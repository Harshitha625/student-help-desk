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
} from 'lucide-react';
import api from '../../services/api';
import LoadingSkeleton, { EmptyState } from '../../components/LoadingSkeleton';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/auth/students/', {
        params: search ? { search } : {},
      });
      const data = response.data;
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
    <div className="min-h-screen bg-[#06130f] text-[#f5eee2]">
      {/* Background atmosphere */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[420px] h-[420px] rounded-full bg-[#2a6b5c]/10 blur-[120px]" />
        <div className="absolute bottom-20 left-[-150px] w-[360px] h-[360px] rounded-full bg-[#c49a45]/5 blur-[110px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#cda86a]" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#c49a45]">
                Residential Directory
              </span>
            </div>

            <h1 className="premium-serif text-3xl sm:text-4xl lg:text-5xl leading-tight text-[#f5eee2]">
              Hostel Student
              <span className="italic text-[#cda86a]"> Directory</span>
            </h1>

            <p className="text-xs sm:text-sm text-[#aebdb5] mt-3 max-w-2xl leading-6">
              Active residential student roster, room allocations and guardian
              contact references in one connected workspace.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-auto">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#315b50] bg-[#0b211b]">
              <Users className="w-3.5 h-3.5 text-[#cda86a]" />
              <span className="text-[9px] uppercase tracking-[0.18em] text-[#84978f]">
                Students
              </span>
              <span className="text-sm font-bold text-[#cda86a]">
                {students.length}
              </span>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative rounded-[24px] border border-[#29483f] bg-[#0b211b] p-4 sm:p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
          <div className="absolute inset-0 pointer-events-none rounded-[24px] bg-[radial-gradient(circle_at_10%_0%,rgba(196,154,69,0.08),transparent_35%)]" />

          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <Search className="w-4 h-4 text-[#cda86a]" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#c49a45]">
                Find a student
              </span>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-[#71857c]" />
              </div>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by student name, roll number, hostel block, or department..."
                className="
                  w-full
                  pl-11
                  pr-4
                  py-3
                  text-xs
                  sm:text-sm
                  rounded-xl
                  border
                  border-[#35574f]
                  bg-[#071a15]
                  text-[#f5eee2]
                  placeholder:text-[#657970]
                  outline-none
                  focus:border-[#c49a45]
                  focus:ring-1
                  focus:ring-[#c49a45]/40
                  transition-all
                "
              />
            </div>
          </div>
        </div>

        {/* Student Cards */}
        {loading ? (
          <LoadingSkeleton count={3} />
        ) : students.length === 0 ? (
          <div className="rounded-[24px] border border-[#29483f] bg-[#0b211b] p-8">
            <EmptyState
              title="No student records found"
              message="No residential students matched your search criteria."
              actionLabel="Clear Search"
              onAction={() => setSearch('')}
              icon={Users}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map((stu) => {
              const profile = stu.student_profile || {};

              return (
                <div
                  key={stu.id}
                  className="
                    group
                    relative
                    overflow-hidden
                    p-5
                    rounded-[24px]
                    bg-[#0b211b]
                    border
                    border-[#29483f]
                    hover:border-[#c49a45]/50
                    hover:bg-[#102b24]
                    hover:-translate-y-1
                    transition-all
                    duration-300
                    space-y-4
                  "
                >
                  {/* Gold glow */}
                  <div className="absolute -right-16 -top-16 w-32 h-32 rounded-full bg-[#c49a45]/5 blur-2xl pointer-events-none group-hover:bg-[#c49a45]/10 transition-colors" />

                  {/* Student identity */}
                  <div className="relative flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="
                        w-11
                        h-11
                        rounded-xl
                        bg-[#123f36]
                        border
                        border-[#315b50]
                        text-[#cda86a]
                        font-bold
                        flex
                        items-center
                        justify-center
                        text-sm
                        shrink-0
                      ">
                        {stu.first_name
                          ? stu.first_name[0].toUpperCase()
                          : stu.username[0].toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-heading font-bold text-sm text-[#f5eee2] truncate">
                          {stu.first_name
                            ? `${stu.first_name} ${stu.last_name || ''}`
                            : stu.username}
                        </h3>

                        <p className="text-[11px] text-[#87978f] truncate max-w-[170px] mt-0.5">
                          {stu.email || stu.username}
                        </p>
                      </div>
                    </div>

                    {profile.roll_number && (
                      <span className="
                        text-[9px]
                        font-mono
                        px-2
                        py-1
                        rounded-full
                        bg-[#c49a45]/10
                        border
                        border-[#c49a45]/25
                        text-[#d4b477]
                        font-bold
                        shrink-0
                      ">
                        {profile.roll_number}
                      </span>
                    )}
                  </div>

                  {/* Student details */}
                  <div className="
                    relative
                    p-4
                    rounded-2xl
                    bg-[#071a15]
                    border
                    border-[#29483f]
                    text-xs
                    space-y-3
                  ">
                    <div className="flex items-center gap-2 mb-3">
                      <Building2 className="w-3.5 h-3.5 text-[#cda86a]" />
                      <span className="text-[9px] uppercase tracking-[0.18em] text-[#c49a45]">
                        Residential Details
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-3">
                      <span className="text-[#71857c] flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5" />
                        Hostel & Room
                      </span>

                      <span className="font-semibold text-[#d7dfda] text-right">
                        {profile.hostel || 'Dorm'}
                        {profile.room_number
                          ? ` (${profile.room_number})`
                          : ''}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-3">
                      <span className="text-[#71857c] flex items-center gap-2">
                        <BookOpen className="w-3.5 h-3.5" />
                        Department
                      </span>

                      <span className="font-semibold text-[#d7dfda] text-right truncate max-w-[150px]">
                        {profile.department || 'Academic'}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-3">
                      <span className="text-[#71857c] flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5" />
                        Student Phone
                      </span>

                      <span className="font-semibold text-[#d7dfda] text-right">
                        {stu.phone || profile.phone || 'N/A'}
                      </span>
                    </div>
                  </div>

                  {/* Guardian */}
                  {profile.guardian_name && (
                    <div className="
                      relative
                      p-3.5
                      rounded-2xl
                      bg-[#c49a45]/8
                      border
                      border-[#c49a45]/25
                    ">
                      <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#cda86a]" />

                        <span className="text-[9px] uppercase tracking-[0.18em] text-[#c49a45] font-semibold">
                          Parent / Guardian
                        </span>
                      </div>

                      <div className="flex justify-between items-center gap-3">
                        <span className="text-xs text-[#d4dcd7]">
                          {profile.guardian_name}
                        </span>

                        <span className="font-mono text-[11px] font-bold text-[#cda86a]">
                          {profile.guardian_phone || 'N/A'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Footer line */}
                  <div className="relative pt-1 border-t border-[#29483f] flex items-center justify-between">
                    <span className="text-[9px] uppercase tracking-[0.16em] text-[#657970]">
                      Residential Student
                    </span>

                    <Hash className="w-3.5 h-3.5 text-[#536a61]" />
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