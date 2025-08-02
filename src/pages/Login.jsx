import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
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

  const [mode, setMode] = useState("login");
  const [status, setStatus] = useState({ error: '', success: '' });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm();

  const email = watch("email");

  const onLogin = async (data) => {
    setStatus({ error: '', success: '' });

    try {
      const res = await login({ email: data.email, password: data.password }).unwrap();
      const userRoles = res.data.user?.role || [];
      dispatch(loginAction({ userData: res.data }));

      const isAdmin = userRoles.some(role => role.toLowerCase() === 'admin');
      navigate(isAdmin ? '/dashboard' : '/');
    } catch (err) {
      setStatus({ error: err?.data?.message || "Invalid credentials", success: '' });
    }
  };

  const onSendCode = async (data) => {
    setStatus({ error: '', success: '' });

    try {
      await sendCode({ email: data.email }).unwrap();
      setStatus({ success: 'Reset code sent. Check your inbox.', error: '' });
      setMode("reset");
    } catch (err) {
      setStatus({ error: err?.data?.message || 'Failed to send code.', success: '' });
    }
  };

  const onResetPassword = async (data) => {
    setStatus({ error: '', success: '' });

    try {
      await resetPassword({
        email: data.email,
        code: data.code,
        newPassword: data.password
      }).unwrap();
      setStatus({ success: 'Password reset successful. You can now log in.', error: '' });
      setMode("login");
      reset();
    } catch (err) {
      setStatus({ error: err?.data?.message || 'Reset failed.', success: '' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e6f2ec] px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-[#2e7d32]">
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
          <form onSubmit={handleSubmit(onLogin)} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                {...register("email", { required: "Email is required." })}
                className="w-full px-4 py-2 border border-[#86ba98] bg-[#e6f2ec] rounded-lg"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                {...register("password", { required: "Password is required." })}
                className="w-full px-4 py-2 border border-[#86ba98] bg-[#e6f2ec] rounded-lg"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#2e7d32] text-white rounded-lg cursor-pointer"
              disabled={loginLoading}
            >
              {loginLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        )}

        {/* FORGOT PASSWORD FORM */}
        {mode === "forgot" && (
          <form onSubmit={handleSubmit(onSendCode)} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Enter your email"
                {...register("email", { required: "Email is required." })}
                className="w-full px-4 py-2 border border-[#86ba98] bg-[#e6f2ec] rounded-lg"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#2e7d32] text-white rounded-lg cursor-pointer"
              disabled={codeLoading}
            >
              {codeLoading ? "Sending..." : "Send Reset Code"}
            </button>
          </form>
        )}

        {/* RESET PASSWORD FORM */}
        {mode === "reset" && (
          <form onSubmit={handleSubmit(onResetPassword)} className="space-y-4">
            <div>
              <input
                type="email"
                readOnly
                value={email}
                {...register("email")}
                className="w-full px-4 py-2 border border-[#86ba98] bg-gray-100 rounded-lg"
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="Enter the reset code"
                {...register("code", { required: "Reset code is required." })}
                className="w-full px-4 py-2 border border-[#86ba98] bg-[#e6f2ec] rounded-lg"
              />
              {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code.message}</p>}
            </div>

            <div>
              <input
                type="password"
                placeholder="New password"
                {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
                className="w-full px-4 py-2 border border-[#86ba98] bg-[#e6f2ec] rounded-lg"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#2e7d32] text-white rounded-lg cursor-pointer"
              disabled={resetLoading}
            >
              {resetLoading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        {/* NAVIGATION */}
        <div className="text-center text-sm mt-4 text-[#2e7d32] cursor-pointer">
          {mode === "login" && (
            <>
              Don’t have an account?{" "}
              <Link to="/signup" className="underline hover:text-[#1b5e20]">Sign up</Link>
              <br />
              <button
                type="button"
                className="text-xs underline mt-2 cursor-pointer"
                onClick={() => {
                  setMode("forgot");
                  reset();
                  setStatus({ error: '', success: '' });
                }}
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
                reset();
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
