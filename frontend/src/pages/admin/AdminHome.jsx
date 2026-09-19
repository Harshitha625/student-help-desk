import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  SlidersHorizontal, 
  Users, 
  MessageSquare, 
  FileCheck2, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ExternalLink, 
  Building2, 
  TrendingUp, 
  ShieldCheck, 
  Radio, 
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import StatusBadge, { PriorityBadge } from '../../components/StatusBadge';
import LoadingSkeleton from '../../components/LoadingSkeleton';

export default function AdminHome() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await adminService.getStats();
        setData(res);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <LoadingSkeleton count={3} />
      </div>
    );
  }

  const overview = data?.overview || {};
  const categories = data?.categories || [];
  const recentComplaints = data?.recent_complaints || [];
  const recentOutpasses = data?.recent_outpasses || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-dark via-brand-teal-dark to-brand-dark text-white border border-brand-teal/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-gold text-xs font-semibold backdrop-blur-xs border border-white/10">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Campus Control Center</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-4xl font-extrabold tracking-tight">
            Institutional Operations & Triage
          </h1>
          <p className="text-xs sm:text-sm text-brand-biscuit/80 max-w-xl">
            Live campus governance: complaints dispatch, hostel outpass oversight, and university service health analytics.
          </p>
        </div>

        {/* Quick Dual Admin Link & Broadcast Button */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/broadcast"
            className="px-4 py-2.5 rounded-xl bg-brand-gold hover:bg-brand-gold-hover text-brand-dark font-bold text-xs sm:text-sm shadow-sm transition-colors flex items-center gap-2"
          >
            <Radio className="w-4 h-4" />
            <span>Broadcast Alert</span>
          </Link>

          <a
            href="http://127.0.0.1:8000/admin/"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-colors flex items-center gap-1.5"
            title="Open native Django Admin panel"
          >
            <span>Django Admin</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* KPI Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-brand-border shadow-xs space-y-1">
          <div className="text-xs text-brand-muted font-medium flex items-center justify-between">
            <span>Enrolled Students</span>
            <Users className="w-4 h-4 text-brand-teal" />
          </div>
          <div className="text-2xl font-bold font-heading text-brand-dark">
            {overview.total_students || 0}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-brand-border shadow-xs space-y-1">
          <div className="text-xs text-brand-muted font-medium flex items-center justify-between">
            <span>Active Complaints</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold font-heading text-amber-700">
            {overview.active_complaints || 0}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-brand-border shadow-xs space-y-1">
          <div className="text-xs text-brand-muted font-medium flex items-center justify-between">
            <span>Pending Outpasses</span>
            <FileCheck2 className="w-4 h-4 text-brand-gold" />
          </div>
          <div className="text-2xl font-bold font-heading text-brand-dark">
            {overview.pending_outpasses || 0}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-brand-border shadow-xs space-y-1">
          <div className="text-xs text-brand-muted font-medium flex items-center justify-between">
            <span>Urgent Attention</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold font-heading text-rose-700">
            {overview.urgent_complaints || 0}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-brand-border shadow-xs space-y-1 col-span-2 lg:col-span-1">
          <div className="text-xs text-brand-muted font-medium flex items-center justify-between">
            <span>Resolution Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-heading text-emerald-700">
            {overview.resolution_rate || 0}%
          </div>
        </div>
      </div>

      {/* Analytics & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Breakdown Bar Chart */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-brand-border shadow-card-soft space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-heading font-bold text-base text-brand-dark">Complaints by Department</h3>
              <p className="text-xs text-brand-muted">Distribution of grievances across maintenance categories</p>
            </div>
            <Link to="/admin/reports" className="text-xs font-semibold text-brand-teal hover:underline">
              Detailed Reports →
            </Link>
          </div>

          <div className="space-y-3 pt-2">
            {categories.length === 0 ? (
              <p className="text-xs text-brand-muted italic">No complaint category data recorded yet.</p>
            ) : (
              categories.map((cat, idx) => {
                const total = overview.total_complaints || 1;
                const pct = Math.round((cat.count / total) * 100);
                return (
                  <div key={idx} className="space-y-1 text-xs">
                    <div className="flex justify-between font-medium">
                      <span className="text-brand-dark font-semibold">{cat.category}</span>
                      <span className="text-slate-500 font-mono">{cat.count} tickets ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-brand-teal h-full rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Quick Access Control Panels */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-brand-border shadow-card-soft space-y-4">
          <h3 className="font-heading font-bold text-base text-brand-dark pb-3 border-b border-slate-100">
            Quick Administrative Operations
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <Link
              to="/admin/complaints"
              className="p-4 rounded-2xl bg-brand-cream/60 border border-brand-border hover:border-brand-teal/40 hover:bg-white transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-brand-teal flex items-center justify-center mb-3">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-sm text-brand-dark group-hover:text-brand-teal transition-colors">
                Manage Complaints
              </h4>
              <p className="text-xs text-brand-muted mt-1">Assign technicians & update statuses</p>
            </Link>

            <Link
              to="/admin/outpasses"
              className="p-4 rounded-2xl bg-brand-cream/60 border border-brand-border hover:border-brand-teal/40 hover:bg-white transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-brand-gold flex items-center justify-center mb-3">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-sm text-brand-dark group-hover:text-brand-teal transition-colors">
                Manage Outpasses
              </h4>
              <p className="text-xs text-brand-muted mt-1">Audit gate passes & parent verification</p>
            </Link>

            <Link
              to="/admin/students"
              className="p-4 rounded-2xl bg-brand-cream/60 border border-brand-border hover:border-brand-teal/40 hover:bg-white transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-3">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-sm text-brand-dark group-hover:text-brand-teal transition-colors">
                Student Registry
              </h4>
              <p className="text-xs text-brand-muted mt-1">Roster, room history & account locks</p>
            </Link>

            <Link
              to="/admin/reports"
              className="p-4 rounded-2xl bg-brand-cream/60 border border-brand-border hover:border-brand-teal/40 hover:bg-white transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-sm text-brand-dark group-hover:text-brand-teal transition-colors">
                Analytics & Reports
              </h4>
              <p className="text-xs text-brand-muted mt-1">Hostel performance and export tools</p>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity Ticker */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Complaints */}
        <div className="p-6 rounded-3xl bg-white border border-brand-border shadow-card-soft space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-heading font-bold text-base text-brand-dark">
              Recent Complaint Influx
            </h3>
            <Link to="/admin/complaints" className="text-xs font-semibold text-brand-teal hover:underline">
              View All →
            </Link>
          </div>

          <div className="space-y-3">
            {recentComplaints.slice(0, 4).map((c) => (
              <Link
                key={c.id}
                to={`/admin/complaints/${c.id}`}
                className="p-3.5 rounded-2xl bg-slate-50/70 hover:bg-slate-100/70 border border-slate-200/60 transition-colors flex items-center justify-between gap-3 text-xs block"
              >
                <div className="space-y-0.5 truncate">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-brand-muted">#{c.id}</span>
                    <span className="font-semibold text-brand-dark truncate max-w-[200px]">{c.title}</span>
                  </div>
                  <span className="text-slate-500">{c.category} • {c.location}</span>
                </div>
                <StatusBadge status={c.status} size="xs" />
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Outpasses */}
        <div className="p-6 rounded-3xl bg-white border border-brand-border shadow-card-soft space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-heading font-bold text-base text-brand-dark">
              Recent Outpass Requests
            </h3>
            <Link to="/admin/outpasses" className="text-xs font-semibold text-brand-teal hover:underline">
              View All →
            </Link>
          </div>

          <div className="space-y-3">
            {recentOutpasses.slice(0, 4).map((o) => (
              <Link
                key={o.id}
                to={`/admin/outpasses/${o.id}`}
                className="p-3.5 rounded-2xl bg-slate-50/70 hover:bg-slate-100/70 border border-slate-200/60 transition-colors flex items-center justify-between gap-3 text-xs block"
              >
                <div className="space-y-0.5 truncate">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-brand-dark">{o.student_name}</span>
                    <span className="text-slate-400">→</span>
                    <span className="font-medium text-brand-teal truncate max-w-[150px]">{o.destination}</span>
                  </div>
                  <span className="text-slate-500">Parent: {o.verification_status}</span>
                </div>
                <StatusBadge status={o.status} size="xs" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
