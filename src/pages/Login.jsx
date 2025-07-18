import React, { useState } from 'react';
import { useLoginMutation } from '../apis/authApi'; // Adjust path
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login as loginAction } from '../store/slices/authSlice'; // Adjust path if needed

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  const { email, password } = formData;

  if (!email.trim() || !password.trim()) {
    setError("Email and password are required.");
    return;
  }

  try {
    const res = await login(formData).unwrap();
    
    const userRoles = res.data.user?.role || [];
    dispatch(loginAction({ userData: res.data }));

    // Normalize roles to lowercase and check for 'admin'
    const hasAdminRole = userRoles.some(role => role.toLowerCase() === 'admin');

    if (hasAdminRole) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  } catch (err) {
    setError(err?.data?.message || "Invalid credentials");
  }
};



  return (

<div className="min-h-screen flex items-center justify-center bg-[#e6f2ec] px-4">
  <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
    <h2 className="text-2xl font-bold text-center mb-6 text-[#2e7d32]">Login to Your Account</h2>

    {error && (
      <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
        {error}
      </div>
    )}

    <form onSubmit={handleSubmit} className="space-y-4">
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
        {isLoading ? "Logging in..." : "Login"}
      </button>
    </form>

    <p className="text-center text-sm mt-4 text-[#2e7d32]">
      Don’t have an account?{" "}
      <Link to="/signup" className="text-[#2e7d32] underline hover:text-[#1b5e20]">
        Sign up
      </Link>

    </p>
  </div>
</div>

  );
}

export default Login;
