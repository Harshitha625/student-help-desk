import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building2,
  Utensils,
  Wifi,
  Wrench,
  GraduationCap,
  Sparkles,
  ChevronDown,
  UserCheck,
  FileText,
  Bell,
  MessageSquare,
  Compass,
  AlertTriangle,
  Send,
  SlidersHorizontal,
  ChevronRight,
  HelpCircle,
  Layers,
} from 'lucide-react';
import BrandLogo from '../components/BrandLogo';

export default function LandingPage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeRole, setActiveRole] = useState('student');
  const [openFaq, setOpenFaq] = useState(0);

  // Mouse spotlight glow
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const roles = [
    {
      id: 'student',
      title: 'Student Portal',
      subtitle: 'Effortless campus requests & real-time tracking',
      badge: 'Empowering Students',
      color: 'from-brand-teal to-brand-teal-dark',
      icon: GraduationCap,
      features: [
        'Lodge complaints with photos, priority & category',
        'Option for 100% anonymous sensitive reports',
        'Apply for digital weekend or emergency outpasses',
        'Real-time status updates via slide-over notifications',
        'Direct remarks and dialogue with campus technicians',
      ],
      ctaText: 'Access Student Portal',
      ctaLink: '/login',
    },
    {
      id: 'warden',
      title: 'Warden Workspace',
      subtitle: 'Streamlined outpass verification & hostel oversight',
      badge: 'Residential Security',
      color: 'from-brand-teal-dark to-brand-dark',
      icon: ShieldCheck,
      features: [
        'Dedicated outpass queue with one-click review',
        'Parent phone verification logging & audit notes',
        'Instant gate pass generation & student hostel roster',
        'Direct communication channel with residential students',
        'Comprehensive arrival and departure timestamps',
      ],
      ctaText: 'Access Warden Desk',
      ctaLink: '/login',
    },
    {
      id: 'admin',
      title: 'Campus Control Center',
      subtitle: 'Centralized administration, analytics & reporting',
      badge: 'Unified Governance',
      color: 'from-brand-dark to-slate-900',
      icon: SlidersHorizontal,
      features: [
        'Live campus health analytics & resolution speed metrics',
        'Assign tickets directly to maintenance staff & plumbers',
        'Dual administration: Custom React suite + Native Django Admin',
        'Broadcast emergency campus announcements instantly',
        'Exportable category and hostel-wise resolution reports',
      ],
      ctaText: 'Open Campus Control',
      ctaLink: '/login',
    },
  ];

  const problems = [
    {
      title: 'Hostel Maintenance',
      desc: 'Plumbing blockages, bathroom fittings, and structural repairs.',
      icon: Wrench,
      accent: 'text-brand-teal',
      bg: 'bg-teal-50',
    },
    {
      title: 'Mess & Food Quality',
      desc: 'Food hygiene feedback, catering schedules, and mess concerns.',
      icon: Utensils,
      accent: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      title: 'Campus Wi-Fi & Internet',
      desc: 'Bandwidth issues, router down-times, and dorm connectivity.',
      icon: Wifi,
      accent: 'text-sky-600',
      bg: 'bg-sky-50',
    },
    {
      title: 'Room & Infrastructure',
      desc: 'Fan regulators, lighting, bed frames, and study furniture.',
      icon: Building2,
      accent: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      title: 'Hostel Outpass Approvals',
      desc: 'Eliminating paper slips with fast digital parent verification.',
      icon: FileText,
      accent: 'text-brand-gold',
      bg: 'bg-yellow-50',
    },
    {
      title: 'Academic & Labs Support',
      desc: 'Projector failures, lab equipment issues, and classroom amenities.',
      icon: GraduationCap,
      accent: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      title: 'General Campus Grievances',
      desc: 'Security requests, transport, sanitation, and safety concerns.',
      icon: AlertTriangle,
      accent: 'text-rose-600',
      bg: 'bg-rose-50',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Raise Request',
      desc: 'Select complaint category or outpass destination, set urgency, and attach photos in seconds.',
      icon: Send,
      previewBadge: 'Step 1 of 4: Initialized',
    },
    {
      number: '02',
      title: 'Request Reviewed',
      desc: 'Wardens verify guardian consent for outpasses; admins assign technicians to complaints.',
      icon: UserCheck,
      previewBadge: 'Warden Verified',
    },
    {
      number: '03',
      title: 'Track Progress',
      desc: 'Follow the animated multi-stage status tracker with real-time comments and technician arrival times.',
      icon: Compass,
      previewBadge: 'Status: In Progress',
    },
    {
      number: '04',
      title: 'Get Resolution',
      desc: 'Receive official resolution notes, closure sign-off, and confirm your safe return to campus.',
      icon: CheckCircle2,
      previewBadge: 'Resolved & Signed Off',
    },
  ];

  const faqs = [
    {
      q: 'How do complaints work?',
      a: 'When you submit a complaint, it is automatically cataloged in the campus control desk. Administrators route the ticket to the relevant department (Electrical, Plumbing, IT, etc.), and you can track every status transition live on your interactive timeline.',
    },
    {
      q: 'Can I submit anonymous complaints?',
      a: 'Yes! When creating a complaint, you can toggle "Submit Anonymously". Your name and roll number will be masked on public and technician views to ensure safety and comfort when raising sensitive campus concerns.',
    },
    {
      q: 'How does outpass approval work?',
      a: 'After you submit your departure date, destination, and parent contact details, your hostel warden receives an instant triage notification. Once the warden verifies parental consent, your outpass status transitions to Approved with an official gate authorization note.',
    },
    {
      q: 'Who verifies parents?',
      a: 'Hostel wardens perform parent verification via direct phone contact or verified parent credentials stored in your student profile, logging audit notes directly onto the request.',
    },
    {
      q: 'How do I know when my request changes?',
      a: 'Student HelpDesk features an automated campus notification engine. Whenever an admin assigns a technician, changes status, or approves an outpass, an instant notification appears in your slide-over drawer.',
    },
    {
      q: 'Can I track old requests?',
      a: 'Absolutely. All previous complaints and completed outpasses are permanently indexed in your personal history, allowing you to review past resolutions, timestamps, and technician remarks at any time.',
    },
  ];

  return (
    <div className="relative overflow-hidden bg-brand-cream selection:bg-brand-teal selection:text-white">
      {/* Interactive mouse background spotlight */}
      <div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 opacity-60 hidden md:block"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(42, 107, 92, 0.07), transparent 80%)`,
        }}
      />

      {/* ===================== HERO SECTION ===================== */}
      <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden border-b border-brand-border/60">
        {/* Subtle decorative background gradient blobs */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-tr from-brand-teal/10 via-brand-biscuit/20 to-transparent blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-teal/10 border border-brand-teal/20 text-brand-teal text-xs font-semibold tracking-wide"
              >
                <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                <span>Next-Generation Campus Service Platform</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brand-dark tracking-tight leading-[1.15]"
              >
                Because your <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-brand-teal to-brand-teal-dark bg-clip-text text-transparent">
                  college life
                </span>{' '}
                matters.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal"
              >
                Raise complaints, apply for outpasses, track requests, and get the help you need — all in one place. Designed for students, trusted by campus authorities.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
              >
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-brand-teal hover:bg-brand-teal-dark text-white font-semibold text-sm shadow-md hover:shadow-teal-glow transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Get Started Now</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <a
                  href="#how-it-works"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-brand-cream text-brand-dark font-semibold text-sm border border-brand-border shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <span>Explore How It Works</span>
                </a>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-brand-muted"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-gold" />
                  <span>24/7 Digital Grievance Desk</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-gold" />
                  <span>Verified Parent Gatepasses</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-gold" />
                  <span>Dual Admin Governance</span>
                </div>
              </motion.div>
            </div>

            {/* Hero Right Visual with Floating UI Notifications */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              {/* Central Campus Visual Card */}
              <div className="relative w-full max-w-md rounded-3xl p-6 bg-gradient-to-br from-brand-teal-dark via-brand-dark to-[#040A09] text-white shadow-2xl border border-brand-teal/30 overflow-hidden group">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-brand-teal/30 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-brand-gold/15 rounded-full blur-3xl pointer-events-none" />

                {/* Card Header */}
                <div className="flex items-center justify-between border-b border-brand-teal/30 pb-4 mb-6 relative z-10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-brand-biscuit/70 font-semibold">
                    Campus Live Service Desk
                  </span>
                </div>

                {/* Card Body - Simulated Campus Interface Preview */}
                <div className="space-y-4 relative z-10">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-brand-biscuit">Hostel Cauvery Block B</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium">
                        Active Triage
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-white">Water Basin Leakage Resolved</div>
                    <div className="text-xs text-slate-300 mt-1">
                      Technician visited Room B-304. Joint replaced & verified.
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-[11px] text-brand-biscuit/80">Avg. Resolution</div>
                      <div className="text-xl font-bold font-heading text-white mt-0.5">3.4 hrs</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-[11px] text-brand-biscuit/80">Outpass Approval</div>
                      <div className="text-xl font-bold font-heading text-brand-gold mt-0.5">99.2%</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-brand-teal/20 border border-brand-teal/30 text-xs text-slate-200 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      Parent Verification Queue
                    </span>
                    <span className="font-semibold text-white font-mono">0 pending</span>
                  </div>
                </div>
              </div>

              {/* Floating Pill 1: Outpass Approved */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-6 -left-4 sm:-left-8 bg-white/95 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl border border-brand-border shadow-xl flex items-center gap-3 z-20"
              >
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-brand-dark">Outpass Request Approved</div>
                  <div className="text-[10px] text-slate-500">Destination: Bangalore • Gate Pass Active</div>
                </div>
              </motion.div>

              {/* Floating Pill 2: Complaint In Progress */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -bottom-6 -right-2 sm:-right-6 bg-white/95 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl border border-brand-border shadow-xl flex items-center gap-3 z-20"
              >
                <div className="p-2 rounded-xl bg-amber-50 text-brand-gold">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-brand-dark">Complaint #1042: In Progress</div>
                  <div className="text-[10px] text-slate-500">Wi-Fi Router Firmware Patch</div>
                </div>
              </motion.div>

              {/* Floating Pill 3: Parent Verification */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="hidden sm:flex absolute top-1/2 -right-10 bg-white/95 backdrop-blur-md p-2.5 rounded-xl border border-brand-border shadow-lg items-center gap-2 z-20"
              >
                <ShieldCheck className="w-4 h-4 text-brand-teal" />
                <span className="text-[11px] font-semibold text-brand-dark">Parent Verification Complete</span>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== PLATFORM ROLES ===================== */}
      <section id="roles" className="py-20 lg:py-28 bg-white border-b border-brand-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
            <span className="text-xs font-bold tracking-widest uppercase text-brand-teal">
              Designed for Campus Stakeholders
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-brand-dark">
              Three Distinct, Tailored Experiences
            </h2>
            <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
              Whether you are living in campus housing, overseeing residential safety, or leading administrative operations, Student HelpDesk delivers dedicated workflows.
            </p>
          </div>

          {/* Interactive Role Selector Tabs */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex p-1.5 rounded-2xl bg-brand-cream border border-brand-border shadow-2xs">
              {roles.map((r) => {
                const Icon = r.icon;
                const isSelected = activeRole === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => setActiveRole(r.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                      isSelected
                        ? 'bg-brand-teal text-white shadow-sm'
                        : 'text-slate-600 hover:text-brand-teal'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{r.title.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Role Showcase Card */}
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              {roles
                .filter((r) => r.id === activeRole)
                .map((role) => {
                  const Icon = role.icon;
                  return (
                    <motion.div
                      key={role.id}
                      initial={{ opacity: 0, scale: 0.98, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98, y: -15 }}
                      transition={{ duration: 0.3 }}
                      className="p-8 sm:p-12 rounded-3xl bg-brand-cream border border-brand-border shadow-card-soft"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                        <div className="md:col-span-7 space-y-5">
                          <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-brand-biscuit/40 text-brand-gold border border-brand-gold/30">
                            {role.badge}
                          </span>
                          <h3 className="font-heading text-2xl sm:text-3xl font-bold text-brand-dark">
                            {role.title}
                          </h3>
                          <p className="text-sm text-slate-600 leading-relaxed font-medium">
                            {role.subtitle}
                          </p>

                          <div className="space-y-2.5 pt-2">
                            {role.features.map((feat, idx) => (
                              <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                                <CheckCircle2 className="w-4 h-4 text-brand-teal shrink-0 mt-0.5" />
                                <span>{feat}</span>
                              </div>
                            ))}
                          </div>

                          <div className="pt-4">
                            <Link
                              to={role.ctaLink}
                              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-teal text-white font-semibold text-sm hover:bg-brand-teal-dark shadow-sm transition-colors"
                            >
                              <span>{role.ctaText}</span>
                              <ChevronRight className="w-4 h-4" />
                            </Link>
                          </div>
                        </div>

                        <div className="md:col-span-5 flex justify-center">
                          <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-3xl bg-gradient-to-br from-brand-teal-dark to-brand-dark p-6 flex flex-col items-center justify-center text-white text-center shadow-xl border border-brand-teal/40">
                            <Icon className="w-16 h-16 text-brand-gold mb-3 stroke-1" />
                            <span className="font-heading font-bold text-lg">{role.title}</span>
                            <span className="text-xs text-brand-biscuit/80 mt-1">Connected Live API</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ===================== WHY STUDENT HELPDESK ===================== */}
      <section id="why-us" className="py-20 lg:py-28 bg-brand-cream border-b border-brand-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold tracking-widest uppercase text-brand-gold">
              Core Advantages
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-brand-dark">
              Why Campus Communities Choose Us
            </h2>
            <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
              Replacing fragmented messaging apps, paper outpass logbooks, and physical notice boards with a modern unified platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Everything In One Place',
                desc: 'Consolidate complaints, outpasses, parent verification, technician assignments, and notifications under one unified portal.',
                icon: Layers,
              },
              {
                title: 'Simple Request Process',
                desc: 'Intuitive multi-step wizards guide students smoothly through attaching images, selecting categories, and filing requests.',
                icon: Send,
              },
              {
                title: 'Real-Time Tracking',
                desc: 'Follow status progressions from Pending to Assigned, In Progress, and Resolved with live timestamps.',
                icon: Compass,
              },
              {
                title: 'Instant Notifications',
                desc: 'Automated alerts in the slide-over notification drawer ensure you never miss a technician remark or outpass decision.',
                icon: Bell,
              },
              {
                title: 'Secure Access & Roles',
                desc: 'Role-enforced authentication with Django DRF Token safeguards student privacy and institutional records.',
                icon: ShieldCheck,
              },
              {
                title: 'Dual Administration',
                desc: 'Admins enjoy the flexibility of our custom React dashboard and the built-in Django superuser administration.',
                icon: SlidersHorizontal,
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="p-7 rounded-2xl bg-white border border-brand-border hover:border-brand-teal/40 shadow-card-soft hover:shadow-card-hover transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-teal/10 text-brand-teal group-hover:bg-brand-teal group-hover:text-white flex items-center justify-center mb-5 transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-brand-dark mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== COMMON STUDENT PROBLEMS ===================== */}
      <section id="problems" className="py-20 lg:py-28 bg-white border-b border-brand-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold tracking-widest uppercase text-brand-teal">
              Problem Categories
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-brand-dark">
              Common Student Issues We Resolve
            </h2>
            <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
              From dormitory plumbing leaks to urgent weekend outpass approvals, select your category and get matched to the right department.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {problems.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-brand-cream/60 border border-brand-border/80 hover:border-brand-teal/40 hover:bg-white transition-all group flex flex-col justify-between shadow-2xs"
                >
                  <div>
                    <div className={`w-11 h-11 rounded-xl ${p.bg} ${p.accent} flex items-center justify-center mb-4 transition-transform group-hover:scale-105`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-heading font-bold text-base text-brand-dark mb-1.5">
                      {p.title}
                    </h3>
                    <p className="text-xs text-brand-muted leading-relaxed">
                      {p.desc}
                    </p>
                  </div>

                  <div className="pt-4 mt-3 border-t border-brand-border/40 flex items-center justify-between text-xs text-brand-teal font-medium">
                    <span>Direct routing</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== HOW IT WORKS ===================== */}
      <section id="how-it-works" className="py-20 lg:py-28 bg-brand-cream border-b border-brand-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold tracking-widest uppercase text-brand-gold">
              Simple 4-Step Journey
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-brand-dark">
              How Student HelpDesk Operates
            </h2>
            <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
              Transparent workflows with stage progression indicators keep everyone informed from initial submission to completed sign-off.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {steps.map((st, i) => {
              const Icon = st.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-white border border-brand-border shadow-card-soft flex flex-col justify-between relative overflow-hidden"
                >
                  <span className="font-heading text-5xl font-extrabold text-brand-biscuit/40 absolute top-4 right-4 select-none pointer-events-none">
                    {st.number}
                  </span>

                  <div>
                    <div className="w-11 h-11 rounded-xl bg-brand-teal/10 text-brand-teal flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-heading font-bold text-lg text-brand-dark mb-2">
                      {st.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-brand-muted leading-relaxed mb-4">
                      {st.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-brand-gold" />
                    <span className="text-[11px] font-mono text-slate-500 font-medium">
                      {st.previewBadge}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== SERVICES ===================== */}
      <section id="services" className="py-20 lg:py-28 bg-white border-b border-brand-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold tracking-widest uppercase text-brand-teal">
              Campus Offerings
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-brand-dark">
              Comprehensive Service Modules
            </h2>
            <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
              Every critical residential and academic service organized into unified digital management modules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Complaint Management',
                desc: 'Multi-step complaint wizard with anonymous options, image attachments, and priority triage.',
                icon: MessageSquare,
              },
              {
                name: 'Outpass Management',
                desc: 'End-to-end digital gate pass system with parent contact recording and warden approvals.',
                icon: FileText,
              },
              {
                name: 'Notification Engine',
                desc: 'Slide-over notification drawer with deep-links, instant alerts, and campus-wide emergency broadcasts.',
                icon: Bell,
              },
              {
                name: 'Hostel Support',
                desc: 'Direct communication between hostel residents, block representatives, and resident wardens.',
                icon: Building2,
              },
              {
                name: 'Maintenance Requests',
                desc: 'Work order dispatch to campus technicians (plumbing, carpentry, electrical, AC repair).',
                icon: Wrench,
              },
              {
                name: 'Student Support Services',
                desc: 'Personalized student home feed, profile management, and history audit logs.',
                icon: GraduationCap,
              },
            ].map((srv, i) => {
              const Icon = srv.icon;
              return (
                <div
                  key={i}
                  className="p-7 rounded-2xl bg-brand-cream/50 border border-brand-border hover:border-brand-teal/40 hover:bg-white transition-all shadow-xs group"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-teal-dark text-brand-gold flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-brand-dark mb-2">
                    {srv.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                    {srv.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== FAQ ACCORDION ===================== */}
      <section id="faq" className="py-20 lg:py-28 bg-brand-cream border-b border-brand-border/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-14">
            <span className="text-xs font-bold tracking-widest uppercase text-brand-gold">
              Got Questions?
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-brand-dark">
              Frequently Asked Questions
            </h2>
            <p className="text-sm sm:text-base text-brand-muted">
              Everything you need to know about navigating the Student HelpDesk platform.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl bg-white border border-brand-border/80 overflow-hidden shadow-2xs transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-heading font-bold text-brand-dark hover:text-brand-teal transition-colors"
                  >
                    <span className="text-sm sm:text-base flex items-center gap-3">
                      <HelpCircle className="w-4 h-4 text-brand-gold shrink-0" />
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180 text-brand-teal' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== FINAL CTA ===================== */}
      <section className="py-20 lg:py-24 bg-brand-teal-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-teal-dark to-brand-dark opacity-90" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <span className="inline-block text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-brand-gold/20 text-brand-gold border border-brand-gold/40">
            Start Your Experience
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight">
            Elevate Your Campus Life Today.
          </h2>
          <p className="text-sm sm:text-base text-brand-biscuit max-w-2xl mx-auto leading-relaxed">
            Join students, wardens, and campus administrators enjoying seamless support, prompt grievance redressal, and hassle-free outpass approvals.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-brand-gold hover:bg-brand-gold-hover text-brand-dark font-bold text-sm shadow-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>Create Student Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-colors"
            >
              Staff & Warden Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
