import React from 'react';
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  ShieldCheck, 
  ArrowRightCircle,
  HelpCircle
} from 'lucide-react';

export default function StatusBadge({ status, type = 'complaint', size = 'sm' }) {
  const s = String(status || '').trim();

  let bg = 'bg-slate-100 text-slate-700 border-slate-200';
  let Icon = HelpCircle;

  // Complaint statuses: Pending, Assigned, In Progress, Resolved, Rejected
  if (s === 'Pending') {
    bg = 'bg-amber-50 text-amber-700 border-amber-200/80';
    Icon = Clock;
  } else if (s === 'Assigned') {
    bg = 'bg-sky-50 text-sky-700 border-sky-200/80';
    Icon = ArrowRightCircle;
  } else if (s === 'In Progress') {
    bg = 'bg-teal-50 text-brand-teal border-brand-teal/30';
    Icon = ArrowRightCircle;
  } else if (s === 'Resolved' || s === 'Approved' || s === 'Completed' || s === 'Verified') {
    bg = 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
    Icon = CheckCircle2;
  } else if (s === 'Rejected' || s === 'Failed') {
    bg = 'bg-rose-50 text-rose-700 border-rose-200/80';
    Icon = XCircle;
  } else if (s === 'Parent Verification') {
    bg = 'bg-amber-50 text-amber-800 border-amber-300';
    Icon = ShieldCheck;
  } else if (s === 'Warden Review') {
    bg = 'bg-indigo-50 text-indigo-700 border-indigo-200';
    Icon = Clock;
  }

  const sizeClasses = size === 'xs' 
    ? 'text-[11px] px-2 py-0.5' 
    : size === 'md' 
    ? 'text-sm px-3 py-1' 
    : 'text-xs px-2.5 py-0.5';

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full border shadow-2xs ${bg} ${sizeClasses}`}>
      <Icon className={size === 'xs' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      <span>{s}</span>
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const p = String(priority || 'Medium').trim();
  let color = 'bg-slate-100 text-slate-700 border-slate-200';

  if (p === 'Low') color = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (p === 'Medium') color = 'bg-blue-50 text-blue-700 border-blue-200';
  if (p === 'High') color = 'bg-amber-50 text-amber-800 border-amber-200';
  if (p === 'Urgent') color = 'bg-rose-100 text-rose-800 border-rose-300 font-semibold animate-pulse';

  return (
    <span className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-md border ${color}`}>
      {p}
    </span>
  );
}
