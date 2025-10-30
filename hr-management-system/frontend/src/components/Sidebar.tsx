// src/components/Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  IoGrid,
  IoPersonAddOutline,
  IoCalendarOutline,
  IoPeopleOutline,
  IoBusinessOutline,
  IoHeadsetOutline,
  IoSettingsOutline,
  IoLogOutOutline
} from 'react-icons/io5';

type NavItemProps = {
  to: string;
  icon: React.ElementType;
  label: string;
  end?: boolean;
};

const NavItem = ({ to, icon: Icon, label, end = false }: NavItemProps) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      `w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
        isActive
          ? 'text-red-500 bg-red-50'
          : 'text-gray-600 hover:bg-gray-50'
      }`
    }
  >
    {({ isActive }) => (
      <>
        <Icon className={`w-5 h-5 ${isActive ? 'text-red-500' : 'text-gray-600'}`} />
        <span>{label}</span>
      </>
    )}
  </NavLink>
);

const Sidebar = () => {
  const { logout } = useAuth();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed top-0 left-0 h-screen">
      {/* Logo */}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900">WeHR</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4">
        {/* Main Menu Section */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
            Main Menu
          </p>
          <div className="space-y-1">
            <NavItem to="/" icon={IoGrid} label="Dashboard" end={true} />
            <NavItem to="/recruitment" icon={IoPersonAddOutline} label="Recruitment" />
            <NavItem to="/schedule" icon={IoCalendarOutline} label="Schedule" />
            <NavItem to="/employees" icon={IoPeopleOutline} label="Employee" />
            <NavItem to="/departments" icon={IoBusinessOutline} label="Department" />
          </div>
        </div>

        {/* Other Section */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
            Other
          </p>
          <div className="space-y-1">
            <NavItem to="/support" icon={IoHeadsetOutline} label="Support" />
            <NavItem to="/settings" icon={IoSettingsOutline} label="Settings" />
          </div>
        </div>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <IoLogOutOutline className="w-5 h-5" />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;