import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import {
  Search,
  MapPin,
  Calendar,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

import { outpassService } from '../../services/outpassService';
import { OUTPASS_STATUSES } from '../../utils/constants';

import StatusBadge from '../../components/StatusBadge';
import LoadingSkeleton, {
  EmptyState
} from '../../components/LoadingSkeleton';


export default function AdminOutpasses() {

  const [outpasses, setOutpasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');


  const fetchOutpasses = async () => {
    try {
      setLoading(true);

      const params = {};

      if (search) {
        params.search = search;
      }

      if (selectedStatus !== 'All') {
        params.status = selectedStatus;
      }

      const data = await outpassService.getOutpasses(params);

      setOutpasses(
        data.results || data || []
      );

    } catch (err) {
      console.error(
        'Failed to load admin outpasses:',
        err
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {

    const delay = setTimeout(() => {
      fetchOutpasses();
    }, 250);

    return () => clearTimeout(delay);

  }, [search, selectedStatus]);


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      {/* Header */}

      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-brand-dark">
          Campus Outpass Audit Desk
        </h1>

        <p className="text-xs sm:text-sm text-brand-muted">
          Institutional registry of residential leaves, parent verification records, and security approvals
        </p>
      </div>


      {/* Filter Bar */}

      <div className="p-4 rounded-2xl bg-white border border-brand-border/80 shadow-xs flex flex-col sm:flex-row gap-3">

        <div className="relative flex-1">

          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student, roll number, or destination..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-brand-border bg-slate-50/50 focus:ring-2 focus:ring-brand-teal outline-none"
          />

        </div>


        <div className="w-full sm:w-56">

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-brand-border bg-slate-50/50 focus:ring-2 focus:ring-brand-teal outline-none text-slate-700"
          >

            <option value="All">
              All Statuses
            </option>

            {OUTPASS_STATUSES.map((st) => (
              <option
                key={st}
                value={st}
              >
                {st}
              </option>
            ))}

          </select>

        </div>

      </div>


      {/* Outpass List */}

      {loading ? (

        <LoadingSkeleton count={4} />

      ) : outpasses.length === 0 ? (

        <EmptyState
          title="No outpasses registered"
          message="No records match your query."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearch('');
            setSelectedStatus('All');
          }}
          icon={Calendar}
        />

      ) : (

        <div className="space-y-3">

          {outpasses.map((item) => (

            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white border border-brand-border hover:border-brand-teal/40 hover:shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >

              {/* Outpass Information */}

              <div className="space-y-2 flex-1">

                <div className="flex flex-wrap items-center gap-2">

                  <span className="text-xs font-mono font-bold text-brand-muted">
                    Pass #{item.id}
                  </span>

                  <span className="text-sm font-bold text-brand-dark">
                    {item.student_name}
                  </span>

                  {item.student_roll && (
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-brand-cream border border-brand-border text-brand-teal font-semibold">
                      {item.student_roll}
                    </span>
                  )}

                  <span className="text-xs text-brand-muted">
                    {item.student_hostel || 'Hostel not assigned'}
                    {' • '}
                    Room {item.student_room || 'N/A'}
                  </span>

                  <StatusBadge
                    status={item.status}
                    size="xs"
                  />

                </div>


                <div className="text-xs sm:text-sm text-slate-700 font-medium flex items-center gap-2">

                  <MapPin className="w-4 h-4 text-brand-teal shrink-0" />

                  <span>
                    Destination:{' '}
                    <strong>
                      {item.destination}
                    </strong>
                  </span>

                  <span className="text-slate-400 font-normal">
                    ({item.reason})
                  </span>

                </div>


                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">

                  <span>
                    Parent:{' '}
                    <strong>
                      {item.parent_name}
                    </strong>{' '}
                    ({item.parent_contact})
                  </span>

                  <span className="text-emerald-700 font-semibold">
                    Verification:{' '}
                    {item.verification_status}
                  </span>

                  {item.reviewer_name && (
                    <span className="text-brand-muted">
                      Reviewed by:{' '}
                      {item.reviewer_name}
                    </span>
                  )}

                </div>

              </div>


              {/* Actions */}

              <div className="shrink-0 flex items-center gap-2">

                <Link
                  to={`/admin/outpasses/${item.id}`}
                  className="px-4 py-2 rounded-xl bg-brand-teal hover:bg-brand-teal-dark text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  View Details
                </Link>


                <Link
                  to={`/admin/outpasses/${item.id}`}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs transition-colors"
                  title="View full outpass details"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}