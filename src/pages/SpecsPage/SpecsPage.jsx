import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Specs from '../Home/Specs/Specs'; // Reusing your existing component

const SpecsPage = () => {
  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="px-6 mb-8">
        <Link to="/" className="text-gray-500 hover:text-white flex items-center gap-2 text-sm transition-colors max-w-6xl mx-auto">
            <ArrowLeft size={16} /> Back to Product
        </Link>
      </div>
      <Specs />
    </div>
  );
};

export default SpecsPage;