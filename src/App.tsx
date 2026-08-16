import React, { useState, useEffect } from 'react';
import { LandingHeaderHero } from './components/LandingHeaderHero';
import { AboutAndActionCards } from './components/AboutAndActionCards';
import { UserLoginPage } from './components/UserLoginPage';
import { RegistrationPage } from './components/RegistrationPage';
import { OfficerLoginPage } from './components/OfficerLoginPage';
import { UserDashboardWorkflow } from './components/UserDashboardWorkflow';
import { DisasterWeatherMap } from './components/DisasterWeatherMap';
import { StatusLookupModal } from './components/StatusLookupModal';
import { SignInModal } from './components/SignInModal';
import { ContactUsModal } from './components/ContactUsModal';
import { Sparkles } from 'lucide-react';
import { LanguageCode, PageRoute, GrievanceRecord } from './types';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<PageRoute>('landing');
  const [selectedLang, setSelectedLang] = useState<LanguageCode>('en');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Authenticated Citizen User State
  const [authenticatedUser, setAuthenticatedUser] = useState<{
    name: string;
    email: string;
    mobile: string;
    identifier: string;
  }>({
    name: 'Bhavik Gore',
    email: 'bhavikgore4@gmail.com',
    mobile: '+91 98765 43210',
    identifier: 'bhavikgore4@gmail.com',
  });

  // Modal States for Landing Page
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  // Sync with browser URL hash for real browser navigation & bookmarking
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'login') setCurrentRoute('login');
      else if (hash === 'register' || hash === 'signup') setCurrentRoute('register');
      else if (hash === 'officer-login' || hash === 'officer') setCurrentRoute('officer-login');
      else if (hash === 'dashboard' || hash === 'user-dashboard') setCurrentRoute('user-dashboard');
      else if (hash === 'weather-map' || hash === 'map' || hash === 'hotspots') setCurrentRoute('weather-map');
      else setCurrentRoute('landing');
    };

    // Initial check on mount
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (route: PageRoute) => {
    setCurrentRoute(route);
    if (route === 'landing') {
      window.location.hash = '';
    } else {
      window.location.hash = route;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handlePdfClick = (title: string, size: string) => {
    showToast(`Opening Official Gazette Circular: ${title} (${size})`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-gray-900 selection:bg-[#6B0C36] selection:text-white">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#002B49] text-white px-4 py-3 rounded-lg shadow-2xl border border-amber-400/40 flex items-center gap-2.5 animate-in slide-in-from-bottom-3 duration-200 text-xs sm:text-sm">
          <Sparkles size={16} className="text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DYNAMIC ROUTE RENDERING */}
      {/* ========================================================================= */}
      {currentRoute === 'weather-map' && (
        <DisasterWeatherMap
          currentLang={selectedLang}
          onBackToHome={() => navigateTo('landing')}
          onLodgeSOS={() => {
            showToast('Opening Grievance / Emergency SOS Lodge Form...');
            navigateTo('user-dashboard');
          }}
          onNotify={showToast}
        />
      )}

      {currentRoute === 'user-dashboard' && (
        <UserDashboardWorkflow
          currentLang={selectedLang}
          onLanguageChange={setSelectedLang}
          onNavigate={navigateTo}
          userName={authenticatedUser.name}
          userEmail={authenticatedUser.email}
          userMobile={authenticatedUser.mobile}
          onSignOut={() => {
            showToast('You have been signed out safely from Drishti Portal.');
            navigateTo('landing');
          }}
        />
      )}

      {currentRoute === 'login' && (
        <UserLoginPage
          currentLang={selectedLang}
          onLanguageChange={setSelectedLang}
          onNavigate={navigateTo}
          onLoginSuccess={(user) => {
            setAuthenticatedUser((prev) => ({
              ...prev,
              identifier: user.identifier,
              name: user.identifier.includes('@') ? 'Bhavik Gore' : user.identifier,
            }));
            showToast(`Login successful for ${user.identifier}. Loading Citizen Dashboard...`);
            navigateTo('user-dashboard');
          }}
        />
      )}

      {currentRoute === 'register' && (
        <RegistrationPage
          currentLang={selectedLang}
          onLanguageChange={setSelectedLang}
          onNavigate={navigateTo}
          onRegisterSuccess={(data) => {
            setAuthenticatedUser({
              name: data.name || 'Bhavik Gore',
              email: data.email || 'bhavikgore4@gmail.com',
              mobile: data.mobile || '+91 98765 43210',
              identifier: data.email || data.mobile || 'Bhavik Gore',
            });
            showToast(`Registration completed for ${data.name}! Opening your dashboard.`);
            navigateTo('user-dashboard');
          }}
        />
      )}

      {currentRoute === 'officer-login' && (
        <OfficerLoginPage
          currentLang={selectedLang}
          onNavigate={navigateTo}
          onOfficerLoginSuccess={(officer) => {
            showToast(`Officer session authenticated for ${officer.username}.`);
            navigateTo('landing');
          }}
        />
      )}

      {currentRoute === 'landing' && (
        <>
          {/* 1. Main Landing Page Header & Dynamic Banner Carousel with Alert Ticker */}
          <LandingHeaderHero
            currentLang={selectedLang}
            onLanguageChange={setSelectedLang}
            onLodgeGrievance={() => navigateTo('login')}
            onSignIn={() => navigateTo('login')}
            onTrackStatus={() => setStatusModalOpen(true)}
            onViewForecastMap={() => navigateTo('weather-map')}
            onVoiceBot={() => showToast('Activating Drishti Mitra AI Voice Assistant...')}
          />

          {/* 2. Official CPGRAMS Two-Column Content Section & Three Action Callout Blocks */}
          <main className="flex-1 flex flex-col">
            <AboutAndActionCards
              currentLang={selectedLang}
              onRegisterLogin={() => navigateTo('login')}
              onViewStatus={() => setStatusModalOpen(true)}
              onContactUs={() => setContactModalOpen(true)}
              onPdfClick={handlePdfClick}
            />
          </main>

          {/* Interactive Modals */}
          <StatusLookupModal
            isOpen={statusModalOpen}
            onClose={() => setStatusModalOpen(false)}
            currentLang={selectedLang}
          />

          <ContactUsModal
            isOpen={contactModalOpen}
            onClose={() => setContactModalOpen(false)}
            currentLang={selectedLang}
          />

          {/* Official Government of India Footer Strip */}
          <footer className="w-full bg-[#001D33] text-gray-300 text-xs py-6 px-4 sm:px-6 border-t border-[#002B49] mt-auto">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
              <div className="space-y-1">
                <div className="font-bold text-white tracking-wide">
                  {selectedLang === 'hi'
                    ? 'दृष्टि (DRISHTI) — एआई-संचालित आपदा एवं लोक शिकायत प्रबंधन प्रणाली'
                    : selectedLang === 'mr'
                    ? 'दृष्टी (DRISHTI) — AI-चालित आपत्ती व सार्वजनिक तक्रार व्यवस्थापन प्रणाली'
                    : 'DRISHTI — AI-Driven Disaster & Public Grievance Management System'}
                </div>
                <div className="text-[11px] text-gray-400">
                  {selectedLang === 'hi'
                    ? 'प्रशासनिक सुधार और लोक शिकायत विभाग (DARPG) एवं राष्ट्रीय आपदा प्रबंधन प्राधिकरण (NDMA)'
                    : selectedLang === 'mr'
                    ? 'प्रशासकीय सुधारणा आणि सार्वजनिक तक्रार निवारण विभाग (DARPG) व राष्ट्रीय आपत्ती व्यवस्थापन प्राधिकरण (NDMA)'
                    : 'Department of Administrative Reforms and Public Grievances (DARPG) & National Disaster Management Authority (NDMA)'}
                </div>
              </div>
              <div className="text-[11px] text-gray-400 flex flex-wrap items-center justify-center gap-3">
                <button onClick={() => navigateTo('login')} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Citizen Login
                </button>
                <span>•</span>
                <button onClick={() => navigateTo('officer-login')} className="hover:text-amber-300 transition-colors cursor-pointer">
                  PG Officer Login
                </button>
                <span>•</span>
                <button onClick={() => navigateTo('register')} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Citizen Sign-Up
                </button>
                <span>•</span>
                <span>DPDP Act 2023 Compliance</span>
                <span>•</span>
                <span>NIC MeghRaj Cloud</span>
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}
