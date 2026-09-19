import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Users, 
  Building2, 
  Phone, 
  Mail, 
  BookOpen, 
  ShieldCheck, 
  Hash, 
  CheckCircle2 
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import LoadingSkeleton, { EmptyState } from '../../components/LoadingSkeleton';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await adminService.getStudents(search);
      setStudents(data || []);
    } catch (err) {
      console.error('Failed to load students:', err);
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-brand-dark">
          Hostel Student Directory
        </h1>
        <p className="text-xs sm:text-sm text-brand-muted">
          Active residential student roster, room allocations, and guardian contact references
        </p>
      </div>

      {/* Search */}
      <div className="p-4 rounded-2xl bg-white border border-brand-border shadow-xs">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, roll number, hostel block, or department..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-brand-border bg-slate-50/50 focus:ring-2 focus:ring-brand-teal outline-none"
          />
        </div>
      </div>

      {/* Student Cards Grid */}
      {loading ? (
        <LoadingSkeleton count={3} />
      ) : students.length === 0 ? (
        <EmptyState
          title="No student records found"
          message="No residential students matched your search criteria."
          actionLabel="Clear Search"
          onAction={() => setSearch('')}
          icon={Users}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map((stu) => {
            const profile = stu.student_profile || {};
            return (
              <div
                key={stu.id}
                className="p-5 rounded-2xl bg-white border border-brand-border hover:border-brand-teal/40 hover:shadow-xs transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-teal-dark text-brand-gold font-bold flex items-center justify-center text-sm border border-brand-teal/30">
                      {stu.first_name ? stu.first_name[0].toUpperCase() : stu.username[0].toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-sm text-brand-dark">
                        {stu.first_name ? `${stu.first_name} ${stu.last_name || ''}` : stu.username}
                      </h3>
                      <p className="text-[11px] text-brand-muted truncate max-w-[140px]">{stu.email || stu.username}</p>
                    </div>
                  </div>

                  {profile.roll_number && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-cream border border-brand-border text-brand-teal font-bold">
                      {profile.roll_number}
                    </span>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Hostel & Room:</span>
                    <span className="font-semibold text-brand-dark">
                      {profile.hostel || 'Dorm'} {profile.room_number ? `(${profile.room_number})` : ''}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Department:</span>
                    <span className="font-semibold text-brand-dark truncate max-w-[150px]">
                      {profile.department || 'Academic'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Student Phone:</span>
                    <span className="font-semibold text-brand-dark">
                      {stu.phone || profile.phone || 'N/A'}
                    </span>
                  </div>
                </div>

                {profile.guardian_name && (
                  <div className="pt-1 text-xs text-amber-900 bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/80">
                    <span className="font-semibold block mb-0.5">Parent / Guardian:</span>
                    <div className="flex justify-between items-center">
                      <span>{profile.guardian_name}</span>
                      <span className="font-mono font-bold text-brand-dark">{profile.guardian_phone || 'N/A'}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
