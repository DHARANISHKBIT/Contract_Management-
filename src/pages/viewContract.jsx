import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AiOutlineEdit, AiOutlineDelete, AiOutlineArrowLeft } from 'react-icons/ai';
import { BsFileText, BsCurrencyDollar, BsCalendar, BsBuilding, BsClock } from 'react-icons/bs';
import axios from "axios";

const ContractDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const contract = location.state?.contract;

  const role = localStorage.getItem("role");
  // If no contract data, redirect back to list
  if (!contract) {
    navigate('/contracts');
    return null;
  }

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-500/20 text-green-100';
      case 'Expired':
        return 'bg-red-500/20 text-red-100';
      case 'Pending':
        return 'bg-yellow-500/20 text-yellow-100';
      default:
        return 'bg-gray-500/20 text-gray-100';
    }
  };

  const handleBackToList = () => {
    navigate('/contract-page');
  };

  const handleEdit = () => {
    navigate(`/edit-contract/${contract._id}`, { state: { contract } });
    console.log('Edit contract:', contract._id);
  };

  
  const handleDelete = async () => {

    const id = contract._id;
  
    if (!window.confirm(`Delete contract "${contract.contract_name}"? This cannot be undone.`)) return;
  
    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("Please log in to delete a contract.");
      return;
    }
  
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/contracts/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.data.success) {
        alert("Contract deleted successfully");
        navigate("/contract-page");   // redirect after delete
      } else {
        alert(response.data.message || "Failed to delete contract");
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      alert(msg || "Failed to delete contract");
    }
  };
  

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <button 
            onClick={handleBackToList}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <AiOutlineArrowLeft size={20} />
            <span className="font-medium">Back to Contracts</span>
          </button>
          {role === "admin" ? (

          <div className="flex gap-3">
            <button 
              onClick={handleEdit}
              style={{backgroundColor:"#5b5dfc"}}
              className="flex items-center gap-2 text-white px-5 py-2.5 rounded-lg hover:opacity-90 transition-colors font-medium"
            >
              <AiOutlineEdit size={18} />
              Edit
            </button>
            <button 
              onClick={handleDelete}
              style={{backgroundColor:"#ef4444"}}
              className="flex items-center gap-2 text-white px-5 py-2.5 rounded-lg hover:opacity-90 transition-colors font-medium"
            >
              <AiOutlineDelete size={18} /  >
              Delete
            </button>
          </div>
          ): null}
        </div>

        {/* Contract Header Card */}
        <div 
          style={{background: "linear-gradient(135deg, #5b5dfc 0%, #7c7eff 100%)"}}
          className="rounded-xl p-8 mb-6 text-white"
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div>
              <div className="text-2xl sm:text-4xl font-bold mb-2">{contract.contract_name}</div>
              <p className="text-white/90 text-lg">{contract.client_name}</p>
            </div>
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getStatusBadgeColor(contract.status)}`}>
              <BsClock size={16} />
              {contract.status}
            </span>
          </div>
        </div>

        {/* Contract Details Grid */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            {/* Contract Type */}
            <div className="flex gap-4 items-start">
              <div className=" w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BsFileText className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Contract Type</p>
                <p className="text-lg font-semibold text-gray-900">{contract.contract_type}</p>
              </div>
            </div>

            {/* Contract Value */}
            <div className="flex gap-4">
              <div className=" w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <BsCurrencyDollar className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Contract Value</p>
                <p className="text-lg font-semibold text-gray-900">{contract.amount}</p>
              </div>
            </div>

            {/* Start Date */}
            <div className="flex gap-4">
              <div className=" w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BsCalendar className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Start Date</p>
                <p className="text-lg font-semibold text-gray-900">{contract.start_date}</p>
              </div>
            </div>

            {/* End Date */}
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <BsCalendar className="text-orange-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">End Date</p>
                <p className="text-lg font-semibold text-gray-900">{contract.end_date}</p>
              </div>
            </div>

            {/* Client/Vendor */}
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <BsBuilding className="text-indigo-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Client/Vendor</p>
                <p className="text-lg font-semibold text-gray-900">{contract.client_name}</p>
              </div>
            </div>

            {/* Status */}
            <div className="flex gap-4">
              <div className=" w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <BsClock className="text-red-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <p className="text-lg font-semibold text-gray-900">{contract.status}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
            <p className="text-gray-600">{contract.description}</p>
          </div>

          {/* Timeline */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contract Timeline</h3>
            <div className="space-y-6">
              {/* Contract Started */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <div className="w-0.5 h-12 bg-gray-200"></div>
                </div>
                <div className="flex-1 pb-8">
                  <h4 className="font-semibold text-gray-900 mb-1">Contract Started</h4>
                  <p className="text-sm text-gray-500">{contract.start_date}</p>
                </div>
              </div>

              {/* Contract Ended */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">Contract Ended</h4>
                  <p className="text-sm text-gray-500">{contract.end_date}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> 
  );
};

export default ContractDetail;