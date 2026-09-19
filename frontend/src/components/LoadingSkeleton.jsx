import React from 'react';

export default function LoadingSkeleton({ count = 3, type = 'card' }) {
  if (type === 'list') {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="p-4 bg-white rounded-xl border border-brand-border/70 animate-pulse flex items-center justify-between"
          >
            <div className="space-y-2 flex-1 max-w-md">
              <div className="h-4 bg-slate-200 rounded w-1/3" />
              <div className="h-3 bg-slate-100 rounded w-2/3" />
            </div>
            <div className="h-6 bg-slate-200 rounded-full w-20" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-6 bg-white rounded-2xl border border-brand-border/70 shadow-xs animate-pulse space-y-4"
        >
          <div className="flex justify-between items-center">
            <div className="h-4 bg-slate-200 rounded w-1/4" />
            <div className="h-5 bg-slate-200 rounded-full w-16" />
          </div>
          <div className="h-5 bg-slate-200 rounded w-3/4" />
          <div className="space-y-2">
            <div className="h-3 bg-slate-100 rounded w-full" />
            <div className="h-3 bg-slate-100 rounded w-5/6" />
          </div>
          <div className="pt-2 flex justify-between items-center border-t border-slate-100">
            <div className="h-3 bg-slate-100 rounded w-20" />
            <div className="h-3 bg-slate-200 rounded w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ title, message, actionLabel, onAction, icon: Icon }) {
  return (
    <div className="p-12 text-center bg-white rounded-2xl border border-brand-border/80 shadow-xs max-w-xl mx-auto my-8 flex flex-col items-center">
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-brand-cream border border-brand-border flex items-center justify-center text-brand-teal mb-4 shadow-inner">
          <Icon className="w-7 h-7" />
        </div>
      )}
      <h3 className="font-heading font-bold text-lg text-brand-dark mb-1">{title}</h3>
      <p className="text-sm text-brand-muted max-w-md mb-6 leading-relaxed">{message}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 rounded-xl bg-brand-teal text-white font-medium text-sm hover:bg-brand-teal-dark transition-colors shadow-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
