import React, { useState } from 'react';
import { X, MapPin, Layers, Filter, AlertCircle, BarChart3, Radio, Shield } from 'lucide-react';
import { LanguageCode } from '../types';

interface ForecastMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang?: LanguageCode;
}

export const ForecastMapModal: React.FC<ForecastMapModalProps> = ({
  isOpen,
  onClose,
  currentLang = 'en',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'disaster' | 'pension' | 'infra'>('all');
  const [timeHorizon, setTimeHorizon] = useState<'7d' | '30d' | '90d'>('30d');

  if (!isOpen) return null;

  const hotspots = [
    { district: 'Guwahati & Brahmaputra Valley', state: 'Assam', count: 1420, risk: 'High Flood Alert', color: '#DC2626' },
    { district: 'Coastal Puri & Kendrapara', state: 'Odisha', count: 980, risk: 'Cyclone Preparedness', color: '#EA580C' },
    { district: 'Chamoli & Joshimath', state: 'Uttarakhand', count: 640, risk: 'Landslide Monitoring', color: '#D97706' },
    { district: 'Pune & Marathwada', state: 'Maharashtra', count: 1120, risk: 'Drought Water Grievances', color: '#F59E0B' },
    { district: 'Bengaluru Urban', state: 'Karnataka', count: 2310, risk: 'Drainage & Municipal', color: '#2563EB' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-[#002B49] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></div>
            <h3 className="font-bold text-sm sm:text-base">
              {currentLang === 'hi'
                ? 'दृष्टि जीआईएस पूर्वानुमेय आपदा एवं शिकायत मानचित्र'
                : 'Drishti GIS Geospatial Forecast & Grievance Density Map'}
            </h3>
            <span className="bg-amber-400 text-[#002B49] text-[10px] font-black uppercase px-1.5 py-0.5 rounded">
              Live PostGIS
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-full transition-colors cursor-pointer text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-gray-100 px-4 py-2.5 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-gray-500" />
            <span className="font-bold text-gray-700">Filter Domain:</span>
            <div className="flex items-center bg-white rounded border border-gray-300 p-0.5">
              {(['all', 'disaster', 'pension', 'infra'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded text-xs capitalize cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#6B0C36] text-white font-bold'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {cat === 'all' ? 'All Incidents' : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-700">Time Horizon:</span>
            <div className="flex bg-white rounded border border-gray-300 p-0.5">
              {(['7d', '30d', '90d'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeHorizon(t)}
                  className={`px-2 py-0.5 rounded text-xs cursor-pointer ${
                    timeHorizon === t
                      ? 'bg-[#002B49] text-white font-bold'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {t.toUpperCase()} Forecast
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Map Visualization Canvas Simulation */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          <div className="relative w-full h-64 sm:h-72 bg-gradient-to-br from-slate-900 via-[#0B2545] to-[#133E68] rounded-xl overflow-hidden shadow-inner flex items-center justify-center p-4 border border-blue-900">
            {/* Grid Coordinates Overlay */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#60A5FA_1px,transparent_1px)] [background-size:24px_24px]"></div>

            {/* Simulated Geographic Outline & Hotspot Nodes */}
            <div className="relative w-full h-full flex items-center justify-center">
              {hotspots.map((item, idx) => (
                <div
                  key={idx}
                  className="absolute flex flex-col items-center group cursor-pointer"
                  style={{
                    top: `${20 + idx * 14}%`,
                    left: `${18 + idx * 16}%`,
                  }}
                >
                  <div className="relative flex items-center justify-center">
                    <span
                      className="w-6 h-6 rounded-full animate-ping opacity-75 absolute"
                      style={{ backgroundColor: item.color }}
                    ></span>
                    <div
                      className="w-4 h-4 rounded-full border-2 border-white flex items-center justify-center shadow-lg relative z-10"
                      style={{ backgroundColor: item.color }}
                    >
                      <MapPin size={10} className="text-white" />
                    </div>
                  </div>
                  <div className="mt-1 bg-black/80 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded shadow-md border border-white/20 whitespace-nowrap hidden sm:block">
                    <span className="font-bold">{item.district}</span>
                    <span className="text-amber-300 ml-1">({item.count})</span>
                  </div>
                </div>
              ))}

              <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-xs text-white p-2.5 rounded-lg border border-white/10 text-[11px] space-y-1">
                <div className="font-bold text-amber-300 flex items-center gap-1">
                  <Radio size={12} className="animate-pulse" />
                  <span>Real-time Density Heatmap</span>
                </div>
                <div className="text-gray-300 text-[10px]">
                  Aggregated &amp; Anonymized per DPDP Act 2023
                </div>
              </div>
            </div>
          </div>

          {/* District Incident Hotspot Cards */}
          <div>
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              High Grievance Density &amp; Early Alert Clusters
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {hotspots.slice(0, 3).map((spot, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-lg p-3 bg-gray-50 flex items-start justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-gray-900 block">{spot.district}</span>
                    <span className="text-[10px] text-gray-500">{spot.state}</span>
                    <span
                      className="text-[10px] font-semibold block mt-1"
                      style={{ color: spot.color }}
                    >
                      {spot.risk}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold bg-white border border-gray-200 px-2 py-1 rounded">
                    {spot.count} cases
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 flex justify-end gap-2 text-xs">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#002B49] text-white font-bold rounded hover:bg-[#001D33] cursor-pointer"
          >
            Close Map View
          </button>
        </div>
      </div>
    </div>
  );
};
