// Dashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../utils/api';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        // If not authenticated, redirect to login
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF671F]"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect due to useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome, {user.name}!</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Dashboard Cards */}
            <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Your Profile</h3>
              <p className="text-gray-600">View and update your personal information</p>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Available Schemes</h3>
              <p className="text-gray-600">Browse schemes you're eligible for</p>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Applications</h3>
              <p className="text-gray-600">Track your scheme applications</p>
            </div>
          </div>
          
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-4">
              <button className="px-4 py-2 bg-[#FF671F] text-white rounded-md hover:bg-[#e05a1a] transition-colors">
                Apply for New Scheme
              </button>
              <button className="px-4 py-2 border border-[#FF671F] text-[#FF671F] rounded-md hover:bg-orange-50 transition-colors">
                View Applications
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                Update Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
