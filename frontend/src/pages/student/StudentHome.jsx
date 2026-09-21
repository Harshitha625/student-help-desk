import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  PlusCircle,
  FileCheck2,
  CheckCircle2,
  ArrowRight,
  Building2,
  Compass,
  Calendar,
  Sparkles,
  ChevronRight,
  ShieldCheck,
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
    (c) =>
      c.status === 'Pending' ||
      c.status === 'Assigned' ||
      c.status === 'In Progress'
  );

  const activeOutpass = outpasses.find(
    (o) => o.status !== 'Completed' && o.status !== 'Rejected'
  );

  const resolvedComplaints = complaints.filter(
    (c) => c.status === 'Resolved'
  ).length;

  return (
    <div className="min-h-screen bg-[#0B1714] text-[#F4EFE5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">

        {/* ============================================================
            WELCOME SECTION
        ============================================================ */}

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-[28px] border border-[#2A6B5C]/50 bg-[#123F36] shadow-2xl"
        >
          {/* Decorative glow */}
          <div className="absolute -right-24 -top-24 w-72 h-72 rounded-full bg-[#2A6B5C]/30 blur-3xl" />
          <div className="absolute -left-20 -bottom-28 w-72 h-72 rounded-full bg-[#C49A45]/10 blur-3xl" />

          <div className="relative z-10 px-6 py-7 sm:px-8 sm:py-9">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-7">

              <div>
                <div className="inline-flex items-center gap-2 mb-4 text-[#C49A45]">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                    Student HelpDesk
                  </span>
                </div>

                <h1 className="font-heading text-2xl sm:text-4xl font-bold tracking-tight text-[#F4EFE5]">
                  {getGreeting()},{' '}
                  {user?.first_name || user?.username}!
                </h1>

                <p className="mt-2 max-w-xl text-sm text-[#C9D5D0]">
                  {user?.student_profile?.hostel ? (
                    <>
                      Resident at{' '}
                      <span className="font-semibold text-[#F4EFE5]">
                        {user.student_profile.hostel}
                      </span>

                      {user.student_profile.room_number
                        ? ` • Room ${user.student_profile.room_number}`
                        : ''}
                    </>
                  ) : (
                    'Manage your campus requests, complaints and outpasses from one place.'
                  )}
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5">
                <Link
                  to="/complaints/create"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#C49A45] px-4 py-2.5 text-xs font-bold text-[#0B1714] transition-all hover:bg-[#D4AF61] hover:-translate-y-0.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  Raise Complaint
                </Link>

                <Link
                  to="/outpasses/create"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#F4EFE5]/20 bg-[#0B1714]/30 px-4 py-2.5 text-xs font-semibold text-[#F4EFE5] backdrop-blur-md transition-all hover:bg-[#0B1714]/50 hover:-translate-y-0.5"
                >
                  <FileCheck2 className="w-4 h-4 text-[#C49A45]" />
                  Apply Outpass
                </Link>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ============================================================
            QUICK OVERVIEW
        ============================================================ */}

        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-3"
        >
          {/* Active complaints */}
          <div className="group rounded-2xl border border-[#2A6B5C]/50 bg-[#10211D] p-4 transition-all hover:border-[#2A6B5C] hover:bg-[#123F36]/70">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2A6B5C]/20 text-[#6FAE9E]">
                  <Compass className="w-5 h-5" />
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[#8FA59D]">
                    Active Complaints
                  </p>

                  <p className="mt-0.5 text-lg font-bold text-[#F4EFE5]">
                    {activeComplaints.length}
                  </p>
                </div>
              </div>

              <Link
                to="/complaints"
                className="rounded-lg p-2 text-[#8FA59D] transition-colors hover:bg-[#2A6B5C]/20 hover:text-[#C49A45]"
              >
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Active outpass */}
          <div className="group rounded-2xl border border-[#C49A45]/30 bg-[#10211D] p-4 transition-all hover:border-[#C49A45]/60 hover:bg-[#123F36]/70">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#C49A45]/15 text-[#C49A45]">
                  <Calendar className="w-5 h-5" />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-[#8FA59D]">
                    Current Outpass
                  </p>

                  {activeOutpass ? (
                    <div className="mt-1 flex items-center gap-2">
                      <span className="truncate text-sm font-semibold text-[#F4EFE5]">
                        {activeOutpass.destination}
                      </span>

                      <StatusBadge
                        status={activeOutpass.status}
                        size="xs"
                      />
                    </div>
                  ) : (
                    <p className="mt-1 text-xs text-[#82948E]">
                      No active outpass
                    </p>
                  )}
                </div>
              </div>

              <Link
                to={
                  activeOutpass
                    ? `/outpasses/${activeOutpass.id}`
                    : '/outpasses'
                }
                className="rounded-lg p-2 text-[#8FA59D] transition-colors hover:bg-[#C49A45]/10 hover:text-[#C49A45]"
              >
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Resolved */}
          <div className="group rounded-2xl border border-[#2A6B5C]/50 bg-[#10211D] p-4 transition-all hover:border-[#2A6B5C] hover:bg-[#123F36]/70">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2A6B5C]/20 text-[#7CC2AE]">
                  <CheckCircle2 className="w-5 h-5" />
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[#8FA59D]">
                    Resolved
                  </p>

                  <p className="mt-0.5 text-lg font-bold text-[#F4EFE5]">
                    {resolvedComplaints}
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7CC2AE]">
                Tracked
              </span>
            </div>
          </div>
        </motion.section>

        {/* ============================================================
            ACTIVE COMPLAINTS
        ============================================================ */}

        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
        >
          <div className="flex items-end justify-between gap-4 mb-4">
            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C49A45]">
                Requests
              </p>

              <h2 className="font-heading text-xl font-bold text-[#F4EFE5]">
                Active complaints
              </h2>

              <p className="mt-1 text-xs text-[#879B94]">
                Your current campus requests
              </p>
            </div>

            <Link
              to="/complaints"
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-[#C49A45] hover:text-[#D4AF61]"
            >
              View all
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-[#2A6B5C]/40 bg-[#10211D] p-4">
              <LoadingSkeleton count={2} />
            </div>
          ) : activeComplaints.length === 0 ? (
            <div className="relative overflow-hidden rounded-2xl border border-[#2A6B5C]/40 bg-[#10211D] px-6 py-8 text-center">
              <div className="absolute left-1/2 top-0 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2A6B5C]/20 blur-3xl" />

              <div className="relative">
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#2A6B5C]/20 text-[#7CC2AE]">
                  <CheckCircle2 className="w-5 h-5" />
                </div>

                <h3 className="text-sm font-semibold text-[#F4EFE5]">
                  Everything looks good
                </h3>

                <p className="mx-auto mt-1 max-w-md text-xs text-[#879B94]">
                  You currently have no active complaints.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-thin">
              {activeComplaints.slice(0, 5).map((item) => (
                <Link
                  key={item.id}
                  to={`/complaints/${item.id}`}
                  className="group min-w-[280px] max-w-[320px] flex-1 snap-start rounded-2xl border border-[#2A6B5C]/40 bg-[#10211D] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#2A6B5C] hover:bg-[#123F36]/80"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] font-bold text-[#71877F]">
                      #{item.id}
                    </span>

                    <StatusBadge status={item.status} size="xs" />
                  </div>

                  <div className="mt-3">
                    <div className="flex items-center gap-2">
                      <span className="truncate rounded-md bg-[#2A6B5C]/15 px-2 py-1 text-[9px] font-semibold uppercase tracking-wide text-[#78B19F]">
                        {item.category}
                      </span>

                      <PriorityBadge priority={item.priority} />
                    </div>

                    <h3 className="mt-3 line-clamp-1 text-sm font-bold text-[#F4EFE5] group-hover:text-[#C49A45]">
                      {item.title}
                    </h3>

                    <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-[#879B94]">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-[#2A6B5C]/20 pt-3 text-[10px]">
                    <span className="flex min-w-0 items-center gap-1.5 text-[#71877F]">
                      <Building2 className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">
                        {item.location || 'Campus'}
                      </span>
                    </span>

                    <ChevronRight className="h-3.5 w-3.5 text-[#71877F] transition-transform group-hover:translate-x-1 group-hover:text-[#C49A45]" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.section>

        {/* ============================================================
            OUTPASSES
        ============================================================ */}

        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
        >
          <div className="flex items-end justify-between gap-4 mb-4">
            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C49A45]">
                Permissions
              </p>

              <h2 className="font-heading text-xl font-bold text-[#F4EFE5]">
                Outpass activity
              </h2>

              <p className="mt-1 text-xs text-[#879B94]">
                Recent requests and approvals
              </p>
            </div>

            <Link
              to="/outpasses"
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-[#C49A45] hover:text-[#D4AF61]"
            >
              View all
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-[#C49A45]/25 bg-[#10211D] p-4">
              <LoadingSkeleton count={1} />
            </div>
          ) : outpasses.length === 0 ? (
            <div className="relative overflow-hidden rounded-2xl border border-[#C49A45]/25 bg-[#10211D] px-6 py-8 text-center">
              <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-[#C49A45]/10 blur-3xl" />

              <div className="relative">
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#C49A45]/10 text-[#C49A45]">
                  <Calendar className="w-5 h-5" />
                </div>

                <h3 className="text-sm font-semibold text-[#F4EFE5]">
                  No outpass applications
                </h3>

                <p className="mx-auto mt-1 max-w-md text-xs text-[#879B94]">
                  Your outpass requests will appear here once you apply.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {outpasses.slice(0, 2).map((item) => (
                <Link
                  key={item.id}
                  to={`/outpasses/${item.id}`}
                  className="group relative overflow-hidden rounded-2xl border border-[#2A6B5C]/40 bg-[#10211D] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#C49A45]/50 hover:bg-[#123F36]/70"
                >
                  <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-[#C49A45]/5 blur-2xl transition-all group-hover:bg-[#C49A45]/10" />

                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-[#71877F]">
                        OUTPASS #{item.id}
                      </span>

                      <StatusBadge status={item.status} size="xs" />
                    </div>

                    <h3 className="mt-3 line-clamp-1 text-base font-bold text-[#F4EFE5] group-hover:text-[#C49A45]">
                      {item.destination}
                    </h3>

                    <p className="mt-1 line-clamp-1 text-xs text-[#879B94]">
                      {item.reason}
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <div className="rounded-xl border border-[#2A6B5C]/30 bg-[#0B1714]/60 px-3 py-2.5">
                        <p className="text-[9px] uppercase tracking-wider text-[#71877F]">
                          Departure
                        </p>

                        <p className="mt-1 text-xs font-semibold text-[#DDE5E1]">
                          {new Date(
                            item.from_date
                          ).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="rounded-xl border border-[#2A6B5C]/30 bg-[#0B1714]/60 px-3 py-2.5">
                        <p className="text-[9px] uppercase tracking-wider text-[#71877F]">
                          Return
                        </p>

                        <p className="mt-1 text-xs font-semibold text-[#DDE5E1]">
                          {new Date(
                            item.to_date
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-[#2A6B5C]/20 pt-3">
                      <span className="flex items-center gap-1.5 text-[10px] font-medium text-[#7CC2AE]">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Parent: {item.verification_status}
                      </span>

                      <ChevronRight className="w-4 h-4 text-[#71877F] transition-transform group-hover:translate-x-1 group-hover:text-[#C49A45]" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.section>

      </div>
    </div>
  );
}