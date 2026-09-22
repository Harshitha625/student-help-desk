import React, { useState, useEffect } from 'react';
import {
  Search,
  Users,
  Power
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import LoadingSkeleton, {
  EmptyState
} from '../../components/LoadingSkeleton';

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [togglingId, setTogglingId] = useState(null);
  const { addToast } = useToast();

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await adminService.getStudents(search);
      setStudents(data.results || data || []);
    } catch (err) {
      console.error('Failed to load students:', err);
      addToast('Failed to load students.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchStudents();
    }, 250);
    return () => clearTimeout(delay);
  }, [search]);

  const handleToggleActive = async (
    studentId,
    currentStatus
  ) => {
    try {
      setTogglingId(studentId);

      const res =
        await adminService.toggleUserActive(
          studentId
        );

      setStudents((prev) =>
        prev.map((student) =>
          student.id === studentId
            ? {
                ...student,
                is_active: res.is_active
              }
            : student
        )
      );

      addToast(
        res.message,
        'success'
      );
    } catch (err) {
      console.error(
        'Error toggling user status:',
        err
      );

      addToast(
        'Failed to toggle user status.',
        'error'
      );
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#123c3a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Header */}

        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">
            Student Registry & Account Controls
          </h1>

          <p className="text-xs sm:text-sm text-white/70">
            Active roster of campus students, residential assignments, and account authorization status
          </p>
        </div>

        {/* Search */}

        <div className="p-4 rounded-2xl bg-[#123c3a] border border-white/20 shadow-xs">
          <div className="relative">

            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/50">
              <Search className="w-4 h-4" />
            </div>

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search student by name, USN/roll number, department, or hostel..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-white/20 bg-white text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-teal outline-none"
            />

          </div>
        </div>

        {/* Student List */}

        {loading ? (

          <LoadingSkeleton count={3} />

        ) : students.length === 0 ? (

          <div className="rounded-2xl bg-[#123c3a] border border-white/20 p-6">
            <EmptyState
              title="No students found"
              message="No records matched your search query."
              actionLabel="Clear Search"
              onAction={() => setSearch('')}
              icon={Users}
            />
          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            {students.map((stu) => {

              const profile =
                stu.student_profile || {};

              const isToggling =
                togglingId === stu.id;

              return (
                <div
                  key={stu.id}
                  className="p-5 rounded-2xl bg-[#123c3a] border border-white/20 hover:border-brand-teal/50 transition-all flex flex-col justify-between space-y-4"
                >

                  {/* Student Information */}

                  <div className="space-y-3">

                    <div className="flex items-start justify-between gap-3">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-xl bg-brand-teal-dark text-brand-gold font-bold flex items-center justify-center text-sm border border-brand-teal/30">

                          {stu.first_name
                            ? stu.first_name[0].toUpperCase()
                            : stu.username
                              ? stu.username[0].toUpperCase()
                              : 'S'}

                        </div>

                        <div>

                          <h3 className="font-heading font-bold text-sm text-white">

                            {stu.first_name
                              ? `${stu.first_name} ${stu.last_name || ''}`.trim()
                              : stu.username}

                          </h3>

                          <p className="text-[11px] text-white/60 truncate max-w-[140px]">
                            {stu.email || 'No email'}
                          </p>

                        </div>

                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          stu.is_active
                            ? 'bg-emerald-400/10 text-emerald-300 border-emerald-300/30'
                            : 'bg-rose-400/10 text-rose-300 border-rose-300/30'
                        }`}
                      >
                        {stu.is_active
                          ? 'Active'
                          : 'Disabled'}
                      </span>

                    </div>

                    {/* Student Profile */}

                    <div className="p-3 rounded-xl bg-white/10 border border-white/20 text-xs space-y-1.5">

                      <div className="flex justify-between gap-3">

                        <span className="text-white/60">
                          Roll / USN:
                        </span>

                        <span className="font-bold text-white font-mono">
                          {profile.roll_number || 'N/A'}
                        </span>

                      </div>

                      <div className="flex justify-between gap-3">

                        <span className="text-white/60">
                          Department:
                        </span>

                        <span className="font-medium text-white truncate max-w-[140px]">
                          {profile.department || 'General'}
                        </span>

                      </div>

                      <div className="flex justify-between gap-3">

                        <span className="text-white/60">
                          Hostel & Room:
                        </span>

                        <span className="font-medium text-white">
                          {profile.hostel || 'Dorm'}
                          {' '}
                          ({profile.room_number || 'N/A'})
                        </span>

                      </div>

                      <div className="flex justify-between gap-3">

                        <span className="text-white/60">
                          Mobile:
                        </span>

                        <span className="font-medium text-white">
                          {stu.phone || profile.phone || 'N/A'}
                        </span>

                      </div>

                    </div>

                    {/* Guardian */}

                    {profile.guardian_name && (

                      <div className="text-xs text-white/80 bg-white/10 p-2.5 rounded-xl border border-amber-300/30">

                        <span className="font-semibold text-amber-300 block mb-0.5">
                          Parent / Guardian:
                        </span>

                        <div className="flex justify-between gap-3">

                          <span>
                            {profile.guardian_name}
                          </span>

                          <span className="font-mono font-semibold text-white">
                            {profile.guardian_phone || 'N/A'}
                          </span>

                        </div>

                      </div>

                    )}

                  </div>

                  {/* Account Controls */}

                  <div className="pt-3 border-t border-white/20 flex items-center justify-between text-xs">

                    <span className="text-white/50 text-[11px]">

                      Joined{' '}

                      {stu.date_joined
                        ? new Date(
                            stu.date_joined
                          ).toLocaleDateString()
                        : 'N/A'}

                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        handleToggleActive(
                          stu.id,
                          stu.is_active
                        )
                      }
                      disabled={isToggling}
                      className={`px-3 py-1.5 rounded-xl font-semibold text-xs border transition-colors flex items-center gap-1.5 ${
                        stu.is_active
                          ? 'bg-rose-400/10 text-rose-300 border-rose-300/30 hover:bg-rose-400/20'
                          : 'bg-emerald-400/10 text-emerald-300 border-emerald-300/30 hover:bg-emerald-400/20'
                      } ${
                        isToggling
                          ? 'opacity-60 cursor-not-allowed'
                          : ''
                      }`}
                    >

                      <Power className="w-3 h-3" />

                      <span>
                        {isToggling
                          ? 'Updating...'
                          : stu.is_active
                            ? 'Deactivate'
                            : 'Activate'}
                      </span>

                    </button>

                  </div>

                </div>
              );

            })}

          </div>

        )}

      </div>
    </div>
  );
}