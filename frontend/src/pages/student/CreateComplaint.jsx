import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Upload,
  ShieldOff,
  Building2,
  Utensils,
  Zap,
  Wrench,
  Wifi,
  BedDouble,
  GraduationCap,
  FileCheck2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { complaintService } from '../../services/complaintService';
import { useToast } from '../../context/ToastContext';
import { COMPLAINT_CATEGORIES, COMPLAINT_PRIORITIES } from '../../utils/constants';

const categoryIcons = {
  'Hostel Maintenance': Wrench,
  'Mess/Food': Utensils,
  'Electrical': Zap,
  'Plumbing': Wrench,
  'Internet/Wi-Fi': Wifi,
  'Room/Furniture': BedDouble,
  'Academic': GraduationCap,
  'Infrastructure': Building2,
  'Other': FileCheck2,
};

export default function CreateComplaint() {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [location, setLocation] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [anonymous, setAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { addToast } = useToast();
  const navigate = useNavigate();
  const totalSteps = 5;

  const validateStep = () => {
    const errs = {};
    if (step === 1 && !category) {
      errs.category = 'Please select a complaint category to continue.';
    }
    if (step === 2) {
      if (!title.trim()) errs.title = 'Please enter a brief complaint title.';
      if (!description.trim()) errs.description = 'Please describe the problem in detail.';
    }
    if (step === 3) {
      if (!location.trim()) errs.location = 'Please specify the exact room, block, or campus location.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((prev) => Math.min(totalSteps, prev + 1));
    }
  };

  const handlePrev = () => {
    setErrors({});
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('category', category);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('priority', priority);
      formData.append('location', location);
      formData.append('anonymous', anonymous);
      if (attachment) {
        formData.append('attachment', attachment);
      }
      const res = await complaintService.createComplaint(formData);
      addToast(`Complaint #${res.id} submitted successfully!`, 'success');
      navigate(`/complaints/${res.id}`);
    } catch (err) {
      console.error('Error submitting complaint:', err);
      addToast('Failed to lodge complaint. Please check your inputs.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#123c3a]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/complaints"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/70 hover:text-white mb-3 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Complaints</span>
          </Link>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">
            Lodge Campus Complaint
          </h1>
          <p className="text-xs sm:text-sm text-white/70">
            Follow our 5-step wizard to direct your issue to the correct maintenance team
          </p>
        </div>

        {/* Progress Stepper Bar */}
        <div className="mb-8 p-4 rounded-2xl bg-[#123c3a] border border-white/20 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-teal">
              Step {step} of {totalSteps}
            </span>
            <span className="text-xs font-medium text-white/70">
              {step === 1 && 'Choose Category'}
              {step === 2 && 'Describe Issue'}
              {step === 3 && 'Priority & Location'}
              {step === 4 && 'Attachment & Privacy'}
              {step === 5 && 'Review & Submit'}
            </span>
          </div>
          <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
            <div
              className="bg-brand-teal h-full transition-all duration-300 rounded-full"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Wizard Form Container */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#123c3a] border border-white/20 shadow-card-soft">
          <AnimatePresence mode="wait">
            {/* STEP 1: CATEGORY SELECTION */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <div>
                  <h3 className="font-heading font-bold text-lg text-white">
                    Select Issue Category
                  </h3>
                  <p className="text-xs text-white/70">
                    Choose the department best suited to address this problem
                  </p>
                </div>

                {errors.category && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.category}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {COMPLAINT_CATEGORIES.map((cat) => {
                    const Icon = categoryIcons[cat] || Wrench;
                    const isSelected = category === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                          isSelected
                            ? 'border-brand-teal bg-brand-teal/20 shadow-xs ring-2 ring-brand-teal/40'
                            : 'border-white/20 hover:border-brand-teal/60 bg-[#123c3a]'
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${
                            isSelected
                              ? 'bg-brand-teal text-white'
                              : 'bg-white/10 text-white/80'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-white">
                          {cat}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 2: ISSUE DESCRIPTION */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <div>
                  <h3 className="font-heading font-bold text-lg text-white">
                    Describe the Issue
                  </h3>
                  <p className="text-xs text-white/70">
                    Provide clear specifics so the technician can arrive with the right tools
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-white mb-1">
                      Complaint Title *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Washroom tap constantly leaking"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-brand-border bg-white focus:ring-2 focus:ring-brand-teal outline-none"
                    />
                    {errors.title && (
                      <p className="text-xs text-rose-300 mt-1">{errors.title}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white mb-1">
                      Detailed Description *
                    </label>
                    <textarea
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe what happened, how long it has been an issue, and any safety hazards..."
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-brand-border bg-white focus:ring-2 focus:ring-brand-teal outline-none leading-relaxed"
                    />
                    {errors.description && (
                      <p className="text-xs text-rose-300 mt-1">{errors.description}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: PRIORITY & LOCATION */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <div>
                  <h3 className="font-heading font-bold text-lg text-white">
                    Urgency & Location
                  </h3>
                  <p className="text-xs text-white/70">
                    Where should maintenance report, and how critically does it affect you?
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-white mb-2">
                      Priority Level
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {COMPLAINT_PRIORITIES.map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPriority(p)}
                          className={`p-3 rounded-xl text-xs font-semibold border transition-all ${
                            priority === p
                              ? 'border-brand-teal bg-brand-teal text-white shadow-xs'
                              : 'border-white/20 bg-white hover:bg-slate-100 text-[#123c3a]'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white mb-1">
                      Specific Location *
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Cauvery Hostel Block B, 3rd Floor, Room B-304"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-brand-border bg-white focus:ring-2 focus:ring-brand-teal outline-none"
                    />
                    {errors.location && (
                      <p className="text-xs text-rose-300 mt-1">{errors.location}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: ATTACHMENT & ANONYMITY */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <div>
                  <h3 className="font-heading font-bold text-lg text-white">
                    Photo Attachment & Privacy
                  </h3>
                  <p className="text-xs text-white/70">
                    Optional image proof and confidentiality toggles
                  </p>
                </div>

                {/* File Upload Box */}
                <div>
                  <label className="block text-xs font-semibold text-white mb-2">
                    Attach Photo (Optional)
                  </label>
                  <label className="border-2 border-dashed border-white/30 hover:border-brand-teal/60 rounded-2xl p-6 text-center flex flex-col items-center justify-center cursor-pointer bg-white hover:bg-slate-50 transition-colors">
                    <Upload className="w-8 h-8 text-brand-teal mb-2" />
                    <span className="text-xs font-semibold text-[#123c3a]">
                      {attachment ? attachment.name : 'Click to select or drag and drop image'}
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5">
                      PNG, JPG, JPEG up to 10MB
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setAttachment(e.target.files[0] || null)}
                      className="hidden"
                    />
                  </label>
                  {attachment && (
                    <div className="flex items-center justify-between text-xs text-brand-teal mt-2">
                      <span>Attached: {attachment.name}</span>
                      <button
                        type="button"
                        onClick={() => setAttachment(null)}
                        className="text-rose-300 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Anonymous Submission Switch */}
                <div className="p-4 rounded-2xl bg-white/10 border border-white/20 flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="anon_switch"
                    checked={anonymous}
                    onChange={(e) => setAnonymous(e.target.checked)}
                    className="mt-1 w-4 h-4 text-brand-teal rounded border-slate-300 focus:ring-brand-teal"
                  />
                  <label
                    htmlFor="anon_switch"
                    className="text-xs text-white/80 leading-relaxed cursor-pointer"
                  >
                    <span className="font-bold text-amber-300 block mb-0.5">
                      Submit as Anonymous Complaint
                    </span>
                    Mask your student name and roll number from public lists and maintenance personnel. Campus administrators can maintain private oversight if necessary.
                  </label>
                </div>
              </motion.div>
            )}

            {/* STEP 5: REVIEW & SUBMIT */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <div>
                  <h3 className="font-heading font-bold text-lg text-white">
                    Review & Confirm Submission
                  </h3>
                  <p className="text-xs text-white/70">
                    Verify your complaint details before sending to campus maintenance
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/10 border border-white/20 space-y-3 text-xs sm:text-sm">
                  <div className="flex items-center justify-between pb-2 border-b border-white/20">
                    <span className="text-white/70">Category:</span>
                    <span className="font-semibold text-brand-teal">{category}</span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-white/20">
                    <span className="text-white/70">Title:</span>
                    <span className="font-semibold text-white">{title}</span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-white/20">
                    <span className="text-white/70">Priority:</span>
                    <span className="font-semibold text-amber-300">{priority}</span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-white/20">
                    <span className="text-white/70">Location:</span>
                    <span className="font-semibold text-white">{location}</span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-white/20">
                    <span className="text-white/70">Confidentiality:</span>
                    <span className="font-semibold text-white/80">
                      {anonymous ? 'Anonymous' : 'Standard Student Identity'}
                    </span>
                  </div>

                  <div className="pt-1">
                    <span className="text-white/70 block mb-1">Description:</span>
                    <p className="text-[#123c3a] leading-relaxed bg-white p-3 rounded-xl border border-white/20 text-xs">
                      {description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Wizard Navigation Footer */}
          <div className="mt-8 pt-5 border-t border-white/20 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl border border-white/20 text-xs font-semibold text-white hover:bg-white/10 transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>
            ) : (
              <div />
            )}

            {step < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-brand-teal hover:bg-brand-teal-dark text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-brand-teal hover:bg-brand-teal-dark text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-60"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Submit Complaint Ticket</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}