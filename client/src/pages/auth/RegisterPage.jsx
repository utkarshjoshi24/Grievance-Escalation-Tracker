import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Input, { Select } from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';

const ROLE_META = {
  student: {
    key: 'student',
    title: 'Student Registration',
    subtitle: 'Enroll your student profile to submit confidential grievances',
    badge: 'Student Account Enrollment',
    accentBadge: 'bg-blue-950 text-blue-300 border-blue-500/40',
    icon: 'school',
  },
  authority: {
    key: 'authority',
    title: 'Authority & Resolver Enrollment',
    subtitle: 'Register departmental resolution authority credentials and tier assignment',
    badge: 'Authority Redressal Queue',
    accentBadge: 'bg-amber-950 text-amber-300 border-amber-500/40',
    icon: 'shield_person',
  },
  admin: {
    key: 'admin',
    title: 'Ombudsman & Admin Registration',
    subtitle: 'Register institutional governance and compliance oversight officer',
    badge: 'Ombudsman Command Portal',
    accentBadge: 'bg-purple-950 text-purple-300 border-purple-500/40',
    icon: 'admin_panel_settings',
  },
};

export const RegisterPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialRole = searchParams.get('role') || 'student';
  const [selectedRole, setSelectedRole] = useState(
    ROLE_META[initialRole] ? initialRole : 'student'
  );

  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rollNumber: '',
    department: 'Computer Science & Engineering',
    title: '',
    hierarchyLevel: 1,
    adminAccessKey: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState(null);

  // Sync state if search param changes
  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam && ROLE_META[roleParam] && roleParam !== selectedRole) {
      setSelectedRole(roleParam);
    }
  }, [searchParams]);

  const handleRoleTabChange = (roleKey) => {
    setSelectedRole(roleKey);
    setSearchParams({ role: roleKey });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    const registrationPayload = {
      ...formData,
      role: selectedRole,
    };

    const result = await register(registrationPayload);
    if (result.success && result.user) {
      // Redirect strictly to the registered role's dedicated portal
      const targetRole = result.user.role || selectedRole;
      if (targetRole === 'admin') navigate('/admin');
      else if (targetRole === 'authority') navigate('/authority');
      else navigate('/student');
    } else {
      setError(result.error || 'Registration failed. Please check your information.');
    }
  };

  const currentMeta = ROLE_META[selectedRole] || ROLE_META.student;

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        {/* Role Selector Tabs */}
        <div className="bg-surface-container-low border border-white/[0.08] p-1.5 rounded-2xl flex items-center gap-1 shadow-inner-keylight">
          {Object.values(ROLE_META).map((cfg) => {
            const isActive = selectedRole === cfg.key;
            return (
              <button
                key={cfg.key}
                type="button"
                onClick={() => handleRoleTabChange(cfg.key)}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold font-mono transition-all flex items-center justify-center gap-1.5 ${
                  isActive
                    ? 'bg-surface-container-highest text-primary border border-primary/30 shadow-md scale-100'
                    : 'text-outline hover:text-on-surface hover:bg-surface-container-high/40'
                }`}
              >
                <span className="material-symbols-outlined text-sm">{cfg.icon}</span>
                <span className="capitalize">{cfg.key}</span>
              </button>
            );
          })}
        </div>

        {/* Portal Header */}
        <div className="text-center space-y-2">
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono font-medium ${currentMeta.accentBadge}`}
          >
            <span className="material-symbols-outlined text-sm">{currentMeta.icon}</span>
            <span className="uppercase">{currentMeta.badge}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            {currentMeta.title}
          </h1>
          <p className="text-xs text-outline max-w-md mx-auto">
            {currentMeta.subtitle}
          </p>
        </div>

        {error && <Alert type="error">{error}</Alert>}

        {/* Form Card */}
        <Card className="p-6 sm:p-8 bg-surface-container border-white/[0.12] shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="e.g. Dr. / Prof. / Mr. Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              icon="person"
              required
            />

            <Input
              label={
                selectedRole === 'student'
                  ? 'Student Institutional Email'
                  : selectedRole === 'authority'
                  ? 'Official Faculty / Authority Email'
                  : 'Official Ombudsman / Admin Email'
              }
              type="email"
              placeholder="name@university.edu"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              icon="mail"
              required
            />

            {/* Role-Specific Fields */}
            {selectedRole === 'student' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Roll / Registration No."
                  placeholder="e.g. 2026CS0142"
                  value={formData.rollNumber}
                  onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                  icon="badge"
                  required
                />
                <Select
                  label="Department / School"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  options={[
                    'Computer Science & Engineering',
                    'Electronics & Communication',
                    'Mechanical Engineering',
                    'Civil Engineering',
                    'Management Studies',
                    'Hostel & Residential Services',
                  ]}
                  icon="school"
                  required
                />
              </div>
            )}

            {selectedRole === 'authority' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Official Designation / Title"
                    placeholder="e.g. Associate Professor / HoD"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    icon="badge"
                    required
                  />
                  <Select
                    label="Assigned Hierarchy Tier"
                    value={formData.hierarchyLevel}
                    onChange={(e) =>
                      setFormData({ ...formData, hierarchyLevel: Number(e.target.value) })
                    }
                    options={[
                      { value: 1, label: 'Tier 1: Course Coordinator / Warden' },
                      { value: 2, label: 'Tier 2: Head of Department (HoD)' },
                      { value: 3, label: 'Tier 3: Dean / Faculty Director' },
                    ]}
                    icon="layers"
                    required
                  />
                </div>

                <Select
                  label="Department / Faculty Division"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  options={[
                    'Computer Science & Engineering',
                    'Electronics & Communication',
                    'Mechanical Engineering',
                    'Civil Engineering',
                    'Academic Affairs',
                    'Hostel Operations',
                  ]}
                  icon="business"
                  required
                />
              </>
            )}

            {selectedRole === 'admin' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Office / Directorate"
                  placeholder="e.g. Ombudsman Directorate"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  icon="account_balance"
                  required
                />
                <Input
                  label="Admin Access Authorization Code"
                  placeholder="e.g. GET-ADMIN-2026"
                  value={formData.adminAccessKey}
                  onChange={(e) => setFormData({ ...formData, adminAccessKey: e.target.value })}
                  icon="key"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                icon="lock"
                required
              />
              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                icon="lock_reset"
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-4"
              loading={loading}
              icon="how_to_reg"
            >
              Register & Access {selectedRole.toUpperCase()} Portal
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/[0.06] text-center text-xs text-outline">
            Already have an account?{' '}
            <Link
              to={`/login?role=${selectedRole}`}
              className="text-primary hover:underline font-semibold"
            >
              Sign in to {selectedRole} portal
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
