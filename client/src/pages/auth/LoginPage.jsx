import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';

export const LoginPage = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('aarav.sharma@university.edu');
  const [password, setPassword] = useState('demo12345');
  const [roleHint, setRoleHint] = useState('student');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const result = await login(email, password, roleHint);
    if (result.success) {
      if (result.user.role === 'student') navigate('/student');
      else if (result.user.role === 'authority') navigate('/authority');
      else navigate('/admin');
    } else {
      setError(result.error);
    }
  };

  const handleQuickDemo = (roleKey, demoEmail) => {
    setRoleHint(roleKey);
    setEmail(demoEmail);
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-300 text-xs font-mono">
            <span className="material-symbols-outlined text-sm">lock</span>
            <span>SECURE INSTITUTIONAL PORTAL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Sign In to GET Portal
          </h1>
          <p className="text-xs text-outline">
            Enter your credentials or choose a preloaded demo persona below.
          </p>
        </div>

        {/* Quick Demo Role Picker Chips */}
        <div className="space-y-1.5">
          <p className="text-[11px] font-mono uppercase text-outline text-center">
            One-Click Persona Login
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('student', 'aarav.sharma@university.edu')}
              className={`p-2 rounded-xl border text-xs font-mono transition-all text-center ${
                roleHint === 'student'
                  ? 'bg-blue-950/80 border-blue-500 text-blue-300 font-bold'
                  : 'bg-surface-container text-outline hover:border-outline-variant'
              }`}
            >
              🎓 Student
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('authority', 'radhika.sen@university.edu')}
              className={`p-2 rounded-xl border text-xs font-mono transition-all text-center ${
                roleHint === 'authority'
                  ? 'bg-amber-950/80 border-amber-500 text-amber-300 font-bold'
                  : 'bg-surface-container text-outline hover:border-outline-variant'
              }`}
            >
              🏛️ HoD / Auth
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin', 'dean.admin@university.edu')}
              className={`p-2 rounded-xl border text-xs font-mono transition-all text-center ${
                roleHint === 'admin'
                  ? 'bg-purple-950/80 border-purple-500 text-purple-300 font-bold'
                  : 'bg-surface-container text-outline hover:border-outline-variant'
              }`}
            >
              ⚖️ Admin
            </button>
          </div>
        </div>

        {error && <Alert type="error">{error}</Alert>}

        <Card className="p-6 sm:p-8 bg-surface-container border-white/[0.12]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Institutional Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. yourname@university.edu"
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
                <span>Remember me</span>
              </label>
              <Link to="/track" className="text-primary hover:underline font-mono">
                Track without login?
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
              Authenticate & Access
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/[0.06] text-center text-xs text-outline">
            Don't have an institutional account?{' '}
            <Link to="/register" className="text-primary hover:underline font-semibold">
              Register here
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
