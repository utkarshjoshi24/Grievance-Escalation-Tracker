import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';

const ROLE_CONFIGS = {
  student: {
    key: 'student',
    title: 'Student Portal Login',
    subtitle: 'Access your confidential submissions and track SLA timelines',
    icon: 'school',
    accentBadge: 'bg-blue-950 text-blue-300 border-blue-500/40',
    defaultEmail: 'alex.student@university.edu',
    defaultPassword: 'Password123!',
    redirectPath: '/student',
  },
  authority: {
    key: 'authority',
    title: 'Authority & Resolver Login',
    subtitle: 'Manage assigned grievances, compliance timers & department queues',
    icon: 'shield_person',
    accentBadge: 'bg-amber-950 text-amber-300 border-amber-500/40',
    defaultEmail: 'instructor@university.edu',
    defaultPassword: 'Password123!',
    redirectPath: '/authority',
  },
  admin: {
    key: 'admin',
    title: 'Ombudsman & Admin Login',
    subtitle: 'Institutional governance, matrix configuration & apex oversight',
    icon: 'admin_panel_settings',
    accentBadge: 'bg-purple-950 text-purple-300 border-purple-500/40',
    defaultEmail: 'admin@university.edu',
    defaultPassword: 'Password123!',
    redirectPath: '/admin',
  },
};

export const LoginPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialRole = searchParams.get('role') || 'student';
  const [selectedRole, setSelectedRole] = useState(
    ROLE_CONFIGS[initialRole] ? initialRole : 'student'
  );

  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState(ROLE_CONFIGS[selectedRole].defaultEmail);
  const [password, setPassword] = useState(ROLE_CONFIGS[selectedRole].defaultPassword);
  const [error, setError] = useState(null);

  // Sync state if query param changes
  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam && ROLE_CONFIGS[roleParam] && roleParam !== selectedRole) {
      setSelectedRole(roleParam);
      setEmail(ROLE_CONFIGS[roleParam].defaultEmail);
      setPassword(ROLE_CONFIGS[roleParam].defaultPassword);
    }
  }, [searchParams]);

  const handleRoleTabChange = (roleKey) => {
    setSelectedRole(roleKey);
    setSearchParams({ role: roleKey });
    setEmail(ROLE_CONFIGS[roleKey].defaultEmail);
    setPassword(ROLE_CONFIGS[roleKey].defaultPassword);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const result = await login(email, password, selectedRole);
    if (result.success && result.user) {
      // Redirect strictly to the authenticated user's designated role portal
      const targetRole = result.user.role || selectedRole;
      if (targetRole === 'admin') navigate('/admin');
      else if (targetRole === 'authority') navigate('/authority');
      else navigate('/student');
    } else {
      setError(result.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const currentConfig = ROLE_CONFIGS[selectedRole] || ROLE_CONFIGS.student;

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Role Selector Tabs */}
        <div className="bg-surface-container-low border border-white/[0.08] p-1.5 rounded-2xl flex items-center gap-1 shadow-inner-keylight">
          {Object.values(ROLE_CONFIGS).map((cfg) => {
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
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono font-medium ${currentConfig.accentBadge}`}
          >
            <span className="material-symbols-outlined text-sm">{currentConfig.icon}</span>
            <span className="uppercase">{selectedRole} PORTAL ACCESS</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            {currentConfig.title}
          </h1>
          <p className="text-xs text-outline max-w-sm mx-auto">
            {currentConfig.subtitle}
          </p>
        </div>

        {error && <Alert type="error">{error}</Alert>}

        {/* Form Card */}
        <Card className="p-6 sm:p-8 bg-surface-container border-white/[0.12] shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={
                selectedRole === 'student'
                  ? 'Student Email'
                  : selectedRole === 'authority'
                  ? 'Official Authority Email'
                  : 'Administrator Email'
              }
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={`name@university.edu`}
              icon="mail"
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              icon="key"
              required
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-outline cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-primary" />
                <span>Remember session</span>
              </label>
              <Link to="/track" className="text-primary hover:underline font-mono">
                Track token?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              loading={loading}
              icon="login"
            >
              Sign In to {selectedRole.toUpperCase()} Portal
            </Button>
          </form>

          {/* Quick Demo Preloads */}
          <div className="mt-6 pt-5 border-t border-white/[0.06] space-y-2">
            <p className="text-[11px] font-mono text-outline uppercase tracking-wider text-center">
              Preloaded Demo Accounts
            </p>
            <div className="grid grid-cols-1 gap-1.5 text-xs font-mono">
              {selectedRole === 'student' && (
                <button
                  type="button"
                  onClick={() => {
                    setEmail('alex.student@university.edu');
                    setPassword('Password123!');
                  }}
                  className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container-high border border-white/[0.04] text-left text-outline hover:text-on-surface flex items-center justify-between"
                >
                  <span>Alex Mercer (Student)</span>
                  <span className="text-primary">alex.student@university.edu</span>
                </button>
              )}

              {selectedRole === 'authority' && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('instructor@university.edu');
                      setPassword('Password123!');
                    }}
                    className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container-high border border-white/[0.04] text-left text-outline hover:text-on-surface flex items-center justify-between"
                  >
                    <span>Tier 1: Dr. Robert Langdon</span>
                    <span className="text-amber-400">instructor@university.edu</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('hod.cs@university.edu');
                      setPassword('Password123!');
                    }}
                    className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container-high border border-white/[0.04] text-left text-outline hover:text-on-surface flex items-center justify-between"
                  >
                    <span>Tier 2: Dr. Sarah Jenkins (HoD)</span>
                    <span className="text-amber-400">hod.cs@university.edu</span>
                  </button>
                </>
              )}

              {selectedRole === 'admin' && (
                <button
                  type="button"
                  onClick={() => {
                    setEmail('admin@university.edu');
                    setPassword('Password123!');
                  }}
                  className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container-high border border-white/[0.04] text-left text-outline hover:text-on-surface flex items-center justify-between"
                >
                  <span>Campus Administrator (Ombudsman)</span>
                  <span className="text-purple-400">admin@university.edu</span>
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-white/[0.06] text-center text-xs text-outline">
            Need a new account?{' '}
            <Link
              to={`/register?role=${selectedRole}`}
              className="text-primary hover:underline font-semibold"
            >
              Sign up for {selectedRole} portal
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
