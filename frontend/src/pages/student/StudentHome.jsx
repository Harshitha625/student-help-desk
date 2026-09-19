import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  PlusCircle, 
  FileCheck2, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  AlertCircle, 
  Building2, 
  Bell, 
  Compass, 
  Calendar, 
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { complaintService } from '../../services/complaintService';
import { outpassService } from '../../services/outpassService';
import StatusBadge, { PriorityBadge } from '../../components/StatusBadge';
import LoadingSkeleton from '../../components/LoadingSkeleton';

export default function StudentHome() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [outpasses, setOutpasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [complaintsData, outpassesData] = await Promise.all([
          complaintService.getComplaints(),
          outpassService.getOutpasses(),
        ]);
        setComplaints(complaintsData.results || complaintsData || []);
        setOutpasses(outpassesData.results || outpassesData || []);
      } catch (err) {
        console.error('Failed to load student dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const activeComplaints = complaints.filter(
    (c) => c.status === 'Pending' || c.status === 'Assigned' || c.status === 'In Progress'
  );
  const activeOutpass = outpasses.find(
    (o) => o.status !== 'Completed' && o.status !== 'Rejected'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* ===================== PERSONALIZED HEADER BANNER ===================== */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-teal-dark via-brand-dark to-brand-teal-dark text-white border border-brand-teal/30 shadow-lg overflow-hidden"
      >
        <div className="absolute right-0 top-0 -mr-12 -mt-12 w-64 h-64 bg-brand-teal/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-48 h-48 bg-brand-gold/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-biscuit text-xs font-semibold backdrop-blur-xs border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
              <span>Campus Service Hub</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-4xl font-extrabold tracking-tight">
              {getGreeting()}, {user?.first_name || user?.username}!
            </h1>
            <p className="text-xs sm:text-sm text-brand-biscuit/80 max-w-xl">
              {user?.student_profile?.hostel ? (
                <span>
                  Resident at <strong>{user.student_profile.hostel}</strong>
                  {user.student_profile.room_number ? ` • Room ${user.student_profile.room_number}` : ''}
                </span>
              ) : (
                'Welcome to your personal campus grievance & outpass center.'
              )}
            </p>
          </div>

          {/* Direct CTA Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/complaints/create"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-gold hover:bg-brand-gold-hover text-brand-dark text-xs sm:text-sm font-bold shadow-sm transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Raise Complaint</span>
            </Link>
            <Link
              to="/outpasses/create"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-semibold border border-white/20 transition-colors"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Apply for Outpass</span>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* ===================== ACTIVE STATUS HORIZONTAL STRIP ===================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Active Complaint Status */}
        <div className="p-5 rounded-2xl bg-white border border-brand-border/80 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-teal-50 text-brand-teal">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-brand-muted font-medium">Active Complaints</div>
              <div className="text-xl font-bold font-heading text-brand-dark">
                {activeComplaints.length} {activeComplaints.length === 1 ? 'ticket' : 'tickets'}
              </div>
            </div>
          </div>
          <Link
            to="/complaints"
            className="text-xs font-semibold text-brand-teal hover:underline flex items-center gap-1"
          >
            <span>View all</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Current Outpass Status */}
        <div className="p-5 rounded-2xl bg-white border border-brand-border/80 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-amber-50 text-brand-gold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-brand-muted font-medium">Current Outpass</div>
              <div className="text-sm font-bold text-brand-dark">
                {activeOutpass ? (
                  <span className="flex items-center gap-1.5 mt-0.5">
                    <span className="truncate max-w-[110px]">{activeOutpass.destination}</span>
                    <StatusBadge status={activeOutpass.status} size="xs" />
                  </span>
                ) : (
                  <span className="text-slate-500 font-normal">No active outpass</span>
                )}
              </div>
            </div>
          </div>
          <Link
            to={activeOutpass ? `/outpasses/${activeOutpass.id}` : '/outpasses'}
            className="text-xs font-semibold text-brand-teal hover:underline flex items-center gap-1"
          >
            <span>Details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Resolved Total */}
        <div className="p-5 rounded-2xl bg-white border border-brand-border/80 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-brand-muted font-medium">Resolved Total</div>
              <div className="text-xl font-bold font-heading text-brand-dark">
                {complaints.filter((c) => c.status === 'Resolved').length} resolved
              </div>
            </div>
          </div>
          <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            100% Tracked
          </span>
        </div>
      </div>

      {/* ===================== ACTIVE COMPLAINTS TIMELINE VIEW ===================== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-lg font-bold text-brand-dark">
              Active Complaints & Service Requests
            </h2>
            <p className="text-xs text-brand-muted">
              Live status updates on open residential and campus tickets
            </p>
          </div>

          <Link
            to="/complaints"
            className="text-xs font-semibold text-brand-teal hover:text-brand-teal-dark flex items-center gap-1"
          >
            <span>Full Complaint List</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <LoadingSkeleton count={2} />
        ) : activeComplaints.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white border border-brand-border/80 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-teal-50 text-brand-teal flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-semibold text-sm text-brand-dark">No Active Complaints</h3>
            <p className="text-xs text-brand-muted max-w-sm mx-auto">
              Everything in your room and hostel is running smoothly. Need maintenance or IT support?
            </p>
            <Link
              to="/complaints/create"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-teal text-white text-xs font-semibold hover:bg-brand-teal-dark transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Lodge a Request</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {activeComplaints.slice(0, 3).map((item) => (
              <Link
                key={item.id}
                to={`/complaints/${item.id}`}
                className="block p-5 rounded-2xl bg-white border border-brand-border/80 hover:border-brand-teal/40 hover:shadow-xs transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-brand-muted">#{item.id}</span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-brand-cream border border-brand-border text-brand-teal">
                      {item.category}
                    </span>
                    <PriorityBadge priority={item.priority} />
                  </div>
                  <StatusBadge status={item.status} />
                </div>

                <h3 className="font-heading font-bold text-base text-brand-dark mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                  {item.description}
                </p>

                <div className="flex flex-wrap items-center justify-between text-xs text-brand-muted pt-2 border-t border-slate-100 gap-2">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.location}</span>
                  </span>

                  {item.assigned_to && (
                    <span className="text-brand-teal font-medium">
                      Assigned: {item.assigned_to}
                    </span>
                  )}

                  <span>
                    Filed {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ===================== OUTPASS SNAPSHOT ===================== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-lg font-bold text-brand-dark">
              Residential Outpass Applications
            </h2>
            <p className="text-xs text-brand-muted">
              Weekend home visits, academic hackathons & emergency permissions
            </p>
          </div>

          <Link
            to="/outpasses"
            className="text-xs font-semibold text-brand-teal hover:text-brand-teal-dark flex items-center gap-1"
          >
            <span>View All Outpasses</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <LoadingSkeleton count={1} />
        ) : outpasses.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white border border-brand-border/80 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-brand-gold flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-semibold text-sm text-brand-dark">No Outpass Applications</h3>
            <p className="text-xs text-brand-muted max-w-sm mx-auto">
              Planning to leave campus for the weekend or an off-campus event? Apply digitally with automated parent verification.
            </p>
            <Link
              to="/outpasses/create"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-gold hover:bg-brand-gold-hover text-brand-dark text-xs font-bold transition-colors"
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Apply for Outpass</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {outpasses.slice(0, 2).map((item) => (
              <Link
                key={item.id}
                to={`/outpasses/${item.id}`}
                className="p-5 rounded-2xl bg-white border border-brand-border/80 hover:border-brand-teal/40 hover:shadow-xs transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-brand-muted">Outpass #{item.id}</span>
                  <StatusBadge status={item.status} />
                </div>

                <div>
                  <h4 className="font-heading font-bold text-base text-brand-dark">
                    Destination: {item.destination}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">{item.reason}</p>
                </div>

                <div className="p-3 rounded-xl bg-brand-cream/60 border border-brand-border/60 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Departure:</span>
                    <span className="font-medium text-brand-dark">
                      {new Date(item.from_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Return:</span>
                    <span className="font-medium text-brand-dark">
                      {new Date(item.to_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="flex items-center gap-1 text-brand-teal font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Parent: {item.verification_status}
                  </span>
                  <span className="text-brand-muted font-semibold hover:underline">
                    Track details →
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
