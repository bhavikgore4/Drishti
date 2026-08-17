import React, { useState } from 'react';
import { EmblemAndTopBar } from './EmblemAndTopBar';
import { Navbar } from './Navbar';
import { HeroCarousel } from './HeroCarousel';
import { AlertTicker } from './AlertTicker';
import { StatusLookupModal } from './StatusLookupModal';
import { ForecastMapModal } from './ForecastMapModal';
import { SignInModal } from './SignInModal';
import { VoiceBotModal } from './VoiceBotModal';
import { FaqDrawer } from './FaqDrawer';
import { NodalOfficersDirectory, DirectoryDepartment } from './NodalOfficersDirectory';
import { GrievanceStatusTimeline } from './GrievanceStatusTimeline';
import { NearbyGrievancesHub } from './NearbyGrievancesHub';
import { LanguageCode } from '../types';

export interface LandingHeaderHeroProps {
  currentLang?: LanguageCode;
  onLanguageChange?: (lang: LanguageCode) => void;
  onLodgeGrievance?: () => void;
  onSignIn?: () => void;
  onTrackStatus?: () => void;
  onViewForecastMap?: () => void;
  onVoiceBot?: () => void;
  customAlertText?: string;
  className?: string;
}

/**
 * LandingHeaderHero - Unified Landing Header & Dynamic Carousel Component for Project "Drishti"
 */
export const LandingHeaderHero: React.FC<LandingHeaderHeroProps> = ({
  currentLang = 'en',
  onLanguageChange,
  onLodgeGrievance,
  onSignIn,
  onTrackStatus,
  onViewForecastMap,
  onVoiceBot,
  customAlertText,
  className = '',
}) => {
  // Interactive Modal States
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [timelineModalOpen, setTimelineModalOpen] = useState(false);
  const [nearbyModalOpen, setNearbyModalOpen] = useState(false);
  const [forecastModalOpen, setForecastModalOpen] = useState(false);
  const [signInModalOpen, setSignInModalOpen] = useState(false);
  const [voiceBotModalOpen, setVoiceBotModalOpen] = useState(false);
  const [faqDrawerOpen, setFaqDrawerOpen] = useState(false);
  const [nodalModalDept, setNodalModalDept] = useState<DirectoryDepartment | null>(null);
  const [fontSizeScale, setFontSizeScale] = useState<'small' | 'normal' | 'large'>('normal');

  const handleNavAction = (actionKey: string) => {
    switch (actionKey) {
      case 'open_timeline_status':
        setTimelineModalOpen(true);
        break;

      case 'open_nearby_grievances':
        setNearbyModalOpen(true);
        break;

      case 'open_status_lookup':
      case 'view_status':
      case 'open_appeal_status':
      case 'open_disaster_status':
        if (onTrackStatus) onTrackStatus();
        else setStatusModalOpen(true);
        break;

      case 'open_signin_dashboard':
        if (onSignIn) onSignIn();
        else setSignInModalOpen(true);
        break;

      case 'officers_nmc':
        setNodalModalDept('nmc');
        break;

      case 'officers_pwd':
        setNodalModalDept('pwd');
        break;

      case 'view_officers':
      case 'officers_central':
      case 'officers_state':
        setNodalModalDept('nmc');
        break;

      case 'open_lodge_flow':
      case 'lodge_grievance':
      case 'open_disaster_sos':
        if (onLodgeGrievance) onLodgeGrievance();
        else setStatusModalOpen(true);
        break;

      case 'open_voice_bot':
        if (onVoiceBot) onVoiceBot();
        else setVoiceBotModalOpen(true);
        break;

      case 'forecast':
      case 'view_forecast':
        if (onViewForecastMap) onViewForecastMap();
        else setForecastModalOpen(true);
        break;

      case 'faqs':
      case 'process_faqs':
        setFaqDrawerOpen(true);
        break;

      default:
        console.log('Action triggered:', actionKey);
        break;
    }
  };

  const handleQuickLinkClick = (key: string) => {
    if (key === 'faqs') setFaqDrawerOpen(true);
    else if (key === 'forecast') {
      if (onViewForecastMap) onViewForecastMap();
      else setForecastModalOpen(true);
    } else if (key === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleNavAction(key);
    }
  };

  const handleSignIn = () => {
    if (onSignIn) onSignIn();
    else setSignInModalOpen(true);
  };

  const handleFontSizeChange = (scale: 'small' | 'normal' | 'large') => {
    setFontSizeScale(scale);
    const root = document.documentElement;
    if (scale === 'small') {
      root.style.fontSize = '90%';
    } else if (scale === 'large') {
      root.style.fontSize = '110%';
    } else {
      root.style.fontSize = '100%';
    }
  };

  return (
    <div className={`w-full flex flex-col font-sans text-gray-900 bg-white ${className}`}>
      {/* 1. Top Government Emblem & Dual-Language Ministry Header */}
      <EmblemAndTopBar
        currentLang={currentLang}
        onQuickLinkClick={handleQuickLinkClick}
        onFontSizeChange={handleFontSizeChange}
      />

      {/* 2. Secondary Navigation Bar (#6B0C36 Deep Maroon Theme) */}
      <Navbar
        currentLang={currentLang}
        onLanguageChange={(lang) => {
          if (onLanguageChange) onLanguageChange(lang);
        }}
        onSignInClick={handleSignIn}
        onNavAction={handleNavAction}
      />

      {/* 3. Auto-Rotating Image Banner Carousel (Hero Section) */}
      <HeroCarousel
        currentLang={currentLang}
        onLodgeClick={() => {
          if (onLodgeGrievance) onLodgeGrievance();
          else setStatusModalOpen(true);
        }}
        onVoiceBotClick={() => {
          if (onVoiceBot) onVoiceBot();
          else setVoiceBotModalOpen(true);
        }}
        onAppealClick={() => handleNavAction('appeal_guide')}
        onProcessClick={() => handleNavAction('process_flow')}
        onDisasterClick={() => {
          if (onViewForecastMap) onViewForecastMap();
          else setForecastModalOpen(true);
        }}
      />

      {/* 4. Ticker / Advisory Alert Bar */}
      <AlertTicker
        currentLang={currentLang}
        onAdvisoryClick={() => setFaqDrawerOpen(true)}
        onEmergencyCallClick={() => {
          if (onViewForecastMap) onViewForecastMap();
          else setForecastModalOpen(true);
        }}
      />

      {/* Interactive Modals & Drawers */}
      <StatusLookupModal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        currentLang={currentLang}
      />

      <ForecastMapModal
        isOpen={forecastModalOpen}
        onClose={() => setForecastModalOpen(false)}
        currentLang={currentLang}
      />

      <SignInModal
        isOpen={signInModalOpen}
        onClose={() => setSignInModalOpen(false)}
        currentLang={currentLang}
      />

      <VoiceBotModal
        isOpen={voiceBotModalOpen}
        onClose={() => setVoiceBotModalOpen(false)}
        currentLang={currentLang}
      />

      <FaqDrawer
        isOpen={faqDrawerOpen}
        onClose={() => setFaqDrawerOpen(false)}
        currentLang={currentLang}
      />

      {/* Grievance Status Timeline Tracker Modal */}
      {timelineModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-slate-100 rounded-2xl max-w-6xl w-full shadow-2xl overflow-hidden border border-gray-300 max-h-[94vh] flex flex-col animate-in zoom-in-95 duration-200 my-auto">
            <div className="p-4 bg-[#002B49] text-white flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm">
                <span>DRISHTI Public Grievance Status Stepper &amp; Live Tracking</span>
              </div>
              <button
                type="button"
                onClick={() => setTimelineModalOpen(false)}
                className="text-gray-300 hover:text-white p-1 rounded-full hover:bg-white/10 cursor-pointer font-bold text-sm"
              >
                ✕ Close
              </button>
            </div>
            <div className="p-4 sm:p-6 overflow-y-auto">
              <GrievanceStatusTimeline
                selectedRegNumber="DRISHTI/2026/00142"
                onBackToHome={() => setTimelineModalOpen(false)}
                onLodgeNew={() => {
                  setTimelineModalOpen(false);
                  if (onLodgeGrievance) onLodgeGrievance();
                  else if (onSignIn) onSignIn();
                }}
                onNotify={(msg) => console.log(msg)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Nearby Grievances Community Hub Modal */}
      {nearbyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-slate-100 rounded-2xl max-w-6xl w-full shadow-2xl overflow-hidden border border-gray-300 max-h-[94vh] flex flex-col animate-in zoom-in-95 duration-200 my-auto">
            <div className="p-4 bg-[#002B49] text-white flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm">
                <span>DRISHTI Community Hub - Nearby Grievances (Nagpur Locality)</span>
              </div>
              <button
                type="button"
                onClick={() => setNearbyModalOpen(false)}
                className="text-gray-300 hover:text-white p-1 rounded-full hover:bg-white/10 cursor-pointer font-bold text-sm"
              >
                ✕ Close
              </button>
            </div>
            <div className="p-4 sm:p-6 overflow-y-auto">
              <NearbyGrievancesHub
                onBackToHome={() => setNearbyModalOpen(false)}
                onLodgeGrievance={() => {
                  setNearbyModalOpen(false);
                  if (onLodgeGrievance) onLodgeGrievance();
                  else if (onSignIn) onSignIn();
                }}
                onNotify={(msg) => console.log(msg)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Nodal Officers Directory Modal */}
      {nodalModalDept && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-slate-100 rounded-2xl max-w-6xl w-full shadow-2xl overflow-hidden border border-gray-300 max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200 my-auto">
            <div className="p-4 bg-[#002B49] text-white flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm">
                <span>Directory of Nodal Public Grievance Officers - Nagpur Region</span>
              </div>
              <button
                type="button"
                onClick={() => setNodalModalDept(null)}
                className="text-gray-300 hover:text-white p-1 rounded-full hover:bg-white/10 cursor-pointer font-bold text-sm"
              >
                ✕ Close
              </button>
            </div>
            <div className="p-4 sm:p-6 overflow-y-auto">
              <NodalOfficersDirectory
                initialDepartment={nodalModalDept}
                onBackToHome={() => setNodalModalDept(null)}
                onNotify={(msg) => console.log(msg)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingHeaderHero;
