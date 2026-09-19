import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileCheck2, 
  Search, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  ChevronRight, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';
import { outpassService } from '../../services/outpassService';
import { OUTPASS_STATUSES } from '../../utils/constants';
import StatusBadge from '../../components/StatusBadge';
import LoadingSkeleton, { EmptyState } from '../../components/LoadingSkeleton';

export default function Outpasses() {
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
      console.error('Failed to load outpasses:', err);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-brand-dark">
            Residential Outpass Portal
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted">
            Digital permission requests for home travel, hackathons, and medical visits
          </p>
        </div>

        <Link
          to="/outpasses/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-gold hover:bg-brand-gold-hover text-brand-dark text-xs sm:text-sm font-bold shadow-sm transition-colors self-start sm:self-auto"
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Apply for Outpass</span>
        </Link>
      </div>

      {/* Search & Filter */}
      <div className="p-4 rounded-2xl bg-white border border-brand-border/80 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by destination or reason..."
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

      {/* Outpasses List */}
      {loading ? (
        <LoadingSkeleton count={3} />
      ) : outpasses.length === 0 ? (
        <EmptyState
          title="No outpasses found"
          message="You currently have no outpass applications registered under this filter."
          actionLabel="Apply for New Outpass"
          onAction={() => window.location.href = '/outpasses/create'}
          icon={Calendar}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {outpasses.map((item) => (
            <Link
              key={item.id}
              to={`/outpasses/${item.id}`}
              className="p-5 rounded-2xl bg-white border border-brand-border/80 hover:border-brand-teal/40 hover:shadow-card-hover transition-all flex flex-col justify-between group space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-brand-muted">Outpass #{item.id}</span>
                  <StatusBadge status={item.status} />
                </div>

                <div>
                  <h3 className="font-heading font-bold text-base text-brand-dark group-hover:text-brand-teal transition-colors flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-brand-teal shrink-0" />
                    <span>{item.destination}</span>
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                    {item.reason}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-brand-cream/60 border border-brand-border/60 text-xs space-y-1">
                  <div className="flex justify-between text-slate-600">
                    <span>Departure:</span>
                    <span className="font-semibold text-brand-dark">
                      {new Date(item.from_date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Return:</span>
                    <span className="font-semibold text-brand-dark">
                      {new Date(item.to_date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Parent: {item.verification_status}
                </span>

                <span className="text-brand-teal font-semibold flex items-center gap-1">
                  <span>Track Status</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
