import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  PhoneCall, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  ChevronRight,
  Users
} from 'lucide-react';
import { outpassService } from '../../services/outpassService';
import { OUTPASS_STATUSES } from '../../utils/constants';
import StatusBadge from '../../components/StatusBadge';
import LoadingSkeleton, { EmptyState } from '../../components/LoadingSkeleton';

export default function OutpassRequests() {
  const [outpasses, setOutpasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const fetchOutpasses = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (selectedStatus !== 'All') params.status = selectedStatus;

      const data = await outpassService.getOutpasses(params);
      setOutpasses(data.results || data || []);
    } catch (err) {
      console.error('Failed to load warden outpass requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchOutpasses();
    }, 250);
    return () => clearTimeout(delayDebounce);
  }, [search, selectedStatus]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-brand-dark">
          Hostel Outpass Verification & Approval Desk
        </h1>
        <p className="text-xs sm:text-sm text-brand-muted">
          Review student gate passes, log guardian phone verifications, and grant exit permissions
        </p>
      </div>

      {/* Search & Status Tabs */}
      <div className="p-4 rounded-2xl bg-white border border-brand-border shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student name, roll number, destination..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-brand-border bg-slate-50/50 focus:ring-2 focus:ring-brand-teal outline-none"
            />
          </div>

          <div className="w-full sm:w-56">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-brand-border bg-slate-50/50 focus:ring-2 focus:ring-brand-teal outline-none text-slate-700"
            >
              <option value="All">All Statuses</option>
              {OUTPASS_STATUSES.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Request Table / Cards */}
      {loading ? (
        <LoadingSkeleton count={4} />
      ) : outpasses.length === 0 ? (
        <EmptyState
          title="No outpass requests found"
          message="No student outpass records match your current filter settings."
          actionLabel="Reset Filters"
          onAction={() => {
            setSearch('');
            setSelectedStatus('All');
          }}
          icon={ShieldCheck}
        />
      ) : (
        <div className="space-y-3">
          {outpasses.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white border border-brand-border hover:border-brand-teal/40 hover:shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-bold text-brand-muted">Pass #{item.id}</span>
                  <span className="text-sm font-bold text-brand-dark">{item.student_name}</span>
                  {item.student_roll && (
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-brand-cream border border-brand-border text-brand-teal font-semibold">
                      {item.student_roll}
                    </span>
                  )}
                  <span className="text-xs text-brand-muted">
                    {item.student_hostel || 'Hostel'} {item.student_room ? `• Room ${item.student_room}` : ''}
                  </span>
                  <StatusBadge status={item.status} size="xs" />
                </div>

                <div className="text-xs sm:text-sm text-slate-700 font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-teal shrink-0" />
                  <span>Destination: <strong>{item.destination}</strong></span>
                  <span className="text-slate-400 font-normal">— {item.reason}</span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                  <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
                    <PhoneCall className="w-3.5 h-3.5 text-brand-gold" />
                    Guardian: <strong>{item.parent_name}</strong> ({item.parent_contact})
                  </span>
                  <span className="flex items-center gap-1 text-emerald-700 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verification: {item.verification_status}
                  </span>
                  <span className="text-slate-500">
                    {new Date(item.from_date).toLocaleDateString()} to {new Date(item.to_date).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <Link
                  to={`/warden/outpasses/${item.id}`}
                  className="px-4 py-2 rounded-xl bg-brand-teal hover:bg-brand-teal-dark text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1"
                >
                  <span>Inspect & Review</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
