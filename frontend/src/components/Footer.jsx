import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ShieldAlert, Heart } from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white border-t border-brand-teal-dark mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Brand & Purpose */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo light linkTo="/" />
            <p className="text-sm text-brand-biscuit/80 max-w-sm leading-relaxed">
              Student HelpDesk is an integrated, role-governed campus service platform empowering students, wardens, and administrators with transparent complaint resolution and digital outpass management.
            </p>
            <div className="flex items-center gap-2 text-xs text-brand-muted">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Campus Service Systems Online & Operational</span>
            </div>
          </div>

          {/* Col 2: Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-gold font-heading">
              Platform Modules
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><Link to="/complaints" className="hover:text-brand-biscuit transition-colors">Lodge Complaints</Link></li>
              <li><Link to="/outpasses" className="hover:text-brand-biscuit transition-colors">Outpass System</Link></li>
              <li><Link to="/warden" className="hover:text-brand-biscuit transition-colors">Warden Verification</Link></li>
              <li><Link to="/admin" className="hover:text-brand-biscuit transition-colors">Campus Control Center</Link></li>
              <li><a href="http://127.0.0.1:8000/admin/" target="_blank" rel="noreferrer" className="hover:text-brand-biscuit transition-colors">Django Admin Panel ↗</a></li>
            </ul>
          </div>

          {/* Col 3: Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-gold font-heading">
              Help & Resources
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><a href="/#faq" className="hover:text-brand-biscuit transition-colors">Frequently Asked Questions</a></li>
              <li><a href="/#how-it-works" className="hover:text-brand-biscuit transition-colors">How Outpass Verification Works</a></li>
              <li><a href="/#roles" className="hover:text-brand-biscuit transition-colors">Role Responsibilities</a></li>
              <li><Link to="/settings" className="hover:text-brand-biscuit transition-colors">Privacy & Account Settings</Link></li>
            </ul>
          </div>

          {/* Col 4: Campus Emergency Helpline */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-gold font-heading">
              Emergency Contacts
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <Phone className="w-3.5 h-3.5 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Campus Control Room</div>
                  <div>+91 (080) 2839-4400</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Hostel Medical Helpdesk</div>
                  <div>+91 94400 11999 (24/7)</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-3.5 h-3.5 text-brand-teal-soft shrink-0 mt-0.5" />
                <div>
                  <div>helpdesk@campus.edu</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-brand-dark-border flex flex-col sm:flex-row items-center justify-between text-xs text-brand-muted gap-4">
          <p>© {new Date().getFullYear()} Student HelpDesk Platform. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built for modern collegiate campus governance
          </p>
        </div>
      </div>
    </footer>
  );
}
