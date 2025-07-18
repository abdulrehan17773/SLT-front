import React, { useState } from 'react';
import { useRegisterMutation } from '../apis/authApi'; // Adjust path as needed
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


function Signup() {
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();

  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { fullname, email, password } = formData;

    if (!fullname.trim() || !email.trim() || !password.trim()) {
      setError("All fields are required.");
      return;
    }

    try {
      await register(formData).unwrap();
      navigate("/login"); // Redirect after successful registration
    } catch (err) {
      setError(err?.data?.message || "Something went wrong.");
    }
  };

  return (

<div className="min-h-screen flex items-center justify-center bg-[#e6f2ec] px-4">
  <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
    <h2 className="text-2xl font-bold text-center mb-6 text-[#2e7d32]">Create Account</h2>

    {error && (
      <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
        {error}
      </div>
    )}

    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="text"
          name="fullname"
          placeholder="Full Name"
          value={formData.fullname}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-[#86ba98] bg-[#e6f2ec] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#86ba98]"
          required
        />
      </div>

      <div>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-[#86ba98] bg-[#e6f2ec] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#86ba98]"
          required
        />
      </div>

      <div>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-[#86ba98] bg-[#e6f2ec] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#86ba98]"
          required
        />
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
