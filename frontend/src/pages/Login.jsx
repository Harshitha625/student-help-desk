import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LogIn,
  Lock,
  User,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import BrandLogo from '../components/BrandLogo';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { addToast } = useToast();

  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password) {
      setError('Please enter your username and password.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      /*
       * Send credentials to Django.
       * Django decides whether the credentials are valid
       * and returns the authenticated user's information,
       * including their role.
       */
      const data = await login({
        username: username.trim(),
        password,
      });

      const user = data.user;

      addToast(
        `Welcome back, ${user.first_name || user.username}!`,
        'success'
      );

      /*
       * If the user originally tried to access a protected page,
       * send them back there after successful login.
       */
      const from = location.state?.from?.pathname;

      if (from) {
        navigate(from, { replace: true });
        return;
      }

      /*
       * Role-based navigation.
       *
       * IMPORTANT:
       * These roles come from Django.
       * They are NOT assigned by this login page.
       */
      if (user.role === 'STUDENT') {
        navigate('/student', { replace: true });
      } else if (user.role === 'WARDEN') {
        navigate('/warden', { replace: true });
      } else if (user.role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }

    } catch (err) {
      const message =
        err.response?.data?.non_field_errors?.[0] ||
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Invalid username or password.';

      setError(message);
      addToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#061D17]">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full"
      >

        {/* Logo and heading */}
        <div className="text-center space-y-3 mb-8">

          <div className="flex justify-center">
            <BrandLogo linkTo="/" />
          </div>

          <h1 className="font-heading text-3xl font-bold text-[#F5F5F0]">
            Welcome Back
          </h1>

          <p className="text-sm text-[#A3B8B0]">
            Sign in to access your campus account
          </p>
        </div>

        {/* Login card */}
        <form
          onSubmit={handleSubmit}
          className="p-8 rounded-3xl bg-[#0E2F26] border border-[#1B4337] shadow-2xl space-y-5"
        >

          {/* Security message */}
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#0B251E] border border-[#1E4D3E]">
            <ShieldCheck className="w-5 h-5 text-[#4E8B73] shrink-0 mt-0.5" />

            <div>
              <p className="text-sm font-semibold text-[#F5F5F0]">
                Secure Campus Login
              </p>

              <p className="text-xs text-[#A3B8B0] mt-1">
                Use the username and password associated with your account.
              </p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />

              <span>{error}</span>
            </div>
          )}

          {/* Username */}
          <div className="space-y-1.5">
            <label
              htmlFor="username"
              className="block text-xs font-semibold text-[#D1E0DA]"
            >
              Username
            </label>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#719B8C]">
                <User className="w-4 h-4" />
              </div>

              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                placeholder="Enter your username"
                autoComplete="username"
                disabled={loading}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#1B4337] bg-[#0A241D] text-sm text-[#F5F5F0] placeholder-[#5A7E72] focus:outline-none focus:ring-2 focus:ring-[#E5C38E] focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-xs font-semibold text-[#D1E0DA]"
            >
              Password
            </label>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#719B8C]">
                <Lock className="w-4 h-4" />
              </div>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={loading}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#1B4337] bg-[#0A241D] text-sm text-[#F5F5F0] placeholder-[#5A7E72] focus:outline-none focus:ring-2 focus:ring-[#E5C38E] focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#E5C38E] hover:bg-[#d8b37b] text-[#122A22] font-semibold text-sm shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-[#122A22] border-t-transparent rounded-full animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </>
            )}
          </button>

          {/* Register */}
          <div className="text-center pt-2">
            <span className="text-xs text-[#A3B8B0]">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-semibold text-[#E5C38E] hover:underline"
              >
                Create an account
              </Link>
            </span>
          </div>

        </form>
      </motion.div>
    </div>
  );
}