import React, { useState } from 'react';
import {
  useLoginMutation,
  useSendResetCodeMutation,
  useResetPasswordMutation
} from '../apis/authApi';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login as loginAction } from '../store/slices/authSlice';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading: loginLoading }] = useLoginMutation();
  const [sendCode, { isLoading: codeLoading }] = useSendResetCodeMutation();
  const [resetPassword, { isLoading: resetLoading }] = useResetPasswordMutation();

  const [mode, setMode] = useState("login"); // login | forgot | reset
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    code: ''
  });
  const [status, setStatus] = useState({ error: '', success: '' });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setStatus({ error: '', success: '' });

    const { email, password } = formData;
    if (!email.trim() || !password.trim()) {
      setStatus({ error: "Email and password are required.", success: '' });
      return;
    }

    try {
      const res = await login({ email, password }).unwrap();
      const userRoles = res.data.user?.role || [];
      dispatch(loginAction({ userData: res.data }));

      const hasAdminRole = userRoles.some(role => role.toLowerCase() === 'admin');
      navigate(hasAdminRole ? '/dashboard' : '/');
    } catch (err) {
      setStatus({ error: err?.data?.message || "Invalid credentials", success: '' });
    }
  };

  const handleSendCode = async () => {
    setStatus({ error: '', success: '' });
    if (!formData.email.trim()) {
      setStatus({ error: 'Email is required.', success: '' });
      return;
    }

    try {
      await sendCode({ email: formData.email }).unwrap();
      setStatus({ success: 'Reset code sent. Check your inbox.', error: '' });
      setMode("reset"); // go to reset password view
    } catch (err) {
      setStatus({ error: err?.data?.message || 'Failed to send code.', success: '' });
    }
  };

  const handleResetPassword = async () => {
    setStatus({ error: '', success: '' });
    const { email, code, password } = formData;

    if (!email.trim() || !code.trim() || !password.trim()) {
      setStatus({ error: 'All fields are required.', success: '' });
      return;
    }

    try {
      await resetPassword({ email, code, newPassword: password }).unwrap();
      setStatus({ success: 'Password reset successful. You can now log in.', error: '' });
      setMode("login");
    } catch (err) {
      setStatus({ error: err?.data?.message || 'Reset failed.', success: '' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e6f2ec] px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-[#2e7d32] cursor-pointer">
          {mode === "login" ? "Login to Your Account" :
            mode === "forgot" ? "Forgot Password" : "Reset Password"}
        </h2>

        {status.error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {status.error}
          </div>
        )}
        {status.success && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4 text-sm">
            {status.success}
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#86ba98] bg-[#e6f2ec] rounded-lg"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#86ba98] bg-[#e6f2ec] rounded-lg"
              required
            />
            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#2e7d32] text-white rounded-lg cursor-pointer"
              disabled={loginLoading}
            >
              {loginLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        )}

        {/* FORGOT PASSWORD STEP 1 */}
        {mode === "forgot" && (
          <>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#86ba98] bg-[#e6f2ec] rounded-lg mb-4"
            />
            <button
              onClick={handleSendCode}
              className="w-full py-2 px-4 bg-[#2e7d32] text-white rounded-lg cursor-pointer"
              disabled={codeLoading}
            >
              {codeLoading ? "Sending..." : "Send Reset Code"}
            </button>
          </>
        )}

        {/* RESET PASSWORD STEP 2 */}
        {mode === "reset" && (
          <>
            <input
              type="email"
              name="email"
              value={formData.email}
              readOnly
              className="w-full px-4 py-2 border border-[#86ba98] bg-gray-100 rounded-lg mb-2"
            />
            <input
              type="text"
              name="code"
              placeholder="Enter the reset code"
              value={formData.code}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#86ba98] bg-[#e6f2ec] rounded-lg mb-2"
            />
            <input
              type="password"
              name="password"
              placeholder="New password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#86ba98] bg-[#e6f2ec] rounded-lg mb-4"
            />
            <button
              onClick={handleResetPassword}
              className="w-full py-2 px-4 bg-[#2e7d32] text-white rounded-lg cursor-pointer"
              disabled={resetLoading}
            >
              {resetLoading ? "Resetting..." : "Reset Password"}
            </button>
          </>
        )}

        {/* SWITCH LINKS */}
        <div className="text-center text-sm mt-4 text-[#2e7d32] cursor-pointer">
          {mode === "login" && (
            <>
              Don’t have an account?{" "}
              <Link to="/signup" className="underline hover:text-[#1b5e20]">Sign up</Link>
              <br />
              <button
                type="button"
                className="text-xs underline mt-2 cursor-pointer"
                onClick={() => setMode("forgot")}
              >
                Forgot password?
              </button>
            </>
          )}

          {(mode === "forgot" || mode === "reset") && (
            <button
              type="button"
              className="text-sm underline mt-4 cursor-pointer"
              onClick={() => {
                setMode("login");
                setFormData({ email: '', password: '', code: '' });
                setStatus({ error: '', success: '' });
              }}
            >
              ← Back to login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
