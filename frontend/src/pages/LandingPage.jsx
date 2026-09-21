import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  ArrowRight,
  CheckCircle2,
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
  HelpCircle,
  Layers,
  Users,
  Heart,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function LandingPage() {
  const [activeRole, setActiveRole] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);

  /*
   * Automatically highlight one role at a time.
   * Role cards themselves are NOT clickable.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveRole((current) => (current + 1) % 3);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  /*
   * Scroll animation:
   * Elements enter from bottom when scrolling down
   * and from top when scrolling back up.
   */
  const sectionAnimation = {
    initial: {
      opacity: 0,
      y: 45,
    },
    whileInView: {
      opacity: 1,
      y: 0,
    },
    viewport: {
      once: false,
      amount: 0.12,
    },
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  };

  const roles = [
    {
      title: "Student Portal",
      subtitle: "Simple campus requests and updates.",
      badge: "For Students",
      icon: GraduationCap,
      features: [
        "Raise campus complaints",
        "Apply for digital outpasses",
        "Track request status",
        "Receive notifications",
      ],
      ctaText: "Access Student Portal",
    },
    {
      title: "Warden Workspace",
      subtitle: "Manage hostel requests and outpasses.",
      badge: "For Wardens",
      icon: ShieldCheck,
      features: [
        "Review outpass requests",
        "Verify parent details",
        "Approve or reject requests",
        "Monitor hostel activity",
      ],
      ctaText: "Access Warden Desk",
    },
    {
      title: "Campus Control",
      subtitle: "Organize requests across the campus.",
      badge: "For Administrators",
      icon: SlidersHorizontal,
      features: [
        "Manage complaints",
        "Assign requests",
        "Monitor campus activity",
        "View useful reports",
      ],
      ctaText: "Open Campus Control",
    },
  ];

  const problems = [
    {
      title: "Hostel Maintenance",
      desc: "Plumbing, electrical and room-related issues.",
      icon: Wrench,
    },
    {
      title: "Mess & Food",
      desc: "Food quality, hygiene and mess concerns.",
      icon: Utensils,
    },
    {
      title: "Campus Wi-Fi",
      desc: "Internet and connectivity problems.",
      icon: Wifi,
    },
    {
      title: "Room & Infrastructure",
      desc: "Furniture, lighting and facility issues.",
      icon: Building2,
    },
    {
      title: "Outpass Requests",
      desc: "Digital requests without paper forms.",
      icon: FileText,
    },
    {
      title: "Academic Support",
      desc: "Classroom, lab and academic facility issues.",
      icon: GraduationCap,
    },
    {
      title: "General Concerns",
      desc: "Other campus support requests.",
      icon: AlertTriangle,
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Raise Request",
      desc: "Submit a complaint or outpass request with the required details.",
      icon: Send,
      previewBadge: "Request submitted",
    },
    {
      number: "02",
      title: "Request Reviewed",
      desc: "The appropriate campus team reviews and handles your request.",
      icon: UserCheck,
      previewBadge: "Under review",
    },
    {
      number: "03",
      title: "Track Progress",
      desc: "Follow your request as its status changes.",
      icon: Compass,
      previewBadge: "In progress",
    },
    {
      number: "04",
      title: "Get Resolution",
      desc: "Receive the final update when your request is completed.",
      icon: CheckCircle2,
      previewBadge: "Resolved",
    },
  ];

  const faqs = [
    {
      q: "How do complaints work?",
      a: "Submit your complaint through Student HelpDesk. The request can then be reviewed, assigned and updated by the responsible campus team.",
    },
    {
      q: "Can I submit anonymous complaints?",
      a: "Yes. Sensitive complaints can be submitted using the anonymous option when it is available for the request.",
    },
    {
      q: "How does outpass approval work?",
      a: "Submit your destination, dates and parent contact details. The request is then sent to the relevant warden for verification.",
    },
    {
      q: "Who verifies parents?",
      a: "The relevant hostel warden handles parent verification for outpass requests.",
    },
    {
      q: "How will I know about updates?",
      a: "Notifications keep you informed when important changes happen to your complaints or outpass requests.",
    },
    {
      q: "Can I view old requests?",
      a: "Yes. Your previous requests and their status history can remain available in your account.",
    },
  ];

  const services = [
    {
      name: "Complaint Management",
      desc: "Raise and track campus complaints.",
      icon: MessageSquare,
    },
    {
      name: "Outpass Management",
      desc: "Apply for and track digital outpasses.",
      icon: FileText,
    },
    {
      name: "Notifications",
      desc: "Stay informed about important updates.",
      icon: Bell,
    },
    {
      name: "Hostel Support",
      desc: "Connect residents with campus authorities.",
      icon: Building2,
    },
    {
      name: "Maintenance",
      desc: "Send problems to the right campus team.",
      icon: Wrench,
    },
    {
      name: "Student Support",
      desc: "Manage requests, profile and history.",
      icon: GraduationCap,
    },
  ];

  const whyUs = [
    {
      title: "Everything In One Place",
      desc: "Complaints, outpasses, notifications and history.",
      icon: Layers,
    },
    {
      title: "Simple Requests",
      desc: "Clear forms without unnecessary steps.",
      icon: Send,
    },
    {
      title: "Real-Time Tracking",
      desc: "Know what is happening with your request.",
      icon: Compass,
    },
    {
      title: "Instant Notifications",
      desc: "Stay updated when something changes.",
      icon: Bell,
    },
    {
      title: "Secure Access",
      desc: "Role-based access for different campus users.",
      icon: ShieldCheck,
    },
    {
      title: "Better Administration",
      desc: "Organized workflows for campus teams.",
      icon: SlidersHorizontal,
    },
  ];

  const active = roles[activeRole];
  const ActiveIcon = active.icon;

  return (
    <div className="bg-[#07130f] text-[#f4efe5] overflow-hidden">
      {/* =========================================================
          FONT + GLOBAL SCROLL
      ========================================================== */}

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap');

          .premium-serif {
            font-family: 'DM Serif Display', Georgia, serif;
            font-weight: 400;
          }

          html {
            scroll-behavior: smooth;
          }

          section {
            scroll-margin-top: 68px;
          }
        `}
      </style>

      {/* =========================================================
          HERO
          IMPORTANT:
          Navbar = 68px
          Hero = calc(100vh - 68px)
          Therefore Navbar + Hero = exactly 100vh
      ========================================================== */}

      <section
        className="
          relative
          min-h-[calc(100vh-68px)]
          h-[calc(100vh-68px)]
          overflow-hidden
          flex items-center
        "
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2200&q=85')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* DARK HALF-SHADE */}

        <div className="absolute inset-0 bg-gradient-to-r from-[#050c09] via-[#07130fe8] via-[48%] to-[#07130e45]" />

        <div className="absolute inset-0 bg-[#07120e]/20" />

        {/* Gold glow */}

        <div className="absolute top-0 left-[35%] w-[500px] h-[500px] bg-[#c49a45]/10 blur-[130px] rounded-full pointer-events-none" />

        {/* Hero Content */}

        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14">
          <div className="max-w-[650px]">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-6 lg:mb-7"
            >
              <Sparkles className="w-4 h-4 text-[#c49a45]" />

              <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] font-medium text-[#cdb681]">
                Campus support, made easier
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="
                premium-serif
                text-[48px]
                sm:text-[60px]
                lg:text-[76px]
                leading-[0.98]
                tracking-[-0.025em]
                text-white
              "
            >
              Campus help,
              <br />
              <span className="italic text-white">made simple.</span>
            </motion.h1>

            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 58, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="h-[2px] bg-[#c49a45] mt-7 mb-6"
            />

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="
                text-[15px]
                sm:text-[17px]
                leading-7
                text-[#dedbd2]
                max-w-[590px]
              "
            >
              Raise a complaint, request an outpass, follow updates,
              and connect with your campus team — without the usual hassle.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="flex flex-col sm:flex-row gap-3 mt-7"
            >
              <Link
                to="/register"
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-4
                  px-7
                  py-3.5
                  rounded-full
                  bg-[#cda86a]
                  text-[#10221c]
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.15em]
                  hover:bg-[#ddbd85]
                  transition-all
                "
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="#how-it-works"
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-4
                  px-7
                  py-3.5
                  rounded-full
                  border
                  border-[#b9b4a6]/60
                  text-[#f4efe5]
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.15em]
                  hover:bg-white/10
                  transition-all
                "
              >
                See How It Works
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="flex flex-wrap gap-x-7 gap-y-3 mt-7"
            >
              {["Easy requests", "Live updates", "Secure access"].map(
                (item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-xs sm:text-sm text-[#cfcac0]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#c49a45]" />
                    {item}
                  </div>
                )
              )}
            </motion.div>
          </div>
        </div>

        {/* HERO SIDE CARDS */}

        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col gap-3 w-[275px]">
          {[
            {
              icon: CheckCircle2,
              title: "Request updated",
              desc: "Your complaint is being handled",
            },
            {
              icon: FileText,
              title: "Outpass approved",
              desc: "Ready for your trip",
            },
            {
              icon: Users,
              title: "Campus team connected",
              desc: "Your request reached the right team",
            },
            {
              icon: CheckCircle2,
              title: "Request resolved",
              desc: "Your issue has been completed",
            },
          ].map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.3 + index * 0.1,
                }}
                className="
                  bg-[#f4f0e7]
                  rounded-l-2xl
                  px-5
                  py-3.5
                  shadow-[0_10px_40px_rgba(0,0,0,0.18)]
                  flex
                  items-center
                  gap-4
                "
              >
                <div className="w-10 h-10 rounded-full bg-[#dce9df] flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-[#286052]" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#15241f]">
                    {item.title}
                  </p>

                  <p className="text-[11px] text-[#7a817a] mt-1">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          WHITE / CREAM INTRO SECTION
      ========================================================== */}

      <motion.section
        id="about"
        {...sectionAnimation}
        className="bg-[#f5f1e9] text-[#123f36] border-b border-[#ddd4c5]"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 py-10 lg:py-11">
          <div className="grid lg:grid-cols-[1fr_auto] items-center gap-7">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-7 h-px bg-[#c49a45]" />

                <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#a37b3b]">
                  Built around campus life
                </span>
              </div>

              <h2 className="premium-serif text-3xl sm:text-4xl lg:text-[42px] leading-tight">
                A simpler way to ask for help,
                <br />
                <span className="italic text-[#b88d4b]">
                  whenever you need it.
                </span>
              </h2>

              <p className="mt-3 max-w-2xl text-sm text-[#69736e] leading-6">
                Student HelpDesk brings everyday campus support into
                one connected experience — from reporting an issue to
                following what happens next.
              </p>
            </div>

            <div className="flex flex-wrap lg:max-w-[360px] gap-2 lg:justify-end">
              {[
                "Complaints",
                "Outpasses",
                "Notifications",
                "Student Support",
              ].map((item) => (
                <span
                  key={item}
                  className="
                    px-4
                    py-2
                    rounded-full
                    border
                    border-[#d5cab8]
                    text-[10px]
                    uppercase
                    tracking-[0.15em]
                    text-[#52615b]
                  "
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* =========================================================
          ROLES
      ========================================================== */}

      <motion.section
        id="roles"
        {...sectionAnimation}
        className="
          relative
          bg-[#06130f]
          text-[#f5eee2]
          py-14
          lg:py-16
          overflow-hidden
        "
      >
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_20%,rgba(42,107,92,0.18),transparent_45%)]" />

        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.42)_100%)]" />

        <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
          <div className="max-w-3xl mb-8">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#c49a45]">
              One platform
            </span>

            <h2 className="premium-serif text-3xl sm:text-4xl lg:text-5xl mt-2 leading-tight">
              Different people,
              <span className="italic text-[#cda86a]">
                {" "}different needs.
              </span>
            </h2>

            <p className="text-[#aebdb5] mt-3 max-w-2xl text-sm leading-6">
              Students, wardens and administrators each have different
              responsibilities. Student HelpDesk gives everyone the tools
              they need in one connected platform.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {roles.map((role, index) => {
              const Icon = role.icon;
              const selected = activeRole === index;

              return (
                <motion.div
                  key={role.title}
                  animate={{
                    y: selected ? -5 : 0,
                    scale: selected ? 1.015 : 1,
                    borderColor: selected
                      ? "rgba(196,154,69,0.75)"
                      : "rgba(69,105,94,0.5)",
                  }}
                  transition={{
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                  className={`
                    relative
                    overflow-hidden
                    rounded-2xl
                    px-5
                    py-5
                    border
                    transition-colors
                    duration-500
                    ${
                      selected
                        ? "bg-[#123f36]"
                        : "bg-[#0b211b]"
                    }
                  `}
                >
                  {selected && (
                    <motion.div
                      layoutId="roleGlow"
                      className="absolute inset-0 pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                      style={{
                        background:
                          "radial-gradient(circle at 20% 0%, rgba(196,154,69,0.14), transparent 55%)",
                      }}
                    />
                  )}

                  <div className="relative flex items-center gap-4">
                    <div
                      className={`
                        w-10
                        h-10
                        rounded-full
                        flex
                        items-center
                        justify-center
                        shrink-0
                        ${
                          selected
                            ? "bg-[#c49a45] text-[#10221c]"
                            : "bg-[#102d25] text-[#cda86a]"
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div>
                      <p className="text-[9px] uppercase tracking-[0.2em] text-[#c49a45]">
                        {role.badge}
                      </p>

                      <h3 className="premium-serif text-xl mt-1">
                        {role.title}
                      </h3>

                      <p className="text-xs text-[#aebdb5] mt-1">
                        {role.subtitle}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              className="
                relative
                rounded-[24px]
                border
                border-[#315b50]
                bg-gradient-to-br
                from-[#123f36]
                via-[#0d2c25]
                to-[#07130f]
                p-6
                sm:p-8
                overflow-hidden
              "
            >
              <div className="absolute right-0 top-0 w-[320px] h-[320px] bg-[#c49a45]/5 blur-[100px] rounded-full" />

              <div className="relative grid lg:grid-cols-[1fr_220px] gap-7 items-center">
                <div>
                  <span className="inline-flex px-3 py-1 rounded-full border border-[#c49a45]/30 bg-[#c49a45]/10 text-[#d4b477] text-[9px] uppercase tracking-[0.2em]">
                    {active.badge}
                  </span>

                  <h3 className="premium-serif text-3xl sm:text-4xl mt-3">
                    {active.title}
                  </h3>

                  <p className="text-[#b8c5bf] text-sm mt-2">
                    {active.subtitle}
                  </p>

                  <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2.5 mt-6">
                    {active.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-3 text-sm text-[#d2dad5]"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#c49a45] shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <Link
                    to="/login"
                    className="
                      inline-flex
                      items-center
                      gap-3
                      mt-6
                      px-6
                      py-3
                      rounded-full
                      bg-[#cda86a]
                      text-[#10221c]
                      text-xs
                      font-semibold
                      hover:bg-[#ddbd85]
                      transition-colors
                    "
                  >
                    {active.ctaText}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="hidden lg:flex justify-center">
                  <motion.div
                    animate={{
                      rotate: [0, 2, -2, 0],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="
                      w-36
                      h-36
                      rounded-full
                      border
                      border-[#c49a45]/30
                      bg-[#06130f]
                      flex
                      flex-col
                      items-center
                      justify-center
                      text-center
                    "
                  >
                    <ActiveIcon className="w-8 h-8 text-[#c49a45]" />

                    <span className="premium-serif text-lg mt-3">
                      {active.title}
                    </span>

                    <span className="text-[8px] uppercase tracking-[0.18em] text-[#84978f] mt-1">
                      Connected platform
                    </span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.section>

      {/* =========================================================
          WHY US
      ========================================================== */}

      <motion.section
        id="why-us"
        {...sectionAnimation}
        className="
          bg-[#0b1d18]
          text-[#f5eee2]
          py-14
          lg:py-16
          relative
          overflow-hidden
        "
      >
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_80%_20%,rgba(196,154,69,0.08),transparent_35%)]" />

        <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
          <div className="max-w-2xl mb-8">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#c49a45]">
              Why Student HelpDesk
            </span>

            <h2 className="premium-serif text-3xl sm:text-4xl lg:text-5xl mt-2">
              Less confusion.
              <span className="italic text-[#cda86a]">
                {" "}More clarity.
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {whyUs.map((item) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="
                    rounded-2xl
                    border
                    border-[#29483f]
                    bg-[#102b24]
                    p-5
                  "
                >
                  <div className="w-10 h-10 rounded-full bg-[#183e34] flex items-center justify-center mb-4">
                    <Icon className="w-4 h-4 text-[#cda86a]" />
                  </div>

                  <h3 className="premium-serif text-xl">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#aebdb5] leading-6 mt-2">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* =========================================================
          PROBLEMS
      ========================================================== */}

      <motion.section
        id="problems"
        {...sectionAnimation}
        className="
          bg-[#f5f1e9]
          text-[#123f36]
          py-14
          lg:py-16
        "
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
          <div className="max-w-2xl mb-8">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#a37b3b]">
              Campus concerns
            </span>

            <h2 className="premium-serif text-3xl sm:text-4xl lg:text-5xl mt-2">
              Problems students
              <span className="italic text-[#b88d4b]">
                {" "}face every day.
              </span>
            </h2>

            <p className="text-sm text-[#69736e] mt-3 leading-6">
              From hostel maintenance to academic support, send your
              request to the right place.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {problems.map((problem) => {
              const Icon = problem.icon;

              return (
                <motion.div
                  key={problem.title}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="
                    bg-[#eee8dc]
                    border
                    border-[#d8d0c1]
                    rounded-2xl
                    p-5
                  "
                >
                  <div className="w-10 h-10 rounded-full bg-[#dce7df] flex items-center justify-center mb-4">
                    <Icon className="w-4 h-4 text-[#286052]" />
                  </div>

                  <h3 className="premium-serif text-lg">
                    {problem.title}
                  </h3>

                  <p className="text-xs text-[#707872] leading-5 mt-2">
                    {problem.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* =========================================================
          HOW IT WORKS
      ========================================================== */}

      <motion.section
        id="how-it-works"
        {...sectionAnimation}
        className="
          bg-[#06130f]
          text-[#f5eee2]
          py-14
          lg:py-16
          relative
          overflow-hidden
        "
      >
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(42,107,92,0.18),transparent_45%)]" />

        <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
          <div className="max-w-2xl mb-8">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#c49a45]">
              How it works
            </span>

            <h2 className="premium-serif text-3xl sm:text-4xl lg:text-5xl mt-2">
              From request
              <span className="italic text-[#cda86a]">
                {" "}to resolution.
              </span>
            </h2>

            <p className="text-sm text-[#aebdb5] mt-3 leading-6">
              A simple process that keeps students and campus teams connected.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <motion.div
                  key={step.number}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="
                    relative
                    bg-[#0e2922]
                    border
                    border-[#294d43]
                    rounded-2xl
                    p-5
                    min-h-[205px]
                    flex
                    flex-col
                    justify-between
                  "
                >
                  <span className="absolute top-4 right-5 premium-serif text-4xl text-[#c49a45]/15">
                    {step.number}
                  </span>

                  <div>
                    <div className="w-10 h-10 rounded-full bg-[#12382f] flex items-center justify-center mb-4">
                      <Icon className="w-4 h-4 text-[#cda86a]" />
                    </div>

                    <h3 className="premium-serif text-xl">
                      {step.title}
                    </h3>

                    <p className="text-xs text-[#b8c5bf] leading-6 mt-2">
                      {step.desc}
                    </p>
                  </div>

                  <div className="border-t border-[#35574f] pt-3 mt-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#cda86a]" />

                    <span className="text-[9px] uppercase tracking-[0.15em] text-[#aebdb5]">
                      {step.previewBadge}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* =========================================================
          SERVICES
          NEW BACKGROUND IMAGE
          HALF DARK SHADE LIKE HERO
      ========================================================== */}

      <motion.section
        id="services"
        {...sectionAnimation}
        className="
          relative
          min-h-[560px]
          overflow-hidden
          text-[#f5eee2]
        "
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=2200&q=85')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* LEFT DARK SHADE */}

        <div className="absolute inset-0 bg-gradient-to-r from-[#06130f] via-[#07130fe8] via-[52%] to-[#07130e45]" />

        {/* Overall subtle shade */}

        <div className="absolute inset-0 bg-[#06130f]/25" />

        {/* Gold glow */}

        <div className="absolute right-[20%] top-0 w-[450px] h-[450px] bg-[#c49a45]/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 py-14 lg:py-16">
          <div className="max-w-2xl mb-8">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#c49a45]">
              Services
            </span>

            <h2 className="premium-serif text-3xl sm:text-4xl lg:text-5xl mt-2">
              Everything your campus
              <span className="italic text-[#cda86a]">
                {" "}needs.
              </span>
            </h2>

            <p className="text-sm text-[#d3d9d5] mt-3 leading-6 max-w-xl">
              One connected platform for everyday student requests,
              campus support and communication.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <motion.div
                  key={service.name}
                  whileHover={{
                    y: -5,
                    backgroundColor: "rgba(18,63,54,0.92)",
                  }}
                  transition={{ duration: 0.25 }}
                  className="
                    bg-[#06130f]/85
                    backdrop-blur-md
                    border
                    border-[#5c685f]/50
                    rounded-2xl
                    p-5
                  "
                >
                  <div className="w-10 h-10 rounded-full bg-[#c49a45]/15 border border-[#c49a45]/25 flex items-center justify-center mb-4">
                    <Icon className="w-4 h-4 text-[#d6b877]" />
                  </div>

                  <h3 className="premium-serif text-xl">
                    {service.name}
                  </h3>

                  <p className="text-xs text-[#c5cec8] leading-6 mt-2">
                    {service.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* =========================================================
          FAQ
      ========================================================== */}

      <motion.section
        id="faq"
        {...sectionAnimation}
        className="
          bg-[#0b1d18]
          text-[#f5eee2]
          py-14
          lg:py-16
        "
      >
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-8">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#c49a45]">
              Questions
            </span>

            <h2 className="premium-serif text-3xl sm:text-4xl lg:text-5xl mt-2">
              Frequently asked
              <span className="italic text-[#cda86a]">
                {" "}questions.
              </span>
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <div
                  key={faq.q}
                  className="
                    bg-[#102b24]
                    border
                    border-[#29483f]
                    rounded-2xl
                    overflow-hidden
                  "
                >
                  <button
                    onClick={() =>
                      setOpenFaq(isOpen ? -1 : index)
                    }
                    className="
                      w-full
                      flex
                      items-center
                      justify-between
                      gap-5
                      px-5
                      py-4
                      text-left
                    "
                  >
                    <span className="flex items-center gap-3 text-sm font-medium">
                      <HelpCircle className="w-4 h-4 text-[#cda86a]" />
                      {faq.q}
                    </span>

                    <ChevronDown
                      className={`
                        w-4
                        h-4
                        text-[#87978f]
                        transition-transform
                        ${isOpen ? "rotate-180" : ""}
                      `}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{
                          height: 0,
                          opacity: 0,
                        }}
                        animate={{
                          height: "auto",
                          opacity: 1,
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                        }}
                      >
                        <div className="px-5 pb-5 pt-1 text-xs text-[#aebdb5] leading-6 border-t border-[#29483f]">
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
      </motion.section>

      {/* =========================================================
          FINAL CTA
      ========================================================== */}

      <motion.section
        {...sectionAnimation}
        className="
          relative
          bg-[#06130f]
          overflow-hidden
          py-14
          lg:py-16
        "
      >
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(42,107,92,0.18),transparent_50%)]" />

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <Heart className="w-6 h-6 text-[#cda86a] mx-auto mb-5" />

          <h2 className="premium-serif text-3xl sm:text-4xl lg:text-5xl text-[#f5eee2]">
            Campus support,
            <br />
            <span className="italic text-[#cda86a]">
              without the hassle.
            </span>
          </h2>

          <p className="max-w-xl mx-auto text-sm text-[#aebdb5] mt-4 leading-6">
            Raise requests, stay informed and connect with the people
            responsible for helping you.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-7">
            <Link
              to="/register"
              className="
                inline-flex
                items-center
                justify-center
                gap-3
                px-7
                py-3.5
                rounded-full
                bg-[#cda86a]
                text-[#10221c]
                text-xs
                font-bold
                uppercase
                tracking-[0.15em]
                hover:bg-[#ddbd85]
                transition-colors
              "
            >
              Create Student Account
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/login"
              className="
                inline-flex
                items-center
                justify-center
                px-7
                py-3.5
                rounded-full
                border
                border-[#52675f]
                text-[#f5eee2]
                text-xs
                font-bold
                uppercase
                tracking-[0.15em]
                hover:bg-white/10
                transition-colors
              "
            >
              Sign In
            </Link>
          </div>
        </div>
      </motion.section>

      {/* =========================================================
          FOOTER
      ========================================================== */}

      <footer className="bg-[#040c09] border-t border-[#20372f] text-[#f5eee2]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 py-10">
          <div className="grid md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-8">
            {/* BRAND */}

            <div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#c49a45] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-[#10221c]" />
                </div>

                <div>
                  <h3 className="premium-serif text-xl">
                    Student HelpDesk
                  </h3>

                  <p className="text-[9px] uppercase tracking-[0.2em] text-[#7e9188] mt-0.5">
                    Campus support made simple
                  </p>
                </div>
              </div>

              <p className="text-xs text-[#8fa099] leading-6 max-w-sm mt-5">
                A connected platform for students, wardens and
                administrators to manage everyday campus requests.
              </p>

              <div className="flex items-center gap-3 mt-5">
                <a
                  href="#"
                  className="
                    w-8
                    h-8
                    rounded-full
                    border
                    border-[#30473f]
                    flex
                    items-center
                    justify-center
                    text-[#9eaaa5]
                    hover:text-[#cda86a]
                    hover:border-[#cda86a]
                    transition-colors
                  "
                  aria-label="Instagram"
                >
                  <Instagram className="w-3.5 h-3.5" />
                </a>

                <a
                  href="mailto:support@studenthelpdesk.com"
                  className="
                    w-8
                    h-8
                    rounded-full
                    border
                    border-[#30473f]
                    flex
                    items-center
                    justify-center
                    text-[#9eaaa5]
                    hover:text-[#cda86a]
                    hover:border-[#cda86a]
                    transition-colors
                  "
                  aria-label="Email"
                >
                  <Mail className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* PLATFORM */}

            <div>
              <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#c49a45] font-semibold mb-4">
                Platform
              </h4>

              <div className="space-y-2.5">
                <a
                  href="#roles"
                  className="block text-xs text-[#9eaaa5] hover:text-[#f5eee2] transition-colors"
                >
                  Roles
                </a>

                <a
                  href="#why-us"
                  className="block text-xs text-[#9eaaa5] hover:text-[#f5eee2] transition-colors"
                >
                  Why Us
                </a>

                <a
                  href="#problems"
                  className="block text-xs text-[#9eaaa5] hover:text-[#f5eee2] transition-colors"
                >
                  Campus Problems
                </a>

                <a
                  href="#how-it-works"
                  className="block text-xs text-[#9eaaa5] hover:text-[#f5eee2] transition-colors"
                >
                  How It Works
                </a>
              </div>
            </div>

            {/* SERVICES */}

            <div>
              <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#c49a45] font-semibold mb-4">
                Services
              </h4>

              <div className="space-y-2.5">
                <a
                  href="#services"
                  className="block text-xs text-[#9eaaa5] hover:text-[#f5eee2] transition-colors"
                >
                  Complaints
                </a>

                <a
                  href="#services"
                  className="block text-xs text-[#9eaaa5] hover:text-[#f5eee2] transition-colors"
                >
                  Outpasses
                </a>

                <a
                  href="#services"
                  className="block text-xs text-[#9eaaa5] hover:text-[#f5eee2] transition-colors"
                >
                  Notifications
                </a>

                <a
                  href="#services"
                  className="block text-xs text-[#9eaaa5] hover:text-[#f5eee2] transition-colors"
                >
                  Hostel Support
                </a>
              </div>
            </div>

            {/* CONTACT */}

            <div>
              <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#c49a45] font-semibold mb-4">
                Contact
              </h4>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#cda86a] mt-0.5 shrink-0" />

                  <span className="text-xs text-[#9eaaa5] leading-5">
                    Campus Student Support Center
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#cda86a] shrink-0" />

                  <span className="text-xs text-[#9eaaa5]">
                    support@studenthelpdesk.com
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#cda86a] shrink-0" />

                  <span className="text-xs text-[#9eaaa5]">
                    Campus Support
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER BOTTOM */}

          <div className="border-t border-[#20372f] mt-8 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[10px] text-[#687b73]">
              © {new Date().getFullYear()} Student HelpDesk. All rights reserved.
            </p>

            <div className="flex items-center gap-5">
              <a
                href="#faq"
                className="text-[10px] text-[#687b73] hover:text-[#cda86a] transition-colors"
              >
                FAQs
              </a>

              <Link
                to="/login"
                className="text-[10px] text-[#687b73] hover:text-[#cda86a] transition-colors"
              >
                Sign In
              </Link>

              <Link
                to="/register"
                className="text-[10px] text-[#687b73] hover:text-[#cda86a] transition-colors"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}