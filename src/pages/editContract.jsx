import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AiOutlineClose, AiOutlineSave } from 'react-icons/ai';
import axios from 'axios';

// Helper function to format date from ISO string to yyyy-MM-dd
const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const EditContract = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const contract = location.state?.contract;

  if (!contract) {
    navigate('/contracts');
    return null;
  }

  const [formData, setFormData] = useState({
    name: contract.contract_name || '',
    type: contract.contract_type || 'Service Contract',
    client: contract.client_name || '',
    startDate: formatDateForInput(contract.start_date) || '',
    endDate: formatDateForInput(contract.end_date) || '',
    value: contract.amount || '',
    description: contract.description || '',
    userEmail: contract.assigned_user_email || '',
    phoneNumber: contract.phone_number || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCancel = () => {
    navigate(-1);
  };

  // ✅ UPDATE METHOD ADDED
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert("Authentication token not found. Please login again.");
        navigate('/login');
        return;
      }

      await axios.put(`http://localhost:5000/api/contracts/update/${contract._id}`, {
        contract_name: formData.name,
        contract_type: formData.type,
        client_name: formData.client,
        start_date: formData.startDate,
        end_date: formData.endDate,
        amount: formData.value,
        description: formData.description,
        assigned_user_email: formData.userEmail,
        phone_number: formData.phoneNumber
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      alert("Contract Updated Successfully ✅");
      navigate(-1);

    } catch (error) {
      console.error("Update Error:", error);
      alert("Update Failed ❌");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-8">

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Contract</h1>
            <p className="text-gray-600">Update contract information</p>
          </div>

          <form onSubmit={handleSubmit}>

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
                  placeholder="Enter client/vendor name"
                />
              </div>
            </div>

            {/* ✅ Email + Phone Added (Logic fixed, UI same) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="userEmail"
                  value={formData.userEmail}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter email"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter phone number"
                />
              </div>
            </div>

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
