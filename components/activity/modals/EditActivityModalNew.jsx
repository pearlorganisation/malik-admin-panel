'use client';

import { useUpdateActivityMutation } from '@/features/activity/activityApi';
import { useGetLanguagesQuery } from '@/features/languages/languageApi';
import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

// ─── Tooltip ────────────────────────────────────────────────────────────────
const Tip = ({ text }) => {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-block ml-1">
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold leading-none border border-amber-300 hover:bg-amber-200 transition-colors"
        aria-label="Help"
      >?</button>
      {show && (
        <span className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 w-52 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-xl pointer-events-none">
          {text}
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
        </span>
      )}
    </span>
  );
};

// ─── Field Label ─────────────────────────────────────────────────────────────
const FieldLabel = ({ label, required, tip }) => (
  <label className="flex items-center gap-1 text-sm font-semibold text-gray-700 mb-1.5">
    {label}
    {required && <span className="text-rose-500 font-bold">*</span>}
    {tip && <Tip text={tip} />}
  </label>
);

// ─── Text Input ───────────────────────────────────────────────────────────────
const TextInput = ({ label, required, tip, error, hint, className = '', ...props }) => (
  <div className={`flex flex-col ${className}`}>
    {label && <FieldLabel label={label} required={required} tip={tip} />}
    <input
      {...props}
      className={`w-full border rounded-lg px-3 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition-all
        focus:outline-none focus:ring-2 focus:border-transparent
        ${error ? 'border-rose-400 focus:ring-rose-300' : 'border-gray-300 focus:ring-amber-400'}
        placeholder:text-gray-400`}
    />
    {hint && !error && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    {error && <p className="mt-1 text-xs text-rose-500 flex items-center gap-1"><span>⚠</span>{error}</p>}
  </div>
);

// ─── Textarea ────────────────────────────────────────────────────────────────
const TextArea = ({ label, required, tip, error, hint, rows = 3, className = '', ...props }) => (
  <div className={`flex flex-col ${className}`}>
    {label && <FieldLabel label={label} required={required} tip={tip} />}
    <textarea
      rows={rows}
      {...props}
      className={`w-full border rounded-lg px-3 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition-all resize-none
        focus:outline-none focus:ring-2 focus:border-transparent
        ${error ? 'border-rose-400 focus:ring-rose-300' : 'border-gray-300 focus:ring-amber-400'}
        placeholder:text-gray-400`}
    />
    {hint && !error && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    {error && <p className="mt-1 text-xs text-rose-500 flex items-center gap-1"><span>⚠</span>{error}</p>}
  </div>
);

// ─── Section Card ─────────────────────────────────────────────────────────────
const SectionCard = ({ icon, title, subtitle, children, accent = 'amber' }) => {
  const accents = {
    amber: 'bg-amber-50 border-amber-200',
    blue: 'bg-blue-50 border-blue-200',
    emerald: 'bg-emerald-50 border-emerald-200',
    orange: 'bg-orange-50 border-orange-200',
    slate: 'bg-slate-50 border-slate-200',
    rose: 'bg-rose-50 border-rose-200',
  };
  const iconBg = {
    amber: 'bg-amber-100 text-amber-700',
    blue: 'bg-blue-100 text-blue-700',
    emerald: 'bg-emerald-100 text-emerald-700',
    orange: 'bg-orange-100 text-orange-700',
    slate: 'bg-slate-100 text-slate-700',
    rose: 'bg-rose-100 text-rose-700',
  };
  return (
    <div className={`rounded-xl border ${accents[accent]} p-5`}>
      <div className="flex items-start gap-3 mb-4">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0 ${iconBg[accent]}`}>
          {icon}
        </div>
        <div>
          <h3 className="font-bold text-gray-800 text-sm">{title}</h3>
          {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
};

// ─── Tag List Preview ──────────────────────────────────────────────────────────
const TagPreview = ({ value, placeholder }) => {
  const tags = value ? value.split(',').map(t => t.trim()).filter(Boolean) : [];
  if (!tags.length) return <p className="text-xs text-gray-400 italic">{placeholder}</p>;
  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {tags.map((tag, i) => (
        <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
          {tag}
        </span>
      ))}
    </div>
  );
};

// ─── Step Progress Bar ──────────────────────────────────────────────────────
const STEPS = [
  { key: 'basic', label: 'Basic Info', icon: '📋' },
  { key: 'experience', label: 'Experience', icon: '✨' },
  { key: 'itinerary', label: 'Itinerary', icon: '🗺️' },
  { key: 'logistics', label: 'Logistics', icon: '📍' },
  { key: 'extras', label: 'Extras', icon: '🎁' },
];

const StepNav = ({ activeTab, setActiveTab }) => {
  const activeIndex = STEPS.findIndex(s => s.key === activeTab);
  return (
    <div className="flex items-center border-b border-gray-200 bg-white overflow-x-auto">
      {STEPS.map((step, i) => {
        const isActive = step.key === activeTab;
        const isDone = i < activeIndex;
        return (
          <button
            key={step.key}
            onClick={() => setActiveTab(step.key)}
            className={`group relative flex items-center gap-2 px-4 py-3.5 text-xs font-semibold uppercase tracking-wide whitespace-nowrap transition-all duration-200 flex-shrink-0
              ${isActive ? 'text-amber-700 bg-amber-50 border-b-2 border-amber-500' : isDone ? 'text-emerald-600 hover:bg-emerald-50' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'}`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 transition-all
              ${isActive ? 'bg-amber-500 text-white' : isDone ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {isDone ? '✓' : i + 1}
            </span>
            <span className="hidden sm:inline">{step.label}</span>
            <span className="sm:hidden">{step.icon}</span>
          </button>
        );
      })}
    </div>
  );
};

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyState = ({ icon, text, sub }) => (
  <div className="flex flex-col items-center justify-center py-10 text-center">
    <div className="text-4xl mb-3 opacity-40">{icon}</div>
    <p className="text-sm font-semibold text-gray-500">{text}</p>
    {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
  </div>
);

// ─── Add Button ───────────────────────────────────────────────────────────────
const AddButton = ({ onClick, label }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full py-3 border-2 border-dashed border-amber-300 text-amber-700 font-semibold text-sm rounded-xl hover:bg-amber-50 hover:border-amber-400 transition-all duration-200 flex items-center justify-center gap-2"
  >
    <span className="text-lg leading-none">+</span> {label}
  </button>
);

// ─── Time Slot Validator ──────────────────────────────────────────────────────
const isValidTime = (time) => /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i.test(time.trim());

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function EditActivityModal({ activity, onClose, onSuccess }) {
  const [updateActivity, { isLoading }] = useUpdateActivityMutation();
  const { data: langsData } = useGetLanguagesQuery(); 
  const languages = langsData?.data || [];
  const [activeTab, setActiveTab] = useState('basic');
  const [errors, setErrors] = useState({});
console.log("updateact",activity)
  const [formData, setFormData] = useState({
    name: '',
    isActive: true,
    languageId: '', 
    isDuplicate: false,
    timeSlots: '',
    experienceTitle: '',
    experienceNote: '',
    experienceDesc: '',
    highlights: '',
    itinerary: [],
    pickupDesc: '',
    pickupNote: '',
    pickupMap: '',
    keyInfo: '',
    essentialGuide: '',
    bbqTitle: '',
    bbqDesc: '',
    bbqFields: [],
    suvAvailable: false,
    suvFee: 0,
    suvModel: 'SUV',
  });

  useEffect(() => {
    if (activity) {
      setFormData({
        name: activity?.name || '',
        isActive: activity?.isActive ?? true,
        languageId: activity?.languageId?._id || activity?.languageId || '', 
        isDuplicate: activity?.isDuplicate || false,
        timeSlots: (activity?.timeSlots || []).join(', '),
        experienceTitle: activity?.Experience?.title || '',
        experienceNote: activity?.Experience?.note || '',
        experienceDesc: activity?.Experience?.description || '',
        highlights: (activity?.Experience?.highlights || []).join(', '),
        itinerary: activity?.Itinerary?.length
          ? activity.Itinerary.map(item => ({ ...item, _id: item._id || crypto.randomUUID() }))
          : [],
        pickupDesc: activity?.InfoAndLogistics?.pickupZone?.description || '',
        pickupNote: activity?.InfoAndLogistics?.pickupZone?.note || '',
        pickupMap: activity?.InfoAndLogistics?.pickupZone?.mapLink || '',
        keyInfo: (activity?.InfoAndLogistics?.keyInfo || []).join(', '),
        essentialGuide: (activity?.InfoAndLogistics?.essentialGuide || []).join(', '),
        bbqTitle: activity?.BBQ_BUFFET?.title || '',
        bbqFields: activity?.BBQ_BUFFET?.fields?.length
          ? activity.BBQ_BUFFET.fields.map(f => ({ category: f.category || '', items: f.items || [] }))
          : [],
        bbqDesc: activity?.BBQ_BUFFET?.description || '',
        suvAvailable: activity?.PrivateSUV?.available || false,
        suvFee: activity?.PrivateSUV?.fee || 0,
        suvModel: activity?.PrivateSUV?.model || 'SUV',
      });
    }
  }, [activity]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  }, [errors]);

  // ── Itinerary ──
  const handleItineraryChange = useCallback((index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.itinerary];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, itinerary: updated };
    });
  }, []);

  const addItineraryItem = () => {
    setFormData(prev => ({
      ...prev,
      itinerary: [...prev.itinerary, { _id: crypto.randomUUID(), time: '', title: '', description: '', image: { secure_url: '', publicId: '' } }],
    }));
  };

  const removeItineraryItem = (index) => {
    setFormData(prev => ({ ...prev, itinerary: prev.itinerary.filter((_, i) => i !== index) }));
  };

  // ── BBQ ──
  const handleBBQFieldChange = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.bbqFields];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, bbqFields: updated };
    });
  };

  const handleBBQItemsChange = (index, value) => {
    setFormData(prev => {
      const updated = [...prev.bbqFields];
      updated[index] = { ...updated[index], items: value.split(',').map(i => i.trim()) };
      return { ...prev, bbqFields: updated };
    });
  };

  const addBBQField = () => {
    setFormData(prev => ({ ...prev, bbqFields: [...prev.bbqFields, { category: '', items: [] }] }));
  };

  const removeBBQField = (index) => {
    setFormData(prev => ({ ...prev, bbqFields: prev.bbqFields.filter((_, i) => i !== index) }));
  };

  // ── Validation ──
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Activity name is required.';

    const slots = formData.timeSlots.split(',').map(s => s.trim()).filter(Boolean);
    for (let s of slots) {
      if (!isValidTime(s)) {
        newErrors.timeSlots = `"${s}" is not valid. Use format like 09:00 AM or 2:30 PM.`;
        break;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Submit ──
  const handleSubmit = async () => {
    if (!validate()) {
      setActiveTab('basic');
      return;
    }
    try {
      const timeSlotsArray = formData.timeSlots.split(',').map(i => i.trim()).filter(Boolean);
      const payload = {
        name: formData.name.trim(),
        isActive: formData.isActive,
         languageId: formData.languageId, 
        isDuplicate: formData.isDuplicate,
        timeSlots: timeSlotsArray,
        Experience: {
          title: formData.experienceTitle,
          note: formData.experienceNote,
          description: formData.experienceDesc,
          highlights: formData.highlights.split(',').map(i => i.trim()).filter(Boolean),
        },
        Itinerary: formData.itinerary
          .filter(item => item.title || item.description)
          .map(item => ({ ...item, image: item.image?.secure_url ? item.image : undefined })),
        InfoAndLogistics: {
          pickupZone: { description: formData.pickupDesc, note: formData.pickupNote, mapLink: formData.pickupMap },
          keyInfo: formData.keyInfo.split(',').map(i => i.trim()).filter(Boolean),
          essentialGuide: formData.essentialGuide.split(',').map(i => i.trim()).filter(Boolean),
        },
        BBQ_BUFFET: {
          title: formData.bbqTitle,
          description: formData.bbqDesc,
          fields: formData.bbqFields.filter(f => f.category),
        },
        PrivateSUV: {
          available: formData.suvAvailable,
          fee: Number(formData.suvFee) || 0,
          model: formData.suvModel,
        },
      };

      await updateActivity({
        id: activity._id,
        data: {
          ...payload,
          Experience: JSON.stringify(payload.Experience),
          Itinerary: JSON.stringify(payload.Itinerary),
          InfoAndLogistics: JSON.stringify(payload.InfoAndLogistics),
          BBQ_BUFFET: JSON.stringify(payload.BBQ_BUFFET),
          PrivateSUV: JSON.stringify(payload.PrivateSUV),
          timeSlots: JSON.stringify(payload.timeSlots),
        },
      }).unwrap();

      toast.success('Activity updated successfully! 🎉');
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      toast.error(error?.data?.message || 'Update failed. Please try again.');
    }
  };

  const goNext = () => {
    const idx = STEPS.findIndex(s => s.key === activeTab);
    if (idx < STEPS.length - 1) setActiveTab(STEPS[idx + 1].key);
  };
  const goPrev = () => {
    const idx = STEPS.findIndex(s => s.key === activeTab);
    if (idx > 0) setActiveTab(STEPS[idx - 1].key);
  };

  if (!activity) return null;

  const activeIndex = STEPS.findIndex(s => s.key === activeTab);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-gray-900/70 backdrop-blur-sm">
      <div
        className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col"
        style={{ height: 'min(92vh, 760px)' }}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-amber-200">
              ✏️
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-gray-900 leading-tight">Edit Activity</h2>
              <p className="text-xs text-gray-400 font-medium truncate max-w-xs">
                {formData.name || 'Unnamed Activity'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-rose-100 hover:text-rose-600 text-gray-500 flex items-center justify-center text-sm font-bold transition-colors"
          >✕</button>
        </div>

        {/* ── Step Nav ── */}
        <StepNav activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto min-h-0 px-6 py-5 space-y-5">

          {/* ════ BASIC INFO ════ */}
          {activeTab === 'basic' && (
            <>
              <div className="mb-1">
                <p className="text-xs font-semibold text-amber-700 uppercase tracking-widest">Step 1 of 5</p>
                <h3 className="text-xl font-extrabold text-gray-900 mt-0.5">Basic Information</h3>
                <p className="text-sm text-gray-500 mt-1">Start with the core details of this activity.</p>
              </div>

              <SectionCard icon="📌" title="Activity Identity" subtitle="Name and visibility status" accent="amber">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextInput
                  label="Activity Name"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Desert Safari, Kayaking Tour"
                  tip="The main title that customers will see. Keep it short and descriptive."
                  error={errors.name}
                />

 <div className="flex flex-col">
          <FieldLabel label="Select Language" required tip="Choose the language for this activity version." />
          <select
            name="languageId"
            value={formData.languageId}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-800 bg-white focus:ring-2 focus:ring-amber-400 focus:outline-none shadow-sm"
          >
            <option value="">Select Language</option>
            {languages.map((lang) => (
              <option key={lang._id} value={lang._id}>
                {lang.name} ({lang.code.toUpperCase()})
              </option>
            ))}
          </select>
        </div>
      </div>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3.5 bg-white border border-gray-200 rounded-lg">
                  <div className="relative flex-shrink-0">
                    <input
                      type="checkbox"
                      name="isActive"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <label
                      htmlFor="isActive"
                      className={`flex items-center cursor-pointer w-11 h-6 rounded-full transition-colors duration-200 ${formData.isActive ? 'bg-emerald-500' : 'bg-gray-300'}`}
                    >
                      <span className={`inline-block w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 mx-1 ${formData.isActive ? 'translate-x-5' : 'translate-x-0'}`} />
                    </label>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {formData.isActive ? '✅ Activity is Live & Visible' : '⏸ Activity is Hidden'}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">Toggle to show or hide this activity from customers</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3.5 bg-white border border-gray-200 rounded-lg">
          <div className="relative flex-shrink-0">
            <input
              type="checkbox"
              name="isDuplicate"
              id="isDuplicate"
              checked={formData.isDuplicate}
              onChange={handleChange}
              className="sr-only"
            />
            <label
              htmlFor="isDuplicate"
              className={`flex items-center cursor-pointer w-11 h-6 rounded-full transition-colors duration-200 ${formData.isDuplicate ? 'bg-blue-500' : 'bg-gray-300'}`}
            >
              <span className={`inline-block w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 mx-1 ${formData.isDuplicate ? 'translate-x-5' : 'translate-x-0'}`} />
            </label>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">Is Duplicate?</p>
            <p className="text-xs text-gray-400 mt-0.5">Check if this is a translated copy</p>
          </div>
        </div>
      </div>
              </SectionCard>

              <SectionCard icon="🕐" title="Time Slots" subtitle="When is this activity available?" accent="blue">
                <TextInput
                  label="Available Time Slots"
                  name="timeSlots"
                  value={formData.timeSlots}
                  onChange={handleChange}
                  placeholder="09:00 AM, 02:30 PM, 06:00 PM"
                  tip="Enter times in 12-hour format. Separate multiple slots with commas."
                  hint="Format: HH:MM AM/PM — e.g. 09:00 AM, 02:30 PM"
                  error={errors.timeSlots}
                />
                <TagPreview value={formData.timeSlots} placeholder="No time slots added yet" />
              </SectionCard>
            </>
          )}

          {/* ════ EXPERIENCE ════ */}
          {activeTab === 'experience' && (
            <>
              <div className="mb-1">
                <p className="text-xs font-semibold text-amber-700 uppercase tracking-widest">Step 2 of 5</p>
                <h3 className="text-xl font-extrabold text-gray-900 mt-0.5">Experience Details</h3>
                <p className="text-sm text-gray-500 mt-1">Describe what customers will feel and see on this activity.</p>
              </div>

              <SectionCard icon="✨" title="Experience Overview" subtitle="Title and key message shown to customers" accent="amber">
                <TextInput
                  label="Experience Title"
                  name="experienceTitle"
                  value={formData.experienceTitle}
                  onChange={handleChange}
                  placeholder="e.g. An Unforgettable Desert Adventure"
                  tip="A short, exciting title summarizing the experience. Shown prominently on the listing."
                />
                <TextInput
                  label="Short Note / Subtitle"
                  name="experienceNote"
                  value={formData.experienceNote}
                  onChange={handleChange}
                  placeholder="e.g. Ideal for families and adventure seekers"
                  tip="A one-line note shown below the title. Use it for important callouts."
                />
              </SectionCard>

              <SectionCard icon="📝" title="Full Description" subtitle="Detailed explanation of the experience" accent="blue">
                <TextArea
                  label="Description"
                  name="experienceDesc"
                  value={formData.experienceDesc}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe the full experience in detail. What will guests do, see, and enjoy? What makes it special?"
                  tip="Write 3–5 sentences describing the activity. More detail = more bookings!"
                />
              </SectionCard>

              <SectionCard icon="⭐" title="Highlights" subtitle="Key selling points shown as tags" accent="emerald">
                <TextArea
                  label="Highlights"
                  name="highlights"
                  value={formData.highlights}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Dune bashing, Camel ride, Sunset photography, BBQ dinner"
                  tip="Comma-separated list of key highlights. These appear as eye-catching tags on the listing."
                  hint="Separate each highlight with a comma — e.g. Camel ride, Bonfire night, Live music"
                />
                <TagPreview value={formData.highlights} placeholder="No highlights added yet — they'll appear as tags here" />
              </SectionCard>
            </>
          )}

          {/* ════ ITINERARY ════ */}
          {activeTab === 'itinerary' && (
            <>
              <div className="mb-1">
                <p className="text-xs font-semibold text-amber-700 uppercase tracking-widest">Step 3 of 5</p>
                <h3 className="text-xl font-extrabold text-gray-900 mt-0.5">Itinerary / Schedule</h3>
                <p className="text-sm text-gray-500 mt-1">Break down the activity into steps so customers know exactly what to expect.</p>
              </div>

              {formData.itinerary.length === 0 ? (
                <div className="border-2 border-dashed border-gray-200 rounded-xl">
                  <EmptyState icon="🗺️" text="No itinerary steps yet" sub="Add steps below to show guests the schedule" />
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.itinerary.map((item, index) => (
                    <div
                      key={item._id || index}
                      className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
                    >
                      {/* Step header */}
                      <div className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                            {index + 1}
                          </span>
                          <span className="font-bold text-amber-800 text-sm">
                            {item.title || `Step ${index + 1}`}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItineraryItem(index)}
                          className="text-xs text-gray-400 hover:text-rose-500 font-semibold flex items-center gap-1 transition-colors"
                        >
                          <span>✕</span> Remove
                        </button>
                      </div>

                      {/* Step fields */}
                      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <TextInput
                          label="Time (Optional)"
                          value={item.time || ''}
                          onChange={e => handleItineraryChange(index, 'time', e.target.value)}
                          placeholder="e.g. 10:00 AM"
                          hint="Leave blank if no fixed time"
                        />
                        <TextInput
                          label="Step Title"
                          required
                          value={item.title || ''}
                          onChange={e => handleItineraryChange(index, 'title', e.target.value)}
                          placeholder="e.g. Arrival at Camp"
                        />
                        <TextArea
                          label="Description"
                          required
                          value={item.description || ''}
                          onChange={e => handleItineraryChange(index, 'description', e.target.value)}
                          rows={2}
                          placeholder="What happens during this step?"
                          className="sm:col-span-2"
                        />
                        <TextInput
                          label="Image URL (Optional)"
                          value={item.image?.secure_url || ''}
                          onChange={e => handleItineraryChange(index, 'image', { ...(item.image || {}), secure_url: e.target.value })}
                          placeholder="https://your-image-url.com/photo.jpg"
                          hint="Paste a direct image link to add a visual for this step"
                          className="sm:col-span-2"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <AddButton onClick={addItineraryItem} label="Add Itinerary Step" />
            </>
          )}

          {/* ════ LOGISTICS ════ */}
          {activeTab === 'logistics' && (
            <>
              <div className="mb-1">
                <p className="text-xs font-semibold text-amber-700 uppercase tracking-widest">Step 4 of 5</p>
                <h3 className="text-xl font-extrabold text-gray-900 mt-0.5">Info & Logistics</h3>
                <p className="text-sm text-gray-500 mt-1">Practical details customers need before and during the activity.</p>
              </div>

              <SectionCard icon="📍" title="Pickup Zone" subtitle="Where and how will customers be picked up?" accent="blue">
                <TextArea
                  label="Pickup Description"
                  name="pickupDesc"
                  value={formData.pickupDesc}
                  onChange={handleChange}
                  rows={2}
                  placeholder="e.g. Hotel pickup available from central Dubai area"
                  tip="Describe where guests are picked up from. Mention cities or zones covered."
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextInput
                    label="Important Note"
                    name="pickupNote"
                    value={formData.pickupNote}
                    onChange={handleChange}
                    placeholder="e.g. Be ready in hotel lobby 10 mins before"
                    tip="A quick tip about pickup — timing, waiting area, etc."
                  />
                  <TextInput
                    label="Google Maps Link"
                    name="pickupMap"
                    value={formData.pickupMap}
                    onChange={handleChange}
                    placeholder="https://maps.google.com/..."
                    tip="Paste the full Google Maps link to the pickup point."
                  />
                </div>
              </SectionCard>

              <SectionCard icon="ℹ️" title="Key Information" subtitle="Things customers must know before booking" accent="amber">
                <TextArea
                  label="Key Info Points"
                  name="keyInfo"
                  value={formData.keyInfo}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Passport required, Wear comfortable shoes, Bring sunscreen"
                  tip="Comma-separated list of must-know items. Shown as a checklist to customers."
                  hint="Separate each point with a comma"
                />
                <TagPreview value={formData.keyInfo} placeholder="Key info items will appear here as tags" />
              </SectionCard>

              <SectionCard icon="📖" title="Essential Guide" subtitle="Safety notices, restrictions, or advice" accent="rose">
                <TextArea
                  label="Essential Guide Points"
                  name="essentialGuide"
                  value={formData.essentialGuide}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Not suitable for pregnant women, Must be 5+ years old, No heart conditions"
                  tip="Important restrictions or safety information. Comma-separated."
                  hint="Separate each point with a comma"
                />
                <TagPreview value={formData.essentialGuide} placeholder="Guide points will appear here as tags" />
              </SectionCard>
            </>
          )}

          {/* ════ EXTRAS ════ */}
          {activeTab === 'extras' && (
            <>
              <div className="mb-1">
                <p className="text-xs font-semibold text-amber-700 uppercase tracking-widest">Step 5 of 5</p>
                <h3 className="text-xl font-extrabold text-gray-900 mt-0.5">Extras & Add-ons</h3>
                <p className="text-sm text-gray-500 mt-1">Optional features like BBQ buffet menus and private SUV upgrades.</p>
              </div>

              {/* BBQ Section */}
              <SectionCard icon="🍖" title="BBQ Buffet" subtitle="Describe the food and dining experience included" accent="orange">
                <TextInput
                  label="BBQ Title"
                  name="bbqTitle"
                  value={formData.bbqTitle}
                  onChange={handleChange}
                  placeholder="e.g. Premium Live BBQ Dinner"
                  tip="A catchy name for the BBQ/buffet experience."
                />
                <TextArea
                  label="BBQ Description"
                  name="bbqDesc"
                  value={formData.bbqDesc}
                  onChange={handleChange}
                  rows={2}
                  placeholder="e.g. Enjoy unlimited vegetarian and non-vegetarian BBQ with live grilling station and soft drinks"
                />

                {/* BBQ Categories */}
                <div>
                  <FieldLabel label="Menu Categories" tip="Add categories like Veg, Non-Veg, Desserts — with items in each." />
                  {formData.bbqFields.length === 0 ? (
                    <p className="text-xs text-gray-400 italic mb-2">No menu categories yet. Add one below.</p>
                  ) : (
                    <div className="space-y-3 mb-3">
                      {formData.bbqFields.map((field, index) => (
                        <div key={index} className="bg-white border border-orange-200 rounded-xl p-4 relative">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-orange-700 uppercase tracking-wide">
                              Category {index + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeBBQField(index)}
                              className="text-xs text-gray-400 hover:text-rose-500 font-semibold transition-colors"
                            >
                              ✕ Remove
                            </button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <TextInput
                              label="Category Name"
                              required
                              value={field.category}
                              onChange={e => handleBBQFieldChange(index, 'category', e.target.value)}
                              placeholder="e.g. Vegetarian / Non-Veg / Desserts"
                            />
                            <TextInput
                              label="Items (comma separated)"
                              value={field.items.join(', ')}
                              onChange={e => handleBBQItemsChange(index, e.target.value)}
                              placeholder="e.g. Paneer Tikka, Corn, Mushroom"
                            />
                          </div>
                          {field.items.filter(Boolean).length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {field.items.filter(Boolean).map((item, i) => (
                                <span key={i} className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full border border-orange-200">
                                  {item}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  <AddButton onClick={addBBQField} label="Add Menu Category" />
                </div>
              </SectionCard>

              {/* SUV Section */}
              <SectionCard icon="🚙" title="Private SUV Upgrade" subtitle="Optional add-on for guests who want private transport" accent="slate">
                <div className="flex items-center justify-between p-3.5 bg-white border border-gray-200 rounded-lg">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Private SUV Available?</p>
                    <p className="text-xs text-gray-400 mt-0.5">Toggle to enable this upgrade option for customers</p>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="suvAvailable"
                      id="suvAvailable"
                      checked={formData.suvAvailable}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <label
                      htmlFor="suvAvailable"
                      className={`flex items-center cursor-pointer w-11 h-6 rounded-full transition-colors duration-200 ${formData.suvAvailable ? 'bg-emerald-500' : 'bg-gray-300'}`}
                    >
                      <span className={`inline-block w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 mx-1 ${formData.suvAvailable ? 'translate-x-5' : 'translate-x-0'}`} />
                    </label>
                  </div>
                </div>

                {formData.suvAvailable && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <TextInput
                      label="Extra Fee (₹ / $)"
                      name="suvFee"
                      type="number"
                      value={formData.suvFee}
                      onChange={handleChange}
                      placeholder="e.g. 5000"
                      tip="Additional amount charged for the SUV upgrade."
                    />
                    <TextInput
                      label="Vehicle Model"
                      name="suvModel"
                      value={formData.suvModel}
                      onChange={handleChange}
                      placeholder="e.g. Land Cruiser, Fortuner"
                      tip="The make/model of vehicle offered as the upgrade."
                    />
                  </div>
                )}
              </SectionCard>
            </>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/80 flex-shrink-0">
          {/* Prev */}
          <button
            type="button"
            onClick={goPrev}
            disabled={activeIndex === 0}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            ← Back
          </button>

          {/* Progress dots */}
          <div className="flex items-center gap-1.5">
            {STEPS.map((s, i) => (
              <button
                key={s.key}
                onClick={() => setActiveTab(s.key)}
                className={`rounded-full transition-all duration-200 ${
                  i === activeIndex ? 'w-5 h-2 bg-amber-500' : i < activeIndex ? 'w-2 h-2 bg-emerald-400' : 'w-2 h-2 bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Next / Save */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
            >
              Cancel
            </button>
            {activeIndex < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={goNext}
                className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-lg shadow-sm shadow-amber-200 transition-all"
              >
                Next →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className={`flex items-center gap-2 px-6 py-2 text-sm font-bold text-white rounded-lg shadow-sm transition-all
                  ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'}`}
              >
                {isLoading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>✓ Save Changes</>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}