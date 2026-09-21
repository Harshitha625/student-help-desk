import React from 'react';
import { Link } from 'react-router-dom';

export default function BrandLogo({ className = '', light = false, linkTo = '/' }) {
  const content = (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-brand-teal-dark to-brand-dark border border-brand-teal/40 shadow-sm overflow-hidden group">
        {/* Subtle interior glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-teal/20 via-transparent to-brand-gold/30 pointer-events-none" />
        <svg
          className="w-5 h-5 text-brand-gold transition-transform duration-300 group-hover:scale-110"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Graduation Cap + Shield hybrid icon */}
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      </div>

      <div className="flex flex-col">
        <span
          className={`font-heading text-lg font-bold tracking-tight leading-tight ${
            light ? 'text-white' : 'text-brand-teal'
          }`}
        >
          Student <span className="text-brand-teal">HelpDesk</span>
        </span>
        <span
          className={`text-[10px] tracking-wider uppercase font-semibold ${
            light ? 'text-brand-biscuit/80' : 'text-brand-muted'
          }`}
        >
          Campus Service Platform
        </span>
      </div>
    </div>
  );

  if (linkTo) {
    return <Link to={linkTo} className="inline-block transition-opacity hover:opacity-95">{content}</Link>;
  }

  return content;
}
