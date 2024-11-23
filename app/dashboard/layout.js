import React from "react";
import SideBar from "./_components/SideBar";
import Header from "./_components/Header";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 shadow-md z-10 hidden md:block">
        <SideBar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white z-20 shadow-sm">
          <Header />
        </div>

        {/* Children Content */}
        <div className="p-6 overflow-auto bg-gray-50">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
