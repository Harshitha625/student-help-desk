import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Search,
  CheckCircle2,
  X,
  ExternalLink,
} from 'lucide-react';

import { complaintService } from '../../services/complaintService';

import {
  COMPLAINT_CATEGORIES,
  COMPLAINT_STATUSES,
  COMPLAINT_PRIORITIES,
} from '../../utils/constants';

import StatusBadge, {
  PriorityBadge,
} from '../../components/StatusBadge';

import LoadingSkeleton, {
  EmptyState,
} from '../../components/LoadingSkeleton';

import { useToast } from '../../context/ToastContext';

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');

  // Selected complaint for quick update modal
  const [activeComplaint, setActiveComplaint] = useState(null);

  const [updateStatusVal, setUpdateStatusVal] =
    useState('In Progress');

  const [assigneeVal, setAssigneeVal] = useState('');
  const [adminResponseVal, setAdminResponseVal] = useState('');

  const [saving, setSaving] = useState(false);

  const { addToast } = useToast();
  const location = useLocation();

  const fetchComplaints = async () => {
    try {
      setLoading(true);

      const params = {};

      if (search) {
        params.search = search;
      }

      if (selectedCategory !== 'All') {
        params.category = selectedCategory;
      }

      if (selectedStatus !== 'All') {
        params.status = selectedStatus;
      }

      if (selectedPriority !== 'All') {
        params.priority = selectedPriority;
      }

      const data = await complaintService.getComplaints(params);

      setComplaints(data.results || data || []);
    } catch (err) {
      console.error(
        'Failed to load admin complaints:',
        err
      );

      addToast(
        'Failed to load complaints.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchComplaints();
    }, 250);

    return () => clearTimeout(delay);
  }, [
    search,
    selectedCategory,
    selectedStatus,
    selectedPriority,
  ]);

  const openUpdateModal = (item) => {
    setActiveComplaint(item);

    setUpdateStatusVal(
      item.status || 'In Progress'
    );

    setAssigneeVal(
      item.assigned_to || ''
    );

    setAdminResponseVal(
      item.admin_response || ''
    );
  };

  useEffect(() => {
    const editComplaint = location.state?.editComplaint;

    if (editComplaint) {
      openUpdateModal(editComplaint);

      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleUpdateStatus = async (e) => {
    e.preventDefault();

    if (!activeComplaint) {
      return;
    }

    try {
      setSaving(true);

      const updated =
        await complaintService.updateStatus(
          activeComplaint.id,
          {
            status: updateStatusVal,
            assigned_to: assigneeVal,
            admin_response: adminResponseVal,
          }
        );

      setComplaints((prev) =>
        prev.map((c) =>
          c.id === updated.id
            ? updated
            : c
        )
      );

      addToast(
        `Complaint #${updated.id} updated to ${updated.status}.`,
        'success'
      );

      setActiveComplaint(null);
    } catch (err) {
      console.error(
        'Error updating status:',
        err
      );

      addToast(
        'Failed to update complaint.',
        'error'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      {/* Header */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-brand-dark">
            Campus Grievance Triage Desk
          </h1>

          <p className="text-xs sm:text-sm text-brand-muted">
            Direct maintenance personnel, update ticket progress, and issue resolution responses
          </p>
        </div>

      </div>


      {/* Filter Bar */}

      <div className="p-4 rounded-2xl bg-white border border-brand-border shadow-xs flex flex-col md:flex-row gap-3">

        {/* Search */}

        <div className="relative flex-1">

          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search complaint title, room, or student..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-brand-border bg-slate-50/50 focus:ring-2 focus:ring-brand-teal outline-none"
          />

        </div>


        {/* Category */}

        <div className="w-full md:w-48">

          <select
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(e.target.value)
            }
            className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-brand-border bg-slate-50/50 focus:ring-2 focus:ring-brand-teal outline-none text-slate-700"
          >

            <option value="All">
              All Categories
            </option>

            {COMPLAINT_CATEGORIES.map(
              (cat) => (
                <option
                  key={cat}
                  value={cat}
                >
                  {cat}
                </option>
              )
            )}

          </select>

        </div>


        {/* Status */}

        <div className="w-full md:w-40">

          <select
            value={selectedStatus}
            onChange={(e) =>
              setSelectedStatus(e.target.value)
            }
            className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-brand-border bg-slate-50/50 focus:ring-2 focus:ring-brand-teal outline-none text-slate-700"
          >

            <option value="All">
              All Statuses
            </option>

            {COMPLAINT_STATUSES.map(
              (st) => (
                <option
                  key={st}
                  value={st}
                >
                  {st}
                </option>
              )
            )}

          </select>

        </div>


        {/* Priority */}

        <div className="w-full md:w-36">

          <select
            value={selectedPriority}
            onChange={(e) =>
              setSelectedPriority(e.target.value)
            }
            className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-brand-border bg-slate-50/50 focus:ring-2 focus:ring-brand-teal outline-none text-slate-700"
          >

            <option value="All">
              All Priorities
            </option>

            {COMPLAINT_PRIORITIES.map(
              (priority) => (
                <option
                  key={priority}
                  value={priority}
                >
                  {priority}
                </option>
              )
            )}

          </select>

        </div>

      </div>


      {/* Complaints List */}

      {loading ? (

        <LoadingSkeleton count={4} />

      ) : complaints.length === 0 ? (

        <EmptyState
          title="No complaints match filters"
          message="Adjust or clear your search and filter parameters."
          actionLabel="Reset Filters"
          onAction={() => {
            setSearch('');
            setSelectedCategory('All');
            setSelectedStatus('All');
            setSelectedPriority('All');
          }}
          icon={CheckCircle2}
        />

      ) : (

        <div className="space-y-3">

          {complaints.map((item) => (

            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white border border-brand-border hover:border-brand-teal/40 hover:shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >

              {/* Complaint Information */}

              <div className="space-y-2 flex-1">

                <div className="flex flex-wrap items-center gap-2">

                  <span className="text-xs font-mono font-bold text-brand-muted">
                    #{item.id}
                  </span>

                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-brand-cream border border-brand-border text-brand-teal">
                    {item.category}
                  </span>

                  <PriorityBadge
                    priority={item.priority}
                  />

                  <StatusBadge
                    status={item.status}
                    size="xs"
                  />

                  <span className="text-xs text-brand-muted">
                    • Reported by:{' '}
                    <strong>
                      {item.student_name}
                    </strong>
                  </span>

                </div>


                <div className="text-sm font-bold text-brand-dark">
                  {item.title}
                </div>


                <p className="text-xs text-slate-600 line-clamp-1">
                  {item.description}
                </p>


                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">

                  <span>
                    Location:{' '}
                    <strong>
                      {item.location}
                    </strong>
                  </span>

                  {item.assigned_to && (
                    <span className="text-brand-teal font-medium">
                      Assigned:{' '}
                      {item.assigned_to}
                    </span>
                  )}

                  {item.admin_response && (
                    <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded text-[11px] truncate max-w-xs">
                      Remarks:{' '}
                      {item.admin_response}
                    </span>
                  )}

                </div>

              </div>


              {/* Actions */}

              <div className="shrink-0 flex items-center gap-2">

                {/* Triage */}

                <button
                  type="button"
                  onClick={() =>
                    openUpdateModal(item)
                  }
                  className="px-4 py-2 rounded-xl bg-brand-teal hover:bg-brand-teal-dark text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  Triage / Assign
                </button>


                {/* IMPORTANT:
                    Admin must go to /admin/complaints/:id
                    NOT /complaints/:id
                */}

                <Link
                  to={`/admin/complaints/${item.id}`}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
                  title="Open full complaint details"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>

              </div>

            </div>

          ))}

        </div>

      )}


      {/* Quick Status / Assign Modal */}

      {activeComplaint && (

        <div className="fixed inset-0 z-50 bg-brand-dark/50 backdrop-blur-xs flex items-center justify-center p-4">

          <div className="bg-white rounded-3xl max-w-lg w-full border border-brand-border shadow-2xl p-6 sm:p-8 space-y-5">

            <div className="flex items-center justify-between pb-3 border-b border-slate-100">

              <div>

                <span className="text-xs font-mono font-bold text-brand-teal">
                  Ticket #{activeComplaint.id} •{' '}
                  {activeComplaint.category}
                </span>

                <h3 className="font-heading font-bold text-lg text-brand-dark">
                  Update Ticket Status & Assignee
                </h3>

              </div>

              <button
                type="button"
                onClick={() =>
                  setActiveComplaint(null)
                }
                className="p-1 rounded-lg text-slate-400 hover:text-brand-dark hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>

            </div>


            <form
              onSubmit={handleUpdateStatus}
              className="space-y-4 text-xs sm:text-sm"
            >

              {/* Status */}

              <div>

                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Status Transition
                </label>

                <select
                  value={updateStatusVal}
                  onChange={(e) =>
                    setUpdateStatusVal(
                      e.target.value
                    )
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border bg-slate-50 focus:ring-2 focus:ring-brand-teal outline-none font-medium"
                >

                  {COMPLAINT_STATUSES.map(
                    (st) => (
                      <option
                        key={st}
                        value={st}
                      >
                        {st}
                      </option>
                    )
                  )}

                </select>

              </div>


              {/* Assignee */}

              <div>

                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assigned Technician / Department
                </label>

                <input
                  type="text"
                  value={assigneeVal}
                  onChange={(e) =>
                    setAssigneeVal(
                      e.target.value
                    )
                  }
                  placeholder="e.g. Plumber Ramesh (Maintenance Div)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border bg-slate-50 focus:ring-2 focus:ring-brand-teal outline-none"
                />

              </div>


              {/* Admin Response */}

              <div>

                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Official Administrative / Resolution Remarks
                </label>

                <textarea
                  rows={3}
                  value={adminResponseVal}
                  onChange={(e) =>
                    setAdminResponseVal(
                      e.target.value
                    )
                  }
                  placeholder="Notes sent to student upon resolution or dispatch..."
                  className="w-full px-3.5 py-2 rounded-xl border border-brand-border bg-slate-50 focus:ring-2 focus:ring-brand-teal outline-none leading-relaxed"
                />

              </div>


              {/* Buttons */}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">

                <button
                  type="button"
                  onClick={() =>
                    setActiveComplaint(null)
                  }
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-brand-teal hover:bg-brand-teal-dark text-white text-xs font-bold shadow-xs transition-colors disabled:opacity-60"
                >
                  {saving
                    ? 'Saving...'
                    : 'Apply Status Update'}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}