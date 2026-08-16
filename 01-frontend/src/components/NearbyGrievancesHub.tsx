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
} from 'lucide-react';
import { getNodalOfficerForGrievance } from '../utils/nodalOfficerData';

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
  category: string;
  location: string;
  zone: string;
  maskedCitizen: string;
  submissionDate: string;
  timeAgo: string;
  priority: 'Critical' | 'High' | 'Medium';
  status: 'Under Review' | 'Field Team Dispatched' | 'Action In Progress' | 'Resolved';
  shortSummary: string;
  fullDescription: string;
  assignedAuthority: string;
  nodalOfficer: {
    name: string;
    designation: string;
    contact: string;
  };
  upvoteCount: number;
  hasUpvoted?: boolean;
  commentsCount: number;
  imageUrl?: string;
  comments: CrowdComment[];
}

const INITIAL_NEARBY_GRIEVANCES: NearbyGrievanceItem[] = [
  {
    id: 'g1',
    regNumber: 'DRISHTI/2026/00981',
    category: 'Urban Flooding & Blocked Drainage',
    location: 'Dharampeth Market, Wardha Road, Nagpur',
    zone: 'Dharampeth Zone No. 8',
    maskedCitizen: 'Resident - Ward 14',
    submissionDate: '14-08-2026',
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
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=600&q=80',
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
      {
        id: 'c4',
        author: 'Resident - Khare Town',
        badge: 'Local Resident',
        text: 'Good to see quick automated triage on Drishti. Hope water clears before evening school rush.',
        timestamp: '30 mins ago',
        verifiedLocal: true,
      },
      {
        id: 'c5',
        author: 'NMC Civic Volunteer',
        badge: 'Civil Volunteer',
        text: 'Dewatering hose line laid towards the main storm drain canal.',
        timestamp: '10 mins ago',
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
      {
        id: 'c202',
        author: 'Citizen - Katol Road',
        badge: 'Daily Commuter',
        text: 'Thank you for upvoting this issue. PWD emergency patrol noticed it within 24 hours.',
        timestamp: '4 hours ago',
      },
      {
        id: 'c203',
        author: 'Resident - Sadar Bazar',
        badge: 'Ward 22 Resident',
        text: 'Temporary gravel filled in 3 potholes. Tar layering scheduled for dry weather window.',
        timestamp: '2 hours ago',
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
        text: 'Water samples collected by NMC Health team at 11 AM for chlorine testing.',
        timestamp: '1 day ago',
        verifiedLocal: true,
      },
      {
        id: 'c302',
        author: 'Resident - Hanuman Nagar',
        badge: 'Local Resident',
        text: 'Drinking water tankers deployed by NMC in the interim behind Dean building.',
        timestamp: '18 hours ago',
        verifiedLocal: true,
      },
    ],
  },
  {
    id: 'g4',
    regNumber: 'DRISHTI/2026/00812',
    category: 'Disaster Mitigation / Dewatering',
    location: 'Ambazari Lake Overflow Canal, Nagpur',
    zone: 'Laxmi Nagar Zone No. 1 / NMC HQ',
    maskedCitizen: 'Citizen - Zone 1',
    submissionDate: '11-08-2026',
    timeAgo: '3 days ago',
    priority: 'Critical',
    status: 'Action In Progress',
    shortSummary:
      'Canal sluice gate silt accumulation causing backflow near residential colony.',
    fullDescription:
      'Nag River / Ambazari spillway canal banks showed water buildup due to tree branches and silt blocking the safety screens. Preemptive desilting and heavy crane clearance deployed to maintain flood retention capacity.',
    assignedAuthority: 'NMC Central HQ & Disaster Management Cell',
    nodalOfficer: {
      name: 'Shri Nirbhay Jain',
      designation: 'Additional Municipal Commissioner (Disaster Cell)',
      contact: '0712-2567035',
    },
    upvoteCount: 67,
    commentsCount: 9,
    imageUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80',
    comments: [
      {
        id: 'c401',
        author: 'Resident - Corporation Colony',
        badge: 'Verified Resident',
        text: 'Hydraulic excavators cleared 4 truckloads of debris from the weir yesterday.',
        timestamp: '2 days ago',
        verifiedLocal: true,
      },
      {
        id: 'c402',
        author: 'Civic Environmentalist',
        badge: 'NGO Observer',
        text: 'Water level down to safe threshold. Flow into Nag River canal is normalized.',
        timestamp: '1 day ago',
      },
    ],
  },
];

interface NearbyGrievancesHubProps {
  onBackToHome: () => void;
  onLodgeGrievance: () => void;
  onNotify: (msg: string) => void;
}

export const NearbyGrievancesHub: React.FC<NearbyGrievancesHubProps> = ({
  onBackToHome,
  onLodgeGrievance,
  onNotify,
}) => {
  const [grievances, setGrievances] = useState<NearbyGrievanceItem[]>(INITIAL_NEARBY_GRIEVANCES);
  const [selectedGrievanceId, setSelectedGrievanceId] = useState<string>(
    INITIAL_NEARBY_GRIEVANCES[0].id
  );
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [newCommentText, setNewCommentText] = useState<string>('');

  // Selected grievance object
  const selectedItem =
    grievances.find((g) => g.id === selectedGrievanceId) || grievances[0];

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
            onNotify(`+1 Upvote registered for ${item.regNumber}! Issue priority boosted.`);
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
    onNotify('Your community verification comment was posted successfully.');
  };

  // Filtered grievances
  const filteredList = grievances.filter((item) => {
    const matchesCat =
      filterCategory === 'All' || item.category.toLowerCase().includes(filterCategory.toLowerCase());
    const matchesSearch =
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.shortSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.regNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.zone.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* ------------------------------------------------------------- */}
      {/* TOP HEADER / ACTION BAR */}
      {/* ------------------------------------------------------------- */}
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
              Crowd-sourced civic &amp; disaster issues lodged in your zone. Upvote to elevate priority or add field updates.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onLodgeGrievance}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#002B49] hover:bg-[#00385F] text-white text-xs font-semibold cursor-pointer shadow-2xs self-end sm:self-auto"
        >
          <span>+ Report Civic Issue in Area</span>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* FILTERS & SEARCH ROW */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            <span className="font-bold text-gray-700 mr-1 flex items-center gap-1 text-xs">
              <Filter size={13} className="text-[#002B49]" />
              <span>Category:</span>
            </span>
            {['All', 'Flooding', 'Infrastructure', 'Water Supply', 'Disaster'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-lg font-semibold text-xs transition-colors cursor-pointer ${
                  filterCategory === cat
                    ? 'bg-[#002B49] text-white shadow-2xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by area, ward, or keywords..."
              className="bg-gray-50 border border-gray-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
            />
          </div>
        </div>

        {/* Privacy notice banner */}
        <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center gap-2 text-[11px] text-gray-500">
          <Info size={13} className="text-blue-600 shrink-0" />
          <span>
            <strong>Citizen Privacy Protected:</strong> In compliance with the DPDP Act 2023, personal citizen identities and phone numbers are masked. Only location tags and public interest descriptions are visible.
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MAIN TWO-COLUMN LAYOUT: LIST ON LEFT, DETAIL & COMMENTS ON RIGHT */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Feed List (5 Cols on large screens) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold text-gray-700 flex items-center justify-between px-1">
            <span>Nearby Issues in Nagpur ({filteredList.length})</span>
            <span className="text-[11px] text-gray-500 font-normal">Select an item to view community actions</span>
          </div>

          {filteredList.map((item) => {
            const isSelected = item.id === selectedGrievanceId;

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
                {/* Top Row: Reg No + Status */}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[11px] font-mono font-bold text-gray-800 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                    {item.regNumber}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.priority === 'Critical'
                        ? 'bg-red-100 text-red-800 border border-red-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}
                  >
                    {item.priority} Priority
                  </span>
                </div>

                {/* Title / Summary */}
                <h3 className="text-xs font-bold text-gray-900 mb-1 leading-snug">
                  {item.shortSummary}
                </h3>

                {/* Location & Masked Citizen Tag */}
                <div className="space-y-1 mb-3 text-[11px] text-gray-600">
                  <div className="flex items-center gap-1 text-gray-700 font-medium">
                    <MapPin size={12} className="text-red-600 shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-500">
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
                      <span>{item.commentsCount} comments</span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      item.status === 'Resolved'
                        ? 'bg-emerald-100 text-emerald-800'
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
          })}
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

          {/* Incident Description & Evidence Photo */}
          <div className="space-y-3 text-xs">
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Issue Description:</h4>
              <p className="text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-200">
                {selectedItem.fullDescription}
              </p>
            </div>

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
    </div>
  );
};
