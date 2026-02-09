import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEdit, AiOutlineDelete, AiOutlinePlus, AiOutlineSearch, AiOutlineFilter } from 'react-icons/ai';

const ContractsTable = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');

  const contracts = [
    {
      id: 1,
      name: 'Software Development Agreement',
      type: 'Service Contract',
      client: 'Tech Solutions Inc.',
      value: '$150,000',
      startDate: '2025-01-15',
      endDate: '2026-01-15',
      status: 'Expired',
      description: 'Custom software development for enterprise application'
    },
    {
      id: 2,
      name: 'Cloud Infrastructure Contract',
      type: 'Vendor Contract',
      client: 'CloudTech Services',
      value: '$75,000',
      startDate: '2025-05-15',
      endDate: '2026-05-31',
      status: 'Active',
      description: 'Cloud infrastructure management and hosting services'
    },
    {
      id: 3,
      name: 'Marketing Services Agreement',
      type: 'Service Contract',
      client: 'Digital Marketing Pro',
      value: '$50,000',
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      status: 'Expired',
      description: 'Digital marketing and brand management services'
    },
    {
      id: 4,
      name: 'Office Supplies Contract',
      type: 'Vendor Contract',
      client: 'Office Depot',
      value: '$12,000',
      startDate: '2023-03-01',
      endDate: '2024-03-01',
      status: 'Expired',
      description: 'Office supplies and stationery procurement'
    },
    {
      id: 5,
      name: 'IT Support Agreement',
      type: 'Service Contract',
      client: 'TechSupport Global',
      value: '$85,000',
      startDate: '2026-03-01',
      endDate: '2027-03-01',
      status: 'Pending',
      description: 'Comprehensive IT support and maintenance services'
    },
    {
      id: 6,
      name: 'Consulting Services',
      type: 'Service Contract',
      client: 'Business Consultants Ltd',
      value: '$95,000',
      startDate: '2025-04-15',
      endDate: '2026-04-30',
      status: 'Active',
      description: 'Business strategy and management consulting services'
    }
  ];

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
    // Navigate to detail page with contract data
    navigate(`/view-contract-page/${contract.id}`, { state: { contract } });
  };
  const handleEdit = (contract) => {
  navigate(`/edit-contract/${contract.id}`, { state: { contract } });
};

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || contract.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-100 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className=" flex flex-col sm:flex-row sm:gap-4 justify-between items-center mb-8">
          <div className='flex-col '>
            <h1 className="text-xl font-bold text-gray-900 ">All Contracts</h1>
            <p className="text-gray-600 mt-1">{contracts.length} contracts found</p>
          </div>
          <button 
          onClick={() => navigate('/addnew-contract')}
            style={{backgroundColor:"#5b5dfc"}} 
            className="flex items-center gap-2 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-colors font-medium"
          >
            <AiOutlinePlus size={20} />
            Add New Contract
          </button>
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
              {filteredContracts.map((contract) => (
                <tr key={contract.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{contract.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">{contract.type}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">{contract.client}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{contract.value}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">{contract.endDate}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(contract.status)}`}>
                      {contract.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleViewDetails(contract)}
                        className="text-gray-600 hover:text-indigo-600 transition-colors"
                      >
                        <AiOutlineEye size={18} />
                      </button>
                      <button 
                      onClick={() => handleEdit(contract)}
                      className="text-gray-600 hover:text-indigo-600 transition-colors">
                        <AiOutlineEdit size={18} />
                      </button>
                      <button className="text-gray-600 hover:text-red-600 transition-colors">
                        <AiOutlineDelete size={18} />
                      </button>
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