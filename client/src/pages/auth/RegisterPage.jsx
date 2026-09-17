import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Input, { Select } from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';

export const RegisterPage = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rollNumber: '',
    department: 'Computer Science & Engineering',
    role: 'student',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError(null);
    const result = await register(formData);
    if (result.success) {
      navigate('/student');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-300 text-xs font-mono">
            <span className="material-symbols-outlined text-sm">how_to_reg</span>
            <span>INSTITUTIONAL ENROLLMENT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Register Student Account
          </h1>
          <p className="text-xs text-outline">
            Create your account to submit and manage institutional grievances.
          </p>
        </div>

        {error && <Alert type="error">{error}</Alert>}

        <Card className="p-6 sm:p-8 bg-surface-container border-white/[0.12]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="e.g. Aarav Sharma"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              icon="person"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Student Email"
                type="email"
                placeholder="e.g. name@university.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                icon="mail"
                required
              />
              <Input
                label="Roll / Registration No."
                placeholder="e.g. 2023CS0142"
                value={formData.rollNumber}
                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                icon="badge"
                required
              />
            </div>

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
              icon="arrow_forward"
              iconPosition="right"
            >
              Create Student Account
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/[0.06] text-center text-xs text-outline">
            Already registered?{' '}
            <Link to="/login" className="text-primary hover:underline font-semibold">
              Sign in to your portal
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
