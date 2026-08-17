import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  MapPin,
  AlertTriangle,
  CloudRain,
  Wind,
  Droplets,
  Thermometer,
  ShieldAlert,
  Search,
  Layers,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  PhoneCall,
  Activity,
  Maximize2,
  Minimize2,
  RefreshCw,
  Eye,
  SlidersHorizontal,
  Navigation,
  Compass,
  Zap,
  ArrowLeft,
  Flame,
  CheckCircle2,
  Info,
  ExternalLink,
  Shield,
  LifeBuoy,
  X,
  Globe,
  Map,
  LocateFixed,
  Filter,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { RiskHotspot, RiskLevel, DayForecast, HotspotCategory, LanguageCode } from '../types';
import {
  calculateDynamicHotspotRisk,
  DEFAULT_7DAY_NAGPUR_FORECAST,
} from '../utils/nagpurHotspotsData';
import { getHotspots } from '../api/disaster';

// Leaflet
import L from 'leaflet';

export interface DisasterWeatherMapProps {
  currentLang?: LanguageCode;
  onBackToHome?: () => void;
  onLodgeSOS?: () => void;
  onNotify?: (msg: string) => void;
  className?: string;
}

export const DisasterWeatherMap: React.FC<DisasterWeatherMapProps> = ({
  currentLang = 'en',
  onBackToHome,
  onLodgeSOS,
  onNotify,
  className = '',
}) => {
  // 1. Forecast state & selected day (0 to 6)
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [forecastList, setForecastList] = useState<DayForecast[]>(DEFAULT_7DAY_NAGPUR_FORECAST);
  const [isLoadingApi, setIsLoadingApi] = useState<boolean>(false);
  const [apiLastSynced, setApiLastSynced] = useState<string>('Live Weather Synced');

  // 2. Active filters & search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<'all' | 'severe' | 'moderate' | 'normal'>('all');
  const [selectedZoneFilter, setSelectedZoneFilter] = useState<string>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // 3. Hotspot inspection & UI controls
  const [hotspots, setHotspots] = useState<RiskHotspot[]>([]);
  const [hotspotsError, setHotspotsError] = useState<string | null>(null);
  const [inspectedHotspot, setInspectedHotspot] = useState<RiskHotspot | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  
  // 2 Essential Modes: Standard GIS (Light CartoDB Positron) & Satellite Earth View (Esri)
  const [mapLayerType, setMapLayerType] = useState<'standard' | 'satellite'>('standard');
  const [isLegendExpanded, setIsLegendExpanded] = useState<boolean>(true);

  // 4. Map references & auto-invalidation
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Selected Day's active forecast
  const currentDayForecast = useMemo(() => {
    return forecastList[selectedDayIndex] || forecastList[0];
  }, [forecastList, selectedDayIndex]);

  // Invalidate Map Size helper to fix any partial rendering or grey tile bugs
  const triggerMapInvalidateSize = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.invalidateSize();
    }
  }, []);

  useEffect(() => {
    let active = true;
    getHotspots()
      .then((items) => {
        if (!active) return;
        setHotspots(items);
        setInspectedHotspot(items[0] || null);
      })
      .catch((error) => {
        if (!active) return;
        const message = error instanceof Error ? error.message : 'Unable to load disaster hotspots.';
        setHotspotsError(message);
      });
    return () => { active = false; };
  }, []);

  // Fetch live weather data from Open-Meteo API for Nagpur (Lat: 21.1458, Long: 79.0882)
  const fetchOpenMeteoWeather = async () => {
    setIsLoadingApi(true);
    try {
      const url =
        'https://api.open-meteo.com/v1/forecast?latitude=21.1458&longitude=79.0882&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=auto';

      const res = await fetch(url);
      if (!res.ok) throw new Error('API response failed');
      const data = await res.json();

      if (data && data.daily && data.daily.time) {
        const daysCount = Math.min(7, data.daily.time.length);
        const newForecasts: DayForecast[] = [];
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        for (let i = 0; i < daysCount; i++) {
          const dateObj = new Date(data.daily.time[i]);
          const dName = i === 0 ? 'Today' : dayNames[dateObj.getDay()];
          const precipMm = data.daily.precipitation_sum ? data.daily.precipitation_sum[i] || 0 : 15;
          const precipProb = data.daily.precipitation_probability_max
            ? data.daily.precipitation_probability_max[i] || 50
            : 60;
          const tempMax = Math.round(data.daily.temperature_2m_max[i] || 32);
          const tempMin = Math.round(data.daily.temperature_2m_min[i] || 24);
          const wind = Math.round(data.daily.wind_speed_10m_max[i] || 20);
          const wCode = data.daily.weather_code[i] || 61;

          let alertLvl: 'RED' | 'ORANGE' | 'YELLOW' | 'GREEN' = 'GREEN';
          let alertTitle = 'GREEN ALERT: Normal Conditions across All 10 NMC Zones';
          let alertDetails = 'No immediate flood warnings. Standard channel flow.';
          let desc = 'Clear to Partly Cloudy';

          if (precipMm >= 45 || precipProb >= 85) {
            alertLvl = 'RED';
            alertTitle = `RED ALERT: Severe Flood Watch (${precipMm}mm Rain Anticipated)`;
            alertDetails =
              'Extreme inundation warning for Nag River, Ambazari overflow, and Pili River corridors. High alertness.';
            desc = 'Heavy Cloudburst & Torrential Showers';
          } else if (precipMm >= 20 || precipProb >= 65) {
            alertLvl = 'ORANGE';
            alertTitle = `ORANGE ALERT: Heavy Rainfall & Waterlogging Expected (${precipMm}mm)`;
            alertDetails =
              'Low-lying underpasses and market catchments on waterlogging watch. High capacity municipal pumps active.';
            desc = 'Moderate to Heavy Monsoon Showers';
          } else if (precipMm >= 5 || precipProb >= 40) {
            alertLvl = 'YELLOW';
            alertTitle = `YELLOW ALERT: Intermittent Showers (${precipMm}mm)`;
            alertDetails = 'Minor road puddles in low depressions. Transport operations normal.';
            desc = 'Light to Moderate Showers with Gusty Breeze';
          }

          newForecasts.push({
            dayIndex: i,
            dateString: `${dName}, ${dateObj.getDate()} ${dateObj.toLocaleString('en-US', { month: 'short' })}`,
            dayName: dName,
            tempMax,
            tempMin,
            weatherCode: wCode,
            weatherDescription: desc,
            precipitationProbability: precipProb,
            precipitationMm: precipMm,
            windSpeedKmh: wind,
            humidityPercent: 80 + (i % 3) * 5,
            alertLevel: alertLvl,
            alertTitle,
            alertDetails,
            aqi: 38 + i * 4,
            aqiCategory: 'Good',
          });
        }

        setForecastList(newForecasts);
        setApiLastSynced(`Live Open-Meteo (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`);
        if (onNotify) onNotify('Live Weather API synchronized for Nagpur GIS Grid.');
      }
    } catch (err) {
      console.warn('Weather API using verified fallback:', err);
      setForecastList(DEFAULT_7DAY_NAGPUR_FORECAST);
      setApiLastSynced('Default Model (Nagpur)');
    } finally {
      setIsLoadingApi(false);
    }
  };

  useEffect(() => {
    fetchOpenMeteoWeather();
  }, []);

  // Compute calculated risk state for all 77 hotspots for the selected day
  const processedHotspots = useMemo(() => {
    return hotspots.map((h) => {
      const dynamic = calculateDynamicHotspotRisk(h, currentDayForecast);
      return {
        ...h,
        calculatedRisk: dynamic.currentRisk,
        calculatedWaterLevel: dynamic.waterLevelEstCm,
        dynamicWarning: dynamic.warningText,
      };
    });
  }, [hotspots, currentDayForecast]);

  // Filtered hotspots based on user search and filters
  const filteredHotspots = useMemo(() => {
    return processedHotspots.filter((item) => {
      const matchSearch =
        searchQuery.trim() === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.marathiName && item.marathiName.includes(searchQuery)) ||
        item.zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.vulnerabilityFactor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchRisk = selectedRiskFilter === 'all' || item.calculatedRisk === selectedRiskFilter;
      const matchZone = selectedZoneFilter === 'all' || item.zone.includes(selectedZoneFilter);
      const matchCategory = selectedCategoryFilter === 'all' || item.category === selectedCategoryFilter;

      return matchSearch && matchRisk && matchZone && matchCategory;
    });
  }, [processedHotspots, searchQuery, selectedRiskFilter, selectedZoneFilter, selectedCategoryFilter]);

  // Aggregate KPI metrics
  const severeCount = useMemo(
    () => processedHotspots.filter((h) => h.calculatedRisk === 'severe').length,
    [processedHotspots]
  );
  const moderateCount = useMemo(
    () => processedHotspots.filter((h) => h.calculatedRisk === 'moderate').length,
    [processedHotspots]
  );
  const normalCount = useMemo(
    () => processedHotspots.filter((h) => h.calculatedRisk === 'normal').length,
    [processedHotspots]
  );

  const totalPopulationAtRisk = useMemo(() => {
    return processedHotspots
      .filter((h) => h.calculatedRisk === 'severe' || h.calculatedRisk === 'moderate')
      .reduce((acc, curr) => acc + curr.populationImpactedEstimate, 0);
  }, [processedHotspots]);

  // Unique Zones & Categories for dropdown filters
  const allZones = useMemo(() => {
    const zonesSet = new Set<string>();
    hotspots.forEach((h) => {
      const zoneClean = h.zone.split('(')[0].trim();
      zonesSet.add(zoneClean);
    });
    return Array.from(zonesSet);
  }, []);

  const allCategories: HotspotCategory[] = [
    'River / Waterbody Overflow',
    'Underpass Waterlogging',
    'Low-lying Residential',
    'Commercial / Market Drain Choke',
    'Bridge / Flyover Approach',
    'Industrial / Highway Corridor',
    'Slum / Riverbank Settlement',
    'Reservoir / Canal Discharge',
  ];

  // Helper to create custom HTML markers for Leaflet with high-contrast Light Theme visibility
  const createCustomMarkerIcon = (risk: RiskLevel, id: string, name: string) => {
    let pinBg = 'bg-emerald-600 text-white border-white ring-2 ring-emerald-400/60 shadow-md';
    let ringHtml = '';
    let labelNum = id.replace('HOT-', '');

    if (risk === 'severe') {
      pinBg = 'bg-red-600 text-white border-white ring-4 ring-red-400/80 shadow-lg shadow-red-500/50 animate-pulse';
      ringHtml = '<span class="absolute w-8 h-8 rounded-full bg-red-500/40 animate-ping"></span>';
    } else if (risk === 'moderate') {
      pinBg = 'bg-amber-500 text-slate-950 border-white ring-3 ring-amber-300/80 shadow-md shadow-amber-500/30';
      ringHtml = '<span class="absolute w-7 h-7 rounded-full bg-amber-400/30"></span>';
    }

    const htmlString = `
      <div class="relative group cursor-pointer flex items-center justify-center -translate-x-1/2 -translate-y-1/2" title="${id}: ${name}">
        ${ringHtml}
        <div class="relative w-6 h-6 rounded-full ${pinBg} border-2 flex items-center justify-center font-bold text-[8.5px] font-mono shadow-md transition-all duration-200 group-hover:scale-125 z-10">
          ${labelNum}
        </div>
      </div>
    `;

    return L.divIcon({
      className: 'custom-gis-hotspot-icon',
      html: htmlString,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -14],
    });
  };

  // Tile URL configuration based on selected mode
  const getTileConfig = (layer: 'standard' | 'satellite') => {
    if (layer === 'satellite') {
      return {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution: '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      };
    }
    // Standard GIS Mode: CartoDB Positron light tiles (clean, crisp light vector style)
    return {
      url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    };
  };

  // Initialize and maintain the Leaflet Map with robust sizing and resize observer
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Create Leaflet Map centered on Nagpur Zero Milestone (Lat: 21.1458, Long: 79.0882)
      const map = L.map(mapContainerRef.current, {
        center: [21.1458, 79.0882],
        zoom: 12,
        minZoom: 9,
        maxZoom: 18,
        zoomControl: false,
      });

      const tileConf = getTileConfig(mapLayerType);
      const tiles = L.tileLayer(tileConf.url, {
        attribution: tileConf.attribution,
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);
      tileLayerRef.current = tiles;

      // Add zoom control on top right with light style
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Create LayerGroup for Hotspots
      const markersGroup = L.layerGroup().addTo(map);
      markersGroupRef.current = markersGroup;

      mapInstanceRef.current = map;

      // Invalidate size immediately and with staged timeouts to ensure no grey tiles
      map.invalidateSize();
      const t1 = setTimeout(() => map.invalidateSize(), 100);
      const t2 = setTimeout(() => map.invalidateSize(), 300);
      const t3 = setTimeout(() => map.invalidateSize(), 600);
      const t4 = setTimeout(() => map.invalidateSize(), 1200);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    }
  }, []);

  // Set up ResizeObserver to handle container resizes seamlessly
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    });

    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Invalidate map whenever layout changes (sidebar toggle, drawer toggle, full screen)
  useEffect(() => {
    const timer = setTimeout(() => {
      triggerMapInvalidateSize();
    }, 250);
    return () => clearTimeout(timer);
  }, [isSidebarOpen, isDetailDrawerOpen, isFullScreen, triggerMapInvalidateSize]);

  // Update Tile Layer if Layer Type changes
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    const tileConf = getTileConfig(mapLayerType);
    tileLayerRef.current.setUrl(tileConf.url);
  }, [mapLayerType]);

  // Update Markers whenever filteredHotspots or processedHotspots change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current) return;

    markersGroupRef.current.clearLayers();

    filteredHotspots.forEach((h) => {
      const marker = L.marker([h.lat, h.lng], {
        icon: createCustomMarkerIcon(h.calculatedRisk, h.id, h.name),
        title: `${h.id}: ${h.name}`,
      });

      // Custom modern light popup content
      const popupHtml = `
        <div class="font-sans text-xs p-1" style="min-width: 230px;">
          <div class="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-1.5">
            <span class="font-mono font-bold text-[#002B49] text-[11px]">${h.id}</span>
            <span class="px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wide uppercase ${
              h.calculatedRisk === 'severe'
                ? 'bg-red-50 text-red-700 border border-red-200'
                : h.calculatedRisk === 'moderate'
                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }">
              ${h.calculatedRisk === 'severe' ? 'Critical Inundation' : h.calculatedRisk === 'moderate' ? 'Moderate Risk' : 'Normal / Safe'}
            </span>
          </div>
          <p class="font-bold text-slate-900 leading-snug text-xs">${h.name}</p>
          ${h.marathiName ? `<p class="text-[10px] text-slate-500 mt-0.5">${h.marathiName}</p>` : ''}
          <p class="text-[10px] text-slate-600 mt-1 font-medium">${h.zone} &bull; ${h.wardNo}</p>
          
          <div class="mt-2 text-[10px] bg-slate-50 p-2 rounded-lg border border-slate-200 space-y-1">
            <div class="flex items-center justify-between">
              <span class="text-slate-600">Est. Water Depth:</span>
              <strong class="text-[#002B49] font-bold font-mono">${h.calculatedWaterLevel} cm</strong>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-600">NDRF Station:</span>
              <strong class="text-slate-800">${h.nearestNDRFPost.split('(')[0]}</strong>
            </div>
          </div>

          <div class="mt-2.5 flex gap-1.5">
            <button
              id="btn-inspect-${h.id}"
              class="flex-1 bg-[#002B49] hover:bg-[#003B66] text-white py-1.5 px-3 rounded-lg text-[11px] font-bold text-center block transition-colors cursor-pointer shadow-xs"
            >
              View Grievance &rarr;
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('click', () => {
        setInspectedHotspot(h);
        setIsDetailDrawerOpen(true);
      });

      marker.on('popupopen', () => {
        setTimeout(() => {
          const btn = document.getElementById(`btn-inspect-${h.id}`);
          if (btn) {
            btn.onclick = () => {
              setInspectedHotspot(h);
              setIsDetailDrawerOpen(true);
            };
          }
        }, 50);
      });

      markersGroupRef.current?.addLayer(marker);
    });
  }, [filteredHotspots]);

  // Zoom to all 77 hotspots
  const handleZoomToFitAll = () => {
    if (!mapInstanceRef.current) return;
    const latLngs: L.LatLngExpression[] = hotspots.map((h) => [h.lat, h.lng]);
    const bounds = L.latLngBounds(latLngs);
    mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40] });
    if (onNotify) onNotify('View adjusted to show all 77 Nagpur metropolitan risk hotspots.');
  };

  // Center on specific hotspot
  const handleCenterOnHotspot = (h: RiskHotspot) => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([h.lat, h.lng], 15, { animate: true, duration: 1 });
    setInspectedHotspot(h);
    setIsDetailDrawerOpen(true);
  };

  // Reset to default Nagpur center
  const handleResetToNagpurCenter = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([21.1458, 79.0882], 12, { animate: true, duration: 1 });
    if (onNotify) onNotify('Map recentered to Zero Milestone, Nagpur.');
  };

  return (
    <div
      className={`bg-slate-100 text-slate-900 min-h-[600px] flex-1 flex flex-col font-sans select-none overflow-hidden ${
        isFullScreen ? 'fixed inset-0 z-50 h-screen' : 'relative h-full w-full'
      } ${className}`}
    >
      {/* ------------------------------------------------------------------------- */}
      {/* TOP HEADER: OFFICIAL SOVEREIGN NAVY BANNER & LIVE WEATHER RADAR */}
      {/* ------------------------------------------------------------------------- */}
      <header className="bg-[#002B49] text-white border-b border-[#00385F] px-3 sm:px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-md z-30 shrink-0">
        <div className="flex items-center gap-3">
          {onBackToHome && (
            <button
              type="button"
              onClick={onBackToHome}
              className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors border border-white/20 cursor-pointer shadow-xs"
              title="Return to Home Dashboard"
            >
              <ArrowLeft size={14} />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </button>
          )}

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 flex items-center justify-center shadow-md">
              <ShieldAlert size={18} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                  <span>Nagpur Disaster &amp; Weather Risk Map</span>
                  <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded font-mono font-bold shadow-xs">
                    77 SITES
                  </span>
                </h1>
              </div>
              <p className="text-[10px] text-blue-200/80 font-medium">
                Centroid: Lat 21.1458&deg; N, Long 79.0882&deg; E &bull; NMC &amp; NDRF Live GIS
              </p>
            </div>
          </div>
        </div>

        {/* Live Weather & Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs">
          <div className="hidden md:flex items-center gap-3 bg-white/10 border border-white/15 rounded-xl px-3 py-1.5 backdrop-blur-xs">
            <div className="flex items-center gap-1.5 text-white">
              <Thermometer size={14} className="text-amber-300" />
              <span>
                <strong>{currentDayForecast.tempMax}&deg;C</strong> / {currentDayForecast.tempMin}&deg;C
              </span>
            </div>
            <div className="w-px h-3.5 bg-white/20"></div>
            <div className="flex items-center gap-1.5 text-white">
              <CloudRain size={14} className="text-cyan-300" />
              <span>
                <strong>{currentDayForecast.precipitationMm} mm</strong> ({currentDayForecast.precipitationProbability}%)
              </span>
            </div>
            <div className="w-px h-3.5 bg-white/20"></div>
            <div className="flex items-center gap-1.5 text-white">
              <Wind size={14} className="text-emerald-300" />
              <span>{currentDayForecast.windSpeedKmh} km/h</span>
            </div>
          </div>

          <button
            type="button"
            onClick={fetchOpenMeteoWeather}
            disabled={isLoadingApi}
            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold border border-white/20 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Refresh Live Open-Meteo Weather Data"
          >
            <RefreshCw size={13} className={isLoadingApi ? 'animate-spin text-cyan-300' : ''} />
            <span className="hidden lg:inline">{apiLastSynced}</span>
          </button>

          {onLodgeSOS && (
            <button
              type="button"
              onClick={onLodgeSOS}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold shadow-md hover:shadow-red-500/30 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 animate-pulse"
            >
              <Zap size={14} />
              <span>Report Disaster SOS</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 cursor-pointer"
            title={isFullScreen ? 'Exit Full Screen' : 'View Full Screen Map'}
          >
            {isFullScreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </header>

      {/* ------------------------------------------------------------------------- */}
      {/* 7-DAY FORECAST & DYNAMIC RISK SIMULATOR BAR (CLEAN LIGHT THEME) */}
      {/* ------------------------------------------------------------------------- */}
      <section className="bg-white border-b border-slate-200 px-3 sm:px-5 py-2 z-20 shrink-0 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5">
          {/* Real-time Alert Status Banner */}
          <div
            className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border text-xs leading-tight font-medium ${
              currentDayForecast.alertLevel === 'RED'
                ? 'bg-red-50 border-red-200 text-red-900'
                : currentDayForecast.alertLevel === 'ORANGE'
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : currentDayForecast.alertLevel === 'YELLOW'
                ? 'bg-yellow-50 border-yellow-200 text-yellow-900'
                : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}
          >
            <div className="shrink-0">
              {currentDayForecast.alertLevel === 'RED' || currentDayForecast.alertLevel === 'ORANGE' ? (
                <Flame size={18} className="text-red-600 animate-bounce" />
              ) : currentDayForecast.alertLevel === 'YELLOW' ? (
                <AlertTriangle size={18} className="text-amber-600" />
              ) : (
                <CheckCircle2 size={18} className="text-emerald-600" />
              )}
            </div>
            <div className="flex-1">
              <span className="font-extrabold uppercase tracking-wide block text-[11px]">
                {currentDayForecast.alertTitle}
              </span>
              <p className="text-[10px] text-slate-600 line-clamp-1">{currentDayForecast.alertDetails}</p>
            </div>
          </div>

          {/* 7-Day Horizontal Day Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 lg:pb-0 scrollbar-thin">
            <span className="text-[10px] uppercase font-bold text-slate-500 mr-1 shrink-0">7-Day Model:</span>
            {forecastList.map((day) => {
              const isSelected = day.dayIndex === selectedDayIndex;
              return (
                <button
                  key={day.dayIndex}
                  type="button"
                  onClick={() => {
                    setSelectedDayIndex(day.dayIndex);
                    if (onNotify)
                      onNotify(`Switched to ${day.dateString} weather risk projection (${day.alertLevel} Alert).`);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold flex flex-col items-center justify-center transition-all cursor-pointer min-w-[68px] shrink-0 border ${
                    isSelected
                      ? 'bg-[#002B49] text-white border-[#002B49] shadow-sm ring-2 ring-blue-400/40'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span className="text-[10px] uppercase tracking-wider">{day.dayName}</span>
                  <div className="flex items-center gap-1 mt-0.5 text-[11px]">
                    <span>{day.tempMax}&deg;</span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        day.alertLevel === 'RED'
                          ? 'bg-red-500'
                          : day.alertLevel === 'ORANGE'
                          ? 'bg-amber-500'
                          : day.alertLevel === 'YELLOW'
                          ? 'bg-yellow-400'
                          : 'bg-emerald-500'
                      }`}
                    ></span>
                  </div>
                  <span
                    className={`text-[9px] font-mono font-normal mt-0.5 ${
                      isSelected ? 'text-cyan-200' : 'text-blue-600'
                    }`}
                  >
                    {day.precipitationMm}mm
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------------- */}
      {/* MAIN GIS WORKSPACE: SIDE PANEL FILTERS + LEAFLET MAP + INSPECTOR DRAWER */}
      {/* ------------------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col md:flex-row relative overflow-hidden bg-slate-100 min-h-[500px]">
        {/* LEFT CONTROL SIDEBAR: HOTSPOT DIRECTORY & FILTERS (CLEAN LIGHT THEME) */}
        {isSidebarOpen && (
          <aside className="w-full md:w-80 lg:w-96 bg-white border-r border-slate-200 flex flex-col z-20 shrink-0 max-h-[35vh] md:max-h-none overflow-hidden shadow-sm transition-all duration-200">
            {/* Risk Level Filter Chips & Search */}
            <div className="p-3 border-b border-slate-200 space-y-2 bg-slate-50/80">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers size={13} className="text-[#002B49]" />
                  <span>Risk Filter ({filteredHotspots.length}/{hotspots.length})</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleZoomToFitAll}
                    className="text-[10px] text-blue-700 hover:text-blue-900 font-bold cursor-pointer underline"
                  >
                    Fit All
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSidebarOpen(false)}
                    className="text-slate-400 hover:text-slate-700 p-0.5 rounded cursor-pointer"
                    title="Collapse Sidebar"
                  >
                    <PanelLeftClose size={14} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedRiskFilter('all')}
                  className={`py-1.5 px-1 rounded-lg text-center font-bold text-[10px] border transition-all cursor-pointer ${
                    selectedRiskFilter === 'all'
                      ? 'bg-[#002B49] text-white border-[#002B49] shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  All (77)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRiskFilter('severe')}
                  className={`py-1.5 px-1 rounded-lg text-center font-bold text-[10px] border flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    selectedRiskFilter === 'severe'
                      ? 'bg-red-600 text-white border-red-600 shadow-xs'
                      : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span>
                  <span>Severe ({severeCount})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRiskFilter('moderate')}
                  className={`py-1.5 px-1 rounded-lg text-center font-bold text-[10px] border transition-all cursor-pointer ${
                    selectedRiskFilter === 'moderate'
                      ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs'
                      : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  <span>Mod ({moderateCount})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRiskFilter('normal')}
                  className={`py-1.5 px-1 rounded-lg text-center font-bold text-[10px] border transition-all cursor-pointer ${
                    selectedRiskFilter === 'normal'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  <span>Safe ({normalCount})</span>
                </button>
              </div>

              {/* Search Input */}
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search hotspot, river, ward..."
                  className="w-full pl-8 pr-7 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden shadow-2xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-2 text-slate-400 hover:text-slate-700"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* Zone & Category Dropdowns */}
              <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                <select
                  value={selectedZoneFilter}
                  onChange={(e) => setSelectedZoneFilter(e.target.value)}
                  className="w-full py-1 px-2 bg-white border border-slate-300 rounded-md text-[10px] text-slate-700 focus:ring-1 focus:ring-blue-500 outline-hidden shadow-2xs"
                >
                  <option value="all">All NMC Zones</option>
                  {allZones.map((z) => (
                    <option key={z} value={z}>
                      {z}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="w-full py-1 px-2 bg-white border border-slate-300 rounded-md text-[10px] text-slate-700 focus:ring-1 focus:ring-blue-500 outline-hidden shadow-2xs"
                >
                  <option value="all">All Categories</option>
                  {allCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Hotspot Scrollable List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1.5 scrollbar-thin">
              {filteredHotspots.length === 0 ? (
                <div className="p-6 text-center text-slate-400">
                  <AlertTriangle size={28} className="mx-auto mb-1 text-amber-500" />
                  <p className="text-xs font-semibold text-slate-700">No hotspots match the filter criteria</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedRiskFilter('all');
                      setSelectedZoneFilter('all');
                      setSelectedCategoryFilter('all');
                    }}
                    className="mt-2 text-[10px] text-blue-600 underline font-bold"
                  >
                    Reset all filters
                  </button>
                </div>
              ) : (
                filteredHotspots.map((hotspot) => {
                  const isSelected = inspectedHotspot?.id === hotspot.id;
                  const risk = hotspot.calculatedRisk;

                  return (
                    <div
                      key={hotspot.id}
                      onClick={() => handleCenterOnHotspot(hotspot)}
                      className={`p-2.5 rounded-xl cursor-pointer transition-all border ${
                        isSelected
                          ? 'bg-blue-50/90 border-[#002B49] shadow-sm'
                          : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1.5">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                              risk === 'severe'
                                ? 'bg-red-600 animate-pulse'
                                : risk === 'moderate'
                                ? 'bg-amber-500'
                                : 'bg-emerald-600'
                            }`}
                          ></span>
                          <span className="font-mono font-bold text-[10px] text-[#002B49]">{hotspot.id}</span>
                          <span className="text-[10px] text-slate-500 font-medium">&bull; {hotspot.wardNo}</span>
                        </div>

                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full font-mono uppercase ${
                            risk === 'severe'
                              ? 'bg-red-100 text-red-800 border border-red-200'
                              : risk === 'moderate'
                              ? 'bg-amber-100 text-amber-900 border border-amber-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {risk}
                        </span>
                      </div>

                      <h4 className="font-bold text-xs text-slate-900 mt-1 leading-snug">{hotspot.name}</h4>
                      {hotspot.marathiName && (
                        <p className="text-[10px] text-slate-500 font-serif mt-0.5">{hotspot.marathiName}</p>
                      )}

                      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-600">
                        <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-slate-700">
                          {hotspot.category}
                        </span>
                        <span className="font-mono text-[#002B49] font-bold">
                          ~{hotspot.calculatedWaterLevel} cm depth
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Quick Summary Footer */}
            <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-600 flex items-center justify-between">
              <span>
                Pop. Exposed: <strong className="text-red-700 font-bold">{totalPopulationAtRisk.toLocaleString()}</strong>
              </span>
              <span className="font-mono text-slate-500">77 Nagpur Sites</span>
            </div>
          </aside>
        )}

        {/* MAP CANVAS CONTAINER */}
        <main className="flex-1 relative bg-slate-200 flex flex-col w-full h-full min-h-[500px]">
          {/* FLOATING TOP-LEFT/CENTER SEARCH BAR & SIDEBAR EXPAND BUTTON */}
          <div className="absolute top-3 left-3 z-[1000] flex items-center gap-2">
            {!isSidebarOpen && (
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="p-2.5 bg-white/90 backdrop-blur-md text-[#002B49] border border-slate-200 rounded-full shadow-lg hover:bg-white cursor-pointer flex items-center gap-1 text-xs font-bold transition-transform hover:scale-105 active:scale-95"
                title="Open Hotspots Directory"
              >
                <PanelLeftOpen size={16} />
              </button>
            )}

            {/* Floating Top Search Box */}
            <div className="relative">
              <div className="flex items-center gap-2.5 bg-white/90 backdrop-blur-md rounded-full shadow-lg p-2 px-4 border border-slate-200/90 text-xs w-64 sm:w-80">
                <Search size={14} className="text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  placeholder="Search 77 Nagpur risk sites, wards..."
                  className="w-full bg-transparent text-slate-800 placeholder-slate-400 outline-hidden text-xs font-medium"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* Instant Search Suggestions Dropdown */}
              {isSearchFocused && searchQuery.trim() !== '' && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl max-h-56 overflow-y-auto divide-y divide-slate-100 z-50 p-1 text-xs">
                  {filteredHotspots.slice(0, 5).map((h) => (
                    <div
                      key={h.id}
                      onMouseDown={() => handleCenterOnHotspot(h)}
                      className="p-2 hover:bg-blue-50/80 rounded-xl cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{h.name}</span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase ${
                            h.calculatedRisk === 'severe'
                              ? 'bg-red-100 text-red-800'
                              : h.calculatedRisk === 'moderate'
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {h.calculatedRisk}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500">{h.zone} &bull; {h.wardNo}</p>
                    </div>
                  ))}
                  {filteredHotspots.length === 0 && (
                    <div className="p-3 text-center text-slate-500 text-xs">No matching hotspots found.</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* FLOATING TOP-RIGHT DUAL LAYER PILL TOGGLE (LIGHT THEME ONLY) */}
          <div className="absolute top-3 right-12 sm:right-14 z-[1000] flex items-center bg-white/90 backdrop-blur-md p-1 rounded-full border border-slate-200/90 shadow-lg text-xs">
            <button
              type="button"
              onClick={() => {
                setMapLayerType('standard');
                if (onNotify) onNotify('Switched to Standard GIS Map (CartoDB Positron).');
              }}
              className={`px-3 py-1.5 rounded-full font-bold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer ${
                mapLayerType === 'standard'
                  ? 'bg-[#002B49] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Map size={13} />
              <span>Standard GIS</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMapLayerType('satellite');
                if (onNotify) onNotify('Switched to Satellite Earth View (Esri World Imagery).');
              }}
              className={`px-3 py-1.5 rounded-full font-bold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer ${
                mapLayerType === 'satellite'
                  ? 'bg-[#002B49] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Globe size={13} />
              <span>Satellite Earth</span>
            </button>
          </div>

          {/* LEAFLET MAP CANVAS WRAPPER (Guaranteed full width/height & zero grey tiles) */}
          <div
            ref={mapContainerRef}
            className="w-full h-full min-h-[500px] flex-1 z-0 relative outline-hidden"
          />

          {/* FLOATING BOTTOM-RIGHT CONTROLS: RE-CENTER BUTTON & COLLAPSIBLE MINIMAL LEGEND */}
          <div className="absolute bottom-6 right-6 z-[1000] flex flex-col items-end gap-2.5 pointer-events-none">
            {/* Re-center Button */}
            <button
              type="button"
              onClick={handleResetToNagpurCenter}
              className="pointer-events-auto w-11 h-11 bg-white/90 hover:bg-white text-[#002B49] border border-slate-200/90 rounded-full shadow-lg backdrop-blur-md flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer group"
              title="Snap to Nagpur Coordinates [21.1458, 79.0882]"
            >
              <LocateFixed size={18} className="text-[#002B49] group-hover:rotate-45 transition-transform" />
            </button>

            {/* Minimal Collapsible Legend */}
            <div className="pointer-events-auto bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-lg text-[10px] overflow-hidden transition-all max-w-[270px]">
              <div
                onClick={() => setIsLegendExpanded(!isLegendExpanded)}
                className="px-3.5 py-2 bg-slate-50/90 border-b border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors gap-3"
              >
                <span className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield size={13} className="text-[#002B49]" />
                  <span>Severity Legend</span>
                </span>
                <button type="button" className="text-slate-500 hover:text-slate-800">
                  {isLegendExpanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                </button>
              </div>

              {isLegendExpanded && (
                <div className="p-3 space-y-1.5 bg-white/95">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600 shrink-0 shadow-xs ring-1 ring-red-300"></span>
                    <span className="text-slate-800 font-semibold leading-tight">
                      Red = Critical (Severe Inundation)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0 shadow-xs ring-1 ring-orange-300"></span>
                    <span className="text-slate-800 font-semibold leading-tight">
                      Orange = Severe (Overflow Watch)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0 shadow-xs ring-1 ring-amber-200"></span>
                    <span className="text-slate-800 font-semibold leading-tight">
                      Yellow = Moderate (Waterlogging)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 shadow-xs ring-1 ring-emerald-200"></span>
                    <span className="text-slate-800 font-semibold leading-tight">
                      Green = Safe (Normal Drainage)
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* RIGHT INSPECTION DRAWER: SELECTED HOTSPOT DOSSIER (CLEAN LIGHT THEME) */}
        {inspectedHotspot && isDetailDrawerOpen && (
          <aside className="w-full md:w-80 lg:w-96 bg-white border-l border-slate-200 flex flex-col z-30 shadow-2xl text-xs overflow-y-auto animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-3.5 bg-[#002B49] text-white border-b border-[#00385F] flex items-center justify-between sticky top-0 z-10 shadow-md">
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                    inspectedHotspot.baseRisk === 'severe'
                      ? 'bg-red-600 text-white'
                      : inspectedHotspot.baseRisk === 'moderate'
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {inspectedHotspot.id.replace('HOT-', '')}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white leading-tight">Hotspot Dossier</h3>
                  <span className="text-[10px] text-blue-200 font-mono">{inspectedHotspot.id}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsDetailDrawerOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/10 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="p-4 space-y-3.5">
              {/* Title & Marathi Translation */}
              <div>
                <h2 className="font-bold text-sm sm:text-base text-slate-900 leading-snug">{inspectedHotspot.name}</h2>
                {inspectedHotspot.marathiName && (
                  <p className="text-xs text-blue-800 font-serif mt-0.5">{inspectedHotspot.marathiName}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 rounded-md font-semibold text-[10px]">
                    {inspectedHotspot.zone}
                  </span>
                  <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 rounded-md font-semibold text-[10px]">
                    {inspectedHotspot.wardNo}
                  </span>
                </div>
              </div>

              {/* Dynamic Risk Gauge Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-600 font-bold uppercase tracking-wider">Forecasted Status:</span>
                  <span
                    className={`font-bold font-mono px-2 py-0.5 rounded text-[10px] ${
                      (inspectedHotspot as any).calculatedRisk === 'severe'
                        ? 'bg-red-100 text-red-800 border border-red-200'
                        : (inspectedHotspot as any).calculatedRisk === 'moderate'
                        ? 'bg-amber-100 text-amber-900 border border-amber-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {((inspectedHotspot as any).calculatedRisk || inspectedHotspot.baseRisk).toUpperCase()} RISK
                  </span>
                </div>

                <p className="text-xs text-amber-900 bg-amber-50/80 p-2 rounded-lg border border-amber-200/80 font-medium">
                  {(inspectedHotspot as any).dynamicWarning || 'Standard drainage operational.'}
                </p>

                <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-slate-200 text-[11px]">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Est. Water Depth:</span>
                    <strong className="text-[#002B49] font-mono text-sm">
                      {(inspectedHotspot as any).calculatedWaterLevel || inspectedHotspot.liveWaterLevelCm || 50} cm
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Elevation AMSL:</span>
                    <strong className="text-slate-800 font-mono text-sm">{inspectedHotspot.elevationMeters} m</strong>
                  </div>
                </div>
              </div>

              {/* Vulnerability & Historical Incident */}
              <div className="space-y-2.5 bg-white border border-slate-200 rounded-xl p-3.5 text-xs text-slate-700 shadow-2xs">
                <div>
                  <span className="text-[10px] font-bold text-[#002B49] uppercase tracking-wider block mb-0.5">
                    Vulnerability Factor
                  </span>
                  <p className="text-slate-800 leading-relaxed">{inspectedHotspot.vulnerabilityFactor}</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block mb-0.5">
                    Historical Disaster Benchmark
                  </span>
                  <p className="text-slate-700 italic">&ldquo;{inspectedHotspot.historicalEvent}&rdquo;</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-0.5">
                    Drainage Channel Capacity
                  </span>
                  <p className="text-slate-800">{inspectedHotspot.drainageCapacity}</p>
                </div>
              </div>

              {/* Emergency Response & Evacuation Shelter Info */}
              <div className="space-y-2 bg-blue-50/60 border border-blue-100 rounded-xl p-3.5 text-xs">
                <span className="text-[11px] font-bold text-[#002B49] uppercase tracking-wider flex items-center gap-1.5">
                  <LifeBuoy size={14} />
                  <span>Disaster Response Station</span>
                </span>

                <div className="space-y-1 text-slate-800 pt-1 text-[11px]">
                  <p>
                    <span className="text-slate-500 block text-[10px]">Nearest NDRF / SDRF Post:</span>
                    <strong>{inspectedHotspot.nearestNDRFPost}</strong>
                  </p>
                  <p>
                    <span className="text-slate-500 block text-[10px]">Designated Evacuation Shelter:</span>
                    <strong>{inspectedHotspot.evacuationShelter}</strong>
                  </p>
                  <p>
                    <span className="text-slate-500 block text-[10px]">Assigned Municipal Officer:</span>
                    <strong>{inspectedHotspot.nodalContact}</strong>
                  </p>
                </div>

                <div className="pt-2 border-t border-blue-200/70">
                  <a
                    href={`tel:${inspectedHotspot.emergencyHelpline}`}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 text-xs transition-colors shadow-xs"
                  >
                    <PhoneCall size={13} />
                    <span>Call Helpline: {inspectedHotspot.emergencyHelpline}</span>
                  </a>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleCenterOnHotspot(inspectedHotspot)}
                  className="flex-1 py-2 bg-[#002B49] hover:bg-[#003B66] text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <Navigation size={13} />
                  <span>Fly To Hotspot</span>
                </button>
                {onLodgeSOS && (
                  <button
                    type="button"
                    onClick={onLodgeSOS}
                    className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                    title="Report emergency hazard at this location"
                  >
                    <ShieldAlert size={14} />
                    <span>Report Hazard</span>
                  </button>
                )}
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default DisasterWeatherMap;
