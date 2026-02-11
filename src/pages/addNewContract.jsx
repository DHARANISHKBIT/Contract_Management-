import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineClose, AiOutlineSave } from 'react-icons/ai';
import axios from "axios";   // ✅ ADDED

const AddNewContract = () => {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    type: 'Service Contract',
    client: '',
    startDate: '',
    endDate: '',
    value: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCancel = () => {
    navigate('/contract-page');
  };

  // ✅ API ADDED (UI NOT TOUCHED)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to create a contract.");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/contracts/create",
        {
          contract_name: formData.name,
          contract_type: formData.type,
          client_name: formData.client,
          start_date: formData.startDate,
          end_date: formData.endDate,
          status: "Pending",
          amount: formData.value,
          description: formData.description,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Contract created:", response.data);

      // Navigate back after successful creation
      navigate('/contract-page');

    } catch (error) {
      console.error(
        "Error creating contract:",
        error.response?.data || error.message
      );
      alert(error.response?.data?.message || "Failed to create contract");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Add New Contract
            </h1>
            <p className="text-gray-600">
              Fill in the details to create a new contract
            </p>
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

            {/* Contract Type and Client/Vendor Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                  <option value="Lease Agreement">Lease Agreement</option>
                  <option value="Other">Other</option>
                </select>
              </div>

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
                  placeholder="Enter client or vendor name"
                />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                style={{ backgroundColor: "#5b5dfc" }}
                className="flex items-center gap-2 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-colors font-medium"
              >
                <AiOutlineSave size={18} />
                Create Contract
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddNewContract;
