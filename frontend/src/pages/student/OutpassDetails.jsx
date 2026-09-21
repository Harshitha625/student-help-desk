import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Phone,
  ShieldCheck,
  User,
  CheckCircle2,
  XCircle,
  Clock,
  Printer,
  FileCheck2,
  Navigation,
} from 'lucide-react';

import { outpassService } from '../../services/outpassService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import LoadingSkeleton from '../../components/LoadingSkeleton';

export default function OutpassDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [outpass, setOutpass] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOutpass = async () => {
    try {
      setLoading(true);
      const data = await outpassService.getOutpass(id);
      setOutpass(data);
    } catch (err) {
      console.error('Failed to load outpass details:', err);
      addToast('Could not load outpass record.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOutpass();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-5xl mx-auto">
          <LoadingSkeleton count={1} />
        </div>
      </div>
    );
  }

  if (!outpass) {
    return (
      <div className="min-h-screen bg-brand-dark px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-brand-teal-dark border border-brand-dark-border flex items-center justify-center mb-5">
            <FileCheck2 className="w-6 h-6 text-brand-gold" />
          </div>

          <h2 className="font-heading text-xl font-bold text-brand-cream">
            Outpass not found
          </h2>

          <p className="mt-2 text-sm text-brand-muted">
            This outpass record could not be found or you are not authorized
            to view it.
          </p>

          <Link
            to="/outpasses"
            className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-gold text-brand-dark text-sm font-bold hover:bg-brand-gold-hover transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Outpasses
          </Link>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------
  // Existing 5-stage workflow
  // ---------------------------------------------------------

  const steps = [
    {
      label: 'Application Submitted',
      shortLabel: 'Submitted',
      key: 'Pending',
    },
    {
      label: 'Parent Verification',
      shortLabel: 'Parent',
      key: 'Parent Verification',
    },
    {
      label: 'Warden Review',
      shortLabel: 'Warden',
      key: 'Warden Review',
    },
    {
      label: 'Approved',
      shortLabel: 'Approved',
      key: 'Approved',
    },
    {
      label: 'Completed',
      shortLabel: 'Completed',
      key: 'Completed',
    },
  ];

  const order = [
    'Pending',
    'Parent Verification',
    'Warden Review',
    'Approved',
    'Completed',
  ];

  const getStepStatus = (index) => {
    if (outpass.status === 'Rejected') {
      return index <= 1 ? 'completed' : 'rejected';
    }

    const currentIndex = order.indexOf(outpass.status);

    if (currentIndex >= index) {
      return 'completed';
    }

    return 'pending';
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'Approved':
        return {
          label: 'Approved',
          icon: CheckCircle2,
          className:
            'bg-[#DFF7ED] text-[#16705A] border-[#9ED9C5]',
        };

      case 'Completed':
        return {
          label: 'Completed',
          icon: CheckCircle2,
          className:
            'bg-[#DFF7ED] text-[#16705A] border-[#9ED9C5]',
        };

      case 'Rejected':
        return {
          label: 'Rejected',
          icon: XCircle,
          className:
            'bg-[#3A211F] text-[#F0A7A1] border-[#70413D]',
        };

      case 'Warden Review':
        return {
          label: 'Warden Review',
          icon: Clock,
          className:
            'bg-[#332B1C] text-brand-gold border-[#6B5730]',
        };

      case 'Parent Verification':
        return {
          label: 'Parent Verification',
          icon: ShieldCheck,
          className:
            'bg-[#332B1C] text-brand-gold border-[#6B5730]',
        };

      default:
        return {
          label: status || 'Pending',
          icon: Clock,
          className:
            'bg-[#1B332D] text-[#B8C8C2] border-brand-dark-border',
        };
    }
  };

  const statusConfig = getStatusConfig(outpass.status);
  const StatusIcon = statusConfig.icon;

  const backPath =
    user?.role === 'WARDEN'
      ? '/warden/outpasses'
      : user?.role === 'ADMIN'
      ? '/admin/outpasses'
      : '/outpasses';

  return (
    <div className="min-h-screen bg-brand-dark text-brand-cream">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-9">

        {/* =====================================================
            BACK LINK
        ====================================================== */}
        <div className="mb-6">
          <Link
            to={backPath}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#8FA39C] hover:text-brand-gold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Outpass Desk</span>
          </Link>
        </div>

        {/* =====================================================
            HERO / DIGITAL PASS HEADER
        ====================================================== */}
        <section className="relative overflow-hidden rounded-[2rem] bg-brand-teal-dark border border-brand-dark-border shadow-teal-glow mb-6">

          {/* Decorative circles */}
          <div className="absolute -right-20 -top-28 w-72 h-72 rounded-full border border-[#3B7667]/40" />
          <div className="absolute -right-10 -bottom-40 w-72 h-72 rounded-full border border-[#3B7667]/30" />
          <div className="absolute right-28 top-20 w-24 h-24 rounded-full bg-[#2A6B5C]/20 blur-2xl" />

          <div className="relative p-6 sm:p-8 lg:p-9">

            {/* Top row */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">

              <div className="flex items-start gap-3.5">

                <div className="w-11 h-11 rounded-xl bg-[#315F53] border border-[#4B796D] flex items-center justify-center shrink-0">
                  <Navigation className="w-5 h-5 text-brand-gold" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#A9BDB6]">
                      Student HelpDesk
                    </span>

                    <span className="hidden sm:block w-1 h-1 rounded-full bg-[#5D8176]" />

                    <span className="text-[10px] font-mono tracking-wider text-[#7F9990] uppercase">
                      Digital Gate Pass
                    </span>
                  </div>

                  <p className="mt-2 text-[10px] font-bold tracking-[0.16em] uppercase text-brand-gold">
                    Outpass #{outpass.id}
                  </p>
                </div>
              </div>

              {/* Status */}
              <div
                className={`inline-flex self-start items-center gap-2 px-3.5 py-2 rounded-full border text-xs font-bold ${statusConfig.className}`}
              >
                <StatusIcon className="w-3.5 h-3.5" />
                <span>{statusConfig.label}</span>
              </div>
            </div>

            {/* Destination */}
            <div className="mt-7 max-w-3xl">

              <div className="flex items-start gap-3">
                <MapPin className="w-6 h-6 sm:w-7 sm:h-7 text-brand-gold shrink-0 mt-1" />

                <div>
                  <h1 className="font-heading text-3xl sm:text-4xl lg:text-[2.7rem] font-bold tracking-tight text-[#F5F3EA] leading-tight">
                    {outpass.destination}
                  </h1>

                  <p className="mt-2 text-sm sm:text-[15px] text-[#A7B9B3] leading-relaxed max-w-2xl">
                    Track your hostel permission request, guardian
                    verification, and authorization progress.
                  </p>
                </div>
              </div>
            </div>

            {/* Hero bottom metadata */}
            <div className="mt-8 pt-5 border-t border-[#3C685D] flex flex-wrap items-center gap-x-7 gap-y-3">

              <div className="flex items-center gap-2 text-xs text-[#B2C2BC]">
                <Calendar className="w-4 h-4 text-brand-gold" />
                <span>Travel Schedule</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#B2C2BC]">
                <ShieldCheck className="w-4 h-4 text-[#6BAE9D]" />
                <span>Guardian Verification</span>
              </div>

              {outpass.status === 'Approved' && (
                <div className="flex items-center gap-2 text-xs text-[#B2C2BC]">
                  <CheckCircle2 className="w-4 h-4 text-[#73C4AA]" />
                  <span>Gate Authorization Active</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* =====================================================
            AUTHORIZATION JOURNEY
        ====================================================== */}
        <section className="rounded-[1.75rem] bg-[#0D201C] border border-brand-dark-border overflow-hidden mb-6">

          <div className="px-5 sm:px-7 py-5 border-b border-[#203B34] flex items-center justify-between gap-4">

            <div>
              <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#579786]">
                Authorization Journey
              </p>

              <h2 className="mt-1.5 font-heading text-xl sm:text-2xl font-bold text-[#F2F0E8]">
                Request Progress
              </h2>

              <p className="mt-1 text-xs sm:text-sm text-[#81948E]">
                Follow your outpass through each approval stage.
              </p>
            </div>

            <div className="hidden sm:flex w-10 h-10 rounded-xl bg-[#2B3525] border border-[#4D4930] items-center justify-center">
              <ShieldCheck className="w-4.5 h-4.5 text-brand-gold" />
            </div>
          </div>

          <div className="px-5 sm:px-7 py-7">

            {/* Desktop timeline */}
            <div className="hidden md:block">
              <div className="relative">

                {/* connecting line */}
                <div className="absolute top-[17px] left-[10%] right-[10%] h-px bg-[#2D4941]" />

                <div className="relative grid grid-cols-5 gap-3">
                  {steps.map((step, index) => {
                    const stepStatus = getStepStatus(index);
                    const isCurrent =
                      outpass.status === step.key &&
                      outpass.status !== 'Rejected';

                    return (
                      <div
                        key={step.key}
                        className="relative flex flex-col items-center text-center"
                      >
                        {/* Circle */}
                        <div
                          className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center border-4 border-[#0D201C] ${
                            isCurrent
                              ? 'bg-brand-gold text-brand-dark shadow-gold-glow'
                              : stepStatus === 'completed'
                              ? 'bg-[#287565] text-[#E9F4EF]'
                              : stepStatus === 'rejected'
                              ? 'bg-[#4B2927] text-[#D98981]'
                              : 'bg-[#182C27] text-[#657B74] border-[#0D201C]'
                          }`}
                        >
                          {stepStatus === 'completed' && !isCurrent ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : stepStatus === 'rejected' ? (
                            <XCircle className="w-4 h-4" />
                          ) : (
                            <span className="text-[10px] font-bold">
                              0{index + 1}
                            </span>
                          )}
                        </div>

                        <p
                          className={`mt-3 text-xs font-semibold ${
                            isCurrent
                              ? 'text-brand-gold'
                              : stepStatus === 'completed'
                              ? 'text-[#B6D0C7]'
                              : stepStatus === 'rejected'
                              ? 'text-[#C47C74]'
                              : 'text-[#667A74]'
                          }`}
                        >
                          {step.shortLabel}
                        </p>

                        <p className="mt-1 text-[10px] text-[#657873] leading-snug max-w-[110px]">
                          {step.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Mobile timeline */}
            <div className="md:hidden space-y-3">
              {steps.map((step, index) => {
                const stepStatus = getStepStatus(index);
                const isCurrent =
                  outpass.status === step.key &&
                  outpass.status !== 'Rejected';

                return (
                  <div
                    key={step.key}
                    className={`flex items-center gap-3 p-3 rounded-xl border ${
                      isCurrent
                        ? 'bg-[#2A3322] border-[#6A5931]'
                        : 'bg-[#10231F] border-[#203B34]'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center ${
                        isCurrent
                          ? 'bg-brand-gold text-brand-dark'
                          : stepStatus === 'completed'
                          ? 'bg-[#287565] text-white'
                          : stepStatus === 'rejected'
                          ? 'bg-[#4B2927] text-[#D98981]'
                          : 'bg-[#1A302B] text-[#647B73]'
                      }`}
                    >
                      {stepStatus === 'completed' && !isCurrent ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : stepStatus === 'rejected' ? (
                        <XCircle className="w-4 h-4" />
                      ) : (
                        <span className="text-[10px] font-bold">
                          0{index + 1}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p
                        className={`text-xs font-bold ${
                          isCurrent
                            ? 'text-brand-gold'
                            : stepStatus === 'completed'
                            ? 'text-[#B6D0C7]'
                            : stepStatus === 'rejected'
                            ? 'text-[#C47C74]'
                            : 'text-[#70837D]'
                        }`}
                      >
                        {step.label}
                      </p>

                      <p className="text-[10px] text-[#60746D] mt-0.5">
                        Stage 0{index + 1}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =====================================================
            TRAVEL INFORMATION
        ====================================================== */}
        <section className="rounded-[1.75rem] bg-[#0D201C] border border-brand-dark-border overflow-hidden mb-6">

          <div className="px-5 sm:px-7 py-5 border-b border-[#203B34]">
            <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#579786]">
              Travel Details
            </p>

            <h2 className="mt-1.5 font-heading text-xl font-bold text-[#F2F0E8]">
              Journey Information
            </h2>
          </div>

          <div className="p-5 sm:p-7 space-y-6">

            {/* Purpose */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#18362F] flex items-center justify-center">
                  <Navigation className="w-3.5 h-3.5 text-brand-gold" />
                </div>

                <h3 className="text-xs font-bold uppercase tracking-wider text-[#A8B9B3]">
                  Purpose of Travel
                </h3>
              </div>

              <div className="rounded-xl bg-[#102720] border border-[#25463E] px-4 py-3.5">
                <p className="text-sm text-[#C2D0CB] leading-relaxed">
                  {outpass.reason}
                </p>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div className="rounded-2xl bg-[#102720] border border-[#25463E] p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#1B3931] flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-brand-gold" />
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#80958E]">
                    Scheduled Departure
                  </span>
                </div>

                <p className="font-heading text-sm sm:text-base font-bold text-[#EDEBE2] leading-snug">
                  {new Date(outpass.from_date).toLocaleString([], {
                    dateStyle: 'full',
                    timeStyle: 'short',
                  })}
                </p>
              </div>

              <div className="rounded-2xl bg-[#102720] border border-[#25463E] p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#30291C] flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-brand-gold" />
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#80958E]">
                    Expected Return
                  </span>
                </div>

                <p className="font-heading text-sm sm:text-base font-bold text-[#EDEBE2] leading-snug">
                  {new Date(outpass.to_date).toLocaleString([], {
                    dateStyle: 'full',
                    timeStyle: 'short',
                  })}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            GUARDIAN VERIFICATION
        ====================================================== */}
        <section className="rounded-[1.75rem] bg-[#102720] border border-[#34574D] overflow-hidden mb-6">

          <div className="px-5 sm:px-7 py-5 border-b border-[#2A4941] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#2E3924] border border-[#4D5430] flex items-center justify-center">
                <ShieldCheck className="w-4.5 h-4.5 text-brand-gold" />
              </div>

              <div>
                <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-brand-gold">
                  Verification
                </p>

                <h2 className="mt-0.5 text-sm sm:text-base font-bold text-[#EEECE3]">
                  Parent / Guardian Verification
                </h2>
              </div>
            </div>

            <span className="self-start sm:self-auto inline-flex items-center px-3 py-1.5 rounded-full bg-[#182F29] border border-[#396256] text-[10px] font-bold uppercase tracking-wider text-[#9AC2B6]">
              {outpass.verification_status}
            </span>
          </div>

          <div className="p-5 sm:p-7">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Guardian */}
              <div className="rounded-xl bg-[#0D201C] border border-[#25463E] p-4">
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-4 h-4 text-[#6CA493]" />
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[#718780]">
                    Guardian Name
                  </span>
                </div>

                <p className="text-sm font-semibold text-[#E6E7DF]">
                  {outpass.parent_name}
                </p>
              </div>

              {/* Contact */}
              <div className="rounded-xl bg-[#0D201C] border border-[#25463E] p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Phone className="w-4 h-4 text-[#6CA493]" />
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[#718780]">
                    Contact Phone
                  </span>
                </div>

                <p className="text-sm font-semibold text-[#E6E7DF]">
                  {outpass.parent_contact}
                </p>
              </div>
            </div>

            {/* Verification notes */}
            {outpass.verification_notes && (
              <div className="mt-4 rounded-xl bg-[#192C25] border border-[#3B554C] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-gold" />

                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold">
                    Warden Verification Notes
                  </span>
                </div>

                <p className="text-xs text-[#B3C3BD] leading-relaxed">
                  {outpass.verification_notes}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* =====================================================
            REVIEWER REMARKS
        ====================================================== */}
        {outpass.reviewer_remarks && (
          <section className="rounded-[1.75rem] bg-[#0D201C] border border-brand-dark-border p-5 sm:p-7 mb-6">

            <div className="flex items-start gap-3">

              <div className="w-9 h-9 rounded-xl bg-[#18362F] flex items-center justify-center shrink-0">
                <FileCheck2 className="w-4 h-4 text-[#70AE9D]" />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wider font-bold text-[#78918A]">
                  Official Authorization Remarks
                </p>

                <p className="mt-1 text-xs text-[#9DAFA9]">
                  Reviewed by {outpass.reviewer_name || 'Warden'}
                </p>

                <div className="mt-4 rounded-xl bg-[#102720] border border-[#25463E] px-4 py-3.5">
                  <p className="text-sm text-[#C0CEC9] leading-relaxed italic">
                    "{outpass.reviewer_remarks}"
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =====================================================
            ADDITIONAL NOTES
        ====================================================== */}
        {outpass.notes && (
          <section className="rounded-[1.5rem] bg-[#0D201C] border border-brand-dark-border p-5 sm:p-6 mb-6">

            <p className="text-[10px] uppercase tracking-wider font-bold text-[#78918A]">
              Additional Itinerary Notes
            </p>

            <p className="mt-2 text-sm text-[#AEBEB9] leading-relaxed">
              {outpass.notes}
            </p>
          </section>
        )}

        {/* =====================================================
            APPROVED DIGITAL GATE PASS
        ====================================================== */}
        {outpass.status === 'Approved' && (
          <section className="relative overflow-hidden rounded-[1.75rem] bg-[#123F36] border border-[#3D7567] shadow-teal-glow mb-8">

            <div className="absolute -right-10 -top-16 w-44 h-44 rounded-full border border-[#4B8273]/30" />

            <div className="relative p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

              <div className="flex items-start gap-3">

                <div className="w-10 h-10 rounded-xl bg-[#2A6B5C] border border-[#4E8979] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-[#DDF6EB]" />
                </div>

                <div>
                  <p className="text-sm font-bold text-[#F1F0E7]">
                    Authorized Digital Gate Pass Active
                  </p>

                  <p className="mt-1 text-xs text-[#B3C7C0] leading-relaxed max-w-xl">
                    Present this screen or reference Pass #{outpass.id}
                    at the hostel campus security gate.
                  </p>
                </div>
              </div>

              <button
                onClick={() => window.print()}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-gold hover:bg-brand-gold-hover text-brand-dark text-xs font-bold transition-colors shrink-0"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Pass</span>
              </button>
            </div>
          </section>
        )}

        {/* Bottom spacing */}
        <div className="h-2" />
      </div>

      {/* =======================================================
          PRINT STYLES
      ======================================================== */}
      <style>{`
        @media print {
          body {
            background: white !important;
          }

          nav,
          header {
            display: none !important;
          }

          .min-h-screen {
            background: white !important;
            color: black !important;
          }

          button {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
