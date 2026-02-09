import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AiOutlineClose, AiOutlineSave } from 'react-icons/ai';

const EditContract = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const contract = location.state?.contract;

  // If no contract data, redirect back to list
  if (!contract) {
    navigate('/contracts');
    return null;
  }

  // Form state
  const [formData, setFormData] = useState({
    name: contract.name || '',
    type: contract.type || 'Service Contract',
    client: contract.client || '',
    startDate: contract.startDate || '',
    endDate: contract.endDate || '',
    value: contract.value.replace('$', '').replace(',', '') || '',
    description: contract.description || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your update logic here
    console.log('Updated contract data:', formData);
    // Navigate back after successful update
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Contract</h1>
            <p className="text-gray-600">Update contract information</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Contract Name */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Contract Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter contract name"
              />
            </div>

            {/* Contract Type and Client/Vendor Name - Two columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Contract Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Contract Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="Service Contract">Service Contract</option>
                  <option value="Vendor Contract">Vendor Contract</option>
                  <option value="Employment Contract">Employment Contract</option>
                  <option value="Partnership Agreement">Partnership Agreement</option>
                </select>
              </div>

              {/* Client/Vendor Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Client/Vendor Name *
                </label>
                <input
                  type="text"
                  name="client"
                  value={formData.client}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter client/vendor name"
                />
              </div>
            </div>

            {/* Start Date and End Date - Two columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Start Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Contract Value */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Contract Value ($) *
              </label>
              <input
                type="number"
                name="value"
                value={formData.value}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter contract value"
              />
            </div>

            {/* Description */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                placeholder="Enter contract description"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                <AiOutlineClose size={18} />
                Cancel
              </button>
              <button
                type="submit"
                style={{backgroundColor:"#5b5dfc"}}
                className="flex items-center gap-2 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-colors font-medium"
              >
                <AiOutlineSave size={18} />
                Update Contract
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditContract;