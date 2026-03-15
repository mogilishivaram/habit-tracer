import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';

function getStrength(password: string): string {
  if (password.length >= 10 && /[A-Z]/.test(password) && /\d/.test(password)) return 'Strong';
  if (password.length >= 8) return 'Medium';
  return 'Weak';
}

const Register: React.FC = () => {
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [formError, setFormError] = useState('');

  const strength = getStrength(password);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError('');
    if (!name.trim()) {
      setFormError('Name is required.');
      return;
    }
    if (!email.includes('@')) {
      setFormError('Enter a valid email.');
      return;
    }
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setFormError('Passwords do not match.');
      return;
    }
    try {
      await register(name, email, password);
      navigate('/', { replace: true });
    } catch {
      // handled in context
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <h1 className="text-lg font-semibold mb-4">Register</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm"
              placeholder="Create a password"
            />
            <p className="text-[11px] text-slate-500 mt-1">Strength: {strength}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm"
              placeholder="Confirm password"
            />
          </div>

          {(formError || error) && (
            <p className="text-xs text-rose-500">{formError || error}</p>
          )}

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? <LoadingSpinner label="Creating" /> : 'Register'}
          </button>
        </form>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
