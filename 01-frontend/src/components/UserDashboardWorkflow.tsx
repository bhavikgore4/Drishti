import React, { useState, useEffect, useRef } from 'react';
import drishtiAvatarImg from '../assets/images/drishti_ai_assistant_1786832073964.jpg';
import emblemLogo from '../assets/images/Lion.jpeg';
import {
  LayoutDashboard,
  PlusSquare,
  History,
  UserCheck,
  Lock,
  Trash2,
  LogOut,
  Search,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Mic,
  MicOff,
  Download,
  Eye,
  Check,
  ChevronRight,
  ChevronDown,
  X,
  RefreshCw,
  Phone,
  Shield,
  ShieldCheck,
  HelpCircle,
  Home,
  Info,
  MapPin,
  Building,
  Calendar,
  Layers,
  FileCheck,
  Printer,
  Share2,
  Bell,
  Send,
  AlertCircle,
  Timer,
  CloudRain,
} from 'lucide-react';
import { LanguageCode, PageRoute, GrievanceRecord } from '../types';
import { EditProfileView, ProfileData } from './EditProfileView';
import { ChangePasswordView } from './ChangePasswordView';
import { AccountActivityView, AuditEntry } from './AccountActivityView';
import { GrievanceAcknowledgmentView } from './GrievanceAcknowledgmentView';
import { NodalOfficersDirectory, DirectoryDepartment } from './NodalOfficersDirectory';
import { GrievanceStatusTimeline } from './GrievanceStatusTimeline';
import { NearbyGrievancesHub } from './NearbyGrievancesHub';
import { DisasterWeatherMap } from './DisasterWeatherMap';
import { ResolutionProofModal } from './ResolutionProofModal';
import { getNodalOfficerForGrievance } from '../utils/nodalOfficerData';
import { ApiGrievance, createGrievance, getGrievances, uploadAttachment } from '../api/grievances';
import { triageGrievance } from '../api/ml';

interface UserDashboardWorkflowProps {
  currentLang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onNavigate: (route: PageRoute) => void;
  userName?: string;
  userEmail?: string;
  userMobile?: string;
  onSignOut: () => void;
  initialGrievances?: GrievanceRecord[];
}

const toDisplayGrievance = (item: ApiGrievance, index: number): GrievanceRecord => {
  const statusMap: Record<string, GrievanceRecord['status']> = {
    submitted: 'Pending', under_review: 'Under Process', assigned: 'Under Process',
    in_progress: 'Under Process', resolved: 'Resolved', rejected: 'Closed',
  };
  const priorityMap: Record<string, GrievanceRecord['priority']> = { urgent: 'Emergency', high: 'High', medium: 'Normal', low: 'Normal' };
  return {
    sn: index + 1, registrationNumber: item.registrationNumber || item.docketNumber,
    receivedDate: item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB') : '—',
    grievanceDescription: item.description, status: statusMap[item.status] || 'Pending',
    ministry: item.ministry, category: item.category, subCategory: item.subCategory, location: item.location,
    attachmentName: item.attachmentName, attachmentSize: item.attachmentSize, attachmentUrl: item.attachmentUrl,
    aiTriaged: item.aiTriaged, priority: priorityMap[item.priority || 'medium'],
    nodalOfficer: getNodalOfficerForGrievance(item.ministry, item.category, item.location),
  };
};

type SubView =
  | 'dashboard'
  | 'terms'
  | 'form'
  | 'acknowledgment'
  | 'profile'
  | 'password'
  | 'activity'
  | 'directory'
  | 'timeline'
  | 'nearby'
  | 'weather-map';

export const UserDashboardWorkflow: React.FC<UserDashboardWorkflowProps> = ({
  currentLang,
  onLanguageChange,
  onNavigate,
  userName = 'Bhavik Gore',
  userEmail = 'bhavikgore4@gmail.com',
  userMobile = '+91 98765 43210',
  onSignOut,
  initialGrievances,
}) => {
  // Current active sub-view
  const [activeSubView, setActiveSubView] = useState<SubView>('dashboard');

  // Active sidebar selection
  const [activeSidebarItem, setActiveSidebarItem] = useState<
    'dashboard' | 'lodge' | 'timeline' | 'nearby' | 'weather-map' | 'directory' | 'activity' | 'profile' | 'password' | 'delete'
  >('dashboard');

  // User Profile State
  const [userProfile, setUserProfile] = useState<ProfileData>({
    username: userEmail || userMobile || userName,
    name: userName,
    gender: '',
    country: '',
    state: '',
    district: '',
    pincode: '',
    address1: '',
    address2: '',
    address3: '',
    phone: '',
    mobile: userMobile,
    email: userEmail,
    exServicemen: 'No',
  });

  // Account Activity Audit Entries
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>([
    {
      id: '1',
      loginId: 'Bhavikgore4',
      actionDateTime: '16/08/2026 4:13',
      actionName: 'Login',
      ipAddress: '203.192.225.145',
    },
    {
      id: '2',
      loginId: 'Bhavikgore4',
      actionDateTime: '16/08/2026 1:39',
      actionName: 'Login',
      ipAddress: '203.192.225.145',
    },
    {
      id: '3',
      loginId: 'Bhavikgore4',
      actionDateTime: '15/08/2026 2:30',
      actionName: 'Login',
      ipAddress: '202.148.61.118',
    },
  ]);

  // Session timer (starting at 29:45 and counting down)
  const [sessionSeconds, setSessionSeconds] = useState(1785); // 29m 45s

  const [grievances, setGrievances] = useState<GrievanceRecord[]>(initialGrievances || []);
  const [grievancesLoading, setGrievancesLoading] = useState(true);
  const [grievancesError, setGrievancesError] = useState<string | null>(null);

  // Latest submitted grievance for Acknowledgment / Summary View
  const [latestSubmittedGrievance, setLatestSubmittedGrievance] = useState<GrievanceRecord | null>(null);

  // Resolution Proof Modal State
  const [selectedProofGrievance, setSelectedProofGrievance] = useState<GrievanceRecord | null>(null);

  // Nodal PG Officers Dropdown & Directory View State
  const [nodalDropdownOpen, setNodalDropdownOpen] = useState(false);
  const [directoryDept, setDirectoryDept] = useState<DirectoryDepartment>('nmc');

  // Grievance Header Dropdown State & Selected Timeline Docket
  const [grievanceDropdownOpen, setGrievanceDropdownOpen] = useState(false);
  const [selectedTimelineDocket, setSelectedTimelineDocket] = useState<string>('');

  // Search & Filter state for table
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Closed' | 'Under Process'>('All');

  // Terms & Conditions page state
  const [termsAgreed, setTermsAgreed] = useState(false);

  // Form states (Page 3)
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: string;
    type: string;
    previewUrl?: string;
  } | null>(null);
  const [remarks, setRemarks] = useState('');
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiDetectedTag, setAiDetectedTag] = useState<string | null>(null);

  // Form Dropdowns
  const [selectedMinistry, setSelectedMinistry] = useState('Ministry of Home Affairs / NDMA');
  const [selectedMainCategory, setSelectedMainCategory] = useState('Disaster Relief & Emergency Response');
  const [selectedNextCategory, setSelectedNextCategory] = useState('Urban Flooding Relief & Evacuation');
  const [selectedSubCategory, setSelectedSubCategory] = useState('Immediate Rescue Boat Deployment & Dewatering');
  const [selectedHeadquarters, setSelectedHeadquarters] = useState('Mumbai Suburban Disaster Cell');

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);

  // Modal states
  const [selectedGrievanceDetail, setSelectedGrievanceDetail] = useState<GrievanceRecord | null>(null);
  const [reminderModalGrievance, setReminderModalGrievance] = useState<GrievanceRecord | null>(null);
  const [reminderCustomNote, setReminderCustomNote] = useState('');
  const [isSendingReminder, setIsSendingReminder] = useState(false);
  const [reminderCooldowns, setReminderCooldowns] = useState<Record<string, number>>({});
  const [activeModal, setActiveModal] = useState<'activity' | 'profile' | 'password' | 'delete' | 'voice' | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Language Dropdown state
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Session timer countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let active = true;
    getGrievances()
      .then((items) => { if (active) setGrievances(items.map(toDisplayGrievance)); })
      .catch((error) => { if (active) setGrievancesError(error instanceof Error ? error.message : 'Unable to load grievances.'); })
      .finally(() => { if (active) setGrievancesLoading(false); });
    return () => { active = false; };
  }, []);

  // Reminder cooldown countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      setReminderCooldowns((prev) => {
        let changed = false;
        const next: Record<string, number> = {};
        for (const key in prev) {
          if (prev[key] > 1) {
            next[key] = prev[key] - 1;
            changed = true;
          } else if (prev[key] === 1) {
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatSessionTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Handler for Confirming and Sending Urgent Reminder
  const handleConfirmSendReminder = () => {
    if (!reminderModalGrievance) return;
    setIsSendingReminder(true);

    setTimeout(() => {
      const regNo = reminderModalGrievance.registrationNumber;
      const officer =
        reminderModalGrievance.nodalOfficer ||
        getNodalOfficerForGrievance(
          reminderModalGrievance.ministry,
          reminderModalGrievance.category,
          reminderModalGrievance.location
        );

      const officerName = officer.name || 'Shri Rajesh Sharma';
      const officerDept = officer.department || reminderModalGrievance.ministry || 'NMC Dharampeth Zone';
      const newReminderNumber = (reminderModalGrievance.reminderCount || 0) + 1;

      // 1. Update grievance record in state with incremented reminder count
      setGrievances((prev) =>
        prev.map((g) => {
          if (g.registrationNumber === regNo) {
            return {
              ...g,
              reminderCount: newReminderNumber,
              lastReminderDate: new Date().toLocaleDateString('en-GB'),
            };
          }
          return g;
        })
      );

      // 2. Set 60-second cooldown timer for this docket to prevent accidental duplicate clicks
      setReminderCooldowns((prev) => ({
        ...prev,
        [regNo]: 60,
      }));

      // 3. Log into Citizen Account Activity audit trail
      const newEntry: AuditEntry = {
        id: Date.now().toString(),
        loginId: userProfile.username,
        actionDateTime: `${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
        })}`,
        actionName: `Urgent Reminder #${newReminderNumber} Dispatched (${regNo} → ${officerName})`,
        ipAddress: '203.192.225.145',
      };
      setAuditEntries((prev) => [newEntry, ...prev]);

      // 4. Reset loading and modal states
      setIsSendingReminder(false);
      setReminderModalGrievance(null);
      setReminderCustomNote('');

      // 5. Display the exact success alert banner required
      showNotification(
        `Urgent reminder sent successfully to Nodal Officer (${officerName} - ${officerDept}). Escalation logged.`
      );
    }, 650);
  };

  // KPI Calculations
  const totalRegistered = grievances.length;
  const pendingCount = grievances.filter((g) => g.status === 'Pending' || g.status === 'Under Process').length;
  const closedCount = grievances.filter((g) => g.status === 'Closed' || g.status === 'Resolved').length;

  // AI Auto-Fill Logic when text is typed or image uploaded
  const triggerAiInference = async (text: string, fileName?: string) => {
    if (!text.trim()) {
      setAiDetectedTag(null);
      return;
    }
    setIsAiAnalyzing(true);
    try {
      const result = await triageGrievance(text, fileName);
      setSelectedMinistry(result.ministry);
      setSelectedMainCategory(result.category);
      setSelectedSubCategory(result.subCategory);
      setAiDetectedTag(`AI Detected: ${result.label} (${Math.round(result.confidence * 100)}%)`);
    } catch {
      setAiDetectedTag('Automated triage is unavailable; please select the grievance category manually.');
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  // Handle File Upload
  const handleFileUpload = (file: File) => {
    if (file.size > 4 * 1024 * 1024) {
      showNotification('File size exceeds 4MB limit. Please upload a smaller file.');
      return;
    }

    const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined;
    const uploaded = {
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      type: file.type,
      previewUrl,
    };
    setUploadedFile(uploaded);
    showNotification(`Uploaded ${file.name} successfully.`);
    triggerAiInference(remarks, file.name);
  };

  // Sample quick presets for testing
  const loadSampleDisasterScenario = (type: 'flood' | 'road' | 'pf') => {
    if (type === 'flood') {
      const sampleText =
        'Severe flash flooding and inundation in low-lying residential clusters following 180mm torrential cloudburst. Stormwater nullahs overflowing, 45 households trapped without potable water or power supply. Urgent dewatering pumps and NDRF rescue boats requested immediately.';
      setRemarks(sampleText);
      setUploadedFile({
        name: 'mumbai_ward14_flood_damage.jpg',
        size: '1.42 MB',
        type: 'image/jpeg',
      });
      triggerAiInference(sampleText, 'flood_damage.jpg');
    } else if (type === 'road') {
      const sampleText =
        'Major landslide and rockfall on National Highway sector NH-48 near mountain pass. 50-meter road segment collapsed into ravine. Emergency connectivity severed for 6 villages. Immediate earthmover deployment required.';
      setRemarks(sampleText);
      setUploadedFile({
        name: 'nh48_landslide_blockage.png',
        size: '2.10 MB',
        type: 'image/png',
      });
      triggerAiInference(sampleText, 'landslide_blockage.png');
    } else {
      const sampleText =
        'Applied for Employee Provident Fund advance withdrawal for medical emergency 45 days ago. UAN linked and KYC verified, but claim status still shows pending under review without intimation.';
      setRemarks(sampleText);
      triggerAiInference(sampleText, '');
    }
  };

  // Voice Recording simulation
  const toggleVoiceRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      showNotification('🎙️ Drishti Voice Engine active. Listening to your voice...');
      // Simulate speech-to-text after 3 seconds
      setTimeout(() => {
        setIsRecording(false);
        const speechText =
          'Severe water logging and emergency flooding in sector 9 due to broken dam sluice gate. Water entered 30 houses, urgent rescue needed.';
        setRemarks((prev) => (prev ? `${prev} ${speechText}` : speechText));
        triggerAiInference(speechText);
        showNotification('Transcribed speech into grievance remarks successfully!');
      }, 3000);
    } else {
      setIsRecording(false);
    }
  };

  // Submit Grievance Handler
  const handleGrievanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!remarks.trim()) {
      showNotification('Please provide text of grievance description (Remarks).');
      return;
    }

    try {
      let attachment: { filename: string; sizeBytes: number; url: string } | undefined;
      if (uploadedFile && fileInputRef.current?.files?.[0]) attachment = await uploadAttachment(fileInputRef.current.files[0]);
      const created = await createGrievance({
        description: remarks, category: selectedMainCategory, ministry: selectedMinistry, sub_category: selectedSubCategory,
        location: selectedHeadquarters, priority: 'urgent', attachment_name: attachment?.filename || uploadedFile?.name,
        attachment_size: attachment ? `${(attachment.sizeBytes / (1024 * 1024)).toFixed(2)} MB` : uploadedFile?.size,
        attachment_url: attachment?.url || uploadedFile?.previewUrl,
      });
      const newRecord = toDisplayGrievance(created, 0);
      setGrievances((previous) => [newRecord, ...previous.map((item, index) => ({ ...item, sn: index + 2 }))]);
      setLatestSubmittedGrievance(newRecord);

    // Reset form fields
    setRemarks('');
    setUploadedFile(null);
    setTermsAgreed(false);
    setAiDetectedTag(null);

    // Switch to Acknowledgment / Summary View (Intermediate View before returning to Home Dashboard)
    setActiveSubView('acknowledgment');
    setActiveSidebarItem('lodge');

      showNotification(`Grievance registered successfully with Docket No: ${newRecord.registrationNumber}`);
    } catch (error) {
      showNotification(error instanceof Error ? error.message : 'Unable to submit grievance. Please try again.');
    }
  };

  // Filtered grievances for table
  const filteredGrievances = grievances.filter((item) => {
    const matchesSearch =
      item.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.grievanceDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.ministry && item.ministry.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.status.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'All'
        ? true
        : statusFilter === 'Pending'
        ? item.status === 'Pending' || item.status === 'Under Process'
        : item.status === 'Closed' || item.status === 'Resolved';

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#F0F3F7] flex flex-col font-sans select-none text-gray-900">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#002B49] text-white px-5 py-3.5 rounded-lg shadow-2xl border-2 border-amber-400 flex items-center gap-3 animate-in slide-in-from-top-4 duration-300 text-xs sm:text-sm">
          <Sparkles size={18} className="text-amber-400 shrink-0" />
          <span className="font-semibold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-gray-300 hover:text-white cursor-pointer">
            <X size={14} />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. TOP MAROON UTILITY BAR (Exact Government Header) */}
      {/* ========================================================================= */}
      <div className="w-full bg-[#6B0C36] text-white text-[11px] sm:text-xs py-1.5 px-4 sm:px-8 border-b border-[#520928]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Left: Ministry Official Name in Hindi & English */}
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="font-medium text-amber-200">भारत सरकार | Government of India</span>
            <span className="hidden md:inline text-white/60">•</span>
            <span className="hidden md:inline text-white/90">
              कार्मिक, लोक शिकायत और पेंशन मंत्रालय (Ministry of Personnel, Public Grievances &amp; Pensions)
            </span>
          </div>

          {/* Right: Quick Links */}
          <div className="flex items-center gap-3 sm:gap-4 text-[11px]">
            <button
              onClick={() => {
                setActiveSubView('dashboard');
                setActiveSidebarItem('dashboard');
              }}
              className="flex items-center gap-1 hover:text-amber-300 transition-colors cursor-pointer"
            >
              <Home size={12} />
              <span>Home</span>
            </button>
            <span>•</span>
            <button
              onClick={() => showNotification('Emergency Helpdesk: 1800-11-4000 (Toll Free)')}
              className="flex items-center gap-1 hover:text-amber-300 transition-colors cursor-pointer"
            >
              <Phone size={12} />
              <span>Contact Us</span>
            </button>
            <span>•</span>
            <button
              onClick={() => showNotification('DRISHTI is an AI-powered Grievance Redressal platform.')}
              className="flex items-center gap-1 hover:text-amber-300 transition-colors cursor-pointer"
            >
              <Info size={12} />
              <span>About Us</span>
            </button>
            <span>•</span>
            <button
              onClick={() => showNotification('Frequently Asked Questions (FAQs) opened.')}
              className="flex items-center gap-1 hover:text-amber-300 transition-colors cursor-pointer"
            >
              <HelpCircle size={12} />
              <span>FAQs/Help</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN HEADER BAR (Emblem + Department Title + Drishti/CPGRAMS Badge + Session) */}
      {/* ========================================================================= */}
      <header className="w-full bg-white border-b border-gray-200 px-4 sm:px-8 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Ashoka Stambh Emblem + Department Bilingual Title */}
          <div
            onClick={() => {
              setActiveSubView('dashboard');
              setActiveSidebarItem('dashboard');
            }}
            className="flex items-center gap-3.5 sm:gap-4 cursor-pointer group"
            title="Go to Citizen Dashboard"
          >
            <img
              src={emblemLogo}
              alt="State Emblem of India"
              className="h-16 w-auto shrink-0 object-contain"
            />
            <div className="border-l border-gray-300 pl-3.5">
              <div className="text-[11px] sm:text-xs text-gray-700 font-serif leading-tight">
                प्रशासनिक सुधार और लोक शिकायत विभाग
              </div>
              <div className="text-[10px] sm:text-[11px] font-bold text-red-900 tracking-wider uppercase mt-0.5">
                DEPARTMENT OF
              </div>
              <div className="text-xs sm:text-sm lg:text-base font-extrabold text-[#002B49] uppercase tracking-tight group-hover:text-[#6B0C36] transition-colors">
                ADMINISTRATIVE REFORMS &amp; PUBLIC GRIEVANCES
              </div>
            </div>
          </div>

          {/* Right: DRISHTI / CPGRAMS Brand Container + Session Timer */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <div className="flex flex-col items-center md:items-end text-center md:text-right">
              <div className="flex items-center gap-2">
                <span className="bg-[#002B49] text-white px-3 py-1 rounded text-lg sm:text-xl font-black tracking-wider border-b-2 border-amber-500">
                  DRISHTI
                </span>
                <span className="bg-blue-800 text-white px-2.5 py-1 rounded text-xs font-bold tracking-widest uppercase">
                  CPGRAMS 7.0
                </span>
              </div>
              <span className="text-[10px] text-gray-500 font-medium tracking-tight mt-1">
                Centralized Public Grievance Redress And Monitoring System
              </span>
            </div>

            {/* Live Session Countdown Timer Badge */}
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-2xs">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-bold">Session: {formatSessionTime(sessionSeconds)}</span>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. SECONDARY MAROON NAVIGATION BAR */}
      {/* ========================================================================= */}
      <nav className="w-full bg-[#6B0C36] text-white text-xs px-4 sm:px-8 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 py-1.5">
          {/* Left Menu Items with Dropdowns */}
          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            <button
              onClick={() => {
                setActiveSubView('timeline');
                setActiveSidebarItem('timeline');
              }}
              className={`px-2.5 py-1.5 rounded transition-colors flex items-center gap-1 font-medium cursor-pointer ${
                activeSubView === 'timeline'
                  ? 'bg-white/20 text-amber-300 shadow-inner'
                  : 'hover:bg-white/10 text-white'
              }`}
            >
              <Eye size={13} />
              <span>View Status</span>
              <ChevronDown size={11} className="opacity-70" />
            </button>

            {/* Nodal PG Officers Dropdown (NMC / PWD) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNodalDropdownOpen(!nodalDropdownOpen)}
                className={`px-2.5 py-1.5 rounded transition-colors flex items-center gap-1 font-medium cursor-pointer ${
                  activeSubView === 'directory' || nodalDropdownOpen
                    ? 'bg-white/20 text-amber-300 shadow-inner'
                    : 'hover:bg-white/10 text-white'
                }`}
              >
                <Building size={13} />
                <span>Nodal PG Officers</span>
                <ChevronDown
                  size={11}
                  className={`opacity-70 transition-transform duration-200 ${
                    nodalDropdownOpen ? 'rotate-180 text-amber-300' : ''
                  }`}
                />
              </button>

              {nodalDropdownOpen && (
                <div className="absolute left-0 top-full mt-1.5 w-72 bg-white text-gray-900 rounded-lg shadow-2xl border border-gray-200 z-50 py-1 text-xs animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 bg-gray-50 border-b border-gray-100 text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                    Select Department / Authority
                  </div>

                  {/* Option 1: NMC */}
                  <button
                    type="button"
                    onClick={() => {
                      setDirectoryDept('nmc');
                      setActiveSubView('directory');
                      setNodalDropdownOpen(false);
                      showNotification('Viewing NMC (Nagpur Municipal Corporation) Nodal Officers Directory.');
                    }}
                    className={`w-full text-left px-3.5 py-2.5 hover:bg-blue-50 flex items-start gap-2.5 transition-colors border-b border-gray-100 cursor-pointer ${
                      activeSubView === 'directory' && directoryDept === 'nmc' ? 'bg-blue-50/80 font-bold text-blue-950' : 'text-gray-800'
                    }`}
                  >
                    <div className="w-6 h-6 rounded bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 mt-0.5">
                      <Building size={13} />
                    </div>
                    <div>
                      <div className="font-bold text-xs">1. NMC (Nagpur Municipal Corporation)</div>
                      <div className="text-[11px] text-gray-500 font-normal mt-0.5">
                        Zonal Offices, Health &amp; Water Works Redressal Cell
                      </div>
                    </div>
                  </button>

                  {/* Option 2: PWD */}
                  <button
                    type="button"
                    onClick={() => {
                      setDirectoryDept('pwd');
                      setActiveSubView('directory');
                      setNodalDropdownOpen(false);
                      showNotification('Viewing PWD Govt (Nagpur Division) Nodal Officers Directory.');
                    }}
                    className={`w-full text-left px-3.5 py-2.5 hover:bg-blue-50 flex items-start gap-2.5 transition-colors cursor-pointer ${
                      activeSubView === 'directory' && directoryDept === 'pwd' ? 'bg-blue-50/80 font-bold text-blue-950' : 'text-gray-800'
                    }`}
                  >
                    <div className="w-6 h-6 rounded bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 mt-0.5">
                      <Building size={13} />
                    </div>
                    <div>
                      <div className="font-bold text-xs">2. PWD Govt (Nagpur Division)</div>
                      <div className="text-[11px] text-gray-500 font-normal mt-0.5">
                        Circle Office, National Highways &amp; City Infra Wings
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => showNotification('Standard Operating Redress Process Flowchart.')}
              className="px-2.5 py-1.5 rounded hover:bg-white/10 transition-colors flex items-center gap-1 font-medium cursor-pointer"
            >
              <Layers size={13} />
              <span>Redress Process</span>
              <ChevronDown size={11} className="opacity-70" />
            </button>

            {/* Grievance Dropdown with 3 Core Features */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setGrievanceDropdownOpen(!grievanceDropdownOpen)}
                className={`px-2.5 py-1.5 rounded transition-colors flex items-center gap-1 font-medium cursor-pointer ${
                  activeSubView === 'terms' ||
                  activeSubView === 'form' ||
                  activeSubView === 'timeline' ||
                  activeSubView === 'nearby' ||
                  grievanceDropdownOpen
                    ? 'bg-white/20 text-amber-300 shadow-inner font-bold'
                    : 'hover:bg-white/10 text-white'
                }`}
              >
                <PlusSquare size={13} />
                <span>Grievance</span>
                <ChevronDown
                  size={11}
                  className={`opacity-70 transition-transform duration-200 ${
                    grievanceDropdownOpen ? 'rotate-180 text-amber-300' : ''
                  }`}
                />
              </button>

              {grievanceDropdownOpen && (
                <div className="absolute left-0 top-full mt-1.5 w-80 bg-white text-gray-900 rounded-lg shadow-2xl border border-gray-200 z-50 py-1 text-xs animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 bg-gray-50 border-b border-gray-100 text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                    Grievance Actions &amp; Community Hub
                  </div>

                  {/* Option 1: Lodge Public Grievance */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSubView('terms');
                      setActiveSidebarItem('lodge');
                      setGrievanceDropdownOpen(false);
                      showNotification('Opened Grievance Submission Flow (Terms & Conditions).');
                    }}
                    className={`w-full text-left px-3.5 py-2.5 hover:bg-blue-50 flex items-start gap-2.5 transition-colors border-b border-gray-100 cursor-pointer ${
                      activeSubView === 'terms' || activeSubView === 'form'
                        ? 'bg-blue-50/80 font-bold text-blue-950'
                        : 'text-gray-800'
                    }`}
                  >
                    <div className="w-6 h-6 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                      <PlusSquare size={13} />
                    </div>
                    <div>
                      <div className="font-bold text-xs flex items-center gap-1.5">
                        <span>1. Lodge Public Grievance</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                          AI-Assisted
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-500 font-normal mt-0.5">
                        Standard statutory submission with automatic department routing
                      </div>
                    </div>
                  </button>

                  {/* Option 2: View Status */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSubView('timeline');
                      setActiveSidebarItem('timeline');
                      setGrievanceDropdownOpen(false);
                      showNotification('Viewing Grievance Progress Stepper & Timeline Tracker.');
                    }}
                    className={`w-full text-left px-3.5 py-2.5 hover:bg-blue-50 flex items-start gap-2.5 transition-colors border-b border-gray-100 cursor-pointer ${
                      activeSubView === 'timeline'
                        ? 'bg-blue-50/80 font-bold text-blue-950'
                        : 'text-gray-800'
                    }`}
                  >
                    <div className="w-6 h-6 rounded bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 mt-0.5">
                      <Eye size={13} />
                    </div>
                    <div>
                      <div className="font-bold text-xs flex items-center gap-1.5">
                        <span>2. View Status</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-800">
                          Live Timeline
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-500 font-normal mt-0.5">
                        Horizontal progress stepper &amp; field inspection history
                      </div>
                    </div>
                  </button>

                  {/* Option 3: View Nearby Grievances */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSubView('nearby');
                      setActiveSidebarItem('nearby');
                      setGrievanceDropdownOpen(false);
                      showNotification('Viewing Nearby Grievances (Nagpur Locality Hub).');
                    }}
                    className={`w-full text-left px-3.5 py-2.5 hover:bg-blue-50 flex items-start gap-2.5 transition-colors border-b border-gray-100 cursor-pointer ${
                      activeSubView === 'nearby'
                        ? 'bg-blue-50/80 font-bold text-blue-950'
                        : 'text-gray-800'
                    }`}
                  >
                    <div className="w-6 h-6 rounded bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin size={13} />
                    </div>
                    <div>
                      <div className="font-bold text-xs flex items-center gap-1.5">
                        <span>3. View Nearby Grievances</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900">
                          Crowd Hub
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-500 font-normal mt-0.5">
                        Community crowd-sourced feed with upvoting &amp; civic comments
                      </div>
                    </div>
                  </button>

                  {/* Option 4: Weather & Hotspot Map */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSubView('weather-map');
                      setActiveSidebarItem('weather-map');
                      setGrievanceDropdownOpen(false);
                      showNotification('Viewing Disaster & Weather Risk Map (77 Hotspots across Nagpur).');
                    }}
                    className={`w-full text-left px-3.5 py-2.5 hover:bg-blue-50 flex items-start gap-2.5 transition-colors cursor-pointer ${
                      activeSubView === 'weather-map'
                        ? 'bg-blue-50/80 font-bold text-blue-950'
                        : 'text-gray-800'
                    }`}
                  >
                    <div className="w-6 h-6 rounded bg-red-100 text-red-700 flex items-center justify-center shrink-0 mt-0.5">
                      <CloudRain size={13} />
                    </div>
                    <div>
                      <div className="font-bold text-xs flex items-center gap-1.5">
                        <span>4. Weather &amp; Hotspot Map</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-red-600 text-white animate-pulse">
                          77 Hotspots
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-500 font-normal mt-0.5">
                        GIS interactive risk radar, 7-day weather model &amp; NDRF stations
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Weather & Hotspot Map Direct Header Item */}
            <button
              onClick={() => {
                setActiveSubView('weather-map');
                setActiveSidebarItem('weather-map');
                showNotification('Opening Nagpur Disaster & Weather Risk Map (77 Hotspots).');
              }}
              className={`px-2.5 py-1.5 rounded transition-colors flex items-center gap-1.5 font-medium cursor-pointer ${
                activeSubView === 'weather-map'
                  ? 'bg-white/20 text-amber-300 shadow-inner font-bold'
                  : 'hover:bg-white/10 text-white'
              }`}
            >
              <CloudRain size={13} className="text-cyan-300" />
              <span>Weather &amp; Hotspot Map</span>
              <span className="bg-red-600 text-white text-[9px] px-1.5 py-0.2 rounded font-bold uppercase animate-pulse">
                77 Sites
              </span>
            </button>

            <button
              onClick={() => showNotification('List of Appellate Authorities for First Appeal.')}
              className="px-2.5 py-1.5 rounded hover:bg-white/10 transition-colors flex items-center gap-1 font-medium cursor-pointer hidden xl:flex"
            >
              <Shield size={13} />
              <span>Nodal Authority for Appeal</span>
            </button>
          </div>

          {/* Right: Language Dropdown + Active User Greeting */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1 text-[11px] bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded text-white font-medium transition-colors cursor-pointer"
              >
                <span>Language :</span>
                <span className="font-bold underline">
                  {currentLang === 'en' ? 'English' : currentLang === 'hi' ? 'हिन्दी' : 'मराठी'}
                </span>
                <ChevronDown size={11} />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 top-full mt-1 w-32 bg-white text-gray-900 rounded shadow-xl border border-gray-200 z-50 py-1 text-xs">
                  <button
                    onClick={() => {
                      onLanguageChange('en');
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-blue-50 flex items-center justify-between ${
                      currentLang === 'en' ? 'font-bold text-blue-900 bg-blue-50/50' : ''
                    }`}
                  >
                    <span>English</span>
                    {currentLang === 'en' && <Check size={12} className="text-blue-700" />}
                  </button>
                  <button
                    onClick={() => {
                      onLanguageChange('hi');
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-blue-50 flex items-center justify-between ${
                      currentLang === 'hi' ? 'font-bold text-blue-900 bg-blue-50/50' : ''
                    }`}
                  >
                    <span>हिन्दी</span>
                    {currentLang === 'hi' && <Check size={12} className="text-blue-700" />}
                  </button>
                  <button
                    onClick={() => {
                      onLanguageChange('mr');
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-blue-50 flex items-center justify-between ${
                      currentLang === 'mr' ? 'font-bold text-blue-900 bg-blue-50/50' : ''
                    }`}
                  >
                    <span>मराठी</span>
                    {currentLang === 'mr' && <Check size={12} className="text-blue-700" />}
                  </button>
                </div>
              )}
            </div>

            {/* User Session Greeting (e.g. Welcome : Bhavik Gore) */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 bg-black/25 px-3 py-1 rounded border border-white/20">
              <UserCheck size={14} className="text-amber-400" />
              <span>Welcome : {userName}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* ========================================================================= */}
      {/* 4. MAIN WORKFLOW BODY (Left Sidebar + Content Workspace) */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 flex flex-col lg:flex-row gap-6">
        
        {/* ======================================================================= */}
        {/* LEFT SIDEBAR MENU (Strictly 7 Items + Bottom Drishti AI Avatar Card) */}
        {/* ======================================================================= */}
        <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-4">
          
          {/* Main Navigation Menu Box */}
          <div className="bg-[#002B49] text-white rounded-lg shadow-md overflow-hidden border border-[#001D33]">
            <div className="divide-y divide-[#00385F] text-xs font-semibold">
              
              {/* 1. Grievance Dashboard */}
              <button
                onClick={() => {
                  setActiveSubView('dashboard');
                  setActiveSidebarItem('dashboard');
                }}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors cursor-pointer ${
                  activeSidebarItem === 'dashboard' && activeSubView === 'dashboard'
                    ? 'bg-[#1F5488] text-amber-300 font-bold border-l-4 border-amber-400'
                    : 'hover:bg-[#003357] text-white'
                }`}
              >
                <LayoutDashboard size={16} className="shrink-0" />
                <span>Grievance Dashboard</span>
              </button>

              {/* 2. Lodge Public Grievance */}
              <button
                onClick={() => {
                  setActiveSubView('terms');
                  setActiveSidebarItem('lodge');
                }}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors cursor-pointer ${
                  activeSidebarItem === 'lodge' || activeSubView === 'terms' || activeSubView === 'form' || activeSubView === 'acknowledgment'
                    ? 'bg-[#1F5488] text-amber-300 font-bold border-l-4 border-amber-400'
                    : 'hover:bg-[#003357] text-white'
                }`}
              >
                <PlusSquare size={16} className="shrink-0 text-amber-400" />
                <span>Lodge Public Grievance</span>
              </button>

              {/* 3. View Status Tracker (Timeline) */}
              <button
                onClick={() => {
                  setActiveSubView('timeline');
                  setActiveSidebarItem('timeline');
                }}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors cursor-pointer ${
                  activeSidebarItem === 'timeline' || activeSubView === 'timeline'
                    ? 'bg-[#1F5488] text-amber-300 font-bold border-l-4 border-amber-400'
                    : 'hover:bg-[#003357] text-white'
                }`}
              >
                <Eye size={16} className="shrink-0 text-cyan-300" />
                <span>View Status Tracker</span>
              </button>

              {/* 4. View Nearby Grievances (Nagpur Locality Hub) */}
              <button
                onClick={() => {
                  setActiveSubView('nearby');
                  setActiveSidebarItem('nearby');
                }}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors cursor-pointer ${
                  activeSidebarItem === 'nearby' || activeSubView === 'nearby'
                    ? 'bg-[#1F5488] text-amber-300 font-bold border-l-4 border-amber-400'
                    : 'hover:bg-[#003357] text-white'
                }`}
              >
                <MapPin size={16} className="shrink-0 text-amber-400" />
                <span>View Nearby Grievances</span>
              </button>

              {/* 5. Weather & Hotspot Map (77 Sites across Nagpur) */}
              <button
                onClick={() => {
                  setActiveSubView('weather-map');
                  setActiveSidebarItem('weather-map');
                }}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors cursor-pointer ${
                  activeSidebarItem === 'weather-map' || activeSubView === 'weather-map'
                    ? 'bg-[#1F5488] text-amber-300 font-bold border-l-4 border-amber-400'
                    : 'hover:bg-[#003357] text-white'
                }`}
              >
                <CloudRain size={16} className="shrink-0 text-cyan-300" />
                <div className="flex items-center justify-between w-full">
                  <span>Weather &amp; Hotspot Map</span>
                  <span className="text-[9px] bg-red-600 text-white font-bold px-1.5 py-0.2 rounded animate-pulse">
                    77 Sites
                  </span>
                </div>
              </button>

              {/* 6. Nodal PG Officers Directory (NMC / PWD) */}
              <button
                onClick={() => {
                  setActiveSubView('directory');
                  setActiveSidebarItem('directory');
                }}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors cursor-pointer ${
                  activeSidebarItem === 'directory' || activeSubView === 'directory'
                    ? 'bg-[#1F5488] text-amber-300 font-bold border-l-4 border-amber-400'
                    : 'hover:bg-[#003357] text-white'
                }`}
              >
                <Building size={16} className="shrink-0 text-amber-300" />
                <span>Nodal PG Officers Directory</span>
              </button>

              {/* 3. Account Activity */}
              <button
                onClick={() => {
                  setActiveSubView('activity');
                  setActiveSidebarItem('activity');
                }}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors cursor-pointer ${
                  activeSidebarItem === 'activity' || activeSubView === 'activity'
                    ? 'bg-[#1F5488] text-amber-300 font-bold border-l-4 border-amber-400'
                    : 'hover:bg-[#003357] text-white'
                }`}
              >
                <History size={16} className="shrink-0 text-sky-300" />
                <span>Account Activity</span>
              </button>

              {/* 4. Edit Profile */}
              <button
                onClick={() => {
                  setActiveSubView('profile');
                  setActiveSidebarItem('profile');
                }}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors cursor-pointer ${
                  activeSidebarItem === 'profile' || activeSubView === 'profile'
                    ? 'bg-[#1F5488] text-amber-300 font-bold border-l-4 border-amber-400'
                    : 'hover:bg-[#003357] text-white'
                }`}
              >
                <UserCheck size={16} className="shrink-0 text-emerald-300" />
                <span>Edit Profile</span>
              </button>

              {/* 5. Change Password */}
              <button
                onClick={() => {
                  setActiveSubView('password');
                  setActiveSidebarItem('password');
                }}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors cursor-pointer ${
                  activeSidebarItem === 'password' || activeSubView === 'password'
                    ? 'bg-[#1F5488] text-amber-300 font-bold border-l-4 border-amber-400'
                    : 'hover:bg-[#003357] text-white'
                }`}
              >
                <Lock size={16} className="shrink-0 text-yellow-300" />
                <span>Change Password</span>
              </button>

              {/* 6. Delete Account */}
              <button
                onClick={() => setActiveModal('delete')}
                className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-[#003357] text-white transition-colors cursor-pointer"
              >
                <Trash2 size={16} className="shrink-0 text-red-300" />
                <span>Delete Account</span>
              </button>

              {/* 7. Sign Out (Highlighted in Yellow as in reference screenshot) */}
              <button
                onClick={onSignOut}
                className="w-full text-left px-4 py-3.5 flex items-center gap-3 bg-[#001D33] hover:bg-black/40 text-amber-400 font-bold transition-colors cursor-pointer border-t-2 border-amber-500/30"
              >
                <LogOut size={16} className="shrink-0 text-amber-400" />
                <span>Sign out</span>
              </button>
            </div>
          </div>

          {/* Bottom Sidebar Card: DRISHTI AI Chatbot / Voice Assistant Card (Exact Layout from Image 1) */}
          <div
            onClick={() => setActiveModal('voice')}
            className="bg-white rounded-lg p-3.5 shadow-sm border border-gray-200 flex items-center gap-3 cursor-pointer hover:shadow-md hover:border-amber-300 transition-all group"
            title="Click to speak your grievance with Drishti AI"
          >
            {/* Realistic AI Assistant Avatar Portrait */}
            <div className="w-16 h-20 rounded-md overflow-hidden bg-slate-100 shrink-0 border border-amber-300/60 shadow-2xs relative">
              <img
                src={drishtiAvatarImg}
                alt="Drishti AI Assistant"
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-0 inset-x-0 bg-[#002B49]/90 text-[8px] text-white font-bold text-center py-0.5">
                DRISHTI AI
              </div>
            </div>

            {/* Voice Prompt & Branding */}
            <div className="flex-1 flex flex-col justify-center">
              <span className="text-[12px] font-bold text-gray-800 leading-tight">
                बोल कर शिकायत दर्ज करें
              </span>
              <span className="text-[11px] font-semibold text-[#002B49] mt-0.5">
                Speak Your Grievance
              </span>
              <div className="mt-1.5 flex items-center gap-1.5">
                <span className="bg-[#6B0C36] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-2xs tracking-wide">
                  DRISHTI AI Chatbot
                </span>
                <Mic size={13} className="text-red-600 animate-pulse" />
              </div>
            </div>
          </div>
        </aside>

        {/* ======================================================================= */}
        {/* RIGHT MAIN WORKSPACE */}
        {/* ======================================================================= */}
        <main className="flex-1 flex flex-col gap-6">

          {/* ===================================================================== */}
          {/* VIEW 1: USER DASHBOARD (Image 1 Layout) */}
          {/* ===================================================================== */}
          {activeSubView === 'dashboard' && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-200">
              
              {/* 3 KPI Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* 1. Total Grievances Registered (Orange Card) */}
                <div
                  onClick={() => setStatusFilter('All')}
                  className={`bg-[#FF9900] text-white rounded-lg p-5 shadow-sm flex items-center justify-between cursor-pointer transition-all hover:shadow-md hover:scale-[1.01] ${
                    statusFilter === 'All' ? 'ring-2 ring-orange-400 ring-offset-2' : ''
                  }`}
                >
                  <div className="w-14 h-14 rounded-full border-2 border-white/80 flex items-center justify-center bg-white/10 shrink-0">
                    <FileText size={28} className="text-white" />
                  </div>
                  <div className="flex flex-col items-end text-right">
                    <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">{totalRegistered}</span>
                    <span className="text-xs sm:text-sm font-semibold text-white/95 mt-1 tracking-wide">
                      Total Grievances Registered
                    </span>
                  </div>
                </div>

                {/* 2. Number of Grievances Pending (Green Card) */}
                <div
                  onClick={() => setStatusFilter('Pending')}
                  className={`bg-[#4CAF50] text-white rounded-lg p-5 shadow-sm flex items-center justify-between cursor-pointer transition-all hover:shadow-md hover:scale-[1.01] ${
                    statusFilter === 'Pending' ? 'ring-2 ring-emerald-400 ring-offset-2' : ''
                  }`}
                >
                  <div className="w-14 h-14 rounded-full border-2 border-white/80 flex items-center justify-center bg-white/10 shrink-0">
                    <Clock size={28} className="text-white" />
                  </div>
                  <div className="flex flex-col items-end text-right">
                    <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">{pendingCount}</span>
                    <span className="text-xs sm:text-sm font-semibold text-white/95 mt-1 tracking-wide">
                      Number of Grievances Pending
                    </span>
                  </div>
                </div>

                {/* 3. Number of Grievances Closed (Red Card) */}
                <div
                  onClick={() => setStatusFilter('Closed')}
                  className={`bg-[#E53935] text-white rounded-lg p-5 shadow-sm flex items-center justify-between cursor-pointer transition-all hover:shadow-md hover:scale-[1.01] ${
                    statusFilter === 'Closed' ? 'ring-2 ring-red-400 ring-offset-2' : ''
                  }`}
                >
                  <div className="w-14 h-14 rounded-full border-2 border-white/80 flex items-center justify-center bg-white/10 shrink-0">
                    <CheckCircle2 size={28} className="text-white" />
                  </div>
                  <div className="flex flex-col items-end text-right">
                    <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">{closedCount}</span>
                    <span className="text-xs sm:text-sm font-semibold text-white/95 mt-1 tracking-wide">
                      Number of Grievances Closed
                    </span>
                  </div>
                </div>
              </div>

              {/* Grievance Data Table Container ("List of Grievances") */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                
                {/* Table Header Section */}
                <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50/70">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-gray-800">
                      List of Grievances
                    </h2>
                    {statusFilter !== 'All' && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                        Filtered: {statusFilter}
                      </span>
                    )}
                  </div>

                  {/* Top Action to Lodge Grievance */}
                  <button
                    onClick={() => {
                      setActiveSubView('terms');
                      setActiveSidebarItem('lodge');
                    }}
                    className="bg-[#002B49] hover:bg-[#00385F] text-white px-3.5 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    <PlusSquare size={14} className="text-amber-300" />
                    <span>Lodge New Grievance</span>
                  </button>
                </div>

                {/* Table Controls (Entries Dropdown & Search Filter) */}
                <div className="p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-700">
                  <div className="flex items-center gap-1.5 self-start sm:self-auto">
                    <span>Show</span>
                    <select
                      value={entriesPerPage}
                      onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                      className="border border-gray-300 rounded px-2 py-1 bg-white text-xs focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </select>
                    <span>entries</span>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <label className="font-semibold shrink-0">Search:</label>
                    <div className="relative w-full sm:w-64">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search docket, keyword, status..."
                        className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-400 focus:outline-hidden"
                      />
                      <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm('')}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Table Data View */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#E9ECEF] text-gray-800 font-bold border-y border-gray-300">
                        <th className="py-2.5 px-3 w-12 text-center">Sn.</th>
                        <th className="py-2.5 px-4 w-44">Registration Number</th>
                        <th className="py-2.5 px-4 w-32">Received Date</th>
                        <th className="py-2.5 px-4">Grievance description</th>
                        <th className="py-2.5 px-4 w-36 text-center">Status</th>
                        <th className="py-2.5 px-4 w-48 text-center">Action / Follow-up</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredGrievances.length > 0 ? (
                        filteredGrievances.map((item, idx) => {
                          const cooldown = reminderCooldowns[item.registrationNumber] || 0;
                          const isPendingOrActive = item.status === 'Pending' || item.status === 'Under Process';

                          return (
                            <tr
                              key={item.registrationNumber}
                              onClick={() => setSelectedGrievanceDetail(item)}
                              className="hover:bg-blue-50/60 transition-colors cursor-pointer group"
                            >
                              <td className="py-3 px-3 text-center font-medium text-gray-600">
                                {idx + 1}
                              </td>
                              <td className="py-3 px-4 font-mono font-bold text-blue-700 group-hover:underline flex items-center gap-1.5">
                                <span>{item.registrationNumber}</span>
                                {item.aiTriaged && (
                                  <span className="bg-purple-100 text-purple-800 text-[9px] px-1.5 py-0.5 rounded font-sans font-bold">
                                    AI
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-gray-700 font-medium whitespace-nowrap">
                                {item.receivedDate}
                              </td>
                              <td className="py-3 px-4 text-gray-800">
                                <p className="line-clamp-2">{item.grievanceDescription}</p>
                                {item.ministry && (
                                  <span className="text-[10px] text-gray-500 font-medium block mt-0.5">
                                    Dept: {item.ministry}
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-center">
                                <span
                                  className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                    item.status === 'Pending'
                                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                      : item.status === 'Under Process'
                                      ? 'bg-blue-100 text-blue-900 border border-blue-300'
                                      : item.status === 'Resolved'
                                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                      : 'bg-red-100 text-red-900 border border-red-300'
                                  }`}
                                >
                                  {item.status}
                                </span>
                                {item.reminderCount && item.reminderCount > 0 ? (
                                  <div className="mt-1 flex items-center justify-center gap-1 text-[10px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5 mx-auto max-w-max shadow-2xs">
                                    <Bell size={10} className="text-amber-600 shrink-0" />
                                    <span>Reminder #{item.reminderCount} Sent</span>
                                  </div>
                                ) : null}
                              </td>
                              <td className="py-3 px-4 text-center">
                                {isPendingOrActive ? (
                                  cooldown > 0 ? (
                                    <button
                                      disabled
                                      type="button"
                                      onClick={(e) => e.stopPropagation()}
                                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-500 rounded-md text-xs font-semibold border border-gray-200 cursor-not-allowed select-none"
                                      title="Cooldown active to prevent duplicate reminder spam"
                                    >
                                      <Timer size={12} className="text-amber-600 animate-spin shrink-0" />
                                      <span>Cooldown ({cooldown}s)</span>
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setReminderModalGrievance(item);
                                      }}
                                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-md text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer border border-amber-600"
                                      title="Send urgent reminder notification to assigned Nodal Officer"
                                    >
                                      <Bell size={12} className="shrink-0" />
                                      <span>
                                        {item.reminderCount
                                          ? `Send Reminder #${item.reminderCount + 1}`
                                          : 'Send Reminder'}
                                      </span>
                                    </button>
                                  )
                                ) : (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedProofGrievance(item);
                                    }}
                                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer border border-emerald-700"
                                    title="View Official Government Resolution Proof Document & Photo"
                                  >
                                    <Eye size={13} className="shrink-0 text-white" />
                                    <span>View Gov Proof 👁️</span>
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-10 text-center text-gray-500 bg-white">
                            <div className="flex flex-col items-center justify-center gap-2">
                              <FileText size={36} className="text-gray-300" />
                              <span className="text-sm font-semibold text-gray-600">
                                {grievancesLoading ? 'Loading grievances…' : grievancesError ? 'Grievances could not be loaded' : 'No data available in table'}
                              </span>
                              <p className="text-xs text-gray-400">
                                {grievancesError
                                  ? grievancesError
                                  : grievancesLoading
                                  ? 'Please wait while your records are retrieved.'
                                  : searchTerm
                                  ? `No grievances matching "${searchTerm}"`
                                  : 'You have not registered any grievances yet.'}
                              </p>
                              {!grievancesLoading && <button
                                onClick={() => {
                                  setActiveSubView('terms');
                                  setActiveSidebarItem('lodge');
                                }}
                                className="mt-2 bg-[#002B49] text-white px-4 py-1.5 rounded text-xs font-bold hover:bg-[#00385F] transition-colors cursor-pointer"
                              >
                                Lodge Your First Grievance
                              </button>}
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer / Pagination Controls (First, Prev, Next, Last) */}
                <div className="p-3 sm:p-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600 bg-gray-50/50">
                  <div>
                    {filteredGrievances.length > 0 ? (
                      <span>
                        Showing 1 to {filteredGrievances.length} of {filteredGrievances.length} entries
                      </span>
                    ) : (
                      <span>No entries found</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      disabled={true}
                      className="px-2.5 py-1 border border-gray-300 rounded bg-white text-gray-400 cursor-not-allowed text-xs font-medium"
                    >
                      First
                    </button>
                    <button
                      disabled={true}
                      className="px-2.5 py-1 border border-gray-300 rounded bg-white text-gray-400 cursor-not-allowed text-xs font-medium"
                    >
                      Prev
                    </button>
                    <button className="px-3 py-1 border border-[#002B49] rounded bg-[#002B49] text-white text-xs font-bold">
                      1
                    </button>
                    <button
                      disabled={true}
                      className="px-2.5 py-1 border border-gray-300 rounded bg-white text-gray-400 cursor-not-allowed text-xs font-medium"
                    >
                      Next
                    </button>
                    <button
                      disabled={true}
                      className="px-2.5 py-1 border border-gray-300 rounded bg-white text-gray-400 cursor-not-allowed text-xs font-medium"
                    >
                      Last
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* VIEW 2: GRIEVANCE TERMS & CONDITIONS (Image 2 Layout) */}
          {/* ===================================================================== */}
          {activeSubView === 'terms' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 flex flex-col gap-6 animate-in fade-in duration-200">
              
              {/* Header Title */}
              <div className="border-b border-gray-200 pb-3">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                  Grievance terms and conditions
                </h1>
              </div>

              {/* List of subjects which can not be treated as grievance */}
              <div className="space-y-3">
                <h2 className="text-sm sm:text-base font-bold text-red-600 tracking-tight">
                  List of subjects/topics which can not be treated as grievance.
                </h2>

                <ul className="space-y-2.5 text-xs sm:text-sm text-gray-700 font-medium pl-2">
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-red-800 shrink-0 mt-1.5"></span>
                    <span>RTI Matters</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-red-800 shrink-0 mt-1.5"></span>
                    <span>Court related / Subjudice matters</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-red-800 shrink-0 mt-1.5"></span>
                    <span>Religious matters</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-red-800 shrink-0 mt-1.5"></span>
                    <span className="leading-relaxed">
                      Grievances of Government employees concerning their service matters including disciplinary proceedings etc. unless the aggrieved employee has already exhausted the prescribed channels keeping in view the{' '}
                      <span className="text-blue-700 font-bold hover:underline cursor-pointer">
                        DoPT OM No. 11013/08/2013-Estt.(A-III) dated 31.08.2015
                      </span>
                    </span>
                  </li>
                </ul>
              </div>

              {/* Yellow Alert Box */}
              <div className="bg-[#FFF9E6] border border-amber-300 rounded-lg p-4 text-xs sm:text-sm text-amber-900 font-medium flex items-start gap-3">
                <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  Please use appropriate specialized emergency desk if your grievance pertains to classified military zones or subjudice court verdicts.
                </div>
              </div>

              {/* Mandatory Checkbox Agreement */}
              <div className="pt-2">
                <label className="flex items-start gap-3 text-xs sm:text-sm font-semibold text-gray-800 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={termsAgreed}
                    onChange={(e) => setTermsAgreed(e.target.checked)}
                    className="w-4 h-4 text-[#002B49] border-gray-300 rounded focus:ring-blue-500 mt-0.5 cursor-pointer"
                  />
                  <span>
                    I agree that my grievance does not fall in any of the above listed categories
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    if (!termsAgreed) {
                      showNotification('Please check the agreement box to proceed.');
                      return;
                    }
                    setActiveSubView('form');
                  }}
                  disabled={!termsAgreed}
                  className={`px-6 py-2.5 rounded-md text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
                    termsAgreed
                      ? 'bg-[#002B49] hover:bg-[#00385F] text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <span>Submit</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  onClick={() => {
                    setActiveSubView('dashboard');
                    setActiveSidebarItem('dashboard');
                  }}
                  className="px-4 py-2.5 rounded-md text-xs sm:text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* VIEW 3: DRISHTI AI SMART GRIEVANCE REGISTRATION FORM (Image 3 Layout) */}
          {/* ===================================================================== */}
          {activeSubView === 'form' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 flex flex-col gap-6 animate-in fade-in duration-200">
              
              {/* Form Title & Top Return Button */}
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                  Grievance registration form
                </h1>
                <button
                  onClick={() => {
                    setActiveSubView('dashboard');
                    setActiveSidebarItem('dashboard');
                  }}
                  className="bg-gray-700 hover:bg-gray-800 text-white px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                >
                  <ArrowLeft size={13} />
                  <span>Return</span>
                </button>
              </div>

              {/* Official Instructions Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2 border-b border-gray-200 pb-3">
                <span className="text-blue-700 font-medium">
                  Please note : If specific information related to a service is not available / known, select Others/Misc. option for lodging of grievance, if available.
                </span>
                <span className="text-red-600 font-bold shrink-0">
                  Fields marked with * are mandatory.
                </span>
              </div>

              {/* Form Submission */}
              <form onSubmit={handleGrievanceSubmit} className="space-y-6">
                
                {/* ------------------------------------------------------------- */}
                {/* SECTION 1: MEDIA UPLOAD & DESCRIPTION (Prioritized Top) */}
                {/* ------------------------------------------------------------- */}
                <div className="bg-slate-50/70 p-4 sm:p-5 rounded-lg border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xs sm:text-sm font-bold text-gray-900 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#002B49] text-white text-[11px] flex items-center justify-center font-black">
                        1
                      </span>
                      <span>Describe Grievance &amp; Attach Supporting Media *</span>
                    </h2>

                    {/* Quick Scenario Fill Buttons for Fast Testing */}
                    <div className="hidden sm:flex items-center gap-2 text-[11px]">
                      <span className="text-gray-500 font-semibold">Test Presets:</span>
                      <button
                        type="button"
                        onClick={() => loadSampleDisasterScenario('flood')}
                        className="bg-blue-100 hover:bg-blue-200 text-blue-900 px-2 py-0.5 rounded font-bold transition-colors cursor-pointer"
                      >
                        🌊 Flood Relief
                      </button>
                      <button
                        type="button"
                        onClick={() => loadSampleDisasterScenario('road')}
                        className="bg-amber-100 hover:bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-bold transition-colors cursor-pointer"
                      >
                        🚧 Landslide Hazard
                      </button>
                      <button
                        type="button"
                        onClick={() => loadSampleDisasterScenario('pf')}
                        className="bg-emerald-100 hover:bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-bold transition-colors cursor-pointer"
                      >
                        📋 EPFO Claim
                      </button>
                    </div>
                  </div>

                  {/* Grievance Text Input (Remarks) */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-gray-900">
                        Text of grievance (Remarks) <span className="text-red-600">*</span>
                      </label>
                      <span className="text-[11px] text-blue-700 font-medium">
                        Maximum 2000 characters allowed. ({2000 - remarks.length} characters remaining)
                      </span>
                    </div>

                    <p className="text-[10px] text-gray-500 mb-1.5">
                      Alphabet A-Z, a-z, number 0-9 and special characters , . - _ ( ) / : &amp; @ # $ % &amp; * ? + = ! &apos; &quot; only are allowed in grievance description.
                    </p>

                    <div className="relative">
                      <textarea
                        rows={4}
                        maxLength={2000}
                        value={remarks}
                        onChange={(e) => {
                          setRemarks(e.target.value);
                          if (e.target.value.length > 8) {
                            triggerAiInference(e.target.value, uploadedFile?.name);
                          }
                        }}
                        placeholder="Please Enter Text of Grievance (Remarks) in English, Hindi, or any regional language..."
                        className="w-full p-3 bg-white border border-gray-300 rounded-md text-xs sm:text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden shadow-2xs font-sans leading-relaxed"
                        required
                      />

                      {/* Microphone Voice Transcription Button */}
                      <button
                        type="button"
                        onClick={toggleVoiceRecording}
                        className={`absolute right-3 bottom-3 p-2 rounded-full shadow-md transition-all cursor-pointer ${
                          isRecording
                            ? 'bg-red-600 text-white animate-bounce'
                            : 'bg-gray-100 hover:bg-red-50 text-red-600 border border-gray-300'
                        }`}
                        title="Click to speak using Drishti Voice AI"
                      >
                        {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Drag & Drop File Upload Area */}
                  <div>
                    <label className="block text-xs font-bold text-gray-900 mb-1">
                      Upload Disaster/Grievance Photo or Document (Optional)
                    </label>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileUpload(e.target.files[0]);
                        }
                      }}
                    />

                    {!uploadedFile ? (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                            handleFileUpload(e.dataTransfer.files[0]);
                          }
                        }}
                        className="border-2 border-dashed border-gray-300 hover:border-blue-500 bg-white hover:bg-blue-50/30 rounded-lg p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 group"
                      >
                        <Upload size={24} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                        <span className="text-xs font-bold text-gray-700 group-hover:text-blue-700">
                          Click to browse or drag and drop disaster image or document
                        </span>
                        <span className="text-[10px] text-gray-500">
                          Supports PDF, JPG, PNG format (Maximum file size: 4MB)
                        </span>
                      </div>
                    ) : (
                      <div className="bg-white border border-emerald-300 rounded-lg p-3 flex items-center justify-between shadow-2xs">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold shrink-0">
                            <FileCheck size={20} />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-gray-900 block truncate max-w-xs">
                              {uploadedFile.name}
                            </span>
                            <span className="text-[10px] text-gray-500 font-medium">
                              {uploadedFile.size} • Attached
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {uploadedFile.previewUrl && (
                            <img
                              src={uploadedFile.previewUrl}
                              alt="Thumbnail"
                              className="w-10 h-10 rounded object-cover border border-gray-200"
                            />
                          )}
                          <button
                            type="button"
                            onClick={() => setUploadedFile(null)}
                            className="text-red-600 hover:text-red-800 p-1.5 rounded hover:bg-red-50 cursor-pointer"
                            title="Remove attachment"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* ------------------------------------------------------------- */}
                {/* SECTION 2: SMART AI AUTO-FILLED FILTERS (Image 3 Dropdowns) */}
                {/* ------------------------------------------------------------- */}
                <div className="bg-white p-5 rounded-lg border border-gray-200 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-3">
                    <h2 className="text-xs sm:text-sm font-bold text-gray-900 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#002B49] text-white text-[11px] flex items-center justify-center font-black">
                        2
                      </span>
                      <span>Departmental Categorization &amp; Jurisdiction Filters *</span>
                    </h2>

                    {/* AI Status Badge */}
                    <div className="flex items-center gap-1.5">
                      {isAiAnalyzing ? (
                        <span className="bg-amber-100 text-amber-900 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 animate-pulse border border-amber-300">
                          <RefreshCw size={12} className="animate-spin text-amber-700" />
                          <span>AI Analyzing intent &amp; jurisdiction...</span>
                        </span>
                      ) : aiDetectedTag ? (
                        <span className="bg-purple-50 text-purple-900 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-purple-300 shadow-2xs">
                          <Sparkles size={13} className="text-purple-600" />
                          <span>{aiDetectedTag}</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-gray-500 font-medium">
                          Auto-filled via Drishti AI engine (Editable)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 2-Column Dropdown Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                    
                    {/* Ministry / Department */}
                    <div className="md:col-span-12">
                      <label className="block font-bold text-gray-800 mb-1">
                        Ministry / Department <span className="text-red-600">*</span>
                      </label>
                      <select
                        value={selectedMinistry}
                        onChange={(e) => setSelectedMinistry(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900 text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                        required
                      >
                        <option value="Ministry of Home Affairs / NDMA">Ministry of Home Affairs / NDMA (Disaster Management)</option>
                        <option value="Labour and Employment">Labour and Employment</option>
                        <option value="Ministry of Housing and Urban Affairs">Ministry of Housing and Urban Affairs</option>
                        <option value="Ministry of Road Transport and Highways">Ministry of Road Transport and Highways</option>
                        <option value="Ministry of Jal Shakti / Central Water Commission">Ministry of Jal Shakti / Central Water Commission</option>
                        <option value="Ministry of Health and Family Welfare">Ministry of Health and Family Welfare</option>
                        <option value="Others / Miscellaneous">Others / Miscellaneous</option>
                      </select>
                    </div>

                    {/* Select main category */}
                    <div className="md:col-span-6">
                      <label className="block font-bold text-gray-800 mb-1">
                        Select main category <span className="text-red-600">*</span>
                      </label>
                      <select
                        value={selectedMainCategory}
                        onChange={(e) => setSelectedMainCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                        required
                      >
                        <option value="Disaster Relief & Emergency Response">Disaster Relief &amp; Emergency Response</option>
                        <option value="Employee Provident Fund Organisation">Employee Provident Fund Organisation</option>
                        <option value="Drainage & Civic Sanitation">Drainage &amp; Civic Sanitation</option>
                        <option value="National Highway Repair & Landslide Clearance">National Highway Repair &amp; Landslide Clearance</option>
                        <option value="Public Health Emergency & Epidemic Prevention">Public Health Emergency &amp; Epidemic Prevention</option>
                        <option value="Others / Miscellaneous">Others / Miscellaneous</option>
                      </select>
                    </div>

                    {/* Select next level category */}
                    <div className="md:col-span-6">
                      <label className="block font-bold text-gray-800 mb-1">
                        Select next level category <span className="text-red-600">*</span>
                      </label>
                      <select
                        value={selectedNextCategory}
                        onChange={(e) => setSelectedNextCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                        required
                      >
                        <option value="Urban Flooding Relief & Evacuation">Urban Flooding Relief &amp; Evacuation</option>
                        <option value="PF related">PF related</option>
                        <option value="Bridge Structural Hazard & Road Cave-in">Bridge Structural Hazard &amp; Road Cave-in</option>
                        <option value="Culvert Blockage & Desilting">Culvert Blockage &amp; Desilting</option>
                        <option value="Emergency Medical Aid Supplies">Emergency Medical Aid Supplies</option>
                      </select>
                    </div>

                    {/* Select next level category (Sub-category) */}
                    <div className="md:col-span-6">
                      <label className="block font-bold text-gray-800 mb-1">
                        Select next level category <span className="text-red-600">*</span>
                      </label>
                      <select
                        value={selectedSubCategory}
                        onChange={(e) => setSelectedSubCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                        required
                      >
                        <option value="Immediate Rescue Boat Deployment & Dewatering">Immediate Rescue Boat Deployment &amp; Dewatering</option>
                        <option value="Delay or non-settlement of PF Advance">Delay or non-settlement of PF Advance</option>
                        <option value="Immediate Debris Clearance & Heavy Machinery Access">Immediate Debris Clearance &amp; Heavy Machinery Access</option>
                        <option value="Mobile Health Clinic Deployment">Mobile Health Clinic Deployment</option>
                      </select>
                    </div>

                    {/* RO / SRO / Headquarters / District */}
                    <div className="md:col-span-6">
                      <label className="block font-bold text-gray-800 mb-1">
                        RO/ SRO/ Headquarters <span className="text-red-600">*</span>
                      </label>
                      <select
                        value={selectedHeadquarters}
                        onChange={(e) => setSelectedHeadquarters(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                        required
                      >
                        <option value="Mumbai Suburban Disaster Cell">Mumbai Suburban Disaster Cell</option>
                        <option value="Guntur">Guntur</option>
                        <option value="Pune Central Regional Command">Pune Central Regional Command</option>
                        <option value="Chennai Disaster Hub">Chennai Disaster Hub</option>
                        <option value="NHAI Regional Office - Western Zone">NHAI Regional Office - Western Zone</option>
                        <option value="State Disaster Health Taskforce">State Disaster Health Taskforce</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* ------------------------------------------------------------- */}
                {/* SECTION 3: SUBMIT ACTION BUTTONS */}
                {/* ------------------------------------------------------------- */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    Your grievance will be assigned a unique Central Grievance Docket Number with 30-day statutory SLA tracking.
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveSubView('dashboard');
                        setActiveSidebarItem('dashboard');
                      }}
                      className="px-5 py-2.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded bg-[#002B49] hover:bg-[#00385F] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                    >
                      <span>Submit Grievance</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* ===================================================================== */}
          {/* VIEW 4: GRIEVANCE ACKNOWLEDGMENT / SUMMARY VIEW (Post-Submission View) */}
          {/* ===================================================================== */}
          {activeSubView === 'acknowledgment' && latestSubmittedGrievance && (
            <GrievanceAcknowledgmentView
              grievance={latestSubmittedGrievance}
              citizenName={userProfile.name}
              citizenEmail={userProfile.email}
              citizenMobile={userProfile.mobile}
              onGoHome={() => {
                setActiveSubView('dashboard');
                setActiveSidebarItem('dashboard');
              }}
              onNotify={(msg) => showNotification(msg)}
            />
          )}

          {/* ===================================================================== */}
          {/* VIEW 5: EDIT PROFILE (Image 1 Layout) */}
          {/* ===================================================================== */}
          {activeSubView === 'profile' && (
            <EditProfileView
              initialData={userProfile}
              onBack={() => {
                setActiveSubView('dashboard');
                setActiveSidebarItem('dashboard');
              }}
              onSave={(savedData) => {
                setUserProfile(savedData);
                const newEntry: AuditEntry = {
                  id: Date.now().toString(),
                  loginId: savedData.username,
                  actionDateTime: `${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`,
                  actionName: 'Profile Update',
                  ipAddress: '203.192.225.145',
                };
                setAuditEntries((prev) => [newEntry, ...prev]);
              }}
              onNotify={(msg) => showNotification(msg)}
            />
          )}

          {/* ===================================================================== */}
          {/* VIEW 6: CHANGE PASSWORD (Image 2 Layout) */}
          {/* ===================================================================== */}
          {activeSubView === 'password' && (
            <ChangePasswordView
              onBack={() => {
                setActiveSubView('dashboard');
                setActiveSidebarItem('dashboard');
              }}
              onSuccess={() => {
                const newEntry: AuditEntry = {
                  id: Date.now().toString(),
                  loginId: userProfile.username,
                  actionDateTime: `${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`,
                  actionName: 'Password Change',
                  ipAddress: '203.192.225.145',
                };
                setAuditEntries((prev) => [newEntry, ...prev]);
                setActiveSubView('dashboard');
                setActiveSidebarItem('dashboard');
              }}
              onNotify={(msg) => showNotification(msg)}
            />
          )}

          {/* ===================================================================== */}
          {/* VIEW 7: ACCOUNT ACTIVITY (Image 3 Layout) */}
          {/* ===================================================================== */}
          {activeSubView === 'activity' && (
            <AccountActivityView
              entries={auditEntries}
              onBack={() => {
                setActiveSubView('dashboard');
                setActiveSidebarItem('dashboard');
              }}
            />
          )}

          {/* ===================================================================== */}
          {/* VIEW 8: NODAL PG OFFICERS DIRECTORY (NMC / PWD Table View) */}
          {/* ===================================================================== */}
          {activeSubView === 'directory' && (
            <NodalOfficersDirectory
              initialDepartment={directoryDept}
              onBackToHome={() => {
                setActiveSubView('dashboard');
                setActiveSidebarItem('dashboard');
              }}
              onNotify={(msg) => showNotification(msg)}
            />
          )}

          {/* ===================================================================== */}
          {/* VIEW 9: GRIEVANCE STATUS TIMELINE & AUDIT TRACKER */}
          {/* ===================================================================== */}
          {activeSubView === 'timeline' && (
            <GrievanceStatusTimeline
              grievances={grievances}
              selectedRegNumber={selectedTimelineDocket}
              onBackToHome={() => {
                setActiveSubView('dashboard');
                setActiveSidebarItem('dashboard');
              }}
              onLodgeNew={() => {
                setActiveSubView('terms');
                setActiveSidebarItem('lodge');
              }}
              onNotify={(msg) => showNotification(msg)}
            />
          )}

          {/* ===================================================================== */}
          {/* VIEW 10: NEARBY GRIEVANCES (Nagpur Locality Community Feed) */}
          {/* ===================================================================== */}
          {activeSubView === 'nearby' && (
            <NearbyGrievancesHub
              onBackToHome={() => {
                setActiveSubView('dashboard');
                setActiveSidebarItem('dashboard');
              }}
              onLodgeGrievance={() => {
                setActiveSubView('terms');
                setActiveSidebarItem('lodge');
              }}
              onNotify={(msg) => showNotification(msg)}
            />
          )}

          {/* ===================================================================== */}
          {/* VIEW 11: DISASTER & WEATHER RISK MAP (77 Hotspots & Open-Meteo API) */}
          {/* ===================================================================== */}
          {activeSubView === 'weather-map' && (
            <DisasterWeatherMap
              currentLang={currentLang}
              onBackToHome={() => {
                setActiveSubView('dashboard');
                setActiveSidebarItem('dashboard');
              }}
              onLodgeSOS={() => {
                setActiveSubView('form');
                setActiveSidebarItem('lodge');
                loadSampleDisasterScenario('flood');
              }}
              onNotify={(msg) => showNotification(msg)}
            />
          )}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* 4b. BOTTOM QUICK NAVIGATION BAR (Responsive Bottom Bar / Dock) */}
      {/* ========================================================================= */}
      <div className="w-full bg-[#001D33]/95 backdrop-blur-md border-y border-[#00385F] sticky bottom-0 z-40 shadow-xl py-2 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-1 sm:gap-3 overflow-x-auto text-[11px] font-semibold text-gray-300 scrollbar-none">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => {
                setActiveSubView('dashboard');
                setActiveSidebarItem('dashboard');
              }}
              className={`px-2.5 py-1.5 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                activeSubView === 'dashboard'
                  ? 'bg-amber-400 text-[#002B49] font-bold shadow-xs'
                  : 'hover:bg-white/10 hover:text-white'
              }`}
            >
              <LayoutDashboard size={14} />
              <span className="hidden xs:inline">Dashboard</span>
            </button>

            <button
              onClick={() => {
                setActiveSubView('terms');
                setActiveSidebarItem('lodge');
              }}
              className={`px-2.5 py-1.5 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                activeSubView === 'terms' || activeSubView === 'form' || activeSubView === 'acknowledgment'
                  ? 'bg-amber-400 text-[#002B49] font-bold shadow-xs'
                  : 'hover:bg-white/10 hover:text-white'
              }`}
            >
              <PlusSquare size={14} className="text-amber-400" />
              <span>Lodge Grievance</span>
            </button>

            <button
              onClick={() => {
                setActiveSubView('timeline');
                setActiveSidebarItem('timeline');
              }}
              className={`px-2.5 py-1.5 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                activeSubView === 'timeline'
                  ? 'bg-amber-400 text-[#002B49] font-bold shadow-xs'
                  : 'hover:bg-white/10 hover:text-white'
              }`}
            >
              <Eye size={14} className="text-cyan-300" />
              <span>Status Tracker</span>
            </button>

            <button
              onClick={() => {
                setActiveSubView('nearby');
                setActiveSidebarItem('nearby');
              }}
              className={`px-2.5 py-1.5 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                activeSubView === 'nearby'
                  ? 'bg-amber-400 text-[#002B49] font-bold shadow-xs'
                  : 'hover:bg-white/10 hover:text-white'
              }`}
            >
              <MapPin size={14} className="text-amber-400" />
              <span>Nearby Hub</span>
            </button>

            {/* Weather & Hotspot Map Highlighted Item */}
            <button
              onClick={() => {
                setActiveSubView('weather-map');
                setActiveSidebarItem('weather-map');
                showNotification('Opening Disaster & Weather Risk Map (77 Hotspots).');
              }}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap border ${
                activeSubView === 'weather-map'
                  ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white font-bold border-amber-300 shadow-md ring-2 ring-red-400/40'
                  : 'bg-red-950/40 text-amber-200 border-red-500/40 hover:bg-red-900/60'
              }`}
            >
              <CloudRain size={14} className="text-cyan-300 shrink-0" />
              <span className="font-bold">Weather &amp; Hotspot Map</span>
              <span className="bg-red-600 text-white text-[9px] px-1.5 py-0.2 rounded font-black tracking-wider uppercase animate-pulse">
                77 Sites
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setActiveSubView('directory');
                setActiveSidebarItem('directory');
              }}
              className={`px-2.5 py-1.5 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap hidden md:flex ${
                activeSubView === 'directory'
                  ? 'bg-amber-400 text-[#002B49] font-bold shadow-xs'
                  : 'hover:bg-white/10 hover:text-white'
              }`}
            >
              <Building size={14} className="text-amber-300" />
              <span>Nodal Officers Directory</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. OFFICIAL GRIEVANCE DETAIL MODAL (Docket View & Tracking) */}
      {/* ========================================================================= */}
      {selectedGrievanceDetail && (() => {
        const modalOfficer =
          selectedGrievanceDetail.nodalOfficer ||
          getNodalOfficerForGrievance(
            selectedGrievanceDetail.ministry,
            selectedGrievanceDetail.category,
            selectedGrievanceDetail.location
          );

        return (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-3xl w-full shadow-2xl overflow-hidden border border-gray-200 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="bg-[#002B49] text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={emblemLogo}
                    alt="State Emblem of India"
                    className="h-10 w-auto object-contain"
                  />
                  <div>
                    <h3 className="text-sm font-bold tracking-tight">
                      Official Grievance Docket &amp; Nodal Authority Tracking
                    </h3>
                    <span className="text-[11px] text-amber-300 font-mono">
                      Registration No: {selectedGrievanceDetail.registrationNumber}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedGrievanceDetail(null)}
                  className="text-gray-300 hover:text-white p-1 rounded-full hover:bg-white/10 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-5 text-xs">
                {/* Grievance Core Meta */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div>
                    <span className="text-[10px] text-gray-500 font-bold block uppercase">Received Date</span>
                    <span className="font-semibold text-gray-800">{selectedGrievanceDetail.receivedDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-bold block uppercase">Current Status</span>
                    <span className="font-bold text-blue-700">{selectedGrievanceDetail.status}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-bold block uppercase">Priority Level</span>
                    <span className="font-bold text-red-600">{selectedGrievanceDetail.priority || 'Normal'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-bold block uppercase">Assigned Ministry</span>
                    <span className="font-semibold text-gray-800 truncate block">
                      {selectedGrievanceDetail.ministry || 'NDMA'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-bold block uppercase">Category</span>
                    <span className="font-semibold text-gray-800 truncate block">
                      {selectedGrievanceDetail.category || 'Disaster Relief'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-bold block uppercase">Jurisdiction</span>
                    <span className="font-semibold text-gray-800 truncate block">
                      {selectedGrievanceDetail.location || 'Central Desk'}
                    </span>
                  </div>
                </div>

                {/* Grievance Description */}
                <div>
                  <span className="text-xs font-bold text-gray-800 block mb-1">
                    Full Grievance Description (Remarks):
                  </span>
                  <div className="p-3 bg-white border border-gray-200 rounded-lg text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {selectedGrievanceDetail.grievanceDescription}
                  </div>
                </div>

                {/* Attached Evidence */}
                {selectedGrievanceDetail.issueImage && (
                  <div>
                    <span className="text-xs font-bold text-gray-800 block mb-1">
                      Reported Site Photo (Before Repair):
                    </span>
                    <div className="p-2.5 bg-slate-50 border border-slate-300 rounded-lg space-y-2">
                      <div className="relative rounded-md overflow-hidden border border-slate-300 max-h-44 flex items-center justify-center bg-black/90">
                        <img
                          src={selectedGrievanceDetail.issueImage}
                          alt="Reported Issue Site Photo"
                          referrerPolicy="no-referrer"
                          className="w-full h-44 object-cover"
                        />
                        <div className="absolute bottom-1.5 left-2 bg-black/75 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded font-mono">
                          📍 {selectedGrievanceDetail.location} • Submitted: {selectedGrievanceDetail.receivedDate}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedGrievanceDetail.attachmentName && (
                  <div>
                    <span className="text-xs font-bold text-gray-800 block mb-1">
                      Attached Evidence / Document:
                    </span>
                    <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileCheck size={16} className="text-blue-700" />
                        <span className="font-semibold text-blue-900">{selectedGrievanceDetail.attachmentName}</span>
                        <span className="text-gray-500 text-[10px]">({selectedGrievanceDetail.attachmentSize})</span>
                      </div>
                      <button
                        onClick={() => showNotification(`Downloading attachment: ${selectedGrievanceDetail.attachmentName}`)}
                        className="text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Download size={13} />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Assigned Nodal Authority Details Box */}
                <div className="border border-emerald-300 rounded-lg overflow-hidden bg-gradient-to-b from-emerald-50/50 via-white to-white">
                  <div className="bg-emerald-800 text-white px-3.5 py-2 flex items-center justify-between font-bold text-xs">
                    <div className="flex items-center gap-2">
                      <Shield size={14} className="text-amber-300" />
                      <span>Assigned Nodal Grievance Redressal Authority</span>
                    </div>
                    <span className="text-[10px] bg-emerald-700 px-2 py-0.5 rounded font-normal text-emerald-100">
                      Direct Officer in Charge
                    </span>
                  </div>

                  <div className="p-3.5 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-gray-200 pb-2">
                      <div>
                        <span className="font-bold text-gray-900 text-xs sm:text-sm">{modalOfficer.name}</span>
                        <span className="text-gray-600 block text-[11px] font-medium">{modalOfficer.designation}</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded self-start sm:self-auto font-bold">
                        CPGRAMS ASSIGNED
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
                      <div>
                        <span className="font-bold text-gray-500 block">Department / Wing</span>
                        <span className="font-medium text-gray-800">{modalOfficer.department}</span>
                        {modalOfficer.subDivision && (
                          <span className="text-gray-500 block text-[10px]">{modalOfficer.subDivision}</span>
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-gray-500 block">Official Helpline Phone</span>
                        <a
                          href={`tel:${modalOfficer.contactNumber.split('/')[0].trim()}`}
                          className="font-mono font-bold text-blue-700 hover:underline block"
                        >
                          {modalOfficer.contactNumber}
                        </a>
                      </div>
                      {modalOfficer.email && (
                        <div>
                          <span className="font-bold text-gray-500 block">Official Government Email</span>
                          <a
                            href={`mailto:${modalOfficer.email}`}
                            className="font-medium text-blue-700 hover:underline block"
                          >
                            {modalOfficer.email}
                          </a>
                        </div>
                      )}
                      <div>
                        <span className="font-bold text-gray-500 block">Office Physical Address</span>
                        <span className="text-gray-800 block">{modalOfficer.officeAddress}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Timeline */}
                <div className="border-t border-gray-200 pt-3">
                  <span className="text-xs font-bold text-gray-800 block mb-2">Redressal Action History:</span>
                  <div className="space-y-2 text-[11px]">
                    <div className="flex items-center gap-2 text-emerald-700 font-medium">
                      <CheckCircle2 size={14} />
                      <span>Docket Generated &amp; Acknowledged on {selectedGrievanceDetail.receivedDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-700 font-medium">
                      <Clock size={14} />
                      <span>Transferred to Nodal Grievance Officer ({modalOfficer.name})</span>
                    </div>
                    {(selectedGrievanceDetail.status === 'Resolved' || selectedGrievanceDetail.status === 'Closed') ? (
                      <div className="flex items-center gap-2 text-emerald-700 font-bold">
                        <CheckCircle2 size={14} />
                        <span>Work Completed &amp; Official Resolution Proof Uploaded</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-500">
                        <div className="w-3.5 h-3.5 rounded-full border border-gray-400"></div>
                        <span>Field Action Report / Relief Verification in Progress (30-Day SLA)</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* If Resolved: Official Resolution Proof Banner */}
                {(selectedGrievanceDetail.status === 'Resolved' || selectedGrievanceDetail.status === 'Closed') && (
                  <div className="border-t border-gray-200 pt-3">
                    <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                          <ShieldCheck size={18} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-emerald-950">
                            Official Resolution Proof &amp; Inspection Photo Available
                          </div>
                          <div className="text-[11px] text-emerald-800">
                            Verified by {modalOfficer.name} on {selectedGrievanceDetail.resolutionProof?.resolvedDate || 'Aug 16, 2026'}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedProofGrievance(selectedGrievanceDetail);
                        }}
                        className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-xs transition-all cursor-pointer shrink-0"
                      >
                        <Eye size={14} />
                        <span>View Gov Proof 👁️</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 p-3 border-t border-gray-200 flex items-center justify-between">
                <button
                  onClick={() => {
                    window.print();
                    showNotification('Printing official docket acknowledgment receipt...');
                  }}
                  className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Printer size={14} />
                  <span>Print Receipt</span>
                </button>

                <button
                  onClick={() => setSelectedGrievanceDetail(null)}
                  className="bg-[#002B49] text-white px-4 py-1.5 rounded text-xs font-bold hover:bg-[#00385F] cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* 5b. SEND URGENT REMINDER / ESCALATION CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {reminderModalGrievance && (() => {
        const officer =
          reminderModalGrievance.nodalOfficer ||
          getNodalOfficerForGrievance(
            reminderModalGrievance.ministry,
            reminderModalGrievance.category,
            reminderModalGrievance.location
          );
        const officerName = officer.name || 'Shri Rajesh Sharma';
        const officerDesignation = officer.designation || 'Executive Engineer (Civil / Drainage)';
        const officerDept = officer.department || reminderModalGrievance.ministry || 'NMC Dharampeth Zone';
        const nextReminderNumber = (reminderModalGrievance.reminderCount || 0) + 1;

        return (
          <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden border border-amber-300 animate-in zoom-in-95 duration-200 my-auto text-xs">
              {/* Modal Header */}
              <div className="bg-linear-to-r from-[#002B49] via-[#00385F] to-[#002B49] text-white p-4 sm:p-5 flex items-center justify-between border-b-2 border-amber-400">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                    <Bell size={20} className="text-amber-300" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold tracking-wide flex items-center gap-2">
                      <span>Send Urgent Reminder</span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-amber-500 text-[#002B49] rounded-full font-black">
                        Escalation #{nextReminderNumber}
                      </span>
                    </h3>
                    <p className="text-[11px] text-gray-300 font-mono mt-0.5">
                      Docket Ref: <span className="text-amber-300 font-bold">{reminderModalGrievance.registrationNumber}</span>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!isSendingReminder) {
                      setReminderModalGrievance(null);
                      setReminderCustomNote('');
                    }
                  }}
                  className="text-gray-300 hover:text-white p-1 rounded-md hover:bg-white/10 cursor-pointer transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto bg-[#F8FAFC]">
                {/* Confirmation Prompt Header */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3">
                  <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-900 leading-relaxed">
                    <p className="font-bold text-sm text-amber-950 mb-1">
                      Confirm Dispatch of Urgent Grievance Reminder
                    </p>
                    <p>
                      Are you sure you want to send an urgent reminder to <strong className="font-bold">{officerName}</strong> ({officerDept}) regarding docket <span className="font-mono font-bold bg-amber-100 px-1 py-0.5 rounded">{reminderModalGrievance.registrationNumber}</span>?
                    </p>
                  </div>
                </div>

                {/* Assigned Nodal Officer Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-2xs space-y-2.5">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                      Designated Authority
                    </span>
                    <span className="text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded">
                      Nagpur Division Nodal Desk
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <span className="text-[10px] text-gray-400 block font-medium">Nodal Officer</span>
                      <span className="font-bold text-gray-900 text-xs sm:text-sm">{officerName}</span>
                      <span className="text-gray-600 block text-[11px]">{officerDesignation}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 block font-medium">Department / Zone</span>
                      <span className="font-bold text-gray-800 text-xs">{officerDept}</span>
                      <span className="text-gray-500 text-[11px] block">{reminderModalGrievance.location || 'Nagpur'}</span>
                    </div>
                  </div>

                  {officer.contactNumber && (
                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-600">
                      <span>Direct Contact: <strong className="font-mono text-gray-900">{officer.contactNumber}</strong></span>
                      {officer.email && <span className="text-blue-700 font-medium truncate max-w-[200px]">{officer.email}</span>}
                    </div>
                  )}
                </div>

                {/* Grievance Summary Snippet */}
                <div className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-2xs space-y-1.5">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                    Grievance Subject &amp; Status
                  </span>
                  <p className="text-gray-800 font-medium line-clamp-2 italic bg-gray-50 p-2 rounded border border-gray-200/60">
                    &ldquo;{reminderModalGrievance.grievanceDescription}&rdquo;
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                    <span>Received: <strong>{reminderModalGrievance.receivedDate}</strong></span>
                    <span className="text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded">
                      Current Status: {reminderModalGrievance.status}
                    </span>
                  </div>
                </div>

                {/* Optional Citizen Follow-up Note */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-800 flex items-center justify-between">
                    <span>Urgent Remarks / Escalation Reason (Optional)</span>
                    <span className="text-[10px] text-gray-400 font-normal">Max 250 characters</span>
                  </label>
                  <textarea
                    rows={2}
                    value={reminderCustomNote}
                    onChange={(e) => setReminderCustomNote(e.target.value)}
                    placeholder="e.g., Heavy water accumulation continuing at site. Requesting immediate field team visit."
                    className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-hidden text-gray-800"
                    maxLength={250}
                  />

                  {/* Preset Note Quick-Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[
                      'Urgent follow-up: situation worsening',
                      'Citizen safety hazard at site',
                      'Please expedite on-ground inspection',
                    ].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setReminderCustomNote(preset)}
                        className="text-[10px] bg-gray-100 hover:bg-amber-100 text-gray-700 hover:text-amber-900 border border-gray-300 hover:border-amber-300 px-2 py-1 rounded-md transition-colors cursor-pointer"
                      >
                        + {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Statutory Audit Notice */}
                <div className="text-[10px] text-gray-500 bg-gray-100 p-2.5 rounded-lg border border-gray-200 flex items-center gap-2">
                  <Clock size={14} className="text-gray-400 shrink-0" />
                  <span>
                    This reminder will be timestamped and dispatched directly to the Nodal Officer's priority queue and registered mobile SMS alert.
                  </span>
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="bg-gray-50 px-4 sm:px-6 py-3.5 border-t border-gray-200 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  disabled={isSendingReminder}
                  onClick={() => {
                    setReminderModalGrievance(null);
                    setReminderCustomNote('');
                  }}
                  className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg font-bold text-gray-700 bg-white hover:bg-gray-100 transition-colors cursor-pointer text-xs"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={isSendingReminder}
                  onClick={handleConfirmSendReminder}
                  className="w-full sm:w-auto px-5 py-2 rounded-lg font-bold text-white bg-linear-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-xs cursor-pointer active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isSendingReminder ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Dispatching Urgent Escalation...</span>
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      <span>Confirm &amp; Send Urgent Reminder</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* 6. SIDEBAR ACTION MODALS (Profile, Password, Activity, Voice) */}
      {/* ========================================================================= */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl overflow-hidden border border-gray-200 p-6 space-y-4 animate-in zoom-in-95 duration-200 text-xs">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="text-sm font-bold text-gray-900 capitalize">
                {activeModal === 'activity' && 'Account Activity Log'}
                {activeModal === 'profile' && 'Citizen Profile Details'}
                {activeModal === 'password' && 'Change Account Password'}
                {activeModal === 'delete' && 'Delete Citizen Account'}
                {activeModal === 'voice' && 'DRISHTI AI Voice Assistant'}
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>

            {activeModal === 'profile' && (
              <div className="space-y-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    defaultValue={userName}
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50"
                    readOnly
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Registered Mobile Number</label>
                  <input
                    type="text"
                    defaultValue={userMobile}
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50"
                    readOnly
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Email ID</label>
                  <input
                    type="text"
                    defaultValue={userEmail}
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50"
                    readOnly
                  />
                </div>
              </div>
            )}

            {activeModal === 'activity' && (
              <div className="space-y-2">
                <div className="p-2.5 bg-gray-50 rounded border border-gray-200">
                  <span className="font-bold text-gray-800 block">User Authenticated via OTP</span>
                  <span className="text-[10px] text-gray-500">Today at 04:14 AM • IP: 103.21.244.18 (India)</span>
                </div>
                <div className="p-2.5 bg-gray-50 rounded border border-gray-200">
                  <span className="font-bold text-gray-800 block">Session Initiated</span>
                  <span className="text-[10px] text-gray-500">SSL SHA-256 Protected Session</span>
                </div>
              </div>
            )}

            {activeModal === 'password' && (
              <div className="space-y-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Current Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              </div>
            )}

            {activeModal === 'delete' && (
              <div className="space-y-3 text-red-700">
                <AlertTriangle size={32} className="text-red-600 mx-auto" />
                <p className="text-center font-bold">
                  Are you sure you want to deactivate your Citizen Profile?
                </p>
                <p className="text-center text-[11px] text-gray-600">
                  All active grievance tracking histories will be archived as per National Public Records Act guidelines.
                </p>
              </div>
            )}

            {activeModal === 'voice' && (
              <div className="text-center space-y-4 py-2">
                <div className="w-20 h-20 rounded-full bg-red-100 border-2 border-red-500 flex items-center justify-center mx-auto shadow-md">
                  <Mic size={32} className="text-red-600 animate-pulse" />
                </div>
                <h4 className="font-bold text-sm text-gray-800">
                  बोल कर शिकायत दर्ज करें / Speak Your Grievance
                </h4>
                <p className="text-[11px] text-gray-600">
                  Drishti AI supports all 22 Indian regional languages. Speak naturally to auto-triage your grievance.
                </p>
                <button
                  onClick={() => {
                    setActiveModal(null);
                    setActiveSubView('form');
                    setActiveSidebarItem('lodge');
                    loadSampleDisasterScenario('flood');
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-full text-xs transition-colors cursor-pointer"
                >
                  Start Speaking Now
                </button>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 border-t border-gray-200 pt-3">
              <button
                onClick={() => setActiveModal(null)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded font-bold cursor-pointer"
              >
                Close
              </button>
              {activeModal === 'password' && (
                <button
                  onClick={() => {
                    showNotification('Password updated successfully.');
                    setActiveModal(null);
                  }}
                  className="bg-[#002B49] text-white px-3 py-1.5 rounded font-bold cursor-pointer"
                >
                  Update Password
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. OFFICIAL GOVERNMENT RESOLUTION PROOF MODAL (HIGH-RES PHOTO & REMARKS) */}
      {/* ========================================================================= */}
      {selectedProofGrievance && (
        <ResolutionProofModal
          isOpen={!!selectedProofGrievance}
          onClose={() => setSelectedProofGrievance(null)}
          docketNumber={selectedProofGrievance.registrationNumber}
          issueTitle={selectedProofGrievance.grievanceDescription}
          category={selectedProofGrievance.category}
          location={selectedProofGrievance.location}
          proofData={selectedProofGrievance.resolutionProof}
          onNotify={showNotification}
        />
      )}

      {/* ========================================================================= */}
      {/* 7. OFFICIAL GOVERNMENT OF INDIA FOOTER WITH DIRECTORY BADGES */}
      {/* ========================================================================= */}
      <footer className="w-full bg-[#001D33] text-gray-300 text-xs py-6 px-4 sm:px-8 border-t border-[#002B49] mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-4 text-center">
          <div className="text-[11px] text-gray-400 leading-relaxed">
            This site is designed, developed &amp; hosted by{' '}
            <strong className="text-white font-semibold">National Informatics Centre (NIC)</strong>, Ministry of
            Electronics &amp; IT (MeitY), Government of India and Content owned by{' '}
            <strong className="text-white font-semibold">
              Department of Administrative Reforms &amp; Public Grievances (DARPG)
            </strong>.
          </div>

          <div className="text-[10px] text-gray-400">
            Portal is Compatible with all major Browsers like Google Chrome, Mozilla Firefox, Microsoft Edge, Safari etc.
            • Best Viewed in 1440 x 900 resolution
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-gray-400 border-t border-white/10 pt-3 w-full">
            <span className="hover:text-amber-300 cursor-pointer">Disclaimer</span>
            <span>•</span>
            <span className="hover:text-amber-300 cursor-pointer">Website Policies</span>
            <span>•</span>
            <span className="hover:text-amber-300 cursor-pointer">Web Information Manager</span>
            <span>•</span>
            <span className="text-amber-400 font-mono">Version 7.0.01092019.0.0, Copyright © 2026</span>
            <span>•</span>
            <span>Last Updated On: 16-08-2026</span>
            <span>•</span>
            <span>Total Visitors : 7838427</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
