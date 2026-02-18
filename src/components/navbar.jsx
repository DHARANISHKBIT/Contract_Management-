import { useState } from "react";
import {
  MdOutlineLibraryBooks,
  MdOutlineDashboard,
  MdOutlinePerson,
} from "react-icons/md";
import { FiMenu, FiX } from "react-icons/fi";
import { IoIosLogOut } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { SiGooglemeet } from "react-icons/si";
import { IoPersonCircle } from "react-icons/io5";

export default function Navbar() {
  const [active, setActive] = useState("dashboard");
  const [open, setOpen] = useState(false);
const navigate = useNavigate();
const role = localStorage.getItem("role");
console.log("User role from localStorage:", role); // Debugging line
  const navItem = (name, label, Icon) => (
    <div
      onClick={() => {
        setActive(name);
        setOpen(false);
        if(name === "dashboard") navigate("/admin-dashboard");
        else if(name === "contracts") navigate("/contract-page");
        else if(name === "meetings") if (role == 'admin' ? navigate("/admin-meeting") : navigate("/user-meeting"));
      }}
      className={`flex items-center  gap-2 px-4 py-2 rounded-lg cursor-pointer
        ${
          active === name
            ? "bg-blue-600 text-white"
            : "text-black hover:bg-blue-200"
        }` } 
    >
      <Icon className="text-xl" />
      <span className="text-lg">{label}</span>
    </div>
  );
   const logout = () => {
    localStorage.clear();
    navigate("/");
  };


  return (
    <div className="bg-white shadow-sm px-6 py-3">
      {/* Top Bar */}
      <div className="flex justify-between items-center">
        {/* Left */}
        <div className="flex items-center gap-8">
        <div className="flex items-center gap-4">
          <div className="p-2 border-4 border-blue-600 rounded-lg bg-blue-600">
            <MdOutlineLibraryBooks className="text-white text-3xl" />
          </div>

          <div>
            <div className="text-[28px] font-bold">CMS</div>
            <div className="text-sm">Contract Management</div>
          </div>
        </div>

         </div>
        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-14">
          {navItem("dashboard", "Dashboard", MdOutlineDashboard)}
          {navItem("contracts", "Contracts", FiMenu)}
          {navItem("meetings", "Meetings", SiGooglemeet)}
          {navItem("customers", "Customers", IoPersonCircle)}

        </nav>

        {/* Right (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex gap-2 px-4 py-2 bg-gray-100 rounded-lg items-center">
            <MdOutlinePerson />
            <span className="text-sm">{role}</span>
            <span className="px-2 py-1 text-xs bg-indigo-600 text-white rounded">
              {role}
            </span>
          </div>

          <button 
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-gray-600 hover:text-red-500">
            <IoIosLogOut />
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setOpen(!open)}
        >
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden mt-4 space-y-3">
          {navItem("dashboard", "Dashboard", MdOutlineDashboard)}
          {navItem("contracts", "Contracts", FiMenu)}

          <div className="flex gap-2 px-4 py-2 bg-gray-100 rounded-lg items-center">
            <MdOutlinePerson />
            <span className="text-sm">admin</span>
            <span className="px-2 py-1 text-xs bg-indigo-600 text-white rounded">
              ADMIN
            </span>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-gray-600 hover:text-red-500 w-full">
            <IoIosLogOut />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}