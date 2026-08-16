import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  Search,
  Users,
  Building2,
  FileText,
  UserCheck,
  Smartphone,
  Globe,
  LogIn,
  Menu,
  X,
} from 'lucide-react';
import { LanguageCode, LanguageOption, NavMenuItem } from '../types';
import { translations } from '../i18n/translations';

interface NavbarProps {
  currentLang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onSignInClick: () => void;
  onNavAction?: (actionKey: string) => void;
}

// Strictly 3 Languages as requested
const LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onLanguageChange,
  onSignInClick,
  onNavAction,
}) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedSection, setMobileExpandedSection] = useState<string | null>(null);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  
  const navRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  const t = translations[currentLang]?.navbar || translations.en.navbar;

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const menuItems: NavMenuItem[] = [
    {
      id: 'status',
      label: 'View Status',
      labelHi: 'स्थिति देखें',
      labelMr: 'स्थिती पहा',
      icon: 'search',
      actionKey: 'view_status',
      items: [
        {
          id: 'status_tracking',
          label: 'Track Grievance by Tracking ID',
          labelHi: 'ट्रैकिंग आईडी द्वारा शिकायत ट्रैक करें',
          labelMr: 'ट्रॅकिंग आयडीद्वारे तक्रार तपासा',
          description: 'Instant status without login',
          descriptionHi: 'बिना लॉगिन के त्वरित स्थिति',
          descriptionMr: 'लॉगिन शिवाय त्वरित स्थिती',
          actionKey: 'open_status_lookup',
        },
        {
          id: 'status_dashboard',
          label: 'Citizen Dashboard (My Grievances)',
          labelHi: 'नागरिक डैशबोर्ड (मेरी शिकायतें)',
          labelMr: 'नागरिक डॅशबोर्ड (माझ्या तक्रारी)',
          description: 'View full history & updates',
          descriptionHi: 'पूर्ण इतिहास एवं विवरण देखें',
          descriptionMr: 'संपूर्ण इतिहास आणि अद्यतने पहा',
          actionKey: 'open_signin_dashboard',
        },
        {
          id: 'status_appeal',
          label: 'Appeal Redressal Status',
          labelHi: 'अपील निवारण स्थिति',
          labelMr: 'अपील निवारण स्थिती',
          description: 'Track ongoing appeals',
          descriptionHi: 'सक्रिय अपीलों की स्थिति देखें',
          descriptionMr: 'दाखल अपीलांची स्थिती तपासा',
          actionKey: 'open_appeal_status',
        },
        {
          id: 'status_disaster',
          label: 'Disaster Emergency Request Status',
          labelHi: 'आपदा आपातकालीन अनुरोध स्थिति',
          labelMr: 'आपत्कालीन विनंती स्थिती',
          badge: 'Emergency',
          description: 'High-priority rescue & relief tracks',
          descriptionHi: 'उच्च प्राथमिकता राहत एवं बचाव ट्रैकिंग',
          descriptionMr: 'अति-तातडीची मदत व बचाव ट्रॅकिंग',
          actionKey: 'open_disaster_status',
        },
      ],
    },
    {
      id: 'officers',
      label: 'Nodal PG Officers',
      labelHi: 'नोडल अधिकारी',
      labelMr: 'नोडल अधिकारी',
      icon: 'users',
      actionKey: 'view_officers',
      items: [
        {
          id: 'officers_nmc',
          label: 'NMC (Nagpur Municipal Corporation)',
          labelHi: 'नागपूर महानगरपालिका (एनएमसी नोडल अधिकारी)',
          labelMr: 'नागपूर महानगरपालिका (एनएमसी नोडल अधिकारी)',
          badge: 'Zone-wise',
          description: 'Zonal nodal officers, sanitation & water works desks',
          descriptionHi: 'जोन-वार नोडल अधिकारी, स्वच्छता एवं जल आपूर्ति प्रकोष्ठ',
          descriptionMr: 'झोननिहाय नोडल अधिकारी, स्वच्छता व पाणीपुरवठा कक्ष',
          actionKey: 'officers_nmc',
        },
        {
          id: 'officers_pwd',
          label: 'PWD Govt (Nagpur Division)',
          labelHi: 'सार्वजनिक निर्माण विभाग (पीडब्ल्यूडी नागपुर)',
          labelMr: 'सार्वजनिक बांधकाम विभाग (पीडब्ल्यूडी नागपूर)',
          badge: 'Divisional',
          description: 'Circle office, national highways & bridges infrastructure',
          descriptionHi: 'मंडल कार्यालय, राष्ट्रीय राजमार्ग एवं अवसंरचना',
          descriptionMr: 'मंडळ कार्यालय, राष्ट्रीय महामार्ग व पायाभूत सुविधा',
          actionKey: 'officers_pwd',
        },
        {
          id: 'officers_disaster',
          label: 'Disaster Response Nodal Cells (NDRF/SDMA)',
          labelHi: 'आपदा प्रतिक्रिया प्रकोष्ठ (NDRF/SDMA)',
          labelMr: 'आपत्ती निवारण कक्ष (NDRF/SDMA)',
          badge: '24x7',
          description: 'Emergency disaster response nodal contact numbers',
          descriptionHi: 'आपातकालीन नोडल संपर्क दूरभाष',
          descriptionMr: 'आपत्कालीन नोडल संपर्क क्रमांक',
          actionKey: 'officers_disaster',
        },
      ],
    },
    {
      id: 'process',
      label: 'Redress Process',
      labelHi: 'निवारण प्रक्रिया',
      labelMr: 'निवारण प्रक्रिया',
      icon: 'building',
      actionKey: 'view_process',
      items: [
        {
          id: 'process_flow',
          label: '3-Step Grievance Workflow',
          labelHi: '3-चरणीय शिकायत प्रक्रिया',
          labelMr: '३-टप्प्यांची तक्रार प्रक्रिया',
          description: 'Lodge → Assessment → Redressal',
          descriptionHi: 'दर्ज करें → मूल्यांकन → निवारण',
          descriptionMr: 'नोंदणी → मूल्यांकन → निवारण',
          actionKey: 'process_flow',
        },
        {
          id: 'process_ai',
          label: 'AI Auto-Categorization & OCR Engine',
          labelHi: 'एआई स्वतः वर्गीकरण इंजन',
          labelMr: 'AI स्वयंचलित वर्गीकरण इंजिन',
          badge: 'SmartGrievance',
          description: 'How Drishti AI routes complaints accurately',
          descriptionHi: 'शिकायतों का सटीक ऑटो-रूटिंग',
          descriptionMr: 'तक्रारींचे अचूक स्वयंचलित वितरण',
          actionKey: 'process_ai_details',
        },
        {
          id: 'process_sla',
          label: 'Citizen Charter & SLA Timelines',
          labelHi: 'नागरिक अधिकार पत्र और समय सीमा',
          labelMr: 'नागरिक सनद आणि वेळेचे निकष',
          description: '30-day resolution benchmarks',
          descriptionHi: '30 दिवसीय निवारण मानक',
          descriptionMr: '३० दिवसांचे निवारण निकष',
          actionKey: 'process_sla',
        },
        {
          id: 'process_faq',
          label: 'Redressal FAQs & Rules',
          labelHi: 'निवारण प्रश्नोत्तरी और नियम',
          labelMr: 'निवारण प्रश्नोत्तरे आणि नियम',
          description: 'Statutory guidelines under DPDP Act',
          descriptionHi: 'डीपीडीपी अधिनियम अनुसार वैधानिक नियम',
          descriptionMr: 'DPDP कायद्यानुसार वैधानिक नियमावली',
          actionKey: 'process_faqs',
        },
      ],
    },
    {
      id: 'grievance',
      label: 'Grievance',
      labelHi: 'शिकायत',
      labelMr: 'तक्रार',
      icon: 'file',
      actionKey: 'lodge_grievance',
      items: [
        {
          id: 'grievance_lodge',
          label: 'Lodge Public Grievance',
          labelHi: 'लोक शिकायत दर्ज करें',
          labelMr: 'सार्वजनिक तक्रार नोंदवा',
          badge: 'AI-Assisted',
          description: '3-step statutory registration with auto department triage',
          descriptionHi: 'स्वचालित विभाग वर्गीकरण एवं शिकायत पंजीकरण',
          descriptionMr: 'स्वयंचलित विभाग निवड व अधिकृत तक्रार नोंदणी',
          actionKey: 'open_lodge_flow',
        },
        {
          id: 'grievance_status',
          label: 'View Status',
          labelHi: 'शिकायत की स्थिति देखें',
          labelMr: 'तक्रारीची स्थिती तपासा',
          badge: 'Live Timeline',
          description: 'Horizontal progress timeline & officer action history',
          descriptionHi: 'प्रगति टाइमलाइन एवं नोडल अधिकारी कार्यवाही इतिहास',
          descriptionMr: 'प्रगती टाइमलाइन आणि नोडल अधिकारी कारवाईचा इतिहास',
          actionKey: 'open_timeline_status',
        },
        {
          id: 'grievance_nearby',
          label: 'View Nearby Grievances',
          labelHi: 'आसपास की शिकायतें देखें',
          labelMr: 'परिसरातील तक्रारी पहा',
          badge: 'Nagpur Hub',
          description: 'Community crowd-sourced feed with upvoting & comments',
          descriptionHi: 'सामुदायिक जन-शिकायत फीड, अपवोटिंग एवं नागरिक टिप्पणियां',
          descriptionMr: 'स्थानिक तक्रारींचा फीड, अपवोटिंग व नागरिक चर्चा',
          actionKey: 'open_nearby_grievances',
        },
        {
          id: 'grievance_disaster',
          label: 'Report Disaster / Flood / Landslide Alert',
          labelHi: 'आपदा / बाढ़ / भूस्खलन रिपोर्ट करें',
          labelMr: 'आपत्ती / पूर / भूस्खलन अलर्ट नोंदवा',
          badge: 'SOS',
          description: 'Direct geo-tagged emergency dispatch',
          descriptionHi: 'जियो-टैग्ड आपातकालीन सहायता',
          descriptionMr: 'थेट स्थान-आधारित मदत कार्य',
          actionKey: 'open_disaster_sos',
        },
        {
          id: 'grievance_voice',
          label: 'Voice-Based Filing ("Drishti Mitra")',
          labelHi: 'आवाज द्वारा शिकायत ("दृष्टि मित्र")',
          labelMr: 'व्हॉईस तक्रार नोंदणी ("दृष्टी मित्र")',
          badge: 'AI Voice',
          description: 'Speak in English, Hindi, or Marathi',
          descriptionHi: 'हिंदी, अंग्रेजी या मराठी में बोलें',
          descriptionMr: 'मराठी, हिंदी किंवा इंग्रजीत बोला',
          actionKey: 'open_voice_bot',
        },
      ],
    },
    {
      id: 'appeal',
      label: 'Nodal Authority for Appeal',
      labelHi: 'अपील प्राधिकरण',
      labelMr: 'अपील प्राधिकरण',
      icon: 'user-check',
      actionKey: 'appeal_authority',
      items: [
        {
          id: 'appeal_guide',
          label: 'Appeal Mechanism Guidelines',
          labelHi: 'अपील तंत्र दिशानिर्देश',
          labelMr: 'अपील यंत्रणा मार्गदर्शक तत्त्वे',
          description: 'One-time opportunity to raise concern',
          descriptionHi: 'दाद मागण्याची संधी',
          descriptionMr: 'पुनर्विचार करण्याची संधी',
          actionKey: 'appeal_guide',
        },
        {
          id: 'appeal_file',
          label: 'File First Appeal with Appellate Authority',
          labelHi: 'प्रथम अपील दायर करें',
          labelMr: 'प्रथम अपील दाखल करा',
          badge: '30 Days Limit',
          description: 'If unsatisfied with previous resolution',
          descriptionHi: 'समाधानकारक निकाल न मिळाल्यास',
          descriptionMr: 'निकालाने समाधानी नसल्यास',
          actionKey: 'appeal_file',
        },
        {
          id: 'appeal_directory',
          label: 'Directory of Appellate Authorities',
          labelHi: 'अपीलीय प्राधिकारियों की सूची',
          labelMr: 'अपील प्राधिकाऱ्यांची सूची',
          description: 'Joint Secretaries & Nodal Appointees',
          descriptionHi: 'संयुक्त सचिव व वरिष्ठ नोडल अधिकारी',
          descriptionMr: 'सहसचिव व वरिष्ठ नोडल अधिकारी',
          actionKey: 'appeal_directory',
        },
      ],
    },
    {
      id: 'mobile',
      label: 'Mobile App',
      labelHi: 'मोबाइल ऐप',
      labelMr: 'मोबाइल ॲप',
      icon: 'phone',
      actionKey: 'mobile_app',
      items: [
        {
          id: 'mobile_android',
          label: 'Download Drishti for Android',
          labelHi: 'एंड्रॉइड ऐप डाउनलोड करें',
          labelMr: 'अँड्रॉइड ॲप डाउनलोड करा',
          badge: 'v2.4',
          description: 'Google Play & Direct APK download',
          descriptionHi: 'गूगल प्ले स्टोर एवं एपीके',
          descriptionMr: 'गुगल प्ले व डायरेक्ट एपीके',
          actionKey: 'download_android',
        },
        {
          id: 'mobile_ios',
          label: 'Drishti on Apple iOS / TestFlight',
          labelHi: 'एप्पल आईओएस ऐप',
          labelMr: 'ॲपल iOS ॲप',
          description: 'Available on App Store',
          descriptionHi: 'ऐप स्टोर पर उपलब्ध',
          descriptionMr: 'ॲप स्टोअरवर उपलब्ध',
          actionKey: 'download_ios',
        },
        {
          id: 'mobile_pwa',
          label: 'Install PWA (Offline Supported)',
          labelHi: 'ऑफ़लाइन समर्थित PWA इंस्टॉल करें',
          labelMr: 'ऑफलाइन समर्थित PWA इन्स्टॉल करा',
          description: 'Zero install friction on all smartphones',
          descriptionHi: 'सभी स्मार्टफोन पर तुरंत इंस्टॉल',
          descriptionMr: 'सर्व स्मार्टफोनवर विनासायास वापर',
          actionKey: 'install_pwa',
        },
      ],
    },
  ];

  const handleDropdownToggle = (id: string) => {
    setActiveDropdown((prev) => (prev === id ? null : id));
  };

  const handleItemAction = (actionKey?: string) => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    if (actionKey && onNavAction) {
      onNavAction(actionKey);
    }
  };

  const currentLanguageObj = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  const getItemLabel = (item: NavMenuItem) => {
    if (currentLang === 'hi') return item.labelHi || item.label;
    if (currentLang === 'mr') return item.labelMr || item.label;
    return item.label;
  };

  const getSubItemLabel = (subItem: any) => {
    if (currentLang === 'hi') return subItem.labelHi || subItem.label;
    if (currentLang === 'mr') return subItem.labelMr || subItem.label;
    return subItem.label;
  };

  const getSubItemDesc = (subItem: any) => {
    if (currentLang === 'hi') return subItem.descriptionHi || subItem.description;
    if (currentLang === 'mr') return subItem.descriptionMr || subItem.description;
    return subItem.description;
  };

  return (
    <nav
      ref={navRef}
      className="w-full bg-[#6B0C36] text-white shadow-md relative z-40 select-none border-t border-[#8B1A4B]"
      aria-label="Main Navigation"
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 flex items-center justify-between min-h-[46px]">
        {/* Mobile Hamburger Toggle Button */}
        <div className="flex lg:hidden py-1.5">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center gap-1.5 px-3 py-1 bg-[#53092A] hover:bg-[#430722] rounded text-white text-xs font-semibold cursor-pointer border border-[#8B1A4B]"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            <span>{t.menu}</span>
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
          {menuItems.map((item) => {
            const isOpen = activeDropdown === item.id;
            return (
              <div key={item.id} className="relative">
                <button
                  onClick={() => handleDropdownToggle(item.id)}
                  onMouseEnter={() => setActiveDropdown(item.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-2.5 text-xs xl:text-[13px] font-medium tracking-wide transition-colors cursor-pointer rounded-t ${
                    isOpen
                      ? 'bg-[#53092A] text-amber-300 shadow-inner'
                      : 'hover:bg-[#580B2D] hover:text-amber-200'
                  }`}
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                >
                  {item.icon === 'search' && <Search size={14} className="text-amber-300" />}
                  {item.icon === 'users' && <Users size={14} className="text-amber-300" />}
                  {item.icon === 'building' && <Building2 size={14} className="text-amber-300" />}
                  {item.icon === 'file' && <FileText size={14} className="text-amber-300" />}
                  {item.icon === 'user-check' && <UserCheck size={14} className="text-amber-300" />}
                  {item.icon === 'phone' && <Smartphone size={14} className="text-amber-300" />}
                  
                  <span>{getItemLabel(item)}</span>
                  <ChevronDown
                    size={13}
                    className={`transition-transform duration-200 opacity-80 ${
                      isOpen ? 'rotate-180 text-amber-300' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Menu Overlay */}
                {isOpen && item.items && (
                  <div
                    onMouseLeave={() => setActiveDropdown(null)}
                    className="absolute left-0 top-full mt-0 w-72 xl:w-80 bg-white text-gray-800 rounded-b-md shadow-2xl border-t-2 border-amber-500 border-x border-b border-gray-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  >
                    {item.items.map((subItem) => (
                      <button
                        key={subItem.id}
                        onClick={() => handleItemAction(subItem.actionKey)}
                        className="w-full text-left px-4 py-2.5 hover:bg-amber-50/80 transition-colors flex items-start justify-between group border-b border-gray-100 last:border-0 cursor-pointer"
                      >
                        <div className="pr-2">
                          <div className="text-xs xl:text-[13px] font-semibold text-gray-900 group-hover:text-[#6B0C36] flex items-center gap-1.5">
                            <span>{getSubItemLabel(subItem)}</span>
                          </div>
                          {subItem.description && (
                            <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                              {getSubItemDesc(subItem)}
                            </p>
                          )}
                        </div>
                        {subItem.badge && (
                          <span
                            className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0 shadow-2xs ${
                              subItem.badge === 'SOS' || subItem.badge === 'Emergency'
                                ? 'bg-red-600 text-white animate-pulse'
                                : subItem.badge === 'SmartGrievance' || subItem.badge === 'AI Voice'
                                ? 'bg-indigo-700 text-white'
                                : 'bg-amber-100 text-amber-900 border border-amber-300'
                            }`}
                          >
                            {subItem.badge}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Utility: Strictly 3 Languages Selector & Yellow Sign In Button */}
        <div className="flex items-center space-x-2 sm:space-x-3 py-1">
          {/* Language Selector Dropdown */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 text-xs bg-[#53092A] hover:bg-[#430722] border border-[#8B1A4B] text-white px-2.5 py-1.5 rounded transition-colors cursor-pointer shadow-xs"
              aria-label="Change Language"
            >
              <Globe size={13} className="text-amber-300" />
              <span className="hidden sm:inline font-medium text-gray-300">{t.language}</span>
              <span className="font-semibold text-amber-300 underline underline-offset-2">
                {currentLanguageObj.nativeName}
              </span>
              <ChevronDown
                size={12}
                className={`transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Language Selection List - STRICTLY English, Hindi, Marathi */}
            {langDropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-44 bg-white text-gray-800 rounded-md shadow-xl border border-gray-200 py-1 z-50">
                <div className="px-3 py-1 bg-gray-50 border-b border-gray-100 text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                  {t.selectLanguage}
                </div>
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onLanguageChange(lang.code);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-amber-50 cursor-pointer ${
                      currentLang === lang.code
                        ? 'bg-amber-100/70 text-[#6B0C36] font-bold'
                        : 'text-gray-700'
                    }`}
                  >
                    <span>{lang.name}</span>
                    <span className="text-[11px] text-gray-500 font-sans">{lang.nativeName}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Yellow Sign In Button */}
          <button
            onClick={onSignInClick}
            className="flex items-center gap-1.5 bg-[#FFC107] hover:bg-[#FFB300] active:bg-[#FFA000] text-[#1E1E1E] px-3 sm:px-4 py-1.5 rounded font-bold text-xs sm:text-[13px] tracking-wide shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer border border-[#E0A800]"
            title="Citizen & Officer Login Portal"
            id="drishti-header-signin-btn"
          >
            <LogIn size={15} className="text-[#1E1E1E] shrink-0 stroke-[2.5]" />
            <span>{t.signIn}</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation (Collapsible Accordion) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#53092A] border-t border-[#8B1A4B] px-3 py-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
          {menuItems.map((item) => {
            const isExpanded = mobileExpandedSection === item.id;
            return (
              <div key={item.id} className="border-b border-[#6B0C36] last:border-0 pb-1">
                <button
                  onClick={() =>
                    setMobileExpandedSection(isExpanded ? null : item.id)
                  }
                  className="w-full flex items-center justify-between py-2 text-xs font-semibold text-white hover:text-amber-200"
                >
                  <div className="flex items-center gap-2">
                    {item.icon === 'search' && <Search size={14} className="text-amber-300" />}
                    {item.icon === 'users' && <Users size={14} className="text-amber-300" />}
                    {item.icon === 'building' && <Building2 size={14} className="text-amber-300" />}
                    {item.icon === 'file' && <FileText size={14} className="text-amber-300" />}
                    {item.icon === 'user-check' && <UserCheck size={14} className="text-amber-300" />}
                    {item.icon === 'phone' && <Smartphone size={14} className="text-amber-300" />}
                    <span>{getItemLabel(item)}</span>
                  </div>
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${isExpanded ? 'rotate-180 text-amber-300' : ''}`}
                  />
                </button>

                {isExpanded && item.items && (
                  <div className="bg-[#430722] rounded p-2 my-1 space-y-1.5">
                    {item.items.map((subItem) => (
                      <button
                        key={subItem.id}
                        onClick={() => handleItemAction(subItem.actionKey)}
                        className="w-full text-left py-1.5 px-2 rounded hover:bg-[#580B2D] text-xs text-gray-200 hover:text-amber-200 flex items-center justify-between"
                      >
                        <div>
                          <span className="font-medium block">
                            {getSubItemLabel(subItem)}
                          </span>
                          {subItem.description && (
                            <span className="text-[10px] text-gray-400 block">
                              {getSubItemDesc(subItem)}
                            </span>
                          )}
                        </div>
                        {subItem.badge && (
                          <span className="text-[9px] bg-amber-400 text-gray-900 px-1.5 py-0.5 rounded font-bold uppercase">
                            {subItem.badge}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </nav>
  );
};
