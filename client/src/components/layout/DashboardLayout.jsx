import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import RoleSwitcher from '../ui/RoleSwitcher';

export const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-canvas text-on-surface flex flex-col antialiased selection:bg-primary-container selection:text-white">
      {/* Top Navbar */}
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex w-full">
        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Content Viewport */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full animate-fade-in">
          <Outlet />
        </main>
      </div>

      {/* Dev Role Switcher */}
      <RoleSwitcher />
    </div>
  );
};

export default DashboardLayout;
