import React from 'react';
import Sensors from '../Home/Sensors/Sensors'; // Reusing sensor component for dashboard
import Navbar from '../../layout/Navbar/Navbar';

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-black">
      <Navbar /> 
      <div className="pt-24 px-6 text-center">
         <h1 className="text-white text-4xl font-bold font-display mb-4">User Dashboard</h1>
         <p className="text-gray-500 mb-12">Manage your device and view historical data.</p>
      </div>
      {/* We reuse the Sensors grid here as the main view for now */}
      <Sensors />
    </div>
  );
};

export default DashboardPage;