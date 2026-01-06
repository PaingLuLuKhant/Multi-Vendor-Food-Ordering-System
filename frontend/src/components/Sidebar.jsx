import React from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="sidebar">
      <Link to="/">Dashboard</Link>
      <Link to="/branches">Branches</Link>
      <Link to="/admins">Admin Users</Link>
      <Link to="/inventory">Inventory Report</Link>
      <Link to="/settings">System Settings</Link>
    </div>
  );
}

export default Sidebar;
