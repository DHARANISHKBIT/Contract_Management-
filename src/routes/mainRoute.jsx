import { Routes, Route } from "react-router-dom";
import Login from "../pages/loginPage";
import Register from "../pages/registerPage";
import AdminDashboard from "../pages/adminDashBoard";
import ContractsTable from "../pages/contractPage";
import ContractDetail from "../pages/viewContract";
import EditContract from "../pages/editContract";
import AddNewContract from "../pages/addNewContract";
import AdminMeetingPage from "../pages/adminMeeting";
import UserMeetingPage from "../pages/userMeeting";
export default function MainRoute() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/contract-page" element={<ContractsTable />} />
      <Route path="/view-contract-page/:id" element={<ContractDetail />} />
       <Route path="/edit-contract/:id" element={<EditContract />} />
       <Route path="/addnew-contract" element={<AddNewContract />} />
       <Route path="/admin-meeting" element={<AdminMeetingPage/>} />
       <Route path="/user-meeting" element={<UserMeetingPage/>} />
    </Routes>
  );
}