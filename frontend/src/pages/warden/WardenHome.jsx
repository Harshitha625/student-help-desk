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
    <div className="min-h-screen bg-[#061D17] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#07211A] via-[#0B2A22] to-[#07211A] text-[#F5F5F0] border border-[#1B4337] shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1B4337]/60 text-[#E5C38E] text-xs font-semibold border border-[#275d4d]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#E5C38E]" />
              <span>Residential Authority Workspace</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F5F5F0]">
              Hostel Warden Outpass Desk
            </h1>
            <p className="text-xs sm:text-sm text-[#A3B8B0] max-w-xl">
              Verify parental consent, authorize residential gate departure passes, and monitor hostel student safety.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/warden/outpasses"
              className="px-5 py-2.5 rounded-xl bg-[#E5C38E] hover:bg-[#d8b37b] text-[#122A22] font-bold text-xs sm:text-sm shadow-sm transition-colors flex items-center gap-2"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Open Outpass Queue</span>
            </Link>
          </div>
        </div>

        {/* Triage Overview Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-[#0E2F26] border border-[#1B4337] shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-[#0B251E] border border-[#1B4337] text-[#E5C38E]">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-[#A3B8B0] font-medium">Pending Parent Verification</div>
                <div className="text-2xl font-bold font-heading text-[#F5F5F0]">
                  {pendingOutpasses.length}
                </div>
              </div>
            </div>
            <Link
              to="/warden/outpasses"
              className="text-xs font-semibold text-[#E5C38E] hover:text-[#d8b37b] transition-colors"
            >
              Triage →
            </Link>
          </div>

          <div className="p-5 rounded-2xl bg-[#0E2F26] border border-[#1B4337] shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-[#0B251E] border border-[#1B4337] text-[#4E8B73]">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-[#A3B8B0] font-medium">Hostel Students Enrolled</div>
                <div className="text-2xl font-bold font-heading text-[#F5F5F0]">
                  {studentsCount}
                </div>
              </div>
            </div>
            <Link
              to="/warden/students"
              className="text-xs font-semibold text-[#E5C38E] hover:text-[#d8b37b] transition-colors"
            >
              Directory →
            </Link>
          </div>

          <div className="p-5 rounded-2xl bg-[#0E2F26] border border-[#1B4337] shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-[#0B251E] border border-[#1B4337] text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-[#A3B8B0] font-medium">Digital Verification System</div>
                <div className="text-sm font-bold text-emerald-400">100% Active</div>
              </div>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>

        {/* Urgent Parent Verification Queue */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-lg font-bold text-[#F5F5F0]">
                Requests Awaiting Parent Verification
              </h2>
              <p className="text-xs text-[#A3B8B0]">
                Call the registered guardian number and record verification notes before approving departure
              </p>
            </div>

            <Link
              to="/warden/outpasses"
              className="text-xs font-semibold text-[#E5C38E] hover:text-[#d8b37b] flex items-center gap-1 transition-colors"
            >
              <span>View all requests</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <LoadingSkeleton count={2} />
          ) : pendingOutpasses.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#0E2F26] border border-[#1B4337] text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-[#4E8B73] mx-auto" />
              <h3 className="font-heading font-bold text-sm text-[#F5F5F0]">Triage Queue Cleared</h3>
              <p className="text-xs text-[#A3B8B0] max-w-sm mx-auto">
                No outpass applications are currently awaiting parent verification.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingOutpasses.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-[#0E2F26] border border-[#1B4337] hover:border-[#2b6855] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold text-[#719B8C]">Outpass #{item.id}</span>
                      <span className="text-xs font-bold text-[#F5F5F0]">{item.student_name}</span>
                      {item.student_roll && (
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#0A241D] text-[#D1E0DA] border border-[#1B4337]">
                          {item.student_roll}
                        </span>
                      )}
                      <span className="text-xs text-[#A3B8B0]">
                        {item.student_hostel} • Room {item.student_room}
                      </span>
                    </div>

                    <div className="text-sm font-semibold text-[#F5F5F0] flex items-center gap-2">
                      <span>Destination: {item.destination}</span>
                      <span className="text-[#A3B8B0] font-normal">({item.reason})</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#D1E0DA]">
                      <span className="flex items-center gap-1.5 font-medium text-[#E5C38E] bg-[#132c23] px-2.5 py-1 rounded-md border border-[#235342]">
                        <PhoneCall className="w-3.5 h-3.5 text-[#E5C38E]" />
                        Guardian: {item.parent_name} ({item.parent_contact})
                      </span>
                      <span className="text-[#A3B8B0]">
                        Departure: {new Date(item.from_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <Link
                      to={`/warden/outpasses/${item.id}`}
                      className="px-4 py-2 rounded-xl bg-[#E5C38E] hover:bg-[#d8b37b] text-[#122A22] text-xs font-bold shadow-xs transition-colors"
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
    </div>
  );
}