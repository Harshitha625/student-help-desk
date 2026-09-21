import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Clock, 
  FileCheck2, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  PhoneCall, 
  Building2,
  Calendar
} from 'lucide-react';
import { outpassService } from '../../services/outpassService';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import LoadingSkeleton from '../../components/LoadingSkeleton';

export default function WardenHome() {
  const [pendingOutpasses, setPendingOutpasses] = useState([]);
  const [studentsCount, setStudentsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWardenData = async () => {
      try {
        setLoading(true);
        const [outpassData, studentsResponse] = await Promise.all([
          outpassService.getOutpasses({ status: 'Parent Verification' }),
          api.get('/api/auth/students/'),
        ]);

        setPendingOutpasses(outpassData.results || outpassData || []);
        setStudentsCount(studentsResponse.data?.length || 0);
      } catch (err) {
        console.error('Failed to load warden overview:', err);
      } finally {
        setLoading(false);
      }
    };

    loadWardenData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-teal-dark to-brand-dark text-white border border-brand-teal/30 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-biscuit text-xs font-semibold backdrop-blur-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-gold" />
            <span>Residential Authority Workspace</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight">
            Hostel Warden Outpass Desk
          </h1>
          <p className="text-xs sm:text-sm text-brand-biscuit/80 max-w-xl">
            Verify parental consent, authorize residential gate departure passes, and monitor hostel student safety.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/warden/outpasses"
            className="px-5 py-2.5 rounded-xl bg-brand-gold hover:bg-brand-gold-hover text-brand-dark font-bold text-xs sm:text-sm shadow-sm transition-colors flex items-center gap-2"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Open Outpass Queue</span>
          </Link>
        </div>
      </div>

      {/* Triage Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-white border border-brand-border shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-amber-50 text-brand-gold">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-brand-muted font-medium">Pending Parent Verification</div>
              <div className="text-2xl font-bold font-heading text-brand-dark">
                {pendingOutpasses.length}
              </div>
            </div>
          </div>
          <Link
            to="/warden/outpasses"
            className="text-xs font-semibold text-brand-teal hover:underline"
          >
            Triage →
          </Link>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-brand-border shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-teal-50 text-brand-teal">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-brand-muted font-medium">Hostel Students Enrolled</div>
              <div className="text-2xl font-bold font-heading text-brand-dark">
                {studentsCount}
              </div>
            </div>
          </div>
          <Link
            to="/warden/students"
            className="text-xs font-semibold text-brand-teal hover:underline"
          >
            Directory →
          </Link>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-brand-border shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-brand-muted font-medium">Digital Verification System</div>
              <div className="text-sm font-bold text-emerald-700">100% Active</div>
            </div>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>

      {/* Urgent Parent Verification Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-lg font-bold text-brand-dark">
              Requests Awaiting Parent Verification
            </h2>
            <p className="text-xs text-brand-muted">
              Call the registered guardian number and record verification notes before approving departure
            </p>
          </div>

          <Link
            to="/warden/outpasses"
            className="text-xs font-semibold text-brand-teal hover:underline flex items-center gap-1"
          >
            <span>View all requests</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <LoadingSkeleton count={2} />
        ) : pendingOutpasses.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white border border-brand-border text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="font-heading font-bold text-sm text-brand-dark">Triage Queue Cleared</h3>
            <p className="text-xs text-brand-muted max-w-sm mx-auto">
              No outpass applications are currently awaiting parent verification.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingOutpasses.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-white border border-brand-border hover:border-brand-teal/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-brand-muted">Outpass #{item.id}</span>
                    <span className="text-xs font-bold text-brand-dark">{item.student_name}</span>
                    {item.student_roll && (
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {item.student_roll}
                      </span>
                    )}
                    <span className="text-xs text-brand-muted">
                      {item.student_hostel} • Room {item.student_room}
                    </span>
                  </div>

                  <div className="text-sm font-semibold text-brand-dark flex items-center gap-2">
                    <span>Destination: {item.destination}</span>
                    <span className="text-slate-400 font-normal">({item.reason})</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                    <span className="flex items-center gap-1.5 font-medium text-amber-900 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                      <PhoneCall className="w-3.5 h-3.5 text-brand-gold" />
                      Guardian: {item.parent_name} ({item.parent_contact})
                    </span>
                    <span>
                      Departure: {new Date(item.from_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <Link
                    to={`/warden/outpasses/${item.id}`}
                    className="px-4 py-2 rounded-xl bg-brand-teal hover:bg-brand-teal-dark text-white text-xs font-semibold shadow-xs transition-colors"
                  >
                    Verify & Review Pass
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
