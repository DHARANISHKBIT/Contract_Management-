import React from "react";
import { useLocation } from "react-router-dom";
import MainRoute from "./routes/mainRoute.jsx";
import Navbar from "./components/navbar.jsx";
import UserMeetings from "./pages/userMeeting.jsx";
import CreateMeetingModal from "./pages/addMeetingPage.jsx";

function App() {
  const location = useLocation();

  // Hide navbar on login and register
  const hideNavbar =
    location.pathname === "/" || location.pathname === "/register";

  return (
    <div>
      {!hideNavbar && <Navbar />}
      <MainRoute />
      {/* <CreateMeetingModal /> */}
    </div>
  );
}

export default App;
