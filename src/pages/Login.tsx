import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';

const Login: React.FC = () => {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError('');
    if (!email.includes('@')) {
      setFormError('Enter a valid email.');
      return;
    }
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }
    try {
      await login(email, password);
      navigate('/', { replace: true });
    } catch {
      // handled in context
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <h1 className="text-lg font-semibold mb-4">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="••••••••"
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
            {loading ? <LoadingSpinner label="Signing in" /> : 'Login'}
          </button>
        </form>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">
          No account?{' '}
          <Link to="/register" className="text-blue-500 hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
