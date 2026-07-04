'use client';
import React, { useState, useEffect, useMemo } from 'react';
import {
    Search,
    ChevronUp,
    ChevronDown,
    ChevronsUpDown,
    Calendar,
    ArrowLeft,
    ArrowRight,
    Loader2,
    Plus,
    X,
    Save,
    Edit2,
    AlertCircle,
    Clock
} from 'lucide-react';
import { leadService } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

// ─── Props ────────────────────────────────────────────────────
interface HearingHistoryProps {
    leadId: number | string;
    caseType?: string;
}

// ─── Sort Types ───────────────────────────────────────────────
type SortField = string;
type SortDirection = 'asc' | 'desc' | null;

// ─── Main Component ──────────────────────────────────────────
export default function HearingHistory({ leadId, caseType }: HearingHistoryProps) {
    const { toast } = useToast();
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [nextHearing, setNextHearing] = useState<any>(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [caseTypeFilter, setCaseTypeFilter] = useState<string>('All');
    const [sortField, setSortField] = useState<SortField>('created_at');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    const [currentPage, setCurrentPage] = useState(1);

    // New States for Expanding & Editing
    const [expandedRow, setExpandedRow] = useState<number | string | null>(null);
    const [isEditingRow, setIsEditingRow] = useState<number | string | null>(null);
    const [editPohText, setEditPohText] = useState<string>('');
    const [isSavingEdit, setIsSavingEdit] = useState(false);

    // New States for Adding
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [isSavingNew, setIsSavingNew] = useState(false);
    const [newHearing, setNewHearing] = useState({
        business_on_date: '',
        hearing_date: '',
        poh: '',
        poh_details: '',
        case_type: caseType || ''
    });

    const itemsPerPage = 10;

    // ─── Fetch activities from API ────────────────────────────
    useEffect(() => {
        if (!leadId) return;

        const controller = new AbortController();
        const fetchActivities = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await leadService.getActivities(leadId, controller.signal);
                setActivities(data.activities || []);
            } catch (err: any) {
                if (!controller.signal.aborted) {
                    console.error('Failed to fetch activities:', err);
                    setError('Failed to load hearing history');
                    setActivities([]);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        const fetchNextHearing = async () => {
            try {
                const res = await leadService.getNextHearingDate(leadId, controller.signal);
                setNextHearing(res);
            } catch (err) {
                console.error("Failed to fetch next hearing date", err);
            }
        };

        fetchActivities();
        fetchNextHearing();
        return () => controller.abort();
    }, [leadId]);

    // ─── Detect columns dynamically from all records ─────────
    const allKeys = useMemo(() => {
        const keys = new Set<string>();
        activities.forEach(act => Object.keys(act).forEach(k => keys.add(k)));
        // console.log('allKeys', allKeys);
        return Array.from(keys);
    }, [activities]);

    // Hide certain columns from main table view
    const skipKeys = ['id', 'lead_id', 'case_detail_id', 'updatedAt', 'updated_at', 'case_type', 'hearing_date', 'created_at'];
    const displayKeys = allKeys.filter((k) => !skipKeys.includes(k));
    console.log('displayKeys', displayKeys);

    // Helper to get case type safely
    const getCaseType = (act: any) => {
        let ct = act.case_type || act.casetype || act.caseType;
        if (ct && typeof ct === 'object') {
            ct = ct.name || ct.type || ct.title || JSON.stringify(ct);
        }
        return ct ? String(ct).trim() : '';
    };

    // ─── Filter ───────────────────────────────────────────────
    const uniqueCaseTypes = useMemo(() => {
        const types = new Set<string>();
        activities.forEach(act => {
            const ct = getCaseType(act);
            if (ct) types.add(ct);
        });
        return Array.from(types);
    }, [activities]);

    const filteredData = useMemo(() => {
        return activities.filter((act) => {
            if (caseTypeFilter !== 'All') {
                const ct = getCaseType(act);
                if (ct !== caseTypeFilter) {
                    return false;
                }
            }

            if (!searchQuery) return true;
            const q = searchQuery.toLowerCase();

            // Global Filter: search across all available keys in the record
            return allKeys.some(key => {
                const val = act[key];
                return val && String(val).toLowerCase().includes(q);
            });
        });
    }, [activities, searchQuery, allKeys, caseTypeFilter]);

    // ─── Sort ─────────────────────────────────────────────────
    const sortedData = useMemo(() => {
        if (!sortDirection) return filteredData;
        return [...filteredData].sort((a, b) => {
            const valA = a[sortField];
            const valB = b[sortField];

            let comparison = 0;
            if (sortField.includes('date') || sortField === 'created_at' || String(valA).match(/^\d{4}-\d{2}-\d{2}T/)) {
                const timeA = valA ? new Date(valA).getTime() : 0;
                const timeB = valB ? new Date(valB).getTime() : 0;
                comparison = timeA - timeB;
            } else {
                comparison = String(valA || '').localeCompare(String(valB || ''));
            }
            return sortDirection === 'asc' ? comparison : -comparison;
        });
    }, [filteredData, sortField, sortDirection]);

    // ─── Paginate ─────────────────────────────────────────────
    const totalPages = Math.ceil(sortedData.length / itemsPerPage) || 1;
    const paginatedData = sortedData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // ─── Sort handler ─────────────────────────────────────────
    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection((prev) =>
                prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc'
            );
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
        setCurrentPage(1);
    };

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field || !sortDirection) {
            return <ChevronsUpDown size={14} className="text-gray-300 ml-1 inline-block" />;
        }
        return sortDirection === 'asc' ? (
            <ChevronUp size={14} className="text-blue-600 ml-1 inline-block" />
        ) : (
            <ChevronDown size={14} className="text-blue-600 ml-1 inline-block" />
        );
    };

    // Helper to format key names nicely
    const formatKeyName = (key: string) => {
        if (key.toLowerCase() === 'poh') return 'Purpose of Hearing (POH)';
        return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    // Helper to format values
    const formatValue = (key: string, value: any) => {
        if (value === null || value === undefined) return '—';
        if (typeof value === 'object') return JSON.stringify(value);

        if (key.includes('date') || key === 'created_at' || String(value).match(/^\d{4}-\d{2}-\d{2}T/)) {
            try {
                return new Date(value).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                });
            } catch {
                return String(value);
            }
        }

        return String(value);
    };

    // ─── Handlers for Edit and Add ────────────────────────────
    const handleSaveEdit = async (activityId: number | string) => {
        setIsSavingEdit(true);
        try {
            // Optimistic UI update
            setActivities(prev => prev.map(act =>
                act.id === activityId
                    ? { ...act, poh_details: editPohText }
                    : act
            ));

            // Call the placeholder backend API you will create
            console.log("making call")
            await leadService.updateHearingActivity(activityId, {
                lead_id: leadId,
                poh_details: editPohText
            });
            console.log("call done")
            setIsEditingRow(null);
            toast({
                title: "Success",
                description: "Hearing details updated successfully."
            });
        } catch (err) {
            console.error('Failed to update POH details', err);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to update. Check console."
            });
        } finally {
            setIsSavingEdit(false);
        }
    };

    const handleAddNewHearing = async () => {
        setIsSavingNew(true);
        try {
            // Call the placeholder backend API you will create
            const res = await leadService.addHearingActivity(leadId, newHearing);
            console.log('new hearing is ', newHearing)

            // Optimistic UI update - prepend the new hearing
            const newAct = {
                id: res?.id || Math.random().toString(),
                ...newHearing,
                casetype: newHearing.case_type || undefined,
                created_at: new Date().toISOString(),
                case_detail_id: leadId
            };
            setActivities(prev => [newAct, ...prev]);

            // Reset form
            setIsAddingNew(false);
            setNewHearing({ business_on_date: '', hearing_date: '', poh: '', poh_details: '', case_type: caseType || '' });

            toast({
                title: "Success",
                description: "Hearing added successfully."
            });
        } catch (err) {
            console.error('Failed to add new hearing', err);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to add new hearing. Check console."
            });
        } finally {
            setIsSavingNew(false);
        }
    };

    const getPageNumbers = () => {
        const maxPagesToShow = 7;
        if (totalPages <= maxPagesToShow) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        let start = Math.max(1, currentPage - 3);
        let end = Math.min(totalPages, currentPage + 3);

        if (currentPage <= 4) {
            end = maxPagesToShow;
        } else if (currentPage >= totalPages - 3) {
            start = totalPages - maxPagesToShow + 1;
        }

        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    // ─── Loading state ────────────────────────────────────────
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 size={32} className="text-blue-600 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Loading hearing history...</p>
            </div>
        );
    }

    // ─── Error state ──────────────────────────────────────────
    if (error) {
        return (
            <div className="bg-red-50 text-red-700 p-6 rounded-xl text-center border border-red-200">
                <p className="font-medium">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-3 px-4 py-2 text-sm bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    // Helper to extract next hearing dates
    const getNextHearings = () => {
        if (!nextHearing) return [];

        let arr: any[] = [];
        if (nextHearing?.data && Array.isArray(nextHearing.data)) {
            arr = nextHearing.data;
        } else if (Array.isArray(nextHearing)) {
            arr = nextHearing;
        } else {
            arr = [nextHearing];
        }

        return arr.map((item: any) => {
            let dateVal = item.next_hearing || item.next_hearing_date || item.hearing_date || item.date || item;
            if (typeof dateVal === 'object' && dateVal !== null) {
                dateVal = Object.values(dateVal)[0];
            }

            let formattedDate = String(dateVal);
            if (dateVal && typeof dateVal === 'string') {
                try {
                    formattedDate = new Date(dateVal).toLocaleDateString('en-IN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                } catch {
                    // keep original string
                }
            }

            // Exclude invalid dates
            if (!dateVal || dateVal === 'undefined') return null;

            const cType = item.case_type || item.casetype || item.caseType || '';

            return {
                caseType: cType,
                dateStr: formattedDate,
                rawDate: dateVal
            };
        }).filter(Boolean);
    };

    const getDaysRemaining = (rawDate: any) => {
        if (!rawDate) return null;
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const targetDate = new Date(rawDate);
            targetDate.setHours(0, 0, 0, 0);
            const diffTime = targetDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays;
        } catch {
            return null;
        }
    };

    const nextHearingsList = getNextHearings();

    return (
        <div className="w-full">
            {/* Next Hearing Banner */}
            {nextHearingsList.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 mb-5 relative">
                    <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-3">
                        <div className="bg-gray-100 p-2 rounded-lg text-gray-600">
                            <Calendar size={20} />
                        </div>
                        <h3 className="text-base font-bold text-gray-900">Upcoming Hearings</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                        {nextHearingsList.map((h: any, i: number) => {
                            const daysRemaining = getDaysRemaining(h.rawDate);
                            const isWithin7Days = daysRemaining !== null && daysRemaining >= 0 && daysRemaining <= 7;

                            let remainingText = '';
                            if (daysRemaining !== null) {
                                if (daysRemaining === 0) {
                                    remainingText = 'Today';
                                } else if (daysRemaining === 1) {
                                    remainingText = 'Tomorrow';
                                } else if (daysRemaining < 0) {
                                    remainingText = 'Passed';
                                } else {
                                    remainingText = `In ${daysRemaining} days`;
                                }
                            }

                            return (
                                <div
                                    key={i}
                                    className={`flex flex-col gap-2.5 p-4 rounded-xl border transition-all ${isWithin7Days
                                        ? 'bg-red-50/60 border-red-200/70 hover:border-red-300 border-l-4 border-l-red-500'
                                        : 'bg-slate-50/50 border-slate-200/80 hover:border-slate-300 border-l-4 border-l-slate-400'
                                        }`}
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        {h.caseType && (
                                            <span
                                                className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ${isWithin7Days
                                                    ? 'bg-red-100 text-red-800 border border-red-200/40'
                                                    : 'bg-slate-200/70 text-slate-800 border border-slate-300/40'
                                                    }`}
                                            >
                                                {h.caseType}
                                            </span>
                                        )}
                                        {remainingText && (
                                            <span
                                                className={`text-xs font-bold flex items-center gap-1 ${isWithin7Days ? 'text-red-600' : 'text-slate-500'
                                                    }`}
                                            >
                                                {isWithin7Days ? <AlertCircle size={12} /> : <Clock size={12} />}
                                                {remainingText}
                                            </span>
                                        )}
                                    </div>
                                    <span
                                        className={`text-sm font-semibold leading-snug ${isWithin7Days ? 'text-red-900' : 'text-slate-800'
                                            }`}
                                    >
                                        {h.dateStr}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Top Bar with Search and Add Button */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-1 items-center gap-3 min-w-[220px] max-w-2xl">
                    <div className="relative flex-1">
                        <Search
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="Search activities & POH details..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all placeholder:text-gray-400"
                        />
                    </div>

                    {uniqueCaseTypes.length > 0 && (
                        <select
                            value={caseTypeFilter}
                            onChange={(e) => {
                                setCaseTypeFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 block px-3 py-2.5 transition-all min-w-[140px] cursor-pointer"
                        >
                            <option value="All">All Case Types</option>
                            {uniqueCaseTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-500">
                        <span className="font-semibold text-gray-700">{activities.length}</span> records
                    </div>
                    <button
                        onClick={() => setIsAddingNew(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm shadow-blue-200"
                    >
                        <Plus size={16} />
                        Add Hearing
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-auto h-[400px] relative">
                    <table className="w-full text-sm text-left">
                        <thead className="sticky top-0 z-20 shadow-sm bg-gray-50">
                            <tr className="bg-gradient-to-r from-gray-50 to-gray-50/50 border-b border-gray-200">
                                <th className="px-5 py-4 font-semibold text-xs uppercase tracking-wider text-gray-500 w-12 whitespace-nowrap">
                                    #
                                </th>
                                {displayKeys.length > 0 ? (
                                    displayKeys.map((key) => (
                                        <th
                                            key={key}
                                            className="px-5 py-4 font-semibold text-xs uppercase tracking-wider text-gray-500 cursor-pointer select-none hover:text-gray-700 transition-colors whitespace-nowrap"
                                            onClick={() => handleSort(key)}
                                        >
                                            <div className="flex items-center">
                                                {formatKeyName(key)}
                                                <SortIcon field={key} />
                                            </div>
                                        </th>
                                    ))
                                ) : (
                                    <th className="px-5 py-4 font-semibold text-xs uppercase tracking-wider text-gray-500">
                                        Data
                                    </th>
                                )}
                                {/* <th className="px-5 py-4 font-semibold text-xs uppercase tracking-wider text-gray-500 text-center w-16">
                                    Expand
                                </th> */}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {paginatedData.length > 0 ? (
                                paginatedData.map((act, idx) => {
                                    const globalIdx = (currentPage - 1) * itemsPerPage + idx;
                                    const rowKey = `${act.id || 'id'}-${act.created_at || 'time'}-${globalIdx}`;
                                    const isExpanded = expandedRow === rowKey;

                                    return (
                                        <React.Fragment key={rowKey}>
                                            <tr
                                                onClick={() => setExpandedRow(isExpanded ? null : rowKey)}
                                                className={`cursor-pointer transition-colors duration-150 ${isExpanded ? 'bg-blue-50/40' : 'bg-white hover:bg-gray-50/70'}`}
                                            >
                                                {/* Row number */}
                                                <td className="px-5 py-4 whitespace-nowrap text-xs font-medium text-gray-400">
                                                    {(currentPage - 1) * itemsPerPage + idx + 1}
                                                </td>

                                                {/* Dynamic Columns */}
                                                {displayKeys.length > 0 ? (
                                                    displayKeys.map((key) => (
                                                        <td key={key} className="px-5 py-4 text-gray-800 text-sm max-w-[300px]">
                                                            {key === 'poh_details' ? (
                                                                <div className="line-clamp-1 whitespace-normal break-words leading-relaxed text-gray-600" title={String(act[key] || '')}>
                                                                    {formatValue(key, act[key])}
                                                                </div>
                                                            ) : (
                                                                <div className="truncate" title={String(act[key] || '')}>
                                                                    {formatValue(key, act[key])}
                                                                </div>
                                                            )}
                                                        </td>
                                                    ))
                                                ) : (
                                                    <td className="px-5 py-4 text-gray-800 text-sm">
                                                        No columns available
                                                    </td>
                                                )}

                                                {/* Expand Arrow */}
                                                {/* <td className="px-5 py-4 text-center">
                                                    <button className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-blue-50">
                                                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                                    </button>
                                                </td> */}
                                            </tr>

                                            {/* EXPANDABLE ROW - POH DETAILS */}
                                            {isExpanded && (
                                                <tr className="bg-gradient-to-b from-blue-50/20 to-white">
                                                    <td colSpan={displayKeys.length + 2} className="px-0 py-0">
                                                        <div className="px-10 py-5 border-l-4 border-blue-500 ml-4 mb-2 mt-2 bg-white rounded-r-xl shadow-sm border border-gray-100/50">
                                                            <div className="flex items-center justify-between mb-3">
                                                                <div className="flex items-center gap-3">
                                                                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide">POH Details</h4>
                                                                    {act.created_at && (
                                                                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md border border-gray-200">
                                                                            Updated: {new Date(act.created_at).toLocaleDateString()}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                {isEditingRow !== rowKey && (
                                                                    <button
                                                                        onClick={() => {
                                                                            setIsEditingRow(rowKey);
                                                                            setEditPohText(act.poh_details || '');
                                                                        }}
                                                                        className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50 transition"
                                                                    >
                                                                        <Edit2 size={13} />
                                                                        Edit Details
                                                                    </button>
                                                                )}
                                                            </div>

                                                            {isEditingRow === rowKey ? (
                                                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                                                    <textarea
                                                                        value={editPohText}
                                                                        onChange={(e) => setEditPohText(e.target.value)}
                                                                        className="w-full bg-white border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all min-h-[100px]"
                                                                        placeholder="Enter POH Details here..."
                                                                    />
                                                                    <div className="flex justify-end gap-2 mt-3">
                                                                        <button
                                                                            onClick={() => setIsEditingRow(null)}
                                                                            className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 transition"
                                                                            disabled={isSavingEdit}
                                                                        >
                                                                            Cancel
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleSaveEdit(act.id)}
                                                                            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-blue-600 border border-transparent rounded hover:bg-blue-700 transition"
                                                                            disabled={isSavingEdit}
                                                                        >
                                                                            {isSavingEdit ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                                                                            Save Changes
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap bg-gray-50/50 p-4 rounded-lg border border-gray-100">
                                                                    {act.poh_details || <span className="text-gray-400 italic">No POH details available for this hearing.</span>}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={displayKeys.length + 2}>
                                        <div className="flex flex-col items-center justify-center py-16">
                                            <div className="p-4 bg-gray-100 rounded-full mb-4">
                                                <Calendar size={32} className="text-gray-400" />
                                            </div>
                                            <p className="text-gray-500 font-medium">
                                                No activity records found
                                            </p>
                                            <p className="text-gray-400 text-sm mt-1">
                                                {searchQuery
                                                    ? 'Try adjusting your search'
                                                    : 'No activities have been recorded for this lead yet'}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                {sortedData.length > 0 && totalPages > 1 && (
                    <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/40 flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            Showing{' '}
                            <span className="font-semibold text-gray-700">
                                {(currentPage - 1) * itemsPerPage + 1}
                            </span>
                            –
                            <span className="font-semibold text-gray-700">
                                {Math.min(currentPage * itemsPerPage, sortedData.length)}
                            </span>{' '}
                            of{' '}
                            <span className="font-semibold text-gray-700">
                                {sortedData.length}
                            </span>{' '}
                            records
                        </p>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                disabled={currentPage === 1}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
                            >
                                <ArrowLeft size={14} />
                                Previous
                            </button>

                            <div className="hidden sm:flex items-center gap-1">
                                {getPageNumbers().map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`w-9 h-9 text-sm font-medium rounded-lg transition-all ${currentPage === page
                                            ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                                            : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
                            >
                                Next
                                <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ADD HEARING MODAL */}
            {isAddingNew && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <h3 className="text-lg font-bold text-gray-900">Add New Hearing</h3>
                            <button
                                onClick={() => setIsAddingNew(false)}
                                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-200 transition"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Case Type — show lead's case type and/or dropdown from existing types */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Case Type</label>
                                {uniqueCaseTypes.length > 0 ? (
                                    <select
                                        value={newHearing.case_type}
                                        onChange={(e) => setNewHearing({ ...newHearing, case_type: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition bg-white cursor-pointer appearance-none"
                                    >
                                        <option value="">Select Case Type</option>
                                        {/* Include the lead's caseType if not already in the list */}
                                        {caseType && !uniqueCaseTypes.includes(caseType) && (
                                            <option key={caseType} value={caseType}>{caseType}</option>
                                        )}
                                        {uniqueCaseTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                ) : caseType ? (
                                    <input
                                        type="text"
                                        value={caseType}
                                        readOnly
                                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm bg-gray-50 text-gray-700 outline-none cursor-default"
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        value={newHearing.case_type}
                                        onChange={(e) => setNewHearing({ ...newHearing, case_type: e.target.value })}
                                        placeholder="Enter case type"
                                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                                    />
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Business On Date</label>
                                    <input
                                        type="date"
                                        value={newHearing.business_on_date}
                                        onChange={(e) => setNewHearing({ ...newHearing, business_on_date: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Hearing Date</label>
                                    <input
                                        type="date"
                                        value={newHearing.hearing_date}
                                        onChange={(e) => setNewHearing({ ...newHearing, hearing_date: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Purpose of Hearing (POH)</label>
                                <input
                                    type="text"
                                    value={newHearing.poh}
                                    onChange={(e) => setNewHearing({ ...newHearing, poh: e.target.value })}
                                    placeholder="e.g. Cross Examination"
                                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">POH Details</label>
                                <textarea
                                    value={newHearing.poh_details}
                                    onChange={(e) => setNewHearing({ ...newHearing, poh_details: e.target.value })}
                                    placeholder="Provide detailed notes about the hearing purpose..."
                                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition min-h-[120px]"
                                />
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3">
                            <button
                                onClick={() => setIsAddingNew(false)}
                                className="px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddNewHearing}
                                disabled={isSavingNew}
                                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm disabled:opacity-70"
                            >
                                {isSavingNew ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                Save Hearing
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
