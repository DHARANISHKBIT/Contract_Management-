import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEdit, AiOutlineDelete, AiOutlinePlus, AiOutlineSearch, AiOutlineFilter } from 'react-icons/ai';
import axios from "axios";

const ContractsTable = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(() => localStorage.getItem("role") || "admin");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }
    const storedRole = localStorage.getItem("role");
    if (storedRole) setRole(storedRole);

    const fetchContracts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/contracts/allcontract",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data.success) {
          setContracts(response.data.contracts || []);
        }
      } catch (error) {
        if (error.response?.status === 401) {
          alert("Session expired or invalid. Please log in again.");
          navigate("/login", { replace: true });
          return;
        }
        console.error("Error fetching contracts:", error);
        alert(error.response?.data?.message || "Failed to load contracts");
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, [navigate]);


  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700';
      case 'Expired':
        return 'bg-red-100 text-red-700';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleViewDetails = (contract) => {
    const id = contract._id || contract.id;
    navigate(`/view-contract-page/${id}`, { state: { contract } });
  };

  const handleEdit = (contract) => {
    const id = contract._id || contract.id;
    navigate(`/edit-contract/${id}`, { state: { contract } });
  };

  const handleDelete = async (contract) => {
    const id = contract._id || contract.id;
    if (!id) return;
    if (!window.confirm(`Delete contract "${contract.contract_name}"? This cannot be undone.`)) return;

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/contracts/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setContracts((prev) => prev.filter((c) => (c._id || c.id) !== id));
      } else {
        alert(response.data.message || "Failed to delete contract");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        alert("Session expired or invalid. Please log in again.");
        navigate("/login");
        return;
      }
      const msg = error.response?.data?.message || error.message;
      alert(msg || "Failed to delete contract");
    }
  };

  const filteredContracts = contracts.filter(contract => {
    const name = (contract.contract_name || "").toLowerCase();
    const type = (contract.contract_type || "").toLowerCase();
    const client = (contract.client_name || "").toLowerCase();
    const term = searchTerm.toLowerCase();
    const matchesSearch = name.includes(term) || type.includes(term) || client.includes(term);
    const matchesStatus = statusFilter === 'All Status' || (contract.status === statusFilter);
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-gray-600">Loading contracts...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className=" flex flex-col sm:flex-row sm:gap-4 justify-between items-center mb-8">
          <div className='flex-col '>
            <h1 className="text-xl font-bold text-gray-900 ">
              {role === "user" ? "Contracts assigned to you" : "All Contracts"}
            </h1>
            <p className="text-gray-600 mt-1">{filteredContracts.length} contracts found</p>
          </div>
          {role === "admin" && (
            <button
              onClick={() => navigate('/addnew-contract')}
              style={{ backgroundColor: "#5b5dfc" }}
              className="flex items-center gap-2 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-colors font-medium"
            >
              <AiOutlinePlus size={20} />
              Add New Contract
            </button>
          )}
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            <div className="flex-1 relative">
              <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, type, or client/vendor..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className='flex gap-3.5'>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <AiOutlineFilter size={20} className="text-gray-600" />
            </button>
            <select
              className="px-4 w-full py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Expired</option>
              <option>Pending</option>
            </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Contract Name
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Type
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Client/Vendor
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Value
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  End Date
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredContracts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    {contracts.length === 0
                      ? (role === "user" ? "No contracts assigned to you yet." : "No contracts yet. Add your first contract.")
                      : "No contracts match your search or filter."}
                  </td>
                </tr>
              ) : filteredContracts.map((contract) => (
                <tr key={contract._id || contract.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{contract.contract_name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">{contract.contract_type}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">{contract.client_name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {contract.amount != null ? Number(contract.amount).toLocaleString() : "—"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">{formatDate(contract.end_date)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(contract.status || "Pending")}`}>
                      {contract.status || "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleViewDetails(contract)}
                        className="text-gray-600 hover:text-indigo-600 transition-colors"
                        title="View details"
                      >
                        <AiOutlineEye size={18} />
                      </button>
                      {role === "admin" && (
                        <>
                          <button
                            onClick={() => handleEdit(contract)}
                            className="text-gray-600 hover:text-indigo-600 transition-colors"
                            title="Edit"
                          >
                            <AiOutlineEdit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(contract)}
                            className="text-gray-600 hover:text-red-600 transition-colors"
                            title="Delete contract"
                          >
                            <AiOutlineDelete size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ContractsTable;