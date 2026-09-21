import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileCheck2,
  Search,
  Calendar,
  MapPin,
  ShieldCheck,
  ChevronRight,
  Clock,
  Sparkles,
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
    <div className="min-h-screen bg-[#07110F] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-7">

        {/* =========================================================
            PAGE HEADER
        ========================================================== */}
        <div className="relative overflow-hidden rounded-[28px] border border-[#23443C] bg-[#123F36] px-6 py-7 sm:px-8 sm:py-8">

          {/* Decorative circles */}
          <div className="absolute -right-20 -top-24 w-64 h-64 rounded-full border border-[#2A6B5C]/40 pointer-events-none" />
          <div className="absolute -right-8 -bottom-36 w-72 h-72 rounded-full border border-[#2A6B5C]/30 pointer-events-none" />

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#2A6B5C] border border-[#4F8F7D]/30 flex items-center justify-center">
                  <FileCheck2 className="w-4 h-4 text-[#E8DCC4]" />
                </div>

                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.16em] text-[#C49A45]">
                  Student HelpDesk
                </span>
              </div>

              <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#FAF9F6]">
                Residential Outpass Portal
              </h1>

              <p className="mt-2 text-sm text-[#B8C9C3] max-w-xl leading-relaxed">
                Manage your digital permission requests, travel schedules,
                guardian verification, and approval progress.
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-5 text-xs text-[#A9BCB6]">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#C49A45]" />
                  Travel Schedule
                </span>

                <span className="w-1 h-1 rounded-full bg-[#4F8F7D]" />

                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C49A45]" />
                  Guardian Verification
                </span>

                <span className="w-1 h-1 rounded-full bg-[#4F8F7D]" />

                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#C49A45]" />
                  Approval Tracking
                </span>
              </div>
            </div>

            <Link
              to="/outpasses/create"
              className="relative inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#C49A45] hover:bg-[#B08838] text-[#07110F] text-sm font-bold shadow-[0_8px_25px_rgba(196,154,69,0.18)] transition-all duration-200 hover:-translate-y-0.5 self-start lg:self-center"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Apply for Outpass</span>
            </Link>

          </div>
        </div>


        {/* =========================================================
            SEARCH + FILTER
        ========================================================== */}
        <div className="rounded-2xl border border-[#23443C] bg-[#0D211C] p-4 sm:p-5">

          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#173C33] border border-[#23443C] flex items-center justify-center">
              <Search className="w-4 h-4 text-[#4F8F7D]" />
            </div>

            <div>
              <p className="text-xs font-bold text-[#E8DCC4]">
                Find an Outpass
              </p>

              <p className="text-[11px] text-[#7A8581]">
                Search your travel requests or filter by approval status
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">

            {/* Search */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-[#5D7A72]" />
              </div>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by destination or reason..."
                className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm rounded-xl border border-[#23443C] bg-[#07110F] text-[#F5F7F6] placeholder:text-[#5D706A] outline-none transition-all focus:border-[#4F8F7D] focus:ring-1 focus:ring-[#2A6B5C]"
              />
            </div>

            {/* Status filter */}
            <div className="w-full sm:w-56">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3.5 py-3 text-xs sm:text-sm rounded-xl border border-[#23443C] bg-[#07110F] text-[#D9E4E0] outline-none transition-all focus:border-[#4F8F7D] focus:ring-1 focus:ring-[#2A6B5C]"
              >
                <option value="All">All Statuses</option>

                {OUTPASS_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

          </div>
        </div>


        {/* =========================================================
            SECTION HEADER
        ========================================================== */}
        <div className="flex items-end justify-between gap-4">

          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#C49A45]" />

              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] text-[#C49A45]">
                Requests
              </span>
            </div>

            <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#F5F7F6]">
              Your Outpasses
            </h2>

            <p className="text-xs text-[#7A8581] mt-1">
              Track your hostel travel permission requests
            </p>
          </div>

          {!loading && outpasses.length > 0 && (
            <span className="hidden sm:block text-[11px] font-semibold text-[#66877E]">
              {outpasses.length} request{outpasses.length !== 1 ? 's' : ''}
            </span>
          )}

        </div>


        {/* =========================================================
            LOADING
        ========================================================== */}
        {loading ? (
          <div className="space-y-4">
            <LoadingSkeleton count={3} />
          </div>
        ) : outpasses.length === 0 ? (

          /* =======================================================
             EMPTY STATE
          ======================================================== */
          <div className="rounded-3xl border border-[#23443C] bg-[#0D211C] p-8 sm:p-12 text-center">

            <div className="mx-auto w-14 h-14 rounded-2xl bg-[#173C33] border border-[#2A6B5C] flex items-center justify-center">
              <Calendar className="w-6 h-6 text-[#4F8F7D]" />
            </div>

            <h3 className="mt-5 font-heading text-lg font-bold text-[#F5F7F6]">
              No outpasses found
            </h3>

            <p className="mt-2 text-xs sm:text-sm text-[#7A8581] max-w-md mx-auto leading-relaxed">
              You currently have no outpass applications registered under
              this filter.
            </p>

            <button
              onClick={() => {
                window.location.href = '/outpasses/create';
              }}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C49A45] hover:bg-[#B08838] text-[#07110F] text-xs font-bold transition-colors"
            >
              <FileCheck2 className="w-4 h-4" />
              Apply for New Outpass
            </button>

          </div>

        ) : (

          /* =======================================================
             OUTPASS CARDS
          ======================================================== */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {outpasses.map((item) => (

              <Link
                key={item.id}
                to={`/outpasses/${item.id}`}
                className="group relative overflow-hidden rounded-2xl border border-[#23443C] bg-[#0D211C] hover:border-[#2A6B5C] hover:bg-[#102720] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_35px_rgba(42,107,92,0.12)]"
              >

                {/* Decorative top glow */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#2A6B5C] to-transparent opacity-70" />

                <div className="p-5 sm:p-6">

                  {/* Card top */}
                  <div className="flex items-center justify-between gap-3">

                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-[#173C33] border border-[#23443C] flex items-center justify-center shrink-0">
                        <FileCheck2 className="w-4 h-4 text-[#4F8F7D]" />
                      </div>

                      <div>
                        <span className="block text-[9px] uppercase tracking-wider text-[#667D76]">
                          Digital Gate Pass
                        </span>

                        <span className="text-xs font-mono font-bold text-[#A7B9B4]">
                          Outpass #{item.id}
                        </span>
                      </div>
                    </div>

                    <StatusBadge
                      status={item.status}
                      size="sm"
                    />

                  </div>


                  {/* Destination */}
                  <div className="mt-5">

                    <h3 className="font-heading font-bold text-lg text-[#F5F7F6] group-hover:text-[#7FB3A3] transition-colors flex items-start gap-2">

                      <MapPin className="w-4 h-4 mt-1 text-[#4F8F7D] shrink-0" />

                      <span className="line-clamp-2">
                        {item.destination}
                      </span>

                    </h3>

                    <p className="text-xs text-[#83958F] line-clamp-2 mt-2 leading-relaxed">
                      {item.reason}
                    </p>

                  </div>


                  {/* Travel schedule */}
                  <div className="mt-5 rounded-xl border border-[#23443C] bg-[#07110F] overflow-hidden">

                    <div className="px-3.5 py-3 border-b border-[#1B342E]">

                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#C49A45]" />

                        <span className="text-[10px] uppercase tracking-wider font-bold text-[#778B85]">
                          Travel Schedule
                        </span>
                      </div>

                    </div>

                    <div className="px-3.5 py-3 space-y-3">

                      <div className="flex items-start justify-between gap-4">

                        <div>
                          <span className="block text-[10px] text-[#62756F] uppercase tracking-wide">
                            Departure
                          </span>

                          <span className="block mt-0.5 text-xs font-semibold text-[#D9E4E0]">
                            {new Date(item.from_date).toLocaleString([], {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            })}
                          </span>
                        </div>

                        <div className="w-7 h-7 rounded-lg bg-[#123F36] flex items-center justify-center shrink-0">
                          <ChevronRight className="w-3.5 h-3.5 text-[#4F8F7D]" />
                        </div>

                        <div className="text-right">
                          <span className="block text-[10px] text-[#62756F] uppercase tracking-wide">
                            Return
                          </span>

                          <span className="block mt-0.5 text-xs font-semibold text-[#D9E4E0]">
                            {new Date(item.to_date).toLocaleString([], {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            })}
                          </span>
                        </div>

                      </div>

                    </div>
                  </div>


                  {/* Bottom status */}
                  <div className="mt-5 pt-4 border-t border-[#23443C] flex items-center justify-between gap-3">

                    <div className="flex items-center gap-2 min-w-0">

                      <div className="w-7 h-7 rounded-lg bg-[#123F36] flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#4F8F7D]" />
                      </div>

                      <div className="min-w-0">
                        <span className="block text-[9px] uppercase tracking-wider text-[#62756F]">
                          Guardian Verification
                        </span>

                        <span className="block text-xs font-semibold text-[#B8C9C3] truncate">
                          {item.verification_status}
                        </span>
                      </div>

                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#C49A45] group-hover:text-[#E8DCC4] transition-colors shrink-0">
                      <span>Track Status</span>

                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>

                  </div>

                </div>

              </Link>

            ))}

          </div>
        )}

      </div>
    </div>
  );
}
