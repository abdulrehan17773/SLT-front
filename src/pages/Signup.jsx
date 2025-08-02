import React from 'react';
import { useRegisterMutation } from '../apis/authApi';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';

function Signup() {
  const navigate = useNavigate();
  const [registerMutation, { isLoading }] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await registerMutation(data).unwrap();
      navigate("/login");
    } catch (err) {
      alert(err?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e6f2ec] px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-[#2e7d32]">Create Account</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Full Name"
              {...register("fullname", { required: "Full name is required" })}
              className="w-full px-4 py-2 border border-[#86ba98] bg-[#e6f2ec] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#86ba98]"
            />
            {errors.fullname && (
              <p className="text-red-600 text-sm mt-1">{errors.fullname.message}</p>
            )}
          </div>

          <div>
            <input
              type="email"
              placeholder="Email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
              className="w-full px-4 py-2 border border-[#86ba98] bg-[#e6f2ec] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#86ba98]"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="w-full px-4 py-2 border border-[#86ba98] bg-[#e6f2ec] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#86ba98]"
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#2e7d32] text-white rounded-lg hover:bg-[#1b5e20] transition cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-[#2e7d32]">
          Already have an account?{" "}
          <Link to="/login" className="text-[#2e7d32] underline hover:text-[#1b5e20]">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
