import React, { useState, useEffect, useMemo } from 'react';
import { Menu, CircleUserRound, Inbox, Users, Settings, LogOut, FileText, MapPin, Gavel, Landmark, Tag, Hourglass, Calendar, CrossIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/LoginContext'
import CustomCalendar from '@/components/Calendar'
import { leadService, authService, profileService, } from '@/lib/api'
import DashboardBanner from '@/components/DashboardBanner'
import { X } from 'lucide-react';
import formatActivityTime from '@/lib/TimeFormat';
import { PhoneClickTracker } from '@/lib/PhoneClickTracker';

const ActivityItem = ({ act }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const showButton = act.activity_text && act.activity_text.length > 50;

  return (
    <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm transition-shadow hover:shadow-md flex flex-col gap-2 ">
      <div className={`text-gray-700 text-sm leading-relaxed break-words ${!isExpanded ? 'line-clamp-1' : ''}`}>
        {act.activity_text}
      </div>
      <div className="flex justify-between items-center w-full pt-2 border-t border-gray-50">
        {showButton ? (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 font-medium text-xs hover:text-blue-700 transition-colors focus:outline-none"
          >
            {isExpanded ? 'See Less' : 'See More'}
          </button>
        ) : <div />}
        <p className="text-xs text-gray-400 font-medium ml-auto">
          {formatActivityTime(act.created_at)}
        </p>
      </div>
    </div>
  );
};

function PersonalDashboard() {
  const [leads, setLeads] = useState([]);
  const [locationFilter, setLocationFilter] = useState('');
  const [courtFilter, setCourtFilter] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);
  const [profile, setProfile] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [visiblePhone, setVisiblePhone] = useState(null)
  const [casetype, setCaseType] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showmodal, setShowModal] = useState(false)
  const [disconnectInfo, setDisconnectInfo] = useState({})
  const [disconnectingPhone, setDisconnectingPhone] = useState(null);
  const [showYesModal, setShowYesModal] = useState(false)
  const [connectInfo, setConnectInfo] = useState({})
  const [currentPage, setCurrentPage] = useState(1);
  const [clickCount, setClickCount] = useState({})
  const [response, setResponse] = useState(false)
  const [password, setpassword] = useState(false)
  const [form, setForm] = useState({ current: '', newPass: '', confirm: '' });
  const { id: userid, name: username, accessToken } = useAuth()
  const [phone, setPhone] = useState({})
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [newActivityText, setNewActivityText] = useState('');
  const [activities, setActivities] = useState([]);
  const [isActivitiesLoading, setIsActivitiesLoading] = useState(false);
  //   console.log('user id is',userid)
  // console.log('login from context is ',login)
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.newPass !== form.confirm) {
      alert('Passwords do not match!');
      return;
    }
    // Call backend API or handler
    // console.log('Password changed:', form);
    setForm({
      current: "",
      newPass: "",
      confirm: "",
    });
    setpassword(false);
  };

  const itemsPerPage = 15;
  const navigate = useRouter()
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    const controller = new AbortController();

    const fetchLeads = async () => {
      setLoading(true);
      try {
        const data = await leadService.getLeads(controller.signal);
        console.log('getLeads call done', data)
        const { leads } = data
        if (leads && leads.length > 0) {
          setLeads(leads);
          setFetchError(null);
        } else {
          console.log('No leads found from API');
          setLeads([]);
          // Optional: set a subtle error/info message if no leads found
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setFetchError('Failed to load real-time leads/No leads assigned');
          console.error('Error fetching leads:', err);
          setLeads([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchLeads();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileService.getProfile();
        console.log('profile data', data)
        setProfile(data);
      } catch (err) {
        console.error("Failed to fetch profile in dashboard:", err);
      }
    };
    fetchProfile();
  }, []);




  useEffect(() => {
    localStorage.setItem('leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = ''; // Required for Chrome to show the confirmation dialog
    };

    if (visiblePhone && !response) {
      // alert("Please respond before navigating away.");
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [visiblePhone, response]);

  useEffect(() => {
    const handlePopState = (event) => {
      if (visiblePhone && !response) {
        alert("Kindly make a selection before moving forward. Please choose 'Yes' or 'No' ");
        // Push the same state back so the user stays on this page
        window.history.pushState(null, "", window.location.href);
      }
    };

    if (visiblePhone && !response) {
      // Push a new history entry so popstate will trigger on back
      window.history.pushState(null, "", window.location.href);
      window.addEventListener("popstate", handlePopState);
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [visiblePhone, response]);

  useEffect(() => {
    if (selectedLead) {
      const fetchActivities = async () => {
        setIsActivitiesLoading(true);
        try {
          const data = await leadService.getActivities(selectedLead.id);
          console.log('activiteis fetched', data.activities)
          setActivities(data.activities || []);
        } catch (err) {
          console.error("Failed to fetch activities:", err);
        } finally {
          setIsActivitiesLoading(false);
        }
      };
      fetchActivities();
    } else {
      setActivities([]);
      setIsActivitiesLoading(false);
      setIsAddingActivity(false);
      setNewActivityText('');
    }
  }, [selectedLead]);

  const locationOptions = useMemo(() => {
    const locations = leads.map(lead => lead.location);
    return Array.from(new Set(locations));
  }, [leads]);

  const courtOptions = useMemo(() => {
    console.log('inside court options')
    const courts = leads.map(lead => lead.court);
    return Array.from(new Set(courts));
  }, [leads]);

  const caseOptions = useMemo(() => {
    const caseTypes = leads.map(lead => lead.casetype)
    return Array.from(new Set(caseTypes))
  }, [leads])
  const statusOptions = useMemo(() => {
    const statustype = leads.map(lead => lead.status)
    return Array.from(new Set(statustype))
  }, [leads])

  // helper for updating lead status with optimistic UI and error handling
  const updateLeadStatus = async (leadId, isConnected, additionalData = {}) => {
    const originalLeads = [...leads];
    console.log('additionl details', additionalData)

    // Set up request tracking to prevent race conditions
    const requestId = Date.now();
    if (!window._pendingLeadUpdates) window._pendingLeadUpdates = {};
    window._pendingLeadUpdates[leadId] = requestId;

    // Optimistic Update
    setLeads(prev =>
      prev.map(lead =>
        lead.id === leadId
          ? { ...lead, connected: isConnected, ...additionalData }
          : lead
      )
    );

    try {
      const response = await leadService.updateLead(leadId, {
        connected: isConnected,
        ...additionalData
      });
      console.log('response from', response)
      // If a newer update has been initiated, do nothing
      if (window._pendingLeadUpdates[leadId] !== requestId) return;

      // Update state with actual backend response to ensure synchronization
      // Assuming response contains the updated lead or lead data
      if (response && (response.lead || typeof response === 'object')) {
        const updatedData = response.lead || response;
        setLeads(prev =>
          prev.map(lead =>
            lead.id === leadId
              ? { ...lead, ...updatedData }
              : lead
          )
        );
      }
    } catch (err) {
      console.error('Failed to update lead status:', err);
      // Only rollback if this was the latest request
      if (window._pendingLeadUpdates[leadId] === requestId) {
        setLeads(originalLeads);
        alert('Failed to save changes. Please check your connection and try again.');
      }
    }
  };

  // advocate yes click handling
  const handleYes = (lead, value) => {
    const decision = 'yes'
    setResponse(true)
    const phone = lead.phone;
    const updatedClicks = {
      ...clickCount[phone],
      [decision]: (clickCount[phone]?.[decision] || 0) + 1
    };
    // console.log('clickcout',clickCount)
    setClickCount(prev => ({
      ...prev,
      [phone]: updatedClicks
    }));

    setConnectInfo({
      leadId: lead.id,
      phone,
      clicks: updatedClicks
    });
    setShowYesModal(value)
    setVisiblePhone(null)
  }

  // advocate No click handling
  const handleNo = (lead, value) => {
    const decision = 'no';
    setResponse(true)
    const phone = lead.phone;

    const updatedClicks = {
      ...clickCount[phone],
      [decision]: (clickCount[phone]?.[decision] || 0) + 1
    };

    setClickCount(prev => ({
      ...prev,
      [phone]: updatedClicks
    }));
    setDisconnectInfo({
      leadId: lead.id,
      phone,
      clicks: updatedClicks
    });
    setShowModal(true);
    setVisiblePhone(null);
  };

  const filteredLeads = leads.filter(lead => {
    return (
      (locationFilter ? lead.location === locationFilter : true) &&
      (courtFilter ? lead.court === courtFilter : true) &&
      (casetype ? lead.casetype === casetype : true) &&
      (statusFilter ? lead.status === statusFilter : true)
    );
  });
  const sortedLeads = useMemo(() => {
    return [...filteredLeads].sort((a, b) => {
      const dateA = new Date(a.assigned_date);
      const dateB = new Date(b.assigned_date);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }, [filteredLeads, sortOrder]);

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const paginatedLeads = sortedLeads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  const maskPhone = (phone) => {
    return phone.replace(/^(\d{4})\d{6}$/, '$1******');
  }

  const handlePhoneClick = (lead) => {
    const phone = lead.phone;
    // increment count
    const storedCounts = JSON.parse(localStorage.getItem("phone_clicks") || "{}");
    const newCount = (storedCounts[phone] || 0) + 1;
    storedCounts[phone] = newCount;

    // update state and persist
    setClickCount((prev) => ({ ...prev, [phone]: newCount }));
    localStorage.setItem("phone_clicks", JSON.stringify(storedCounts));

    // console.log(`Phone ${phone} clicked ${newCount} times`);


    // show number modal
    setVisiblePhone(lead);
  };


  const handleProfile = () => {
    navigate.replace('/profile')
  }
  const handlechangePassword = () => {
    navigate.replace('/forgot-password')
  }
  const { logoutUser } = useAuth();
  const handlelogout = () => {
    logoutUser();
  }


  return (
    <div className="flex bg-gray-50 h-screen">
      {/* Sidebar */}
      <div className={`flex flex-col transition-all duration-200 ease-in-out ${sidebarOpen ? 'w-64' : 'w-16'} bg-white border-r min-h-screen shadow-md fixed z-20  `}>
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className={`text-lg font-semibold ${sidebarOpen ? 'block' : 'hidden'}`}>Dashboard</h2>
          <button onClick={() => setSidebarOpen(prev => !prev)} className="p-2 rounded hover:bg-gray-200">
            <Menu size={20} />
          </button>
        </div>
        <nav className="flex-1 px-2 py-4">
          <ul className="space-y-2">
            {/* Sidebar Menu Items */}
            {[
              { icon: <Inbox size={20} />, label: 'All Leads' },
              { icon: <Users size={20} />, label: 'My Clients' },
              { icon: <FileText size={20} />, label: 'Documents' },
            ].map(({ icon, label }, idx) => (
              <li key={idx} className="relative group flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer">
                {icon}
                {sidebarOpen && <span>{label}</span>}
                {!sidebarOpen && (
                  <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-gray-700 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap ">
                    {label}
                  </span>
                )}
              </li>
            ))}

            {/* Location Filter */}
            {/* <li className="relative group flex flex-col gap-1 p-2 rounded hover:bg-gray-100 cursor-pointer">
              <div className="flex items-center gap-2">
                <MapPin size={20} />
                {sidebarOpen && <span className="text-sm font-medium">Region</span>}
                {!sidebarOpen && (
                  <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-gray-700 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-90">
                    Region
                  </span>
                )}
              </div>
              {sidebarOpen && (
                <select
                  className="w-full mt-1 border border-gray-300 px-3 py-2 rounded text-sm bg-white"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                >
                  <option value="">All Locations</option>
                  {locationOptions.map((loc, idx) => (
                    <option key={idx} value={loc}>{loc}</option>
                  ))}
                </select>
              )}
            </li> */}

            {/* Court Filter */}
            <li className="relative group flex flex-col gap-1 p-2 rounded hover:bg-gray-100 cursor-pointer">
              <div className="flex items-center gap-2">
                <Landmark size={20} className="text-gray-600" />
                {sidebarOpen && <span className="text-sm font-medium">Jurisdiction</span>}
                {!sidebarOpen && (
                  <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-gray-700 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    Jurisdiction
                  </span>
                )}
              </div>
              {sidebarOpen && (
                <select
                  className="w-full mt-1 border border-gray-300 px-3 py-2 rounded text-sm bg-white"
                  value={courtFilter}
                  onChange={(e) => setCourtFilter(e.target.value)}
                >
                  <option value="">All Courts</option>
                  {courtOptions.map((court, idx) => (
                    <option key={idx} value={court}>{court}</option>
                  ))}
                </select>
              )}
            </li>

            {/* casetypefiler */}
            <li className="relative group flex flex-col gap-1 p-2 rounded hover:bg-gray-100 cursor-pointer">
              <div className="flex items-center gap-2">
                {/* <Gavel size={20} /> */}
                <Tag size={20} className="text-gray-600" />
                {sidebarOpen && <span className="text-sm font-medium">Case Type</span>}
                {!sidebarOpen && (
                  <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-gray-700 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Case Type
                  </span>
                )}
              </div>
              {sidebarOpen && (
                <select
                  className="w-full mt-1 border border-gray-300 px-3 py-2 rounded text-sm bg-white"
                  value={casetype}
                  onChange={(e) => setCaseType(e.target.value)}
                >
                  <option value="">All Cases</option>
                  {caseOptions.map((casetype, idx) => (
                    <option key={idx} value={casetype}>{casetype}</option>
                  ))}
                </select>
              )}
            </li>
            <li className="relative group flex flex-col gap-1 p-2 rounded hover:bg-gray-100 cursor-pointer">
              <div className="flex items-center gap-2">
                <Hourglass size={18} className="text-gray-600" />
                {sidebarOpen && <span className="text-sm font-medium">Status</span>}
                {!sidebarOpen && (
                  <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-gray-700 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Status
                  </span>
                )}
              </div>
              {sidebarOpen && (
                <select
                  className="w-full mt-1 border border-gray-300 px-3 py-2 rounded text-sm bg-white"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Status</option>
                  {statusOptions.map((status, idx) => (
                    <option key={idx} value={status}>{status}</option>
                  ))}
                </select>
              )}
            </li>
          </ul>

          <CustomCalendar value={sidebarOpen} />
          {/* <CalendarApp user={userid}/> */}

        </nav>
      </div>

      {/* Main Content */}
      <div
        className={`p-6 relative transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'
          } w-full`}
      >
        {/* Top Right Menu */}
        <div className="absolute top-4 right-6 z-20">
          <button
            onClick={() => setMenuOpen(prev => !prev)}
            className="w-10 h-10 rounded-full overflow-hidden border border-gray-300 hover:ring-2 hover:ring-blue-400"
          >
            <img
              src={profile?.profile_image}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white shadow-xl rounded-xl border overflow-hidden">
              <div className="p-4 border-b">
                <p className="font-semibold text-gray-800">{profile?.name || username || 'Advocate'}</p>
                <p className="text-sm text-gray-500">Advocate</p>
              </div>
              <ul className="py-2 text-sm text-gray-700">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <button className="w-full text-left text-gray-700 cursor-pointer hover:text-blue-600"

                    onClick={handleProfile}
                  >
                    Profile
                  </button>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <button className="w-full text-left text-gray-700 cursor-pointer hover:text-blue-600"
                    onClick={handlechangePassword}>
                    Change Password
                  </button>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <button className="w-full text-left text-gray-700 cursor-pointer hover:text-red-600"
                    onClick={handlelogout}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>

        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Personal Dashboard</h1>


        <DashboardBanner />
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden w-full">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="ml-4 text-gray-500 font-medium">Loading leads...</p>
            </div>
          ) : (
            <>
              {fetchError && (
                <div className="bg-orange-50 text-orange-700 p-4 m-4 rounded-lg text-center border border-orange-200">
                  {fetchError}
                </div>
              )}
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
                          Assigned Date
                          <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {paginatedLeads.map((lead) => (
                      <tr key={lead.id} className="bg-white hover:bg-blue-50/30 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap text-left">
                          <span className="font-semibold text-gray-900">{lead.name}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => {
                              handlePhoneClick(lead);
                              if (lead?.phone) {
                                PhoneClickTracker(lead.phone);
                              }
                            }}
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                          >
                            {maskPhone(lead.phone)}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${lead.connected
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : 'bg-red-50 text-red-700 border-red-200'
                              }`}
                          >
                            {lead.connected ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-left">
                          <span className="text-gray-600">{lead.casetype}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            {lead.status}
                          </span>
                          {/* <select
                            value={lead.status || ''}
                            onChange={(e) => {
                              leadService.addActivity(lead.id, e.target.value);
                            }}
                            className="px-2 py-1 text-xs font-medium border rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="New">New</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Declined">Declined</option>
                          </select> */}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center bg-blue-50/50">
                          <button
                            onClick={() => setSelectedLead(lead)}
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors p-2 rounded-full hover:bg-blue-100/50"
                          >
                            <FileText size={18} />
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-gray-500 text-xs">
                          {lead.assigned ? (
                            <span className="bg-gray-100 px-2 py-1 rounded">{lead.assigned}</span>
                          ) : (
                            <span className="text-gray-900">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-gray-500 tabular-nums">
                          {new Date(lead.created_at).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
            </>
          )}
        </div>

        {selectedLead && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">
            <div className="w-[700px] h-[80vh] overflow-hidden bg-white rounded-2xl shadow-2xl flex flex-col transform transition-all duration-300 scale-100">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <FileText size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Case Details</h2>
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Main Content Wrapper - Fixed Layout with specific internal scrolling */}
              <div className="flex-1 flex flex-col min-h-0 bg-gray-50/50 overflow-hidden">

                {/* Case Summary Section (Fixed at top) */}
                <div className="flex-none p-6 pb-2">
                  <div className="bg-white p-5 rounded-xl border border-gray-200/60 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                      Case Summary
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap max-h-32 overflow-y-auto custom-scrollbar">
                      {selectedLead.description || 'No description provided for this case.'}
                    </p>
                  </div>
                </div>

                {/* Activity Section (Takes remaining space) */}
                <div className="flex-1 flex flex-col min-h-0 px-6 pb-6">
                  <div className="flex items-center justify-between mb-4 flex-none">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      Activity Log

                    </h3>

                    {!isAddingActivity && (
                      <button
                        onClick={() => setIsAddingActivity(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-all shadow-sm active:scale-95"
                      >
                        <span>+ Add Note</span>
                      </button>
                    )}
                  </div>

                  {isAddingActivity && (
                    <div className="flex-none mb-4 bg-white p-4 rounded-xl border border-gray-200 shadow-md animate-in fade-in slide-in-from-top-2 duration-200">
                      <textarea
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                        rows={3}
                        placeholder="Type your activity note here..."
                        value={newActivityText}
                        onChange={(e) => setNewActivityText(e.target.value)}
                        autoFocus
                      />
                      <div className="flex justify-end gap-3 mt-3">
                        <button
                          className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                          onClick={() => {
                            setIsAddingActivity(false);
                            setNewActivityText('');
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm hover:shadow transition-all active:scale-95"
                          onClick={async () => {
                            if (!newActivityText.trim()) return;
                            try {
                              await leadService.addActivity(selectedLead.id, newActivityText);
                              setNewActivityText('');
                              setIsAddingActivity(false);
                              const data = await leadService.getActivities(selectedLead.id);
                              setActivities(data.activities || []);
                            } catch (e) {
                              console.error(e);
                              alert("Failed to add activity");
                            }
                          }}
                        >
                          Save Note
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Scrollable Activity List */}
                  <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar relative">
                    {isActivitiesLoading ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary border-blue-600"></div>
                      </div>
                    ) : (
                      <>
                        {activities.length > 0 ? (
                          activities.slice(0, 5).map((act, idx) => (
                            <ActivityItem key={idx} act={act} />
                          ))
                        ) : (
                          <div className="text-center py-8 bg-white rounded-xl border border-dashed border-gray-200">
                            <p className="text-sm text-gray-400">No activity recorded yet.</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {visiblePhone && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-[2px] bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[300px] text-center">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Phone Number</h3>
            <p className="text-xl text-gray-700">{visiblePhone.phone}</p>
            <div className='flex flex-col'>
              <span>Is Client Connected</span>
              <div className='flex items-center justify-center gap-2'>
                <button
                  onClick={() => handleYes(visiblePhone, true)}
                  className="mt-4 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded cursor-pointer"
                >
                  Yes
                </button>
                <button
                  onClick={() => handleNo(visiblePhone, false)}
                  className="mt-4 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded cursor-pointer"
                >
                  No
                </button>
                {/* <p className="mt-2 text-sm text-gray-500">
                  Yes: {clickCount[visiblePhone.phone]?.yes || 0} | No: {clickCount[visiblePhone.phone]?.no || 0}
                </p> */}
              </div>
            </div>
          </div>
        </div>
      )}


      {/* ADVOCATE NO HANDLING MODAL */}
      {showmodal && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-[2px] bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-[400px] p-6 rounded shadow-xl text-center relative">
            <h3 className="text-lg font-semibold text-red-700 mb-4">Why is the client not connected?</h3>

            <form className="flex flex-col items-start space-y-2">
              {['Wrong Number', 'No Response', 'Not Interested', 'Other'].map((reason, idx) => (
                <label key={idx} className="flex items-center gap-2 text-gray-700 ">
                  <input
                    type="radio"
                    name="disconnectReason"
                    value={reason}
                    className="accent-red-500 cursor-pointer"
                    onChange={(e) => {
                      setDisconnectInfo(prev => ({ ...prev, reason }))
                      // console.log('Selected reason:', e.target.value)
                      // console.log('selected', disconnectInfo)

                    }}
                  />
                  {reason}
                  {/* {console.log('selected 2',disconnectInfo)} */}
                </label>
              ))}
              <p>

                No: {clickCount[disconnectInfo.phone]?.no || 0}
              </p>
              {disconnectInfo.reason === 'Other' && (
                <textarea
                  placeholder="Please specify..."
                  className="border px-2 py-1 rounded w-full mt-2 text-sm"
                  value={disconnectInfo.notes}
                  onChange={(e) =>
                    setDisconnectInfo((prev) => ({ ...prev, notes: e.target.value }))
                  }
                />
              )}

            </form>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => {
                  if (!disconnectInfo.reason) {
                    alert("Please select a reason before submitting.");
                    return;
                  }
                  updateLeadStatus(disconnectInfo.leadId, false, {
                    reason: disconnectInfo.reason,
                    notes: disconnectInfo.notes,
                    status: 'Declined'
                  });
                  setShowModal(false);
                  // console.log('Disconnect Info', disconnectInfo)
                  localStorage.setItem('DisconnectInfo', JSON.stringify(disconnectInfo))
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}


      {/* ADVOCATE YES HANDLING MODAL */}
      {showYesModal && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-[2px]  bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-[400px] p-6 rounded shadow-xl text-center relative">
            <h3 className="text-lg font-semibold text-green-700 mb-4">
              Connection Details
            </h3>

            <form className="flex flex-col items-start space-y-2">
              {['Required Follow-Up', 'Converted to Business', 'Not Interested'].map((status, idx) => (
                <label key={idx} className="flex items-center gap-2 text-gray-700">
                  <input
                    type="radio"
                    name="connectStatus"
                    value={status}
                    className="accent-green-500 cursor-pointer"
                    onChange={(e) =>
                      setConnectInfo(prev => ({ ...prev, status: e.target.value }))
                    }
                  />
                  {status}
                </label>
              ))}
              <p className="mt-2 text-sm text-gray-500">
                Yes: {clickCount[connectInfo.phone]?.yes || 0}
              </p>
              <textarea
                placeholder="Additional notes (optional)..."
                className="border px-2 py-1 rounded w-full mt-2 text-sm"
                value={connectInfo.notes}
                onChange={(e) =>
                  setConnectInfo(prev => ({ ...prev, notes: e.target.value }))
                }
              />
            </form>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => {
                  if (!connectInfo.status) {
                    alert("Please select a status");
                    return;
                  }
                  const statusMap = {
                    'Converted to Business': 'Completed',
                    'Required Follow-Up': 'In Progress',
                    'Not Interested': 'Declined'
                  };
                  updateLeadStatus(connectInfo.leadId, true, {
                    reason: connectInfo.status,
                    notes: connectInfo.notes,
                    status: statusMap[connectInfo.status] || 'In Progress'
                  });
                  setShowYesModal(false);
                  // console.log('connect Info', connectInfo)
                  localStorage.setItem('connectInfo', JSON.stringify(connectInfo))
                }}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )
      }
      {/* {password && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg relative">
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="password"
                name="current"
                placeholder="Current Password"
                className="w-full px-4 py-2 border rounded-lg"
                value={form.current}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="newPass"
                placeholder="New Password"
                className="w-full px-4 py-2 border rounded-lg"
                value={form.newPass}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="confirm"
                placeholder="Confirm New Password"
                className="w-full px-4 py-2 border rounded-lg"
                value={form.confirm}
                onChange={handleChange}
                required
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 rounded-lg"
                  onClick={() => setpassword(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )} */}
      {/* <div className='absolute inset-0 z-40 bg-white'>

<CalendarApp/>
</div> */}
    </div>
  );

}

export default PersonalDashboard;
