import Navbar from "../components/navbar";
import StatCard from "../components/statCard";
import RecentContracts from "../components/RecentContracts";
import StatusBox from "../components/statusBox";
import { MdOutlineDescription } from "react-icons/md";
import { VscError } from "react-icons/vsc";
import { BiError } from "react-icons/bi";
import { GiConfirmed } from "react-icons/gi";
import { LuClock } from "react-icons/lu";
import { MdOutlineAttachMoney } from "react-icons/md";
import StatusDistribution from "../components/StatusDistribution";

const contractsData = [
  {
    title: "Software Development Agreement",
    company: "Tech Solutions Inc.",
    amount: "$150K",
    type: "Service Contract",
    status: "Expired",
  },
  {
    title: "Cloud Infrastructure Contract",
    company: "CloudTech Services",
    amount: "$75K",
    type: "Vendor Contract",
    status: "Active",
  },
  {
    title: "Marketing Services Agreement",
    company: "Digital Marketing Pro",
    amount: "$50K",
    type: "Service Contract",
    status: "Expired",
  },
  {
    title: "Office Supplies Contract",
    company: "Office Depot",
    amount: "$12K",
    type: "Vendor Contract",
    status: "Expired",
  },
  {
    title: "IT Support Agreement",
    company: "TechSupport Global",
    amount: "$85K",
    type: "Service Contract",
    status: "Pending",
  },
];
export default function AdminDashboard() {

  return (
    <div className="min-h-screen bg-slate-100">
      {/* <Navbar /> */}

      <div className="p-6">
        <h2 className="text-2xl font-bold">Dashboard Overview</h2>
        <div className="mb-4">
          Welcome back! Here's your contract summary
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Total Contracts"
            value="6"
            icon={<MdOutlineDescription />}
            color="text-blue-600"
            bgColor="bg-blue-50"
          />

          <StatCard
            title="Active Contracts"
            value="2"
            icon={<GiConfirmed />}
            color="text-green-600"
            bgColor="bg-green-50"
          />

          <StatCard
            title="Expired Contracts"
            value="3"
            icon={<VscError />}
            color="text-red-600"
            bgColor="bg-red-50"
          />

          <StatCard
            title="Pending Contracts"
            value="1"
            icon={<LuClock />}
            color="text-yellow-600"
            bgColor="bg-yellow-50"
          />

          <StatCard
            title="Active Value"
            value="$170K"
            icon={<MdOutlineAttachMoney />}
            color="text-purple-600"
            bgColor="bg-purple-50"
          />

          <StatCard
            title="Expiring Soon"
            value="0"
            icon={<BiError />}
            color="text-orange-600"
            bgColor="bg-orange-50"
          />
        </div>

        <RecentContracts contracts={contractsData} />;

        {/* Bottom Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
          <StatusBox
            title="Contract Types"
            items={[
              {
                label: "Service Contract",
                value: "4",
                percentage: 66,
                barColor: "#2563eb",   // blue
                trackColor: "#eff6ff",
              },
              {
                label: "Vendor Contract",
                value: "2",
                percentage: 34,
                barColor: "#16a34a",   // green
                trackColor: "#dcfce7",
              },
            ]}
          />
          <StatusDistribution
            title="Status Distribution"
            items={[
              {
                label: "Active",
                value: "2 (33%)",
                color: "bg-green-500",
              },
              {
                label: "Pending",
                value: "1 (17%)",
                color: "bg-yellow-500",
              },
              {
                label: "Expired",
                value: "3 (50%)",
                color: "bg-red-500",
              },
            ]}
          />;

        </div>
      </div>
    </div>
  );
}
