import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  Search,
  Filter,
  Building2,
  MessageSquare,
  Paperclip,
  Clock,
  CheckCircle2,
  ChevronRight,
  ShieldOff
} from 'lucide-react';
import { complaintService } from '../../services/complaintService';
import { COMPLAINT_CATEGORIES, COMPLAINT_STATUSES } from '../../utils/constants';
import StatusBadge, { PriorityBadge } from '../../components/StatusBadge';
import LoadingSkeleton, { EmptyState } from '../../components/LoadingSkeleton';

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedStatus !== 'All') params.status = selectedStatus;

      const data = await complaintService.getComplaints(params);
      setComplaints(data.results || data || []);
    } catch (err) {
      console.error('Failed to fetch complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchComplaints();
    }, 250);
    return () => clearTimeout(delayDebounceFn);
  }, [search, selectedCategory, selectedStatus]);

  return (
    <div className="min-h-screen w-full bg-[#123c3a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">
              Campus Grievance & Maintenance Desk
            </h1>
            <p className="text-xs sm:text-sm text-white/70">
              Track your open complaints, dialogue with technicians, and review resolutions
            </p>
          </div>

          <Link
            to="/complaints/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-teal text-white text-xs sm:text-sm font-semibold hover:bg-brand-teal-dark shadow-sm transition-colors self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Lodge New Complaint</span>
          </Link>
        </div>

        {/* Filter and Search Controls */}
        <div className="p-4 rounded-2xl bg-[#123c3a] border border-white/20 shadow-xs flex flex-col md:flex-row gap-3">

          {/* Search */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, room number, or description..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-brand-border bg-white focus:ring-2 focus:ring-brand-teal outline-none text-[#123c3a]"
            />
          </div>

          {/* Category Filter */}
          <div className="w-full md:w-56">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-brand-border bg-white focus:ring-2 focus:ring-brand-teal outline-none text-[#123c3a]"
            >
              <option value="All">All Categories</option>
              {COMPLAINT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="w-full md:w-44">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-brand-border bg-white focus:ring-2 focus:ring-brand-teal outline-none text-[#123c3a]"
            >
              <option value="All">All Statuses</option>
              {COMPLAINT_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Complaints List */}
        {loading ? (
          <LoadingSkeleton count={4} />
        ) : complaints.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#123c3a] border border-white/20">
            <EmptyState
              title="No complaints found"
              message="There are no complaint tickets matching your selected filters or search query."
              actionLabel="Clear Filters & Refresh"
              onAction={() => {
                setSearch('');
                setSelectedCategory('All');
                setSelectedStatus('All');
              }}
              icon={CheckCircle2}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {complaints.map((item) => (
              <Link
                key={item.id}
                to={`/complaints/${item.id}`}
                className="p-5 rounded-2xl bg-[#123c3a] border border-white/20 hover:border-brand-teal/60 hover:shadow-card-hover transition-all flex flex-col justify-between group"
              >

                <div className="space-y-3">

                  {/* Complaint Header */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">

                      <span className="text-xs font-mono font-bold text-white/60">
                        #{item.id}
                      </span>

                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-white/10 border border-white/20 text-brand-teal">
                        {item.category}
                      </span>

                      <PriorityBadge priority={item.priority} />
                    </div>

                    <StatusBadge status={item.status} />
                  </div>

                  {/* Complaint Details */}
                  <div>
                    <h3 className="font-heading font-bold text-base text-white group-hover:text-brand-teal transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-xs text-white/70 line-clamp-2 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Location and Assignment */}
                  <div className="text-xs text-white/60 space-y-1">

                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-white/50 shrink-0" />
                      <span className="truncate">
                        {item.location}
                      </span>
                    </div>

                    {item.assigned_to && (
                      <div className="text-brand-teal font-medium">
                        Assigned: {item.assigned_to}
                      </div>
                    )}
                  </div>
                </div>

                {/* Complaint Footer */}
                <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs text-white/60">

                  <div className="flex items-center gap-3">

                    {item.anonymous && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-amber-300 font-medium">
                        <ShieldOff className="w-3 h-3" />
                        Anonymous
                      </span>
                    )}

                    {item.attachment && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-brand-teal font-medium">
                        <Paperclip className="w-3 h-3" />
                        Attachment
                      </span>
                    )}

                    {item.comments_count > 0 && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-white/60">
                        <MessageSquare className="w-3 h-3" />
                        {item.comments_count} remarks
                      </span>
                    )}

                  </div>

                  <span className="text-white/40 text-[11px]">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>

                </div>

              </Link>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}