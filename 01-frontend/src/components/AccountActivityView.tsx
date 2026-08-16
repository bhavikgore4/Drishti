import React, { useState } from 'react';
import { ArrowLeft, History, Search, X, ArrowUpDown, Shield } from 'lucide-react';

export interface AuditEntry {
  id: string;
  loginId: string;
  actionDateTime: string;
  actionName: string;
  ipAddress: string;
}

interface AccountActivityViewProps {
  entries?: AuditEntry[];
  onBack: () => void;
}

export const AccountActivityView: React.FC<AccountActivityViewProps> = ({
  entries = [
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
  ],
  onBack,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof AuditEntry>('actionDateTime');
  const [sortAsc, setSortAsc] = useState(false);

  // Filter entries based on search
  const filteredEntries = entries.filter((entry) => {
    const term = searchTerm.toLowerCase();
    return (
      entry.loginId.toLowerCase().includes(term) ||
      entry.actionDateTime.toLowerCase().includes(term) ||
      entry.actionName.toLowerCase().includes(term) ||
      entry.ipAddress.toLowerCase().includes(term)
    );
  });

  // Sort entries
  const sortedEntries = [...filteredEntries].sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  // Pagination calculation
  const totalEntries = sortedEntries.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / entriesPerPage));
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedEntries = sortedEntries.slice(startIndex, startIndex + entriesPerPage);

  const handleSort = (field: keyof AuditEntry) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 animate-in fade-in duration-200">
      {/* Top Header Row with Title and Back Button on Right */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-4">
        <h1 className="text-lg sm:text-xl font-bold text-gray-900">Account Activity</h1>
        <button
          type="button"
          onClick={onBack}
          className="bg-[#5A6268] hover:bg-[#4E555B] text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <ArrowLeft size={13} />
          <span>Back To Home Page</span>
        </button>
      </div>

      {/* Controls: Show Entries Dropdown + Search Box */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-700">
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <select
            value={entriesPerPage}
            onChange={(e) => {
              setEntriesPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded px-2 py-1 bg-white text-xs text-gray-800 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>entries</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto self-end sm:self-auto">
          <label className="font-semibold shrink-0">Search:</label>
          <div className="relative w-full sm:w-56">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs text-gray-800 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
            />
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

      {/* Audit Table */}
      <div className="mt-4 border border-gray-200 rounded overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#E9ECEF] text-gray-800 font-bold border-b border-gray-300">
              <th
                onClick={() => handleSort('loginId')}
                className="py-2.5 px-4 cursor-pointer select-none hover:bg-gray-300/60 transition-colors"
              >
                <div className="flex items-center justify-between gap-1">
                  <span>Login Id</span>
                  <ArrowUpDown size={12} className="text-gray-500" />
                </div>
              </th>
              <th
                onClick={() => handleSort('actionDateTime')}
                className="py-2.5 px-4 cursor-pointer select-none hover:bg-gray-300/60 transition-colors"
              >
                <div className="flex items-center justify-between gap-1">
                  <span>Action Date &amp; Time</span>
                  <ArrowUpDown size={12} className="text-gray-500" />
                </div>
              </th>
              <th
                onClick={() => handleSort('actionName')}
                className="py-2.5 px-4 cursor-pointer select-none hover:bg-gray-300/60 transition-colors"
              >
                <div className="flex items-center justify-between gap-1">
                  <span>Action Name</span>
                  <ArrowUpDown size={12} className="text-gray-500" />
                </div>
              </th>
              <th
                onClick={() => handleSort('ipAddress')}
                className="py-2.5 px-4 cursor-pointer select-none hover:bg-gray-300/60 transition-colors"
              >
                <div className="flex items-center justify-between gap-1">
                  <span>IP Address</span>
                  <ArrowUpDown size={12} className="text-gray-500" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedEntries.length > 0 ? (
              paginatedEntries.map((row) => (
                <tr key={row.id} className="hover:bg-blue-50/40 transition-colors">
                  <td className="py-2.5 px-4 font-semibold text-gray-800">{row.loginId}</td>
                  <td className="py-2.5 px-4 text-gray-700 whitespace-nowrap">{row.actionDateTime}</td>
                  <td className="py-2.5 px-4">
                    <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 text-gray-800 border border-gray-300">
                      {row.actionName}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 font-mono text-gray-600">{row.ipAddress}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-500">
                  No activity records match your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
        <div>
          {totalEntries > 0 ? (
            <span>
              Showing {startIndex + 1} to {Math.min(startIndex + entriesPerPage, totalEntries)} of{' '}
              {totalEntries} entries
            </span>
          ) : (
            <span>Showing 0 to 0 of 0 entries</span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className={`px-2.5 py-1 border border-gray-300 rounded text-xs font-medium ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 cursor-pointer'
            }`}
          >
            First
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`px-2.5 py-1 border border-gray-300 rounded text-xs font-medium ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 cursor-pointer'
            }`}
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`px-3 py-1 border rounded text-xs font-bold ${
                currentPage === pageNum
                  ? 'border-[#002B49] bg-[#002B49] text-white'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 cursor-pointer'
              }`}
            >
              {pageNum}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`px-2.5 py-1 border border-gray-300 rounded text-xs font-medium ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 cursor-pointer'
            }`}
          >
            Next
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className={`px-2.5 py-1 border border-gray-300 rounded text-xs font-medium ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 cursor-pointer'
            }`}
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
};
