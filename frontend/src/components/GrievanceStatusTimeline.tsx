import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  UserCheck,
  Building,
  MapPin,
  Calendar,
  Printer,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Download,
  Share2,
  RefreshCw,
  Eye,
  Sparkles,
} from 'lucide-react';
import { GrievanceRecord } from '../types';
import { getNodalOfficerForGrievance } from '../utils/nodalOfficerData';

interface TimelineStep {
  title: string;
  subtitle: string;
  timestamp: string;
  status: 'completed' | 'in_progress' | 'pending';
  officerName?: string;
  officerDesignation?: string;
  note?: string;
}

interface GrievanceHistoryLog {
  date: string;
  time: string;
  action: string;
  actionBy: string;
  designation: string;
  remarks: string;
  statusBadge: string;
}

interface GrievanceStatusTimelineProps {
  grievances: GrievanceRecord[];
  selectedRegNumber?: string;
  onBackToHome: () => void;
  onLodgeNew: () => void;
  onNotify: (msg: string) => void;
}

// Sample enriched data for timeline demonstration
const SAMPLE_TIMELINE_RECORDS: Record<
  string,
  {
    steps: TimelineStep[];
    logs: GrievanceHistoryLog[];
  }
> = {
  'DRISHTI/2026/00142': {
    steps: [
      {
        title: 'Grievance Submitted',
        subtitle: 'Registered via Drishti AI Portal',
        timestamp: '14 Aug 2026, 10:30 AM',
        status: 'completed',
        note: 'AI auto-triaged and assigned Priority: High (Urban Flooding & Blocked Drainage).',
      },
      {
        title: 'Under Review & Acknowledged',
        subtitle: 'Read by Nodal Authority',
        timestamp: '14 Aug 2026, 02:15 PM',
        status: 'completed',
        officerName: 'Shri Milind Meshram',
        officerDesignation: 'Executive Engineer, Dharampeth Zone No. 8 (NMC)',
        note: 'Docket accepted and forwarded to Field Inspection Wing (Ward 14 Dewatering Squad).',
      },
      {
        title: 'Action Initiated & Field Inspection',
        subtitle: 'Site visit & pumps deployed',
        timestamp: '15 Aug 2026, 09:45 AM',
        status: 'in_progress',
        officerName: 'Er. Sandeep Bhalerao',
        officerDesignation: 'Junior Engineer & Field Officer (NMC)',
        note: 'Heavy dewatering suction pumps dispatched to Dharampeth market square. Drain desilting underway.',
      },
      {
        title: 'Resolution & Closure',
        subtitle: 'Citizen verification pending',
        timestamp: 'Est. 16 Aug 2026',
        status: 'pending',
        note: 'Resolution sign-off and photo proof verification will be sent to citizen mobile.',
      },
    ],
    logs: [
      {
        date: '15-08-2026',
        time: '09:45 AM',
        action: 'Field Dewatering Squad Deployed',
        actionBy: 'Er. Sandeep Bhalerao',
        designation: 'Junior Engineer (NMC Dharampeth)',
        remarks: '2 High-capacity 15HP submersible dewatering pumps placed near Metro pillar #42. Water level receded by 8 inches.',
        statusBadge: 'In Progress',
      },
      {
        date: '14-08-2026',
        time: '02:15 PM',
        action: 'Docket Accepted & Assigned to Zone',
        actionBy: 'Shri Milind Meshram',
        designation: 'Executive Engineer & Nodal Officer (Zone 8)',
        remarks: 'Direct emergency notice issued to emergency sanitation contractors for immediate culvert cleaning.',
        statusBadge: 'Under Process',
      },
      {
        date: '14-08-2026',
        time: '10:30 AM',
        action: 'Citizen Registration & AI Triage',
        actionBy: 'Drishti AI Automated Dispatch',
        designation: 'Central Dispatch Engine (CPGRAMS-NDMA)',
        remarks: 'Geotagged complaint matched to Nagpur Municipal Corporation Dharampeth Zone. SMS acknowledgment sent.',
        statusBadge: 'Registered',
      },
    ],
  },
  'DRISHTI/2026/00098': {
    steps: [
      {
        title: 'Grievance Submitted',
        subtitle: 'Registered via Voice Assistant',
        timestamp: '02 Aug 2026, 11:20 AM',
        status: 'completed',
        note: 'Issue: Damaged storm culvert wall during flash monsoon rain.',
      },
      {
        title: 'Under Review & Acknowledged',
        subtitle: 'Assigned to PWD Division',
        timestamp: '02 Aug 2026, 03:40 PM',
        status: 'completed',
        officerName: 'Shri Dhananjay R. Patil, EE',
        officerDesignation: 'Executive Engineer (North Division, PWD Nagpur)',
        note: 'Site inspection requisition filed under Emergency Infrastructure Fund.',
      },
      {
        title: 'Action Initiated & Field Inspection',
        subtitle: 'Culvert masonry rebuilt',
        timestamp: '05 Aug 2026, 04:00 PM',
        status: 'completed',
        officerName: 'Shri Janardan B. Bagde, SE',
        officerDesignation: 'Superintending Engineer (PWD Circle Nagpur)',
        note: 'Reinforced concrete culvert headwall reconstruction completed. Silt cleared.',
      },
      {
        title: 'Resolved & Closed',
        subtitle: 'Satisfactory Redressal Confirmed',
        timestamp: '08 Aug 2026, 05:30 PM',
        status: 'completed',
        officerName: 'Nodal Redressal Cell',
        officerDesignation: 'PWD Nagpur Divisional HQ',
        note: 'Closure certificate issued. Citizen feedback recorded as: 5-Star (Satisfied).',
      },
    ],
    logs: [
      {
        date: '08-08-2026',
        time: '05:30 PM',
        action: 'Case Closed with Redressal Certificate',
        actionBy: 'Nodal Redressal Cell',
        designation: 'PWD Nagpur Divisional HQ',
        remarks: 'Final inspection completed. Culvert retaining wall restored to full structural strength. Closed.',
        statusBadge: 'Resolved',
      },
      {
        date: '05-08-2026',
        time: '04:00 PM',
        action: 'Structural Repair Completed',
        actionBy: 'Shri Dhananjay R. Patil, EE',
        designation: 'Executive Engineer (PWD North Division)',
        remarks: '12m culvert headwall re-plastered and concrete curing test cleared.',
        statusBadge: 'Work Done',
      },
      {
        date: '02-08-2026',
        time: '03:40 PM',
        action: 'Field Inspection Assigned',
        actionBy: 'Shri Janardan B. Bagde, SE',
        designation: 'Superintending Engineer (PWD Circle)',
        remarks: 'Site visited by Assistant Engineer. Work order sanctioned under Monsoon Contingency.',
        statusBadge: 'Inspected',
      },
      {
        date: '02-08-2026',
        time: '11:20 AM',
        action: 'Complaint Docket Generated',
        actionBy: 'Drishti AI Automated Dispatch',
        designation: 'Nagpur Region Desk',
        remarks: 'Voice recording transcribed in Marathi & translated to English for PWD nodal queue.',
        statusBadge: 'Registered',
      },
    ],
  },
};

export const GrievanceStatusTimeline: React.FC<GrievanceStatusTimelineProps> = ({
  grievances,
  selectedRegNumber,
  onBackToHome,
  onLodgeNew,
  onNotify,
}) => {
  // Available list combining passed grievances
  const allGrievances = grievances.length > 0 ? grievances : [];

  // Currently tracked grievance registration number
  const [activeRegNo, setActiveRegNo] = useState<string>(
    selectedRegNumber || (allGrievances[0]?.registrationNumber ?? 'DRISHTI/2026/00142')
  );

  const [searchQuery, setSearchQuery] = useState('');

  // Find the selected grievance record
  const currentGrievance = allGrievances.find((g) => g.registrationNumber === activeRegNo) || {
    sn: 1,
    registrationNumber: activeRegNo,
    receivedDate: '14-08-2026',
    grievanceDescription: 'Heavy rainwater overflow near Dharampeth metro station blocking pedestrian walkway.',
    status: 'Pending',
    ministry: 'Nagpur Municipal Corporation (NMC)',
    category: 'Urban Flooding & Blocked Drainage',
    location: 'Dharampeth Zone No. 8, Nagpur',
    priority: 'High',
    nodalOfficer: getNodalOfficerForGrievance(
      'Nagpur Municipal Corporation (NMC)',
      'Drainage & Civic Sanitation',
      'Dharampeth Zone'
    ),
  };

  // Get or dynamically build timeline steps & logs
  const timelineData = SAMPLE_TIMELINE_RECORDS[activeRegNo] || {
    steps: [
      {
        title: 'Grievance Submitted',
        subtitle: 'Registered on Drishti Portal',
        timestamp: `${currentGrievance.receivedDate}, 10:00 AM`,
        status: 'completed',
        note: 'AI auto-triaged and assigned Priority: ' + (currentGrievance.priority || 'High'),
      },
      {
        title: 'Under Review & Acknowledged',
        subtitle: 'Assigned to Nodal Authority',
        timestamp: `${currentGrievance.receivedDate}, 02:30 PM`,
        status: 'completed',
        officerName: currentGrievance.nodalOfficer?.name || 'Nodal Grievance Officer',
        officerDesignation: currentGrievance.nodalOfficer?.designation || 'Zonal Authority',
        note: `Docket routed to ${currentGrievance.ministry || 'NMC Nagpur'} for prompt field inspection.`,
      },
      {
        title: 'Action Initiated / Field Inspection',
        subtitle: currentGrievance.status === 'Closed' ? 'Field action finished' : 'Action under execution',
        timestamp: '15 Aug 2026, 11:15 AM',
        status: currentGrievance.status === 'Closed' ? 'completed' : 'in_progress',
        officerName: currentGrievance.nodalOfficer?.name || 'Field Redressal Team',
        officerDesignation: 'Executive Redressal Cell',
        note: currentGrievance.status === 'Closed'
          ? 'Inspection verified and works executed successfully.'
          : 'Inspection team dispatched to site. Redressal underway.',
      },
      {
        title: currentGrievance.status === 'Closed' ? 'Resolved & Closed' : 'Resolution Pending',
        subtitle: currentGrievance.status === 'Closed' ? '30-Day SLA Redressed' : 'SLA Target: Within 30 Days',
        timestamp: currentGrievance.status === 'Closed' ? '15 Aug 2026, 04:00 PM' : 'Estimated: 5 Days Remaining',
        status: currentGrievance.status === 'Closed' ? 'completed' : 'pending',
        note: currentGrievance.status === 'Closed'
          ? 'Resolution certificate issued. Case completed.'
          : 'Citizen verification & photo evidence pending.',
      },
    ],
    logs: [
      {
        date: '15-08-2026',
        time: '11:15 AM',
        action: 'Field Inspection Requisition',
        actionBy: currentGrievance.nodalOfficer?.name || 'Nodal Officer',
        designation: currentGrievance.nodalOfficer?.designation || 'Zonal Engineer',
        remarks: 'Redressal team dispatched to address reported complaint at ' + (currentGrievance.location || 'Nagpur'),
        statusBadge: currentGrievance.status === 'Closed' ? 'Resolved' : 'In Progress',
      },
      {
        date: currentGrievance.receivedDate,
        time: '10:00 AM',
        action: 'Grievance Docket Created',
        actionBy: 'Drishti AI Dispatcher',
        designation: 'Central Redressal Engine',
        remarks: 'Grievance registered with Registration ID ' + currentGrievance.registrationNumber,
        statusBadge: 'Registered',
      },
    ],
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const found = allGrievances.find(
      (g) => g.registrationNumber.toLowerCase() === searchQuery.trim().toLowerCase()
    );
    if (found) {
      setActiveRegNo(found.registrationNumber);
      onNotify(`Tracking docket: ${found.registrationNumber}`);
    } else {
      setActiveRegNo(searchQuery.trim().toUpperCase());
      onNotify(`Tracking docket: ${searchQuery.trim().toUpperCase()}`);
    }
  };

  const nodalOfficer =
    currentGrievance.nodalOfficer ||
    getNodalOfficerForGrievance(
      currentGrievance.ministry,
      currentGrievance.category,
      currentGrievance.location
    );

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* ------------------------------------------------------------- */}
      {/* TOP HEADER / ACTION BAR */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl shadow-xs border border-gray-200 print:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToHome}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-bold transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Back to Dashboard</span>
          </button>
          <div className="h-5 w-px bg-gray-300 hidden sm:block"></div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
              <span>Real-Time Grievance Status Timeline</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200">
                {activeRegNo}
              </span>
            </h1>
            <p className="text-[11px] text-gray-500">
              Interactive 4-stage tracking timeline &amp; audit history for your registered grievances.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => onNotify(`Refreshed status for ${activeRegNo}`)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold cursor-pointer shadow-2xs"
            title="Refresh Status"
          >
            <RefreshCw size={13} />
            <span>Refresh</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#002B49] hover:bg-[#00385F] text-white text-xs font-semibold cursor-pointer shadow-2xs"
            title="Print Status Report"
          >
            <Printer size={13} />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* GRIEVANCE SELECTOR / QUICK DOCKET PICKER */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Quick Select Buttons from user's grievances */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="font-bold text-gray-700 shrink-0 flex items-center gap-1">
              <FileText size={14} className="text-[#002B49]" />
              <span>Select Docket:</span>
            </span>

            <button
              type="button"
              onClick={() => setActiveRegNo('DRISHTI/2026/00142')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer border ${
                activeRegNo === 'DRISHTI/2026/00142'
                  ? 'bg-amber-100 text-amber-900 border-amber-400 shadow-2xs'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
            >
              DRISHTI/2026/00142 (Pending • NMC Zone 8)
            </button>

            <button
              type="button"
              onClick={() => setActiveRegNo('DRISHTI/2026/00098')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer border ${
                activeRegNo === 'DRISHTI/2026/00098'
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-400 shadow-2xs'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
            >
              DRISHTI/2026/00098 (Resolved • PWD North)
            </button>

            {allGrievances
              .filter(
                (g) =>
                  g.registrationNumber !== 'DRISHTI/2026/00142' &&
                  g.registrationNumber !== 'DRISHTI/2026/00098'
              )
              .map((g) => (
                <button
                  key={g.registrationNumber}
                  type="button"
                  onClick={() => setActiveRegNo(g.registrationNumber)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer border ${
                    activeRegNo === g.registrationNumber
                      ? 'bg-blue-100 text-blue-900 border-blue-400 shadow-2xs'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {g.registrationNumber} ({g.status})
                </button>
              ))}
          </div>

          {/* Search by custom registration number */}
          <form onSubmit={handleSearch} className="flex items-center gap-1.5">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Registration No..."
                className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-1.5 text-xs text-gray-900 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-52 shadow-2xs"
              />
            </div>
            <button
              type="submit"
              className="bg-gray-800 hover:bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-2xs"
            >
              Track
            </button>
          </form>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* GRIEVANCE SNAPSHOT CARD */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-200 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Docket Overview
              </span>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  currentGrievance.status === 'Closed' || currentGrievance.status === 'Resolved'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                }`}
              >
                {currentGrievance.status === 'Closed' || currentGrievance.status === 'Resolved'
                  ? 'Resolved & Closed'
                  : 'Under Active Redressal'}
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-200">
                Priority: {currentGrievance.priority || 'High'}
              </span>
            </div>
            <h2 className="text-base font-bold text-gray-900">
              {currentGrievance.category || 'Urban Flooding & Civic Sanitation'}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
              <span className="flex items-center gap-1">
                <Building size={13} className="text-[#002B49]" />
                <span className="font-semibold">{currentGrievance.ministry || 'NMC Nagpur'}</span>
              </span>
              <span className="flex items-center gap-1">
                <MapPin size={13} className="text-red-600" />
                <span>{currentGrievance.location || 'Dharampeth Zone, Nagpur'}</span>
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={13} className="text-gray-500" />
                <span>Lodged Date: {currentGrievance.receivedDate}</span>
              </span>
            </div>
          </div>

          {/* Assigned Authority Mini Card */}
          <div className="bg-blue-50/70 border border-blue-200/80 rounded-lg p-3 text-xs max-w-sm shrink-0">
            <div className="flex items-center gap-1.5 text-blue-950 font-bold mb-1">
              <ShieldCheck size={14} className="text-blue-700" />
              <span>Assigned Nodal Authority</span>
            </div>
            <div className="font-bold text-gray-900">{nodalOfficer.name}</div>
            <div className="text-[11px] text-gray-600">{nodalOfficer.designation}</div>
            <div className="text-[11px] text-blue-800 font-mono mt-0.5">
              Helpline: {nodalOfficer.contactNumber}
            </div>
          </div>
        </div>

        {/* Remarks preview */}
        <div className="mt-3 text-xs text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200">
          <span className="font-bold text-gray-900 block mb-0.5">Citizen Remarks:</span>
          <span>&ldquo;{currentGrievance.grievanceDescription}&rdquo;</span>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* HORIZONTAL INTERACTIVE PROGRESS TIMELINE / STEPPER BAR */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6 overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Clock size={16} className="text-[#002B49]" />
            <span>Progress Stepper Tracker</span>
          </h3>
          <span className="text-xs text-gray-500 font-medium">
            Standard Redressal SLA: <strong className="text-emerald-700">30 Calendar Days</strong>
          </span>
        </div>

        {/* Stepper Container */}
        <div className="relative">
          {/* Desktop/Tablet Horizontal Stepper */}
          <div className="hidden md:grid md:grid-cols-4 gap-4 relative">
            {/* Connecting Track Line */}
            <div className="absolute top-5 left-12 right-12 h-1 bg-gray-200 -z-0">
              <div
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{
                  width:
                    timelineData.steps.filter((s) => s.status === 'completed').length === 4
                      ? '100%'
                      : timelineData.steps.filter((s) => s.status === 'completed').length === 3
                      ? '75%'
                      : timelineData.steps.filter((s) => s.status === 'completed').length === 2
                      ? '40%'
                      : '15%',
                }}
              />
            </div>

            {timelineData.steps.map((step, idx) => {
              const isCompleted = step.status === 'completed';
              const isInProgress = step.status === 'in_progress';
              const isPending = step.status === 'pending';

              return (
                <div key={idx} className="flex flex-col items-center text-center relative z-10">
                  {/* Step Bubble Icon */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-md ${
                      isCompleted
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                        : isInProgress
                        ? 'bg-amber-500 text-white ring-4 ring-amber-100 animate-bounce'
                        : 'bg-white text-gray-400 border-2 border-gray-300 ring-2 ring-gray-100'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={20} />
                    ) : isInProgress ? (
                      <Clock size={20} />
                    ) : (
                      <span>{idx + 1}</span>
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="mt-3 space-y-1 max-w-[200px]">
                    <div
                      className={`text-xs font-bold ${
                        isCompleted
                          ? 'text-emerald-800'
                          : isInProgress
                          ? 'text-amber-800'
                          : 'text-gray-500'
                      }`}
                    >
                      {step.title}
                    </div>

                    <div className="text-[11px] font-mono text-gray-500">
                      {step.timestamp}
                    </div>

                    <div className="text-[11px] text-gray-600 leading-snug">
                      {step.subtitle}
                    </div>

                    {step.officerName && (
                      <div className="text-[10px] font-bold text-blue-900 bg-blue-50 px-1.5 py-0.5 rounded inline-block mt-1">
                        {step.officerName}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Vertical Stepper View */}
          <div className="md:hidden space-y-6">
            {timelineData.steps.map((step, idx) => {
              const isCompleted = step.status === 'completed';
              const isInProgress = step.status === 'in_progress';

              return (
                <div key={idx} className="flex items-start gap-3 relative">
                  {idx < timelineData.steps.length - 1 && (
                    <div className="absolute top-9 left-4 bottom-[-16px] w-0.5 bg-gray-200" />
                  )}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 z-10 ${
                      isCompleted
                        ? 'bg-emerald-600 text-white'
                        : isInProgress
                        ? 'bg-amber-500 text-white animate-pulse'
                        : 'bg-white border-2 border-gray-300 text-gray-400'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 size={16} /> : idx + 1}
                  </div>
                  <div className="space-y-0.5 text-xs flex-1">
                    <div className="font-bold text-gray-900">{step.title}</div>
                    <div className="text-gray-500 text-[11px]">{step.subtitle}</div>
                    <div className="text-gray-400 text-[10px] font-mono">{step.timestamp}</div>
                    {step.note && (
                      <div className="text-[11px] text-gray-700 bg-gray-50 p-2 rounded mt-1 border border-gray-200">
                        {step.note}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* DETAILED ACTION AUDIT LOG TABLE */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50/70 flex items-center justify-between">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
            <FileText size={14} className="text-[#002B49]" />
            <span>Redressal Action &amp; Inspection Audit Log</span>
          </h3>
          <span className="text-[11px] text-gray-500 font-medium">
            Total entries: {timelineData.logs.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-100 text-gray-800 border-b border-gray-200 font-bold">
                <th className="py-2.5 px-4 w-28">Date &amp; Time</th>
                <th className="py-2.5 px-4 min-w-[180px]">Action Taken</th>
                <th className="py-2.5 px-4 min-w-[200px]">Handled By / Authority</th>
                <th className="py-2.5 px-4 min-w-[280px]">Official Remarks / Findings</th>
                <th className="py-2.5 px-4 w-28 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {timelineData.logs.map((log, index) => (
                <tr key={index} className="hover:bg-blue-50/30 transition-colors">
                  <td className="py-3 px-4 font-mono text-[11px] text-gray-700 align-top">
                    <div>{log.date}</div>
                    <div className="text-gray-400 text-[10px]">{log.time}</div>
                  </td>
                  <td className="py-3 px-4 font-bold text-gray-900 align-top">
                    {log.action}
                  </td>
                  <td className="py-3 px-4 align-top">
                    <div className="font-bold text-gray-900">{log.actionBy}</div>
                    <div className="text-gray-500 text-[11px]">{log.designation}</div>
                  </td>
                  <td className="py-3 px-4 text-gray-700 leading-relaxed align-top">
                    {log.remarks}
                  </td>
                  <td className="py-3 px-4 text-center align-top">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.statusBadge === 'Resolved' || log.statusBadge === 'Work Done'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : log.statusBadge === 'In Progress' || log.statusBadge === 'Under Process'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-blue-100 text-blue-800 border border-blue-300'
                      }`}
                    >
                      {log.statusBadge}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer info banner */}
        <div className="p-3 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-gray-600">
          <div>
            Need to lodge another grievance regarding civic or disaster relief in Nagpur?
          </div>
          <button
            type="button"
            onClick={onLodgeNew}
            className="text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>+ Lodge New Grievance</span>
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
