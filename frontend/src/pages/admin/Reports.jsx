import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  BarChart3,
  Building2,
  CheckCircle2,
  Clock,
  FileText,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import LoadingSkeleton from '../../components/LoadingSkeleton';

export default function Reports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await adminService.getReports();
      setData(response);
    } catch (err) {
      console.error('Failed to load admin reports:', err);

      if (err.response?.status === 403) {
        setError(
          'You do not have permission to view administrative reports.'
        );
      } else {
        setError(
          'Could not load reports. Please check that the backend is running.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <LoadingSkeleton count={4} />
      </div>
    );
  }

  const categoryBreakdown = data?.category_breakdown || [];
  const hostelBreakdown = data?.hostel_breakdown || [];

  const totalCategoryComplaints = categoryBreakdown.reduce(
    (sum, item) => sum + Number(item.total || 0),
    0
  );

  const totalResolved = categoryBreakdown.reduce(
    (sum, item) => sum + Number(item.resolved || 0),
    0
  );

  const totalPending = categoryBreakdown.reduce(
    (sum, item) => sum + Number(item.pending || 0),
    0
  );

  const resolutionRate =
    totalCategoryComplaints > 0
      ? Math.round((totalResolved / totalCategoryComplaints) * 100)
      : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back */}
      <div>
        <Link
          to="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-muted hover:text-brand-teal transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Admin Dashboard</span>
        </Link>
      </div>

      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-dark via-brand-teal-dark to-brand-dark text-white border border-brand-teal/40 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-brand-gold text-xs font-semibold border border-white/10 mb-3">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Administrative Analytics</span>
            </div>

            <h1 className="font-heading text-2xl sm:text-3xl font-bold">
              Reports & Analytics
            </h1>

            <p className="text-xs sm:text-sm text-brand-biscuit/80 mt-1 max-w-2xl">
              Review complaint distribution, resolution progress, and hostel-wise
              complaint activity.
            </p>
          </div>

          <button
            onClick={fetchReports}
            disabled={loading}
            className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 shrink-0 mt-0.5" />

            <div>
              <p className="text-sm font-bold">
                Reports could not be loaded
              </p>

              <p className="text-xs mt-1">
                {error}
              </p>

              <button
                onClick={fetchReports}
                className="mt-3 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      {!error && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-brand-border shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs text-brand-muted font-medium">
                  Total Complaints
                </span>

                <FileText className="w-4 h-4 text-brand-teal" />
              </div>

              <p className="text-2xl font-bold font-heading text-brand-dark mt-2">
                {totalCategoryComplaints}
              </p>

              <p className="text-[11px] text-brand-muted mt-1">
                Across all categories
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-brand-border shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs text-brand-muted font-medium">
                  Resolved
                </span>

                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>

              <p className="text-2xl font-bold font-heading text-emerald-700 mt-2">
                {totalResolved}
              </p>

              <p className="text-[11px] text-brand-muted mt-1">
                Successfully resolved
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-brand-border shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs text-brand-muted font-medium">
                  Pending / Active
                </span>

                <Clock className="w-4 h-4 text-amber-600" />
              </div>

              <p className="text-2xl font-bold font-heading text-amber-700 mt-2">
                {totalPending}
              </p>

              <p className="text-[11px] text-brand-muted mt-1">
                Require attention
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-brand-border shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs text-brand-muted font-medium">
                  Resolution Rate
                </span>

                <TrendingUp className="w-4 h-4 text-brand-teal" />
              </div>

              <p className="text-2xl font-bold font-heading text-brand-teal mt-2">
                {resolutionRate}%
              </p>

              <p className="text-[11px] text-brand-muted mt-1">
                Based on complaint records
              </p>
            </div>
          </div>

          {/* Main Reports */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Breakdown */}
            <div className="p-6 rounded-3xl bg-white border border-brand-border shadow-card-soft">
              <div className="flex items-center gap-3 pb-4 mb-5 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-brand-teal/10 text-brand-teal flex items-center justify-center">
                  <BarChart3 className="w-5 h-5" />
                </div>

                <div>
                  <h2 className="font-heading font-bold text-base text-brand-dark">
                    Complaints by Category
                  </h2>

                  <p className="text-xs text-brand-muted">
                    Total, resolved, and active complaints
                  </p>
                </div>
              </div>

              {categoryBreakdown.length === 0 ? (
                <div className="py-10 text-center">
                  <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />

                  <p className="text-sm font-semibold text-brand-dark">
                    No complaint data
                  </p>

                  <p className="text-xs text-brand-muted mt-1">
                    There are no complaint records to display.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {categoryBreakdown.map((item, index) => {
                    const total = Number(item.total || 0);
                    const resolved = Number(item.resolved || 0);
                    const pending = Number(item.pending || 0);

                    const percentage =
                      totalCategoryComplaints > 0
                        ? Math.round(
                            (total / totalCategoryComplaints) * 100
                          )
                        : 0;

                    const resolvedPercentage =
                      total > 0
                        ? Math.round((resolved / total) * 100)
                        : 0;

                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm font-bold text-brand-dark">
                            {item.category || 'Uncategorized'}
                          </span>

                          <span className="text-xs font-mono text-slate-500">
                            {total} ({percentage}%)
                          </span>
                        </div>

                        <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-brand-teal transition-all"
                            style={{
                              width: `${percentage}%`,
                            }}
                          />
                        </div>

                        <div className="flex items-center gap-4 text-[11px]">
                          <span className="text-emerald-700 font-semibold">
                            Resolved: {resolved}
                          </span>

                          <span className="text-amber-700 font-semibold">
                            Active: {pending}
                          </span>

                          <span className="text-slate-400">
                            {resolvedPercentage}% resolved
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Hostel Breakdown */}
            <div className="p-6 rounded-3xl bg-white border border-brand-border shadow-card-soft">
              <div className="flex items-center gap-3 pb-4 mb-5 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-brand-gold flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>

                <div>
                  <h2 className="font-heading font-bold text-base text-brand-dark">
                    Complaints by Hostel
                  </h2>

                  <p className="text-xs text-brand-muted">
                    Hostel-wise complaint activity
                  </p>
                </div>
              </div>

              {hostelBreakdown.length === 0 ? (
                <div className="py-10 text-center">
                  <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />

                  <p className="text-sm font-semibold text-brand-dark">
                    No hostel data
                  </p>

                  <p className="text-xs text-brand-muted mt-1">
                    No hostel complaint records are available.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {hostelBreakdown.map((item, index) => {
                    const maxCount = Math.max(
                      ...hostelBreakdown.map(
                        (hostel) => Number(hostel.count || 0)
                      ),
                      1
                    );

                    const percentage =
                      (Number(item.count || 0) / maxCount) * 100;

                    return (
                      <div
                        key={index}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-200"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold text-brand-dark">
                            {item.hostel || 'Unassigned'}
                          </span>

                          <span className="text-sm font-bold text-brand-teal">
                            {item.count}
                          </span>
                        </div>

                        <div className="w-full h-2 rounded-full bg-white overflow-hidden">
                          <div
                            className="h-full rounded-full bg-brand-gold"
                            style={{
                              width: `${percentage}%`,
                            }}
                          />
                        </div>

                        <p className="text-[11px] text-brand-muted mt-2">
                          Complaint records
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Report Information */}
          <div className="p-5 rounded-2xl bg-brand-cream/60 border border-brand-border">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-brand-teal shrink-0 mt-0.5" />

              <div>
                <h3 className="text-sm font-bold text-brand-dark">
                  About these reports
                </h3>

                <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                  These analytics are generated from the complaint records
                  currently stored in the Student HelpDesk system. Category
                  and hostel figures are calculated from the backend report
                  service.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}