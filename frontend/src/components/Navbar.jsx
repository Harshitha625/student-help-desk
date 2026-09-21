import React, { useState, useRef, useEffect } from 'react';

import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';

import {
  Bell,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  PlusCircle,
  FileCheck2,
  ChevronDown,
  Home,
  Users,
  HelpCircle,
  Briefcase,
  MessageSquare,
} from 'lucide-react';

import BrandLogo from './BrandLogo';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

export default function Navbar() {
  const {
    user,
    isAuthenticated,
    logout,
    isStudent,
    isWarden,
    isAdmin,
  } = useAuth();

  const { unreadCount, setIsDrawerOpen } = useNotifications();

  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const profileRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  /*
   * Close profile dropdown when clicking outside.
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  /*
   * Close mobile menu whenever the route changes.
   */
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  /*
   * Prevent background scrolling when mobile menu is open.
   */
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    setMobileMenuOpen(false);
    setProfileOpen(false);

    await logout();

    navigate('/login');
  };

  /*
   * Desktop dashboard navigation styles.
   *
   * THEME ONLY CHANGED.
   */
  const navLinkClasses = ({ isActive }) =>
    `text-sm font-medium transition-all px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${
      isActive
        ? 'bg-[#c49a45]/15 text-[#cda86a] font-semibold'
        : 'text-[#cfcac0] hover:text-[#cda86a] hover:bg-[#123f36]/70'
    }`;

  /*
   * Public landing-page navigation.
   * LINKS ARE UNCHANGED.
   */
  const publicLinks = [
    {
      label: 'Roles',
      href: '#roles',
      icon: Users,
    },
    {
      label: 'Why Us',
      href: '#why-us',
      icon: Briefcase,
    },
    {
      label: 'Problems',
      href: '#problems',
      icon: MessageSquare,
    },
    {
      label: 'How It Works',
      href: '#how-it-works',
      icon: HelpCircle,
    },
    {
      label: 'Services',
      href: '#services',
      icon: Briefcase,
    },
    {
      label: 'FAQs',
      href: '#faq',
      icon: HelpCircle,
    },
  ];

  /*
   * Scroll to landing page sections smoothly.
   */
  const handlePublicNavigation = (href) => {
    setMobileMenuOpen(false);

    if (location.pathname !== '/') {
      navigate(`/${href}`);
      return;
    }

    const element = document.querySelector(href);

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    } else {
      window.location.hash = href.replace('#', '');
    }
  };

  /*
   * Decide where the logo should navigate.
   *
   * LINKS ARE UNCHANGED.
   */
  const logoLink = isAuthenticated
    ? isStudent
      ? '/student'
      : isWarden
        ? '/warden'
        : '/admin'
    : '/';

  return (
    <>
      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <header className="sticky top-0 z-50 w-full bg-[#07130f]/95 backdrop-blur-xl  border-[#29483f] shadow-[0_8px_30px_rgba(0,0,0,0.18)]">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex items-center justify-between h-[68px]">

            {/* =================================================
                LOGO
            ================================================== */}

            <div className="flex items-center shrink-0">
              <BrandLogo linkTo={logoLink} />
            </div>

            {/* =================================================
                DESKTOP NAVIGATION
            ================================================== */}

            <div className="hidden md:flex items-center flex-1 ml-8">

              {/* PUBLIC NAVIGATION */}

              {!isAuthenticated && (
                <nav className="flex items-center gap-1">

                  {publicLinks.map((item) => (
                    <button
                      key={item.href}
                      type="button"
                      onClick={() =>
                        handlePublicNavigation(item.href)
                      }
                      className="px-3 py-2 rounded-lg text-sm font-medium text-[#cfcac0] hover:text-[#cda86a] hover:bg-[#123f36]/70 transition-all"
                    >
                      {item.label}
                    </button>
                  ))}

                </nav>
              )}

              {/* =================================================
                  STUDENT NAVIGATION
              ================================================== */}

              {isAuthenticated && isStudent && (
                <nav className="flex items-center gap-1">

                  <NavLink
                    to="/student"
                    end
                    className={navLinkClasses}
                  >
                    Home
                  </NavLink>

                  <NavLink
                    to="/complaints"
                    className={navLinkClasses}
                  >
                    Complaints
                  </NavLink>

                  <NavLink
                    to="/outpasses"
                    className={navLinkClasses}
                  >
                    Outpasses
                  </NavLink>

                </nav>
              )}

              {/* =================================================
                  WARDEN NAVIGATION
              ================================================== */}

              {isAuthenticated && isWarden && (
                <nav className="flex items-center gap-1">

                  <NavLink
                    to="/warden"
                    end
                    className={navLinkClasses}
                  >
                    Overview
                  </NavLink>

                  <NavLink
                    to="/warden/outpasses"
                    className={navLinkClasses}
                  >
                    Outpass Desk
                  </NavLink>

                  <NavLink
                    to="/warden/students"
                    className={navLinkClasses}
                  >
                    Students Directory
                  </NavLink>

                </nav>
              )}

              {/* =================================================
                  ADMIN NAVIGATION
              ================================================== */}

              {isAuthenticated && isAdmin && (
                <nav className="flex items-center gap-1">

                  <NavLink
                    to="/admin"
                    end
                    className={navLinkClasses}
                  >
                    Overview
                  </NavLink>

                  <NavLink
                    to="/admin/complaints"
                    className={navLinkClasses}
                  >
                    Complaints
                  </NavLink>

                  <NavLink
                    to="/admin/outpasses"
                    className={navLinkClasses}
                  >
                    Outpasses
                  </NavLink>

                  <NavLink
                    to="/admin/students"
                    className={navLinkClasses}
                  >
                    Students
                  </NavLink>

                </nav>
              )}

            </div>

            {/* =================================================
                RIGHT SIDE
            ================================================== */}

            <div className="flex items-center gap-2 sm:gap-3">

              {/* -------------------------------------------------
                  STUDENT QUICK ACTIONS
              -------------------------------------------------- */}

              {isAuthenticated && isStudent && (
                <div className="hidden lg:flex items-center gap-2">

                  <Link
                    to="/complaints/create"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#cda86a] text-[#10221c] hover:bg-[#ddbd85] transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    Raise Complaint
                  </Link>

                  <Link
                    to="/outpasses/create"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#c49a45]/15 text-[#d4b477] hover:bg-[#c49a45]/25 border border-[#c49a45]/40 transition-colors"
                  >
                    <FileCheck2 className="w-3.5 h-3.5" />
                    Apply Outpass
                  </Link>

                </div>
              )}

              {/* -------------------------------------------------
                  NOTIFICATIONS
              -------------------------------------------------- */}

              {isAuthenticated && (
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(true)}
                  className="relative p-2.5 rounded-xl text-[#cfcac0] hover:text-[#cda86a] hover:bg-[#123f36]/70 transition-colors"
                  aria-label="Open notifications"
                >

                  <Bell className="w-5 h-5" />

                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#c49a45] text-[9px] font-bold text-[#10221c]">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}

                </button>
              )}

              {/* -------------------------------------------------
                  AUTHENTICATED PROFILE
              -------------------------------------------------- */}

              {isAuthenticated ? (

                <div
                  className="relative hidden sm:block"
                  ref={profileRef}
                >

                  <button
                    type="button"
                    onClick={() =>
                      setProfileOpen(!profileOpen)
                    }
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#123f36]/70 transition-colors text-left"
                  >

                    <div className="w-8 h-8 rounded-lg bg-[#123f36] text-[#cda86a] font-bold flex items-center justify-center text-sm border border-[#c49a45]/40">
                      {user?.first_name
                        ? user.first_name[0].toUpperCase()
                        : user?.username?.[0]?.toUpperCase() ||
                          'U'}
                    </div>

                    <div className="hidden lg:block text-xs">

                      <div className="font-semibold text-[#f5eee2] leading-tight">
                        {user?.first_name
                          ? `${user.first_name} ${
                              user.last_name || ''
                            }`
                          : user?.username}
                      </div>

                      <div className="text-[10px] text-[#9ba9a2] uppercase font-bold tracking-wider">
                        {user?.role}
                      </div>

                    </div>

                    <ChevronDown
                      className={`w-3.5 h-3.5 text-[#87978f] transition-transform ${
                        profileOpen ? 'rotate-180' : ''
                      }`}
                    />

                  </button>

                  {/* =================================================
                      PROFILE DROPDOWN
                  ================================================== */}

                  {profileOpen && (

                    <div className="absolute right-0 mt-2 w-56 bg-[#0b211b] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.35)] border border-[#29483f] py-2 z-[60]">

                      <div className="px-4 py-3 border-b border-[#29483f]">

                        <p className="text-xs font-semibold text-[#f5eee2]">
                          {user?.first_name
                            ? `${user.first_name} ${
                                user.last_name || ''
                              }`
                            : user?.username}
                        </p>

                        <p className="text-[11px] text-[#8fa098] truncate mt-0.5">
                          {user?.email || user?.username}
                        </p>

                        {user?.student_profile?.roll_number && (
                          <span className="mt-2 inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-[#123f36] border border-[#315b50] text-[#cda86a] font-medium">
                            Roll: {user.student_profile.roll_number}
                          </span>
                        )}

                      </div>

                      <div className="py-1">

                        {isStudent && (
                          <Link
                            to="/profile"
                            className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#cfcac0] hover:bg-[#123f36] hover:text-[#cda86a] transition-colors"
                          >
                            <User className="w-4 h-4 text-[#9ba9a2]" />
                            My Profile
                          </Link>
                        )}

                        <Link
                          to="/settings"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#cfcac0] hover:bg-[#123f36] hover:text-[#cda86a] transition-colors"
                        >
                          <Settings className="w-4 h-4 text-[#9ba9a2]" />
                          Account Settings
                        </Link>

                      </div>

                      <div className="pt-1 border-t border-[#29483f]">

                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>

                      </div>

                    </div>

                  )}

                </div>

              ) : (

                /* -------------------------------------------------
                   PUBLIC AUTH BUTTONS
                -------------------------------------------------- */

                <div className="hidden sm:flex items-center gap-2">

                  <Link
                    to="/login"
                    className="px-4 py-2 text-xs font-semibold rounded-xl text-[#f5eee2] hover:bg-[#123f36] transition-colors"
                  >
                    Sign In
                  </Link>

                  <Link
                    to="/register"
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#cda86a] text-[#10221c] hover:bg-[#ddbd85] shadow-sm transition-colors"
                  >
                    Get Started
                  </Link>

                </div>

              )}

              {/* =================================================
                  MOBILE MENU BUTTON
              ================================================== */}

              <button
                type="button"
                onClick={() =>
                  setMobileMenuOpen(!mobileMenuOpen)
                }
                className="md:hidden p-2.5 rounded-xl text-[#cfcac0] hover:bg-[#123f36] hover:text-[#cda86a] transition-all"
                aria-label={
                  mobileMenuOpen
                    ? 'Close navigation menu'
                    : 'Open navigation menu'
                }
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>

            </div>

          </div>

        </div>

      </header>

      {/* =========================================================
          MOBILE MENU OVERLAY
      ========================================================== */}

      {mobileMenuOpen && (

        <div className="fixed inset-0 z-40 md:hidden">

          {/* Background overlay */}

          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Menu panel */}

          <div className="absolute top-[68px] left-0 right-0 bg-[#07130f] border-b border-[#29483f] shadow-[0_20px_50px_rgba(0,0,0,0.35)] max-h-[calc(100vh-68px)] overflow-y-auto">

            <div className="px-4 py-5">

              {/* =================================================
                  PUBLIC MOBILE MENU
              ================================================== */}

              {!isAuthenticated && (

                <div className="space-y-1">

                  <div className="px-3 pb-3">

                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#c49a45]">
                      Explore Student HelpDesk
                    </p>

                  </div>

                  {publicLinks.map((item) => {

                    const Icon = item.icon;

                    return (
                      <button
                        key={item.href}
                        type="button"
                        onClick={() =>
                          handlePublicNavigation(item.href)
                        }
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-[#cfcac0] hover:bg-[#123f36] hover:text-[#cda86a] transition-all text-left"
                      >

                        <span className="w-9 h-9 rounded-lg bg-[#123f36] text-[#cda86a] flex items-center justify-center">
                          <Icon className="w-4 h-4" />
                        </span>

                        <span>{item.label}</span>

                      </button>
                    );
                  })}

                  <div className="pt-4 mt-3 border-t border-[#29483f] grid grid-cols-2 gap-3">

                    <Link
                      to="/login"
                      onClick={() =>
                        setMobileMenuOpen(false)
                      }
                      className="text-center py-3 rounded-xl border border-[#52675f] text-sm font-semibold text-[#f5eee2] hover:bg-[#123f36] transition-colors"
                    >
                      Sign In
                    </Link>

                    <Link
                      to="/register"
                      onClick={() =>
                        setMobileMenuOpen(false)
                      }
                      className="text-center py-3 rounded-xl bg-[#cda86a] text-[#10221c] text-sm font-semibold hover:bg-[#ddbd85] transition-colors"
                    >
                      Get Started
                    </Link>

                  </div>

                </div>
              )}

              {/* =================================================
                  STUDENT MOBILE MENU
              ================================================== */}

              {isAuthenticated && isStudent && (

                <div className="space-y-1">

                  <div className="px-3 pb-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#c49a45]">
                      Student Menu
                    </p>
                  </div>

                  <Link
                    to="/student"
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-[#cfcac0] hover:bg-[#123f36] hover:text-[#cda86a]"
                  >
                    <Home className="w-5 h-5 text-[#cda86a]" />
                    Home
                  </Link>

                  <Link
                    to="/complaints"
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-[#cfcac0] hover:bg-[#123f36] hover:text-[#cda86a]"
                  >
                    <MessageSquare className="w-5 h-5 text-[#cda86a]" />
                    Complaints
                  </Link>

                  <Link
                    to="/complaints/create"
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-[#cda86a] hover:bg-[#123f36]"
                  >
                    <PlusCircle className="w-5 h-5" />
                    Raise Complaint
                  </Link>

                  <Link
                    to="/outpasses"
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-[#cfcac0] hover:bg-[#123f36] hover:text-[#cda86a]"
                  >
                    <FileCheck2 className="w-5 h-5 text-[#cda86a]" />
                    Outpasses
                  </Link>

                  <Link
                    to="/outpasses/create"
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-[#cda86a] hover:bg-[#123f36]"
                  >
                    <PlusCircle className="w-5 h-5" />
                    Apply Outpass
                  </Link>

                  <Link
                    to="/settings"
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-[#cfcac0] hover:bg-[#123f36] hover:text-[#cda86a]"
                  >
                    <Settings className="w-5 h-5 text-[#9ba9a2]" />
                    Settings
                  </Link>

                  <div className="pt-3 mt-3 border-t border-[#29483f]">

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 text-left"
                    >
                      <LogOut className="w-5 h-5" />
                      Sign Out
                    </button>

                  </div>

                </div>
              )}

              {/* =================================================
                  WARDEN MOBILE MENU
              ================================================== */}

              {isAuthenticated && isWarden && (

                <div className="space-y-1">

                  <div className="px-3 pb-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#c49a45]">
                      Warden Menu
                    </p>
                  </div>

                  <Link
                    to="/warden"
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-[#cfcac0] hover:bg-[#123f36] hover:text-[#cda86a]"
                  >
                    <Home className="w-5 h-5 text-[#cda86a]" />
                    Overview
                  </Link>

                  <Link
                    to="/warden/outpasses"
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-[#cfcac0] hover:bg-[#123f36] hover:text-[#cda86a]"
                  >
                    <FileCheck2 className="w-5 h-5 text-[#cda86a]" />
                    Outpass Desk
                  </Link>

                  <Link
                    to="/warden/students"
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-[#cfcac0] hover:bg-[#123f36] hover:text-[#cda86a]"
                  >
                    <Users className="w-5 h-5 text-[#cda86a]" />
                    Students Directory
                  </Link>

                  <Link
                    to="/settings"
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-[#cfcac0] hover:bg-[#123f36] hover:text-[#cda86a]"
                  >
                    <Settings className="w-5 h-5 text-[#9ba9a2]" />
                    Settings
                  </Link>

                  <div className="pt-3 mt-3 border-t border-[#29483f]">

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 text-left"
                    >
                      <LogOut className="w-5 h-5" />
                      Sign Out
                    </button>

                  </div>

                </div>
              )}

              {/* =================================================
                  ADMIN MOBILE MENU
              ================================================== */}

              {isAuthenticated && isAdmin && (

                <div className="space-y-1">

                  <div className="px-3 pb-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#c49a45]">
                      Administration
                    </p>
                  </div>

                  <Link
                    to="/admin"
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-[#cfcac0] hover:bg-[#123f36] hover:text-[#cda86a]"
                  >
                    <Home className="w-5 h-5 text-[#cda86a]" />
                    Control Center
                  </Link>

                  <Link
                    to="/admin/complaints"
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-[#cfcac0] hover:bg-[#123f36] hover:text-[#cda86a]"
                  >
                    <MessageSquare className="w-5 h-5 text-[#cda86a]" />
                    Manage Complaints
                  </Link>

                  <Link
                    to="/admin/outpasses"
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-[#cfcac0] hover:bg-[#123f36] hover:text-[#cda86a]"
                  >
                    <FileCheck2 className="w-5 h-5 text-[#cda86a]" />
                    Manage Outpasses
                  </Link>

                  <Link
                    to="/admin/students"
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-[#cfcac0] hover:bg-[#123f36] hover:text-[#cda86a]"
                  >
                    <Users className="w-5 h-5 text-[#cda86a]" />
                    Manage Students
                  </Link>

                  <div className="pt-3 mt-3 border-t border-[#29483f]">

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 text-left"
                    >
                      <LogOut className="w-5 h-5" />
                      Sign Out
                    </button>

                  </div>

                </div>
              )}

            </div>

          </div>

        </div>
      )}

    </>
  );
}