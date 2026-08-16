export type LanguageCode = 'en' | 'hi' | 'mr';

export type PageRoute = 'landing' | 'login' | 'register' | 'officer-login' | 'user-dashboard' | 'weather-map';

export interface NodalOfficerInfo {
  name: string;
  designation: string;
  department: string;
  subDivision?: string;
  contactNumber: string;
  email?: string;
  officeAddress: string;
}

export interface GrievanceRecord {
  sn: number;
  registrationNumber: string;
  receivedDate: string;
  grievanceDescription: string;
  status: 'Pending' | 'Under Process' | 'Closed' | 'Resolved';
  ministry?: string;
  category?: string;
  subCategory?: string;
  location?: string;
  attachmentName?: string;
  attachmentSize?: string;
  attachmentUrl?: string;
  aiTriaged?: boolean;
  priority?: 'High' | 'Emergency' | 'Normal';
  nodalOfficer?: NodalOfficerInfo;
  reminderCount?: number;
  lastReminderDate?: string;
}

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
}

export interface NavDropdownItem {
  id: string;
  label: string;
  labelHi?: string;
  labelMr?: string;
  href?: string;
  description?: string;
  descriptionHi?: string;
  descriptionMr?: string;
  badge?: string;
  icon?: string;
  actionKey?: string;
}

export interface NavMenuItem {
  id: string;
  label: string;
  labelHi?: string;
  labelMr?: string;
  icon?: string;
  href?: string;
  badge?: string;
  actionKey?: string;
  items?: NavDropdownItem[];
}

export interface CarouselSlide {
  id: string;
  title: string;
  titleHi?: string;
  titleMr?: string;
  subtitle: string;
  subtitleHi?: string;
  subtitleMr?: string;
  tagline?: string;
  taglineHi?: string;
  taglineMr?: string;
  desc?: string;
  descHi?: string;
  descMr?: string;
  ctaText?: string;
  ctaTextHi?: string;
  ctaTextMr?: string;
  ctaAction?: string;
  theme: 'blue-gradient' | 'sky-governance' | 'yellow-process' | 'appeal-light' | 'disaster-navy';
  type: 'governance' | 'voice-ai' | 'appeal' | 'process' | 'disaster';
  bgGradient?: string;
}

export interface QuickLink {
  id: string;
  label: string;
  labelHi?: string;
  labelMr?: string;
  icon: string;
  actionKey: string;
}

export type RiskLevel = 'severe' | 'moderate' | 'normal';

export type HotspotCategory =
  | 'River / Waterbody Overflow'
  | 'Underpass Waterlogging'
  | 'Low-lying Residential'
  | 'Commercial / Market Drain Choke'
  | 'Bridge / Flyover Approach'
  | 'Industrial / Highway Corridor'
  | 'Slum / Riverbank Settlement'
  | 'Reservoir / Canal Discharge';

export interface RiskHotspot {
  id: string;
  name: string;
  marathiName?: string;
  zone: string;
  wardNo: number | string;
  lat: number;
  lng: number;
  category: HotspotCategory;
  baseRisk: RiskLevel;
  elevationMeters: number;
  vulnerabilityFactor: string;
  historicalEvent: string;
  drainageCapacity: string;
  nearestNDRFPost: string;
  emergencyHelpline: string;
  nodalContact: string;
  evacuationShelter: string;
  populationImpactedEstimate: number;
  liveWaterLevelCm?: number;
  cctvStreamAvailable?: boolean;
}

export interface DayForecast {
  dayIndex: number; // 0 = Today, 1 = Tomorrow, ..., 6 = Day 7
  dateString: string;
  dayName: string;
  tempMax: number;
  tempMin: number;
  weatherCode: number;
  weatherDescription: string;
  precipitationProbability: number;
  precipitationMm: number;
  windSpeedKmh: number;
  humidityPercent: number;
  alertLevel: 'RED' | 'ORANGE' | 'YELLOW' | 'GREEN';
  alertTitle: string;
  alertDetails: string;
  aqi: number;
  aqiCategory: 'Good' | 'Moderate' | 'Poor' | 'Very Poor' | 'Severe';
}

