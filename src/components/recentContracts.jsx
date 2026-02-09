import ContractItem from "./ContractItem";
import { useNavigate } from "react-router-dom";

export default function RecentContracts({ contracts }) {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-xl shadow mt-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-blue-600">
          Recent Contracts
        </h3>
        <button 
        onClick={() => navigate('/contract-page')}
        className="text-blue-600 hover:underline text-sm">
          View All →
        </button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {contracts.map((contract, index) => (
          <ContractItem key={index} {...contract} />
        ))}
      </div>
    </div>
  );
}
