import { HiOutlineDocumentText } from "react-icons/hi";

export default function ContractItem({
  title,
  company,
  amount,
  type,
  status,
}) {
  const statusStyles = {
    Active: "bg-green-100 text-green-700",
    Expired: "bg-red-100 text-red-600",
    Pending: "bg-yellow-100 text-yellow-700",
  };

  const iconBg =
    status === "Active"
      ? "bg-green-100 text-green-600"
      : status === "Pending"
      ? "bg-yellow-100 text-yellow-600"
      : "bg-red-100 text-red-600";

  return (
    <div className="border-gray-300 border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      {/* Left */}
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${iconBg}`}>
          <HiOutlineDocumentText size={22} />
        </div>

        <div>
          <h4 className="font-semibold">{title}</h4>
          <p className="text-sm text-gray-500">{company}</p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center sm:items-end gap-5">
        <div className="flex-col items-start">
        <div className="font-semibold">{amount}</div>
        <div className="text-sm text-gray-500">{type}</div>
        </div>
        <span className={`px-3 py-1 flex items-center rounded-full text-xs font-medium ${statusStyles[status]}`}>
          {status}
        </span>
      </div>
    </div>
  );
}
