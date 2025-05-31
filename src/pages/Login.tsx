import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { PiggyBank } from 'lucide-react';

const Login: React.FC = () => {
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const { loginUser } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!mobile) {
      setError('Mobile number is required');
      return;
    }

    const success = loginUser(mobile);
    if (success) {
      navigate('/');
    } else {
      setError('User not found. Please check your mobile number or register.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex flex-col items-center mb-6">
          <PiggyBank size={64} className="text-indigo-600 mb-2" />
          <h1 className="text-3xl font-bold text-center text-gray-800">Covid-19 Bank</h1>
          <p className="text-gray-600 text-center mt-2">Login to access your account</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="mobile" className="block text-gray-700 font-medium mb-2">
              Mobile Number
            </label>
            <input
              type="tel"
              id="mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your mobile number"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;