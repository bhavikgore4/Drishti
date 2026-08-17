import React, { useState } from 'react';
import {
  MapPin,
  ThumbsUp,
  MessageSquare,
  Building,
  ShieldCheck,
  AlertTriangle,
  Filter,
  Search,
  ArrowLeft,
  ChevronRight,
  User,
  Clock,
  CheckCircle,
  Share2,
  Image as ImageIcon,
  Send,
  Sparkles,
  ExternalLink,
  Info,
  Eye,
  CheckCircle2,
  Check,
  Hourglass,
  Layers,
} from 'lucide-react';
import { ResolutionProofModal } from './ResolutionProofModal';
import { ResolutionProofInfo } from '../types';
import beforeImg from '../assets/images/before.jpg';
import afterImg from '../assets/images/after.jpg';

export interface CrowdComment {
  id: string;
  author: string;
  badge: string;
  text: string;
  timestamp: string;
  verifiedLocal?: boolean;
}

export interface NearbyGrievanceItem {
  id: string;
  regNumber: string;
  title?: string;
  category: string;
  location: string;
  zone: string;
  maskedCitizen: string;
  submittedOn?: string;
  submissionDate: string;
  timeAgo: string;
  priority: 'Critical' | 'High' | 'Medium';
  status: 'Under Review' | 'Field Team Dispatched' | 'Action In Progress' | 'Resolved' | 'solved';
  shortSummary: string;
  fullDescription: string;
  assignedAuthority: string;
  issueImage?: string | any;
  nodalOfficer: {
    name: string;
    designation: string;
    contact: string;
  };
  upvoteCount: number;
  hasUpvoted?: boolean;
  commentsCount: number;
  imageUrl?: string | any;
  comments: CrowdComment[];
  resolutionProof?: ResolutionProofInfo;
}

const INITIAL_NEARBY_GRIEVANCES: NearbyGrievanceItem[] = [
  {
    id: 'GR-2026-0802',
    regNumber: 'GR-2026-0802',
    title: 'Blocked Drainage & Damaged Road Repair',
    category: 'Drainage & Infrastructure',
    location: 'Plot No. 24, Street Lane',
    zone: 'Dharampeth Zone / West Ward',
    maskedCitizen: 'Resident - Plot 24',
    submittedOn: '02-08-2026',
    submissionDate: '02-08-2026',
    timeAgo: 'Resolved (02-08-2026)',
    priority: 'High',
    status: 'Resolved',
    shortSummary: 'Blocked Drainage & Damaged Road Repair',
    fullDescription:
      'Severe blockage in the open street drainage channel causing wastewater overflow across the lane in front of Plot No. 24. Potholes and broken road pavement caused hazardous conditions for commuters and residents. Complete drainage desilting, precast slab covering, iron grate installation, and concrete road resurfacing requested.',
    assignedAuthority: 'Municipal Public Works Department',
    issueImage: beforeImg,
    imageUrl: beforeImg,
    nodalOfficer: {
      name: 'Executive Engineer (PWD & Drainage)',
      designation: 'Municipal Public Works Department',
      contact: '0712-2561188',
    },
    upvoteCount: 148,
    commentsCount: 8,
    resolutionProof: {
      beforeImage: beforeImg,
      afterImage: afterImg,
      proofImageUrl: afterImg,
      beforeImageUrl: beforeImg,
      resolvedBy: 'Municipal Public Works Department',
      verifiedBy: 'Municipal Public Works Department',
      department: 'Municipal Public Works Department',
      resolvedAt: '02-08-2026 at 05:00 PM',
      resolvedDate: '02-08-2026 at 05:00 PM',
      notes:
        'Drainage line cleared and completely covered with concrete slabs and iron grates. Road surface repaved with concrete.',
      workDone:
        'Drainage line cleared and completely covered with concrete slabs and iron grates. Road surface repaved with concrete.',
      inspectionNotes:
        'Site inspection verified. Heavy-duty reinforced precast concrete slabs and stormwater iron grates installed. Zero water stagnation recorded.',
      geoTag: '21.1458° N, 79.0882° E • Plot No. 24, Street Lane',
      docketNumber: 'GR-2026-0802',
      officerContact: '0712-2561188',
    },
    comments: [
      {
        id: 'c802_1',
        author: 'Resident - Plot No. 24',
        badge: 'Verified Resident',
        text: 'The concrete road repaving and new drain covers look excellent. No more foul smell or muddy puddles.',
        timestamp: '02-08-2026',
        verifiedLocal: true,
      },
      {
        id: 'c802_2',
        author: 'Local Citizen - Street Lane',
        badge: 'Local Citizen',
        text: 'Clean iron drain grates allow smooth rainwater intake without getting choked.',
        timestamp: '03-08-2026',
        verifiedLocal: true,
      },
    ],
  },
  {
    id: 'g1',
    regNumber: 'DRISHTI/2026/00981',
    category: 'Urban Flooding & Blocked Drainage',
    location: 'Dharampeth Market, Wardha Road, Nagpur',
    zone: 'Dharampeth Zone No. 8',
    maskedCitizen: 'Resident - Ward 14',
    submissionDate: '15-08-2026',
    timeAgo: '4 hours ago',
    priority: 'High',
    status: 'Field Team Dispatched',
    shortSummary:
      'Heavy rainwater overflow near Dharampeth metro station blocking pedestrian walkway.',
    fullDescription:
      'Due to continuous torrential rain, stormwater culverts beneath West High Court Road are heavily clogged with plastic and silt. Rainwater has backed up 1.5 feet over the pedestrian pathway and shopping arcade. Immediate suction dewatering and culvert desilting needed to avoid electrocution hazard near transformers.',
    assignedAuthority: 'Nagpur Municipal Corporation (NMC) - Dharampeth Zone',
    nodalOfficer: {
      name: 'Shri Milind Meshram',
      designation: 'Executive Engineer, Zone No. 8 (NMC)',
      contact: '0712-2561188',
    },
    upvoteCount: 42,
    commentsCount: 5,
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
    comments: [
      {
        id: 'c1',
        author: 'Shop Owner - WHC Road',
        badge: 'Verified Ward Resident',
        text: 'Confirmed, waterlogging still present near hospital square. Cars are slowing down and creating gridlock.',
        timestamp: '3 hours ago',
        verifiedLocal: true,
      },
      {
        id: 'c2',
        author: 'Citizen - Dharampeth',
        badge: 'Local Citizen',
        text: 'NMC tractor with dewatering pump just arrived at 2:30 PM. Work is starting on the main culvert.',
        timestamp: '1 hour ago',
        verifiedLocal: true,
      },
      {
        id: 'c3',
        author: 'Daily Commuter',
        badge: 'Commuter',
        text: 'Please take caution if walking near the transformer pole opposite the chemist.',
        timestamp: '45 mins ago',
      },
    ],
  },
  {
    id: 'g5',
    regNumber: 'DRISHTI/2026/00764',
    category: 'Drainage & Sewerage Pipeline',
    location: 'Mahal Gandhi Gate Road, Gandhibagh Zone, Nagpur',
    zone: 'Gandhibagh Zone No. 6',
    maskedCitizen: 'Merchant - Ward 19',
    submissionDate: '12-08-2026',
    timeAgo: '4 days ago',
    priority: 'High',
    status: 'Resolved',
    shortSummary:
      'Choked underground stormwater drainage pipeline casing replaced and desilted.',
    fullDescription:
      'Underground storm drain pipeline cracked under heavy vehicular load, causing continuous wastewater seepage across Gandhi Gate shopping street. High-pressure jetting and pipeline trenching completed.',
    assignedAuthority: 'Nagpur Municipal Corporation - Drainage Dept',
    nodalOfficer: {
      name: 'Shri Avinash Barahate',
      designation: 'Assistant Municipal Commissioner, Zone 6 (NMC)',
      contact: '0712-2765432',
    },
    upvoteCount: 78,
    commentsCount: 6,
    imageUrl: 'https://images.unsplash.com/photo-1590496793907-49cc7c918645?auto=format&fit=crop&w=800&q=80',
    resolutionProof: {
      proofImageUrl: 'https://images.unsplash.com/photo-1590496793907-49cc7c918645?auto=format&fit=crop&w=1200&q=80',
      department: 'Nagpur Municipal Corporation - Drainage Dept (Gandhibagh Zone)',
      resolvedDate: 'Aug 15, 2026 at 02:15 PM',
      verifiedBy: 'Shri Avinash Barahate, Assistant Commissioner',
      workDone:
        'Trenchless underground pipe relining completed over 22-meter stretch. Replaced cracked concrete pipeline with heavy-duty 450mm HDPE corrugated pipe. Sealed road chamber and resurfaced top layer.',
      inspectionNotes:
        'CCTV pipe camera inspection confirms 100% obstruction-free pipeline flow. Odor and seepage completely mitigated.',
      geoTag: '21.1442° N, 79.1028° E (Mahal Gandhi Gate)',
      docketNumber: 'DRISHTI/2026/00764',
      officerContact: '0712-2765432',
    },
    comments: [
      {
        id: 'c501',
        author: 'Shop Owner - Gandhi Gate',
        badge: 'Verified Resident',
        text: 'The foul smell is gone and the newly laid pipe solved the recurring backflow.',
        timestamp: '2 days ago',
        verifiedLocal: true,
      },
    ],
  },
  {
    id: 'g2',
    regNumber: 'DRISHTI/2026/00945',
    category: 'Infrastructure / Pothole Emergency',
    location: 'Sadar Flyover Road, Nagpur',
    zone: 'PWD North Division / Sadar',
    maskedCitizen: 'Anonymous Citizen',
    submissionDate: '13-08-2026',
    timeAgo: '1 day ago',
    priority: 'Critical',
    status: 'Action In Progress',
    shortSummary:
      'Deep potholes causing severe traffic congestion near Sadar Bazar intersection.',
    fullDescription:
      'A series of dangerous crater-like potholes (approx 8-10 inches deep) have formed on the approach ramp to Sadar Flyover following continuous rain. Multiple two-wheelers have skidded in waterlogged craters. Urgent cold-mix asphalt patch repair and safety barricading required.',
    assignedAuthority: 'PWD Govt (Nagpur Division) - North Division',
    nodalOfficer: {
      name: 'Shri Dhananjay R. Patil',
      designation: 'Executive Engineer (PWD North Division)',
      contact: '0712-2598765',
    },
    upvoteCount: 89,
    commentsCount: 12,
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
    comments: [
      {
        id: 'c201',
        author: 'Advocate - Sadar Court',
        badge: 'Verified Resident',
        text: 'Road repair team with cold-mix asphalt arrived this morning. Left lane is barricaded.',
        timestamp: '6 hours ago',
        verifiedLocal: true,
      },
    ],
  },
  {
    id: 'g3',
    regNumber: 'DRISHTI/2026/00889',
    category: 'Water Supply Contamination',
    location: 'Medical Square, Hanuman Nagar, Nagpur',
    zone: 'Hanuman Nagar Zone No. 3',
    maskedCitizen: 'Resident - Ward 28',
    submissionDate: '12-08-2026',
    timeAgo: '2 days ago',
    priority: 'High',
    status: 'Under Review',
    shortSummary:
      'Muddy tap water reported in Medical College residential quarters following storm drain overflow.',
    fullDescription:
      'Drinking water supply pipeline pressure dropped and turbid brown water with strong odor received in quarters near GMC Hospital square. Possible cross-seepage from neighboring open storm drainage line after heavy rainfall.',
    assignedAuthority: 'Nagpur Municipal Corporation (NMC) - Water Works Wing',
    nodalOfficer: {
      name: 'Shri Ganesh Rathod',
      designation: 'Assistant Municipal Commissioner, Zone 3 (NMC)',
      contact: '0712-2743322',
    },
    upvoteCount: 35,
    commentsCount: 4,
    imageUrl: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=600&q=80',
    comments: [
      {
        id: 'c301',
        author: 'Doctor - GMC Quarters',
        badge: 'Local Resident',
        text: 'Water samples collected by NMC Health team for residual chlorine testing.',
        timestamp: '1 day ago',
        verifiedLocal: true,
      },
    ],
  },
];

interface NearbyGrievancesHubProps {
  onBackToHome: () => void;
  onLodgeGrievance: () => void;
  onNotify: (msg: string) => void;
}

export type StatusFilterType = 'All' | 'Pending' | 'Solved';

export const NearbyGrievancesHub: React.FC<NearbyGrievancesHubProps> = ({
  onBackToHome,
  onLodgeGrievance,
  onNotify,
}) => {
  const [grievances, setGrievances] = useState<NearbyGrievanceItem[]>(INITIAL_NEARBY_GRIEVANCES);
  const [selectedGrievanceId, setSelectedGrievanceId] = useState<string>(
    INITIAL_NEARBY_GRIEVANCES[0].id
  );
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>('All');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [newCommentText, setNewCommentText] = useState<string>('');

  // Resolution Proof Modal State
  const [proofModalItem, setProofModalItem] = useState<NearbyGrievanceItem | null>(null);

  // Selected grievance object
  const selectedItem =
    grievances.find((g) => g.id === selectedGrievanceId) || grievances[0];

  // Counts for status tabs
  const countAll = grievances.length;
  const countPending = grievances.filter((g) => g.status !== 'Resolved').length;
  const countSolved = grievances.filter((g) => g.status === 'Resolved').length;

  // Upvote toggle handler
  const handleUpvote = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setGrievances((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const isUpvoted = !!item.hasUpvoted;
          const newCount = isUpvoted ? item.upvoteCount - 1 : item.upvoteCount + 1;
          const updated = {
            ...item,
            hasUpvoted: !isUpvoted,
            upvoteCount: newCount,
          };
          if (!isUpvoted) {
            onNotify(`+1 Upvote registered for ${item.regNumber}! Priority escalated.`);
          }
          return updated;
        }
        return item;
      })
    );
  };

  // Add community comment
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: CrowdComment = {
      id: 'c_' + Date.now(),
      author: 'You (Citizen - Nagpur)',
      badge: 'Verified Citizen',
      text: newCommentText.trim(),
      timestamp: 'Just now',
      verifiedLocal: true,
    };

    setGrievances((prev) =>
      prev.map((item) => {
        if (item.id === selectedItem.id) {
          return {
            ...item,
            commentsCount: item.commentsCount + 1,
            comments: [newComment, ...item.comments],
          };
        }
        return item;
      })
    );

    setNewCommentText('');
    onNotify('Your civic verification note was posted to the community feed.');
  };

  // Filtered grievances matching both Status Filter and Category/Search
  const filteredList = grievances.filter((item) => {
    // 1. Status Filter: 'All' | 'Pending' | 'Solved'
    if (statusFilter === 'Pending' && item.status === 'Resolved') return false;
    if (statusFilter === 'Solved' && item.status !== 'Resolved') return false;

    // 2. Category Filter
    const matchesCat =
      filterCategory === 'All' || item.category.toLowerCase().includes(filterCategory.toLowerCase());

    // 3. Search Query
    const matchesSearch =
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.shortSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.regNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.zone.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* ============================================================= */}
      {/* TOP HEADER / ACTION BAR */}
      {/* ============================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl shadow-xs border border-gray-200">
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
              <span>View Nearby Grievances (Nagpur Locality Hub)</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                Live Community Feed
              </span>
            </h1>
            <p className="text-[11px] text-gray-500">
              Crowd-sourced civic &amp; disaster issues lodged in your zone. Inspect official resolution proofs or track pending tasks.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onLodgeGrievance}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#002B49] hover:bg-[#00385F] text-white text-xs font-bold cursor-pointer shadow-xs self-end sm:self-auto transition-colors"
        >
          <span>+ Report Civic Issue in Area</span>
        </button>
      </div>

      {/* ============================================================= */}
      {/* 1. TOP STATUS FILTER BAR (All Issues | Pending ⏳ | Solved ✅) */}
      {/* ============================================================= */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-3 sm:p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-gray-100 pb-3">
          {/* Status Tabs Bar */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-gray-800 mr-1 flex items-center gap-1">
              <Layers size={14} className="text-[#002B49]" />
              <span>Status Filter:</span>
            </span>

            {/* Tab 1: All Issues */}
            <button
              type="button"
              onClick={() => setStatusFilter('All')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'All'
                  ? 'bg-[#002B49] text-white shadow-xs ring-2 ring-[#002B49]/30'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
              }`}
            >
              <span>All Issues</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  statusFilter === 'All'
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {countAll}
              </span>
            </button>

            {/* Tab 2: Pending ⏳ */}
            <button
              type="button"
              onClick={() => setStatusFilter('Pending')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'Pending'
                  ? 'bg-amber-600 text-white shadow-xs ring-2 ring-amber-500/30'
                  : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <span>Pending ⏳</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  statusFilter === 'Pending'
                    ? 'bg-white/20 text-white'
                    : 'bg-amber-200 text-amber-900'
                }`}
              >
                {countPending}
              </span>
            </button>

            {/* Tab 3: Solved ✅ */}
            <button
              type="button"
              onClick={() => setStatusFilter('Solved')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'Solved'
                  ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-500/30'
                  : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <span>Solved ✅</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  statusFilter === 'Solved'
                    ? 'bg-white/20 text-white'
                    : 'bg-emerald-200 text-emerald-900'
                }`}
              >
                {countSolved}
              </span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by area, ward, keywords..."
              className="bg-gray-50 border border-gray-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
            />
          </div>
        </div>

        {/* Category Pill Sub-filter */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-1 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-gray-500 text-[11px] mr-1">Category:</span>
            {['All', 'Flooding', 'Infrastructure', 'Water Supply', 'Drainage'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCategory(cat)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                  filterCategory === cat
                    ? 'bg-slate-800 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Active status indicator label */}
          <div className="text-[11px] text-gray-500">
            Showing <strong>{filteredList.length}</strong> of {grievances.length} grievances
          </div>
        </div>
      </div>

      {/* ============================================================= */}
      {/* MAIN TWO-COLUMN LAYOUT: LIST ON LEFT, DETAIL ON RIGHT */}
      {/* ============================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Feed List (5 Cols on large screens) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold text-gray-700 flex items-center justify-between px-1">
            <span>Nagpur Community Feed ({filteredList.length})</span>
            <span className="text-[11px] text-gray-500 font-normal">Click card to inspect</span>
          </div>

          {filteredList.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-gray-200 text-center space-y-2">
              <Info size={28} className="mx-auto text-gray-400" />
              <p className="text-xs font-bold text-gray-700">No grievances found</p>
              <p className="text-[11px] text-gray-500">
                No items match the current status filter &quot;{statusFilter}&quot;.
              </p>
              <button
                type="button"
                onClick={() => {
                  setStatusFilter('All');
                  setFilterCategory('All');
                  setSearchQuery('');
                }}
                className="mt-2 text-xs font-bold text-blue-700 hover:underline cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            filteredList.map((item) => {
              const isSelected = item.id === selectedGrievanceId;
              const isSolved = item.status === 'Resolved';

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedGrievanceId(item.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer bg-white relative ${
                    isSelected
                      ? 'border-[#002B49] ring-2 ring-blue-500/30 shadow-md bg-blue-50/10'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-xs'
                  }`}
                >
                  {/* Top Row: Reg No + Status Badge */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-mono font-bold text-gray-800 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                      {item.regNumber}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {isSolved ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                          <CheckCircle2 size={10} />
                          <span>Solved ✅</span>
                        </span>
                      ) : (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.priority === 'Critical'
                              ? 'bg-red-100 text-red-800 border border-red-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}
                        >
                          {item.priority} Priority
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title / Summary */}
                  <h3 className="text-xs font-bold text-gray-900 mb-1.5 leading-snug">
                    {item.shortSummary}
                  </h3>

                  {/* Location & Masked Citizen Tag */}
                  <div className="space-y-1 mb-3 text-[11px] text-gray-600">
                    <div className="flex items-center gap-1 text-gray-700 font-medium">
                      <MapPin size={12} className="text-red-600 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-500 text-[10px]">
                      <span className="flex items-center gap-1">
                        <User size={11} className="text-gray-400" />
                        <span>{item.maskedCitizen}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} className="text-gray-400" />
                        <span>{item.timeAgo}</span>
                      </span>
                    </div>
                  </div>

                  {/* SOLVED PROOF EYE BUTTON HIGHLIGHT (Requirement 1.B) */}
                  {isSolved && (
                    <div className="mb-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setProofModalItem(item);
                        }}
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer active:scale-98"
                        title="View Official Government Resolution Proof Photo and Remarks"
                      >
                        <Eye size={14} className="text-emerald-700 shrink-0" />
                        <span>View Solved Proof 👁️</span>
                        <span className="text-[10px] font-normal text-emerald-700 bg-emerald-200/60 px-1.5 py-0.2 rounded ml-1">
                          Photo Verified
                        </span>
                      </button>
                    </div>
                  )}

                  {/* Bottom Row: Actions (Upvote + Comment count) */}
                  <div className="flex items-center justify-between pt-2.5 border-t border-gray-100 text-xs">
                    <div className="flex items-center gap-2">
                      {/* Upvote Button */}
                      <button
                        type="button"
                        onClick={(e) => handleUpvote(item.id, e)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          item.hasUpvoted
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        <ThumbsUp size={12} className={item.hasUpvoted ? 'fill-white' : ''} />
                        <span>{item.upvoteCount}</span>
                      </button>

                      {/* Comments Indicator */}
                      <div className="flex items-center gap-1 text-gray-500 px-2 py-1 text-xs">
                        <MessageSquare size={12} />
                        <span>{item.commentsCount} notes</span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        item.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800 font-bold'
                          : item.status === 'Action In Progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Detailed View & Community Comments (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl shadow-xs border border-gray-200 p-5 space-y-5">
          {/* Header of selected item */}
          <div className="border-b border-gray-200 pb-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-mono font-bold text-blue-900 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                {selectedItem.regNumber}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">
                  Reported: {selectedItem.submissionDate} ({selectedItem.timeAgo})
                </span>
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    selectedItem.status === 'Resolved'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}
                >
                  {selectedItem.status}
                </span>
              </div>
            </div>

            <h2 className="text-base font-bold text-gray-900 mb-2">
              {selectedItem.shortSummary}
            </h2>

            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
              <span className="flex items-center gap-1 font-semibold text-gray-800">
                <MapPin size={13} className="text-red-600" />
                <span>{selectedItem.location}</span>
              </span>
              <span className="flex items-center gap-1 text-gray-500">
                <User size={13} />
                <span>Lodged by {selectedItem.maskedCitizen}</span>
              </span>
            </div>
          </div>

          {/* If Solved: Prominent Government Resolution Proof Banner on Right Column */}
          {selectedItem.status === 'Resolved' && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50/60 to-emerald-50 border border-emerald-300 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-emerald-950">
                      Official Government Resolution Proof Available
                    </h4>
                    <p className="text-[11px] text-emerald-800">
                      Verified by {selectedItem.nodalOfficer.name} on {selectedItem.resolutionProof?.resolvedDate || 'Aug 16, 2026 at 04:30 PM'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setProofModalItem(selectedItem)}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
                >
                  <Eye size={14} />
                  <span>View Solved Proof 👁️</span>
                </button>
              </div>

              {selectedItem.resolutionProof?.workDone && (
                <div className="text-[11px] text-slate-800 bg-white/90 p-2.5 rounded-lg border border-emerald-200">
                  <strong>Official Work Done:</strong> {selectedItem.resolutionProof.workDone}
                </div>
              )}
            </div>
          )}

          {/* Incident Description */}
          <div className="space-y-3 text-xs">
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Issue Description:</h4>
              <p className="text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-200">
                {selectedItem.fullDescription}
              </p>
            </div>

            {/* Attached Photo Evidence if available */}
            {(selectedItem.issueImage || selectedItem.imageUrl) && (
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-gray-800">
                  <span className="flex items-center gap-1.5">
                    <Eye size={14} className="text-blue-700" />
                    <span>Citizen Uploaded Site Evidence:</span>
                  </span>
                  {selectedItem.status === 'Resolved' && (
                    <button
                      type="button"
                      onClick={() => setProofModalItem(selectedItem)}
                      className="text-[11px] text-emerald-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 size={12} />
                      <span>Compare Before &amp; After Fix ➔</span>
                    </button>
                  )}
                </div>
                <div className="relative rounded-lg overflow-hidden border border-gray-300 max-h-48 flex items-center justify-center bg-black/90">
                  <img
                    src={selectedItem.issueImage || selectedItem.imageUrl}
                    alt="Citizen Reported Issue Evidence"
                    referrerPolicy="no-referrer"
                    className="w-full h-48 object-cover hover:scale-102 transition-transform duration-200"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/75 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded font-mono">
                    📍 {selectedItem.location} • Submitted: {selectedItem.submissionDate}
                  </div>
                </div>
              </div>
            )}

            {/* Assigned Nodal Desk */}
            <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-950">
                  <ShieldCheck size={14} className="text-blue-700" />
                  <span>Assigned Redressal Authority:</span>
                </div>
                <div className="font-bold text-gray-900 text-xs mt-0.5">
                  {selectedItem.assignedAuthority}
                </div>
                <div className="text-[11px] text-gray-600">
                  Nodal Officer: {selectedItem.nodalOfficer.name} ({selectedItem.nodalOfficer.designation})
                </div>
              </div>
              <div className="text-right sm:border-l sm:border-blue-200 sm:pl-4 shrink-0">
                <span className="text-[10px] text-gray-500 block uppercase font-bold">Helpline Desk</span>
                <span className="text-xs font-mono font-bold text-blue-800">
                  {selectedItem.nodalOfficer.contact}
                </span>
              </div>
            </div>

            {/* Upvote & Impact bar */}
            <div className="flex items-center justify-between gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleUpvote(selectedItem.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedItem.hasUpvoted
                      ? 'bg-blue-700 text-white shadow-xs ring-2 ring-blue-300'
                      : 'bg-white border border-gray-300 hover:bg-blue-50 text-blue-900'
                  }`}
                >
                  <ThumbsUp size={14} className={selectedItem.hasUpvoted ? 'fill-white' : ''} />
                  <span>{selectedItem.hasUpvoted ? 'Upvoted' : 'Upvote This Issue'}</span>
                  <span className="bg-black/15 px-1.5 py-0.5 rounded text-[11px]">
                    {selectedItem.upvoteCount}
                  </span>
                </button>
                <span className="text-[11px] text-gray-500 hidden sm:inline">
                  Upvotes elevate issue priority on NMC &amp; PWD officer dashboards.
                </span>
              </div>

              <div className="text-xs text-gray-500 font-semibold">
                {selectedItem.commentsCount} Community Notes
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* CIVIC VERIFICATION & COMMENT SECTION */}
          {/* ------------------------------------------------------------- */}
          <div className="border-t border-gray-200 pt-4 space-y-4">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <MessageSquare size={14} className="text-[#002B49]" />
              <span>Civic Verification &amp; Crowd Updates ({selectedItem.comments.length})</span>
            </h3>

            {/* New Comment Input */}
            <form onSubmit={handleAddComment} className="space-y-2">
              <div className="relative">
                <textarea
                  rows={2}
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Provide ground-level updates (e.g., 'Dewatering started at 2 PM', 'Water level receding')..."
                  className="w-full text-xs p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-gray-500">
                  Posting as <strong>Resident - Nagpur</strong> (Anonymous public handle)
                </span>
                <button
                  type="submit"
                  disabled={!newCommentText.trim()}
                  className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-[#002B49] hover:bg-[#00385F] disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                >
                  <Send size={12} />
                  <span>Post Community Update</span>
                </button>
              </div>
            </form>

            {/* List of existing crowd comments */}
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {selectedItem.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 font-bold text-gray-900">
                      <span>{comment.author}</span>
                      <span className="text-[10px] font-normal px-1.5 py-0.2 rounded bg-blue-100 text-blue-900">
                        {comment.badge}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {comment.timestamp}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-[11px]">
                    {comment.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================= */}
      {/* RESOLUTION PROOF MODAL POPUP */}
      {/* ============================================================= */}
      {proofModalItem && (
        <ResolutionProofModal
          isOpen={!!proofModalItem}
          onClose={() => setProofModalItem(null)}
          docketNumber={proofModalItem.regNumber}
          issueTitle={proofModalItem.shortSummary}
          category={proofModalItem.category}
          location={proofModalItem.location}
          proofData={proofModalItem.resolutionProof}
          onNotify={onNotify}
        />
      )}
    </div>
  );
};
