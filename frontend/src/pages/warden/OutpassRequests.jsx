import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  PhoneCall,
  MapPin,
  ShieldCheck,
  ChevronRight,
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
      if (selectedStatus !== 'All') {
        params.status = selectedStatus;
      }

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
    <div className="min-h-screen bg-[#06130f] text-[#f5eee2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-6">

        {/* HEADER */}
        <div className="relative overflow-hidden rounded-[28px] border border-[#29483f] bg-gradient-to-br from-[#123f36] via-[#0b211b] to-[#06130f] p-6 sm:p-8">
          <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-[#c49a45]/10 blur-3xl pointer-events-none" />

          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#c49a45]">
                Warden Desk
              </span>

              <span className="w-1 h-1 rounded-full bg-[#cda86a]" />

              <span className="text-[10px] uppercase tracking-[0.2em] text-[#82958d]">
                Outpass Management
              </span>
            </div>

            <h1 className="premium-serif text-3xl sm:text-4xl leading-tight text-[#f5eee2]">
              Hostel Outpass
              <span className="italic text-[#cda86a]">
                {' '}Verification Desk
              </span>
            </h1>

            <p className="text-sm text-[#aebdb5] mt-3 max-w-2xl leading-6">
              Review student gate passes, verify guardian communication,
              and manage departure permissions from one connected workspace.
            </p>
          </div>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="relative rounded-[24px] border border-[#29483f] bg-[#0b211b] p-4 sm:p-5">
          <div className="absolute inset-0 rounded-[24px] bg-[radial-gradient(circle_at_0%_0%,rgba(196,154,69,0.08),transparent_35%)] pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row gap-3">

            {/* SEARCH */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#82958d]">
                <Search className="w-4 h-4" />
              </div>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search student, roll number, destination..."
                className="
                  w-full
                  pl-10
                  pr-4
                  py-3
                  text-xs
                  sm:text-sm
                  rounded-xl
                  border
                  border-[#29483f]
                  bg-[#06130f]
                  text-[#f5eee2]
                  placeholder:text-[#687b73]
                  focus:border-[#c49a45]
                  focus:ring-1
                  focus:ring-[#c49a45]/40
                  outline-none
                  transition
                "
              />
            </div>

            {/* STATUS */}
            <div className="w-full sm:w-56">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="
                  w-full
                  px-3
                  py-3
                  text-xs
                  sm:text-sm
                  rounded-xl
                  border
                  border-[#29483f]
                  bg-[#06130f]
                  text-[#f5eee2]
                  focus:border-[#c49a45]
                  focus:ring-1
                  focus:ring-[#c49a45]/40
                  outline-none
                "
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

        {/* CONTENT */}
        {loading ? (
          <LoadingSkeleton count={4} />
        ) : outpasses.length === 0 ? (
          <div className="rounded-[24px] border border-[#29483f] bg-[#0b211b] p-8">
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
          </div>
        ) : (
          <div className="space-y-4">

            {outpasses.map((item) => (
              <div
                key={item.id}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-[24px]
                  border
                  border-[#29483f]
                  bg-[#0b211b]
                  p-5
                  sm:p-6
                  hover:border-[#c49a45]/50
                  hover:bg-[#0e2922]
                  transition-all
                  duration-300
                "
              >

                {/* GOLD HOVER GLOW */}
                <div className="absolute right-0 top-0 w-40 h-40 rounded-full bg-[#c49a45]/5 blur-3xl pointer-events-none" />

                <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-5">

                  {/* REQUEST INFORMATION */}
                  <div className="space-y-4 flex-1">

                    {/* TOP ROW */}
                    <div className="flex flex-wrap items-center gap-2">

                      <span className="text-[10px] uppercase tracking-[0.15em] text-[#82958d]">
                        Pass #{item.id}
                      </span>

                      <span className="text-[#29483f]">
                        •
                      </span>

                      <span className="text-sm font-semibold text-[#f5eee2]">
                        {item.student_name}
                      </span>

                      {item.student_roll && (
                        <span className="
                          text-[10px]
                          font-mono
                          px-2.5
                          py-1
                          rounded-full
                          bg-[#12382f]
                          border
                          border-[#315b50]
                          text-[#cda86a]
                        ">
                          {item.student_roll}
                        </span>
                      )}

                      <StatusBadge
                        status={item.status}
                        size="xs"
                      />
                    </div>

                    {/* DESTINATION */}
                    <div className="flex flex-wrap items-center gap-2 text-sm text-[#d2dad5]">

                      <div className="
                        w-8
                        h-8
                        rounded-full
                        bg-[#12382f]
                        flex
                        items-center
                        justify-center
                        shrink-0
                      ">
                        <MapPin className="w-4 h-4 text-[#cda86a]" />
                      </div>

                      <span className="text-[#82958d]">
                        Destination
                      </span>

                      <span className="font-semibold text-[#f5eee2]">
                        {item.destination}
                      </span>

                      <span className="text-[#52675f]">
                        —
                      </span>

                      <span className="text-[#aebdb5]">
                        {item.reason}
                      </span>
                    </div>

                    {/* DETAILS */}
                    <div className="grid sm:grid-cols-3 gap-2.5">

                      {/* GUARDIAN */}
                      <div className="
                        rounded-xl
                        border
                        border-[#29483f]
                        bg-[#06130f]/60
                        p-3
                      ">
                        <div className="flex items-center gap-2 mb-1.5">
                          <PhoneCall className="w-3.5 h-3.5 text-[#cda86a]" />

                          <span className="
                            text-[9px]
                            uppercase
                            tracking-[0.15em]
                            text-[#82958d]
                          ">
                            Guardian
                          </span>
                        </div>

                        <p className="text-xs font-semibold text-[#d8e0dc]">
                          {item.parent_name}
                        </p>

                        <p className="text-[11px] text-[#8fa099] mt-0.5">
                          {item.parent_contact}
                        </p>
                      </div>

                      {/* VERIFICATION */}
                      <div className="
                        rounded-xl
                        border
                        border-[#29483f]
                        bg-[#06130f]/60
                        p-3
                      ">
                        <div className="flex items-center gap-2 mb-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#cda86a]" />

                          <span className="
                            text-[9px]
                            uppercase
                            tracking-[0.15em]
                            text-[#82958d]
                          ">
                            Verification
                          </span>
                        </div>

                        <p className="text-xs font-semibold text-[#d8e0dc]">
                          {item.verification_status}
                        </p>
                      </div>

                      {/* DATE */}
                      <div className="
                        rounded-xl
                        border
                        border-[#29483f]
                        bg-[#06130f]/60
                        p-3
                      ">
                        <div className="
                          text-[9px]
                          uppercase
                          tracking-[0.15em]
                          text-[#82958d]
                          mb-1.5
                        ">
                          Travel Window
                        </div>

                        <p className="text-[11px] text-[#d8e0dc]">
                          {new Date(item.from_date).toLocaleDateString()}
                        </p>

                        <p className="text-[11px] text-[#8fa099]">
                          to {new Date(item.to_date).toLocaleDateString()}
                        </p>
                      </div>

                    </div>

                    {/* HOSTEL */}
                    <div className="text-[11px] text-[#82958d]">
                      Hostel:
                      <span className="text-[#d2dad5] ml-1 font-medium">
                        {item.student_hostel || 'Hostel'}
                      </span>

                      {item.student_room && (
                        <>
                          <span className="mx-2 text-[#52675f]">
                            •
                          </span>

                          Room:
                          <span className="text-[#d2dad5] ml-1 font-medium">
                            {item.student_room}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* ACTION */}
                  <div className="shrink-0">

                    <Link
                      to={`/warden/outpasses/${item.id}`}
                      className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        w-full
                        lg:w-auto
                        px-5
                        py-3
                        rounded-full
                        bg-[#cda86a]
                        text-[#10221c]
                        text-xs
                        font-bold
                        uppercase
                        tracking-[0.12em]
                        hover:bg-[#ddbd85]
                        transition-colors
                      "
                    >
                      <span>
                        Inspect & Review
                      </span>

                      <ChevronRight className="w-4 h-4" />
                    </Link>

                  </div>

                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}