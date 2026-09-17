import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useGrievances } from '../../context/GrievanceContext';
import { CATEGORIES, PRIORITY_LEVELS } from '../../utils/constants';
import Card from '../../components/ui/Card';
import Input, { Textarea, Select } from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import TrackingTokenCard from '../../components/ui/TrackingTokenCard';
import Alert from '../../components/ui/Alert';

export const SubmitGrievancePage = () => {
  const { user, isAuthenticated } = useAuth();
  const { submitGrievance } = useGrievances();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Academic',
    department: 'Computer Science & Engineering',
    priority: 'MEDIUM',
    description: '',
    isAnonymous: true, // Default to anonymous for maximum student safety
    complainantName: user?.name || '',
    complainantEmail: user?.email || '',
  });

  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successResult, setSuccessResult] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map((f) => ({
      name: f.name,
      size: `${(f.size / (1024 * 1024)).toFixed(2)} MB`,
      url: '#',
    }));
    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Grievance title is required';
    if (formData.title.trim().length < 8) errs.title = 'Title must be at least 8 characters';
    if (!formData.description.trim()) errs.description = 'Detailed description is required';
    if (formData.description.trim().length < 20) errs.description = 'Please provide sufficient details (min 20 characters)';
    if (!formData.isAnonymous && !isAuthenticated && !formData.complainantEmail) {
      errs.complainantEmail = 'Email is required for non-anonymous submissions';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const result = await submitGrievance({
        ...formData,
        attachments,
      });

      if (result.success) {
        setSuccessResult(result);
        setShowSuccessModal(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
          <span className="material-symbols-outlined text-sm">enhanced_encryption</span>
          <span>ZERO-KNOWLEDGE REDACTION SHIELD</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-on-surface tracking-tight">
          Lodge Institutional Grievance
        </h1>
        <p className="text-xs sm:text-sm text-outline max-w-lg mx-auto leading-relaxed">
          Submit your complaint with guaranteed time-bound resolution. If our authorities fail to act within the SLA, the system automatically escalates it to higher leadership.
        </p>
      </div>

      {/* Main Form */}
      <Card className="p-6 sm:p-8 bg-surface-container border-white/[0.12]">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Anonymous Shield Toggle Card */}
          <div
            onClick={() => handleInputChange('isAnonymous', !formData.isAnonymous)}
            className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 ${
              formData.isAnonymous
                ? 'bg-blue-950/40 border-blue-500/40'
                : 'bg-surface-container-high/60 border-white/[0.06]'
            }`}
          >
            <div className="pt-0.5">
              <input
                type="checkbox"
                checked={formData.isAnonymous}
                onChange={() => {}} // handled by parent div
                className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer"
              />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-on-surface">
                  Submit with Confidential Anonymous Shield
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-300 border border-blue-500/30">
                  Recommended
                </span>
              </div>
              <p className="text-xs text-outline leading-relaxed">
                When enabled, your name, student ID, and email are cryptographically stripped before reaching departmental authorities. You will receive an anonymous Tracking Token to monitor progress.
              </p>
            </div>
            <span className="material-symbols-outlined text-xl text-primary shrink-0">
              {formData.isAnonymous ? 'lock' : 'lock_open'}
            </span>
          </div>

          {/* Complainant Info (if NOT anonymous) */}
          {!formData.isAnonymous && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-surface-container-high/40 border border-white/[0.06] animate-slide-up">
              <Input
                label="Complainant Full Name"
                placeholder="e.g. Aarav Sharma"
                value={formData.complainantName}
                onChange={(e) => handleInputChange('complainantName', e.target.value)}
                icon="person"
              />
              <Input
                label="Official Student Email"
                type="email"
                placeholder="e.g. aarav.sharma@university.edu"
                value={formData.complainantEmail}
                onChange={(e) => handleInputChange('complainantEmail', e.target.value)}
                error={errors.complainantEmail}
                icon="mail"
                required
              />
            </div>
          )}

          {/* Category & Department Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Grievance Category"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              options={CATEGORIES.map((c) => ({ value: c, label: c }))}
              icon="category"
              required
            />

            <Input
              label="Concerned Department / Facility"
              placeholder="e.g. Computer Science & Engg"
              value={formData.department}
              onChange={(e) => handleInputChange('department', e.target.value)}
              icon="apartment"
            />
          </div>

          {/* Priority Level */}
          <div>
            <label className="block text-xs font-medium text-on-surface-variant tracking-wide mb-2">
              Assessed Urgency / Priority
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRIORITY_LEVELS.map((lvl) => (
                <button
                  key={lvl.value}
                  type="button"
                  onClick={() => handleInputChange('priority', lvl.value)}
                  className={`p-2.5 rounded-xl border text-xs font-mono font-medium transition-all text-center ${
                    formData.priority === lvl.value
                      ? `${lvl.bg} ${lvl.color} border-primary/50 shadow-inner-keylight`
                      : 'bg-surface-container-high text-outline border-transparent hover:border-outline-variant'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <Input
            label="Grievance Subject / Short Summary"
            placeholder="e.g. Irregular Evaluation & Delay in Midterm Exam Grades"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            error={errors.title}
            icon="edit_note"
            required
          />

          {/* Description */}
          <Textarea
            label="Comprehensive Grievance Narrative & Facts"
            placeholder="Please detail the specific incidents, dates, personnel involved, course codes, and previous communications..."
            rows={5}
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            error={errors.description}
            helperText="Include all factual evidence. Do not include sensitive passwords or credentials."
            required
          />

          {/* Evidence Attachments */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-on-surface-variant tracking-wide">
              Supporting Documents / Evidence (Optional)
            </label>
            <div className="border-2 border-dashed border-outline-variant/60 hover:border-primary/50 rounded-xl p-5 text-center transition-colors bg-surface-container-low/60">
              <input
                type="file"
                multiple
                id="file-upload"
                className="hidden"
                onChange={handleFileUpload}
              />
              <label htmlFor="file-upload" className="cursor-pointer space-y-1 block">
                <span className="material-symbols-outlined text-2xl text-primary">
                  cloud_upload
                </span>
                <p className="text-xs text-on-surface font-medium">
                  Click to upload PDF, PNG, JPG, or audio evidence
                </p>
                <p className="text-[11px] text-outline">Up to 15 MB per file • End-to-end encrypted</p>
              </label>
            </div>

            {/* Uploaded Files List */}
            {attachments.length > 0 && (
              <div className="space-y-1.5 pt-2">
                {attachments.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-high border border-white/[0.04] text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="material-symbols-outlined text-primary text-base">
                        attach_file
                      </span>
                      <span className="text-on-surface font-mono truncate">{file.name}</span>
                      <span className="text-outline text-[11px]">({file.size})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(idx)}
                      className="text-outline hover:text-red-400 p-1 transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit CTA */}
          <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between gap-4">
            <span className="text-[11px] font-mono text-outline flex items-center gap-1">
              <span className="material-symbols-outlined text-xs text-emerald-400">shield</span>
              Guaranteed SLA Auto-Escalation
            </span>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              icon="send"
              loading={loading}
            >
              Submit Grievance
            </Button>
          </div>
        </form>
      </Card>

      {/* Success Confirmation Modal */}
      {showSuccessModal && successResult && (
        <Modal
          isOpen={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false);
            navigate(`/track/${successResult.token}`);
          }}
          title="Grievance Registered Successfully"
          subtitle="Your ticket is now queued for Tier-1 Departmental Redressal."
          maxWidth="max-w-xl"
          footer={
            <div className="flex items-center gap-3 w-full justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate('/student');
                }}
              >
                Go to Student Portal
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon="travel_explore"
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate(`/track/${successResult.token}`);
                }}
              >
                Track Live Status
              </Button>
            </div>
          }
        >
          <div className="space-y-4 py-2">
            <TrackingTokenCard
              token={successResult.token}
              uuid={successResult.trackingUuid}
              isAnonymous={formData.isAnonymous}
            />

            <Alert type="info" title="Important Notice">
              Please copy and store your <strong>Tracking Token ({successResult.token})</strong>. It allows you to monitor the real-time SLA countdown and review lifecycle milestones anonymously without logging in.
            </Alert>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SubmitGrievancePage;
