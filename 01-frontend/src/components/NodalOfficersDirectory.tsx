import React, { useState, useMemo } from 'react';
import {
  Search,
  Building,
  Phone,
  Mail,
  MapPin,
  Printer,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  Download,
  Copy,
  Check,
  Info,
  ShieldCheck,
  Building2,
  HardHat,
  ArrowLeft,
} from 'lucide-react';

export type DirectoryDepartment = 'nmc' | 'pwd';

export interface NodalOfficerDirectoryEntry {
  id: string;
  sNo: number;
  department: DirectoryDepartment;
  zoneDepartment: string;
  officerName: string;
  designation: string;
  address: string;
  phone: string;
  email: string;
}

const NMC_OFFICERS: NodalOfficerDirectoryEntry[] = [
  {
    id: 'nmc-1',
    sNo: 1,
    department: 'nmc',
    zoneDepartment: 'Central Office (Mahanagarpalika HQ)',
    officerName: 'Dr. Vipin Sharma, IAS',
    designation: 'Additional Municipal Commissioner (PG Redressal)',
    address: 'NMC Main Building, Civil Lines, Nagpur - 440001',
    phone: '0712-2567035',
    email: 'commissioner.nmc[at]maharashtra[dot]gov[dot]in',
  },
  {
    id: 'nmc-2',
    sNo: 2,
    department: 'nmc',
    zoneDepartment: 'Dharampeth Zone No. 8',
    officerName: 'Shri Milind Meshram',
    designation: 'Executive Engineer & Zonal Nodal Officer',
    address: 'NMC Zone Office, West High Court Road, Dharampeth, Nagpur - 440010',
    phone: '0712-2561188',
    email: 'zone8.nmc[at]maharashtra[dot]gov[dot]in',
  },
  {
    id: 'nmc-3',
    sNo: 3,
    department: 'nmc',
    zoneDepartment: 'Hanuman Nagar Zone No. 3',
    officerName: 'Smt. Sushma Mandape',
    designation: 'Assistant Municipal Commissioner',
    address: 'NMC Office, Medical Square, Hanuman Nagar, Nagpur - 440009',
    phone: '0712-2743322',
    email: 'zone3.nmc[at]maharashtra[dot]gov[dot]in',
  },
  {
    id: 'nmc-4',
    sNo: 4,
    department: 'nmc',
    zoneDepartment: 'Laxmi Nagar Zone No. 1',
    officerName: 'Shri Ganesh Rathod',
    designation: 'Zonal PG Nodal Officer & Assistant Commissioner',
    address: 'NMC Office, Wardha Road, Laxmi Nagar, Nagpur - 440022',
    phone: '0712-2234511',
    email: 'zone1.nmc[at]maharashtra[dot]gov[dot]in',
  },
  {
    id: 'nmc-5',
    sNo: 5,
    department: 'nmc',
    zoneDepartment: 'Dhantoli Zone No. 4',
    officerName: 'Shri Prakash Warade',
    designation: 'Assistant Municipal Commissioner & PG Officer',
    address: 'NMC Zone Office, Near Mehadia Square, Dhantoli, Nagpur - 440012',
    phone: '0712-2426789',
    email: 'zone4.nmc[at]maharashtra[dot]gov[dot]in',
  },
  {
    id: 'nmc-6',
    sNo: 6,
    department: 'nmc',
    zoneDepartment: 'Nehru Nagar Zone No. 5',
    officerName: 'Shri Avinash Barahate',
    designation: 'Executive Engineer (Grievance Redressal Cell)',
    address: 'NMC Office, Great Nag Road, Nehru Nagar, Nagpur - 440024',
    phone: '0712-2701234',
    email: 'zone5.nmc[at]maharashtra[dot]gov[dot]in',
  },
  {
    id: 'nmc-7',
    sNo: 7,
    department: 'nmc',
    zoneDepartment: 'Gandhibagh Zone No. 6',
    officerName: 'Smt. Deepa Deshmukh',
    designation: 'Assistant Commissioner (Zone 6)',
    address: 'NMC Office, Central Avenue Road, Gandhibagh, Nagpur - 440002',
    phone: '0712-2765432',
    email: 'zone6.nmc[at]maharashtra[dot]gov[dot]in',
  },
  {
    id: 'nmc-8',
    sNo: 8,
    department: 'nmc',
    zoneDepartment: 'Satranjipura Zone No. 7',
    officerName: 'Shri Harish Raut',
    designation: 'Zonal PG Nodal Officer',
    address: 'NMC Building, Shanti Nagar Road, Satranjipura, Nagpur - 440017',
    phone: '0712-2778901',
    email: 'zone7.nmc[at]maharashtra[dot]gov[dot]in',
  },
  {
    id: 'nmc-9',
    sNo: 9,
    department: 'nmc',
    zoneDepartment: 'Ashi Nagar Zone No. 9',
    officerName: 'Shri Vijay Humne',
    designation: 'Executive Engineer & Nodal Officer',
    address: 'NMC Office, Kamptee Road, Ashi Nagar, Nagpur - 440026',
    phone: '0712-2645678',
    email: 'zone9.nmc[at]maharashtra[dot]gov[dot]in',
  },
  {
    id: 'nmc-10',
    sNo: 10,
    department: 'nmc',
    zoneDepartment: 'Mangalwari Zone No. 10',
    officerName: 'Smt. Archana Patil',
    designation: 'Assistant Municipal Commissioner',
    address: 'NMC Office, Sadar Bazar, Mangalwari, Nagpur - 440001',
    phone: '0712-2591234',
    email: 'zone10.nmc[at]maharashtra[dot]gov[dot]in',
  },
  {
    id: 'nmc-11',
    sNo: 11,
    department: 'nmc',
    zoneDepartment: 'Water Works & Disaster Dewatering Division',
    officerName: 'Shri Rajesh Dufare',
    designation: 'Superintending Engineer (Water Supply & Crisis Management)',
    address: 'Water Supply Directorate, NMC Civil Lines, Nagpur - 440001',
    phone: '0712-2567890',
    email: 'waterworks.nmc[at]maharashtra[dot]gov[dot]in',
  },
  {
    id: 'nmc-12',
    sNo: 12,
    department: 'nmc',
    zoneDepartment: 'Health & Solid Waste Management Wing',
    officerName: 'Dr. Narendra Bahirwar',
    designation: 'Chief Medical Officer of Health (CMOH) & PG Officer',
    address: 'Health Department, 2nd Floor, NMC HQ, Civil Lines, Nagpur - 440001',
    phone: '0712-2567088',
    email: 'health.nmc[at]maharashtra[dot]gov[dot]in',
  },
];

const PWD_OFFICERS: NodalOfficerDirectoryEntry[] = [
  {
    id: 'pwd-1',
    sNo: 1,
    department: 'pwd',
    zoneDepartment: 'PWD Circle Office Nagpur (Regional HQ)',
    officerName: 'Shri Janardan B. Bagde, SE',
    designation: 'Superintending Engineer, PWD Circle',
    address: 'Bungalow No. 2, Bandhkam Bhavan, Civil Lines, Nagpur - 440001',
    phone: '0712-2561234',
    email: 'se.nagpur.pwd[at]maharashtra[dot]gov[dot]in',
  },
  {
    id: 'pwd-2',
    sNo: 2,
    department: 'pwd',
    zoneDepartment: 'PWD World Bank & National Highway Division',
    officerName: 'Shri Anand M. Kulkarni, EE',
    designation: 'Executive Engineer (National Highway Division)',
    address: 'PWD Complex, Opposite High Court, Nagpur - 440001',
    phone: '0712-2534567',
    email: 'ee.nh.nagpur[at]maharashtra[dot]gov[dot]in',
  },
  {
    id: 'pwd-3',
    sNo: 3,
    department: 'pwd',
    zoneDepartment: 'PWD North Division (Infrastructure & Roads)',
    officerName: 'Shri Dhananjay R. Patil, EE',
    designation: 'Executive Engineer (North Division)',
    address: 'Sadar, Katol Road, Nagpur - 440001',
    phone: '0712-2598765',
    email: 'ee.north.pwd[at]maharashtra[dot]gov[dot]in',
  },
  {
    id: 'pwd-4',
    sNo: 4,
    department: 'pwd',
    zoneDepartment: 'PWD South Division (City Infrastructure)',
    officerName: 'Smt. Rohini K. Shinde, EE',
    designation: 'Executive Engineer (South Division & Stormwater Bridges)',
    address: 'PWD Campus, Medical Square, Nagpur - 440009',
    phone: '0712-2741122',
    email: 'ee.south.pwd[at]maharashtra[dot]gov[dot]in',
  },
  {
    id: 'pwd-5',
    sNo: 5,
    department: 'pwd',
    zoneDepartment: 'PWD Special Project & Flyovers Division',
    officerName: 'Shri S. P. Choudhary, EE',
    designation: 'Executive Engineer (Major Bridges & Rapid Flyovers)',
    address: 'Bandhkam Bhavan Annexe, Civil Lines, Nagpur - 440001',
    phone: '0712-2569900',
    email: 'ee.bridges.nagpur[at]maharashtra[dot]gov[dot]in',
  },
  {
    id: 'pwd-6',
    sNo: 6,
    department: 'pwd',
    zoneDepartment: 'PWD Electrical Division (Public Lighting & Sub-stations)',
    officerName: 'Shri Mahendra N. Meshram, EE',
    designation: 'Executive Engineer (Electrical Infrastructure)',
    address: 'Electric Division Compound, Amravati Road, Ravi Nagar, Nagpur - 440033',
    phone: '0712-2543210',
    email: 'ee.elec.nagpur[at]maharashtra[dot]gov[dot]in',
  },
  {
    id: 'pwd-7',
    sNo: 7,
    department: 'pwd',
    zoneDepartment: 'PWD Quality Control & Disaster Material Testing Lab',
    officerName: 'Dr. Vivek K. Joshi',
    designation: 'Superintending Quality Control Officer',
    address: 'PWD Laboratory Complex, Dharampeth, Nagpur - 440010',
    phone: '0712-2563344',
    email: 'ee.qc.pwdnagpur[at]maharashtra[dot]gov[dot]in',
  },
  {
    id: 'pwd-8',
    sNo: 8,
    department: 'pwd',
    zoneDepartment: 'PWD Rural Roads & PMGSY Connectivity Division',
    officerName: 'Shri Satish K. Kale, EE',
    designation: 'Executive Engineer (Rural Connectivity & Watershed Bridges)',
    address: 'Zilla Parishad Compound, Civil Lines, Nagpur - 440001',
    phone: '0712-2564455',
    email: 'ee.rural.pwd[at]maharashtra[dot]gov[dot]in',
  },
];

interface NodalOfficersDirectoryProps {
  initialDepartment?: DirectoryDepartment;
  onBackToHome: () => void;
  onNotify: (msg: string) => void;
}

export const NodalOfficersDirectory: React.FC<NodalOfficersDirectoryProps> = ({
  initialDepartment = 'nmc',
  onBackToHome,
  onNotify,
}) => {
  const [selectedDept, setSelectedDept] = useState<DirectoryDepartment>(initialDepartment);
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortField, setSortField] = useState<keyof NodalOfficerDirectoryEntry>('sNo');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Switch dataset
  const activeDataset = selectedDept === 'nmc' ? NMC_OFFICERS : PWD_OFFICERS;

  // Filtered entries
  const filteredEntries = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return activeDataset;

    return activeDataset.filter(
      (item) =>
        item.zoneDepartment.toLowerCase().includes(term) ||
        item.officerName.toLowerCase().includes(term) ||
        item.designation.toLowerCase().includes(term) ||
        item.address.toLowerCase().includes(term) ||
        item.phone.toLowerCase().includes(term) ||
        item.email.toLowerCase().includes(term)
    );
  }, [activeDataset, searchTerm]);

  // Sorted entries
  const sortedEntries = useMemo(() => {
    return [...filteredEntries].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }

      const strA = String(aVal).toLowerCase();
      const strB = String(bVal).toLowerCase();
      if (strA < strB) return sortOrder === 'asc' ? -1 : 1;
      if (strA > strB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredEntries, sortField, sortOrder]);

  // Pagination calculation
  const totalEntries = sortedEntries.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * entriesPerPage;
  const endIndex = Math.min(startIndex + entriesPerPage, totalEntries);
  const displayedEntries = sortedEntries.slice(startIndex, endIndex);

  const handleSort = (field: keyof NodalOfficerDirectoryEntry) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleCopy = (text: string, label: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    onNotify(`Copied ${label}: ${text}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportCSV = () => {
    const headers = ['S.No.', 'Zone / Department', 'Officer Name & Designation', 'Address', 'Phone', 'Email'];
    const rows = filteredEntries.map((e, idx) => [
      idx + 1,
      `"${e.zoneDepartment.replace(/"/g, '""')}"`,
      `"${e.officerName} - ${e.designation.replace(/"/g, '""')}"`,
      `"${e.address.replace(/"/g, '""')}"`,
      `"${e.phone}"`,
      `"${e.email}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Nodal_Officers_${selectedDept.toUpperCase()}_Nagpur.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onNotify(`Exported ${selectedDept.toUpperCase()} Nodal Officers Directory to CSV.`);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* ------------------------------------------------------------- */}
      {/* TOP NAVIGATION & DEPARTMENT TOGGLE BAR */}
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

          {/* Department Switcher Tabs */}
          <div className="inline-flex rounded-lg p-1 bg-gray-100 border border-gray-200">
            <button
              type="button"
              onClick={() => {
                setSelectedDept('nmc');
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                selectedDept === 'nmc'
                  ? 'bg-[#002B49] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
              }`}
            >
              <Building2 size={14} className={selectedDept === 'nmc' ? 'text-amber-300' : ''} />
              <span>NMC (Nagpur Municipal Corporation)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedDept('pwd');
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                selectedDept === 'pwd'
                  ? 'bg-[#002B49] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
              }`}
            >
              <HardHat size={14} className={selectedDept === 'pwd' ? 'text-amber-300' : ''} />
              <span>PWD Govt (Nagpur Division)</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold cursor-pointer shadow-2xs"
            title="Export Table as CSV"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-900 text-white text-xs font-semibold cursor-pointer shadow-2xs"
            title="Print Directory"
          >
            <Printer size={13} />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MAIN DIRECTORY CARD (Matching Screenshot 1 & 2 layout) */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
        {/* Header Title & Red Disclaimer */}
        <div className="p-4 sm:p-5 border-b border-gray-200 bg-white">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
            <div>
              <h1 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
                <span>List Of Nodal Public Grievance Officers</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200">
                  {selectedDept === 'nmc' ? 'NMC Nagpur (Zone-wise)' : 'PWD Nagpur Division'}
                </span>
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Official directory of designated grievance redressal authorities for citizen escalations in Nagpur region.
              </p>
            </div>

            {/* Red Disclaimer Banner matching screenshots */}
            <div className="text-xs font-semibold text-red-600 flex items-center gap-1.5 bg-red-50/80 px-3 py-1.5 rounded-lg border border-red-200/80 self-start lg:self-auto">
              <Info size={14} className="shrink-0 text-red-500" />
              <span>In Email, the words used in the square brackets may be replaced with respective symbols.</span>
            </div>
          </div>
        </div>

        {/* Table Controls (Entries selector + Search box) */}
        <div className="p-4 bg-gray-50/70 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          {/* Entries dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white border border-gray-300 rounded px-2.5 py-1 text-xs text-gray-800 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="text-gray-700 font-medium">entries per page</span>
          </div>

          {/* Search Box */}
          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <label htmlFor="directory-search" className="font-bold text-gray-700 shrink-0">
              Search:
            </label>
            <div className="relative flex-1 sm:w-64">
              <input
                id="directory-search"
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Zone, officer, address, phone..."
                className="w-full bg-white border border-gray-300 rounded px-3 py-1 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs pr-7"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 font-bold text-xs"
                >
                  &times;
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* TABLE COMPONENT (5 Columns matching images 1 & 2) */}
        {/* ========================================================= */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#e5e7eb] text-gray-800 border-b border-gray-300 font-bold">
                <th
                  onClick={() => handleSort('sNo')}
                  className="py-3 px-3 w-14 text-center cursor-pointer hover:bg-gray-300/80 transition-colors select-none"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>S.No.</span>
                    <ArrowUpDown size={11} className="opacity-60" />
                  </div>
                </th>

                <th
                  onClick={() => handleSort('zoneDepartment')}
                  className="py-3 px-4 cursor-pointer hover:bg-gray-300/80 transition-colors select-none min-w-[200px]"
                >
                  <div className="flex items-center gap-1">
                    <span>Zone / Sub-Division / Department</span>
                    <ArrowUpDown size={11} className="opacity-60" />
                  </div>
                </th>

                <th
                  onClick={() => handleSort('officerName')}
                  className="py-3 px-4 cursor-pointer hover:bg-gray-300/80 transition-colors select-none min-w-[220px]"
                >
                  <div className="flex items-center gap-1">
                    <span>Nodal Public Grievance Officer Name and Designation</span>
                    <ArrowUpDown size={11} className="opacity-60" />
                  </div>
                </th>

                <th
                  onClick={() => handleSort('address')}
                  className="py-3 px-4 cursor-pointer hover:bg-gray-300/80 transition-colors select-none min-w-[220px]"
                >
                  <div className="flex items-center gap-1">
                    <span>Address</span>
                    <ArrowUpDown size={11} className="opacity-60" />
                  </div>
                </th>

                <th className="py-3 px-4 min-w-[220px]">
                  <span>Phone No/Fax/Email</span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {displayedEntries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-500 italic bg-gray-50">
                    No nodal officers found matching &ldquo;{searchTerm}&rdquo; in {selectedDept.toUpperCase()} directory.
                  </td>
                </tr>
              ) : (
                displayedEntries.map((item, index) => {
                  const actualIndex = startIndex + index + 1;
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-blue-50/40 transition-colors group"
                    >
                      {/* S.No. */}
                      <td className="py-3 px-3 text-center font-bold text-gray-700 align-top">
                        {actualIndex}
                      </td>

                      {/* Zone / Sub-Division / Department */}
                      <td className="py-3 px-4 font-bold text-gray-900 align-top">
                        <div className="flex items-start gap-1.5">
                          <Building size={14} className="text-[#002B49] shrink-0 mt-0.5" />
                          <span>{item.zoneDepartment}</span>
                        </div>
                      </td>

                      {/* Nodal Officer Name & Designation */}
                      <td className="py-3 px-4 align-top">
                        <div className="font-bold text-gray-900 text-xs">
                          {item.officerName}
                        </div>
                        <div className="text-gray-600 text-[11px] mt-0.5">
                          {item.designation}
                        </div>
                      </td>

                      {/* Address */}
                      <td className="py-3 px-4 text-gray-700 leading-snug align-top">
                        <div className="flex items-start gap-1">
                          <MapPin size={13} className="text-red-600 shrink-0 mt-0.5" />
                          <span>{item.address}</span>
                        </div>
                      </td>

                      {/* Phone No / Fax / Email */}
                      <td className="py-3 px-4 align-top space-y-1 font-mono text-[11px]">
                        {/* Phone */}
                        <div className="flex items-center justify-between gap-1 text-gray-900 font-semibold bg-gray-50 px-2 py-1 rounded border border-gray-200/80">
                          <div className="flex items-center gap-1.5">
                            <Phone size={12} className="text-emerald-700 shrink-0" />
                            <a href={`tel:${item.phone}`} className="hover:text-blue-700 hover:underline">
                              {item.phone}
                            </a>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopy(item.phone, 'Phone Number', `phone-${item.id}`)}
                            className="text-gray-400 hover:text-gray-700 cursor-pointer p-0.5"
                            title="Copy Phone"
                          >
                            {copiedId === `phone-${item.id}` ? (
                              <Check size={12} className="text-emerald-600" />
                            ) : (
                              <Copy size={12} />
                            )}
                          </button>
                        </div>

                        {/* Email with [at] [dot] */}
                        <div className="flex items-center justify-between gap-1 text-blue-900 font-medium bg-blue-50/60 px-2 py-1 rounded border border-blue-200/70">
                          <div className="flex items-center gap-1.5 truncate">
                            <Mail size={12} className="text-blue-700 shrink-0" />
                            <span className="truncate" title={item.email}>
                              {item.email}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopy(item.email, 'Email Address', `email-${item.id}`)}
                            className="text-gray-400 hover:text-blue-700 cursor-pointer p-0.5 shrink-0"
                            title="Copy Email Address"
                          >
                            {copiedId === `email-${item.id}` ? (
                              <Check size={12} className="text-emerald-600" />
                            ) : (
                              <Copy size={12} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ========================================================= */}
        {/* BOTTOM PAGINATION BAR (Matching Screenshots 1 & 2) */}
        {/* ========================================================= */}
        <div className="p-4 bg-gray-50/80 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          {/* Status text: Showing 1 to 10 of 92 entries */}
          <div className="text-gray-600 font-medium">
            Showing {totalEntries === 0 ? 0 : startIndex + 1} to {endIndex} of {totalEntries} entries
          </div>

          {/* Pagination Controls: First, Prev, 1, 2, ..., Next, Last */}
          <div className="flex items-center gap-1 self-center sm:self-auto">
            {/* First */}
            <button
              type="button"
              disabled={safeCurrentPage === 1}
              onClick={() => setCurrentPage(1)}
              className="px-2.5 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-colors"
            >
              First
            </button>

            {/* Prev */}
            <button
              type="button"
              disabled={safeCurrentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-2.5 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-colors"
            >
              Prev
            </button>

            {/* Page number buttons */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => setCurrentPage(pageNum)}
                className={`w-7 h-7 rounded border text-xs font-bold transition-colors ${
                  safeCurrentPage === pageNum
                    ? 'bg-[#002B49] text-white border-[#002B49]'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
              >
                {pageNum}
              </button>
            ))}

            {/* Next */}
            <button
              type="button"
              disabled={safeCurrentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-2.5 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-colors"
            >
              Next
            </button>

            {/* Last */}
            <button
              type="button"
              disabled={safeCurrentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(totalPages)}
              className="px-2.5 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-colors"
            >
              Last
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
