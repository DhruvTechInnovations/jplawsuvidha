import React, { useState, useEffect, useMemo } from 'react';
import { FileText, Gavel, X } from 'lucide-react';
import { leadService } from '@/lib/api';
import HearingHistory from '@/components/Hearing_history';

// Mock data — used as fallback until the /clients API is live
// const MOCK_CLIENTS = [
//   {
//     id: 1,
//     name: 'Rajesh Kumar',
//     phone: '9876543210',
//     connected: true,
//     casetype: 'Civil',
//     status: 'In Progress',
//     assigned: 'Adv. Priya Sharma',
//     created_at: '2025-12-10T10:00:00Z',
//   },
//   {
//     id: 2,
//     name: 'Sunita Devi',
//     phone: '9123456780',
//     connected: false,
//     casetype: 'Criminal',
//     status: 'New',
//     assigned: 'Adv. Ravi Teja',
//     created_at: '2026-01-15T08:30:00Z',
//   },
//   {
//     id: 3,
//     name: 'Amit Patel',
//     phone: '9988776655',
//     connected: true,
//     casetype: 'Family',
//     status: 'Completed',
//     assigned: 'Adv. Sneha Patel',
//     created_at: '2026-02-20T14:00:00Z',
//   },
//   {
//     id: 4,
//     name: 'Meena Reddy',
//     phone: '9001122334',
//     connected: false,
//     casetype: 'Cyber Crime',
//     status: 'Declined',
//     assigned: null,
//     created_at: '2026-03-05T09:15:00Z',
//   },
//   {
//     id: 5,
//     name: 'Vijay Singh',
//     phone: '9345678901',
//     connected: true,
//     casetype: 'Property',
//     status: 'In Progress',
//     assigned: 'Adv. Karthik Varma',
//     created_at: '2026-04-12T11:45:00Z',
//   },
//   {
//     id: 6,
//     name: 'Lakshmi Narayan',
//     phone: '9567890123',
//     connected: true,
//     casetype: 'Corporate',
//     status: 'New',
//     assigned: 'Adv. Arjun Reddy',
//     created_at: '2026-05-01T16:00:00Z',
//   },
//   {
//     id: 7,
//     name: 'Deepak Sharma',
//     phone: '9234567890',
//     connected: false,
//     casetype: 'Labour',
//     status: 'In Progress',
//     assigned: null,
//     created_at: '2026-05-18T07:30:00Z',
//   },
//   {
//     id: 8,
//     name: 'Priya Joshi',
//     phone: '9876501234',
//     connected: true,
//     casetype: 'Civil',
//     status: 'Completed',
//     assigned: 'Adv. Ananya Gupta',
//     created_at: '2026-06-02T13:00:00Z',
//   },
// ];

const itemsPerPage = 15;

function CustomerTable({ clients = [] }) {
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClient, setSelectedClient] = useState(null);


  const sortedClients = useMemo(() => {
    return [...clients].sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }, [clients, sortOrder]);

  const totalPages = Math.ceil(clients.length / itemsPerPage);
  const paginatedClients = sortedClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const maskPhone = (phone) => {
    if (!phone) return '—';
    return phone.replace(/^(\d{4})\d{6}$/, '$1******');
  };


  return (
    <>
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden w-full mt-8">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/30">
        <h2 className="text-xl font-bold text-gray-800">Clients</h2>
        <p className="text-sm text-gray-500 mt-1">
          {clients.length} total client{clients.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-gray-50/50 text-gray-500 font-semibold tracking-wider border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Name</th>
                  <th className="px-6 py-4 font-medium whitespace-nowrap text-center">Phone</th>
                  <th className="px-6 py-4 font-medium whitespace-nowrap text-center">Connected</th>
                  <th className="px-6 py-4 font-medium whitespace-nowrap text-center">Case Type</th>
                  <th className="px-6 py-4 font-medium whitespace-nowrap text-center">Status</th>
                  <th className="px-6 py-4 font-medium whitespace-nowrap text-center">Details</th>
                  <th className="px-6 py-4 font-medium whitespace-nowrap text-center">Assigned To</th>
                  <th
                    className="px-6 py-4 font-medium whitespace-nowrap cursor-pointer select-none text-right hover:text-blue-600 transition-colors"
                    onClick={() => setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))}
                  >
                    <div className="flex items-center justify-end gap-1">
                      Date
                      <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginatedClients.map((client) => (
                  <tr key={client.id} className="bg-white hover:bg-blue-50/30 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-left">
                      <span className="font-semibold text-gray-900">{client.name}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {maskPhone(client.phone)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${client.connected
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                          }`}
                      >
                        {client.connected ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left">
                      <span className="text-gray-600">{client.casetype}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {client.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center bg-blue-50/50">
                      <button
                        onClick={() => setSelectedClient(client)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors p-2 rounded-full hover:bg-blue-100/50"
                      >
                        <FileText size={18} />
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-gray-500 text-xs">
                      {client.assigned ? (
                        <span className="bg-gray-100 px-2 py-1 rounded">{client.assigned}</span>
                      ) : (
                        <span className="text-gray-900">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-gray-500 tabular-nums">
                      {new Date(client.created_at).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-100 bg-gray-50/30 flex items-center justify-end">
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  Next
                </button>
              </div>
            </div>
          )}
    </div>

    {/* Hearing History Modal */}
    {selectedClient && (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">
        <div className="w-[90vw] max-w-[1200px] h-[85vh] overflow-hidden bg-white rounded-2xl shadow-2xl flex flex-col transform transition-all duration-300 scale-100">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Gavel size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Hearing History</h2>
                <p className="text-sm text-gray-500">{selectedClient.name} — {selectedClient.casetype || 'Case'}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedClient(null)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Main Content - Hearing History */}
          <div className="flex-1 overflow-y-auto bg-gray-50/50 p-6">
            <HearingHistory leadId={selectedClient.id} caseType={selectedClient.casetype} />
          </div>
        </div>
      </div>
    )}
  </>
  );
}

export default CustomerTable;
