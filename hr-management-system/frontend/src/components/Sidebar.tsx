import { NavLink } from 'react-router-dom';
import type { ElementType } from 'react';
import {
  IoGrid,
  IoCalendarOutline,
  IoPeopleOutline,
  IoBusinessOutline,
  IoHeadsetOutline,
  IoSettingsOutline,
  IoClose,
} from 'react-icons/io5';

type NavItemProps = {
  to: string;
  icon: ElementType;
  label: string;
  end?: boolean;
};

const NavItem = ({ to, icon: Icon, label, end = false }: NavItemProps) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      `w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 ${
        isActive
          ? 'text-primary-700 bg-primary-50'
          : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100'
      }`
    }
  >
    {({ isActive }) => (
      <>
        <Icon className={`w-[18px] h-[18px] ${isActive ? 'text-primary-600' : 'text-neutral-400'}`} />
        <span>{label}</span>
      </>
    )}
  </NavLink>
);

type SidebarProps = {
  isOpen: boolean;
  toggleSidebar: () => void;
};

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  return (
    <>
      <aside
        className={`w-[260px] bg-white border-r border-neutral-200 flex flex-col fixed top-0 left-0 h-screen z-30
                    transform transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-neutral-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">W</span>
            </div>
            <span className="text-xl font-bold text-neutral-900">WeHR</span>
          </div>
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-1.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <IoClose size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-5 overflow-y-auto">
          <div className="mb-6">
            <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2.5 px-3">
              Main Menu
            </p>
            <div className="space-y-0.5">
              <NavItem to="/" icon={IoGrid} label="Dashboard" end={true} />
              <NavItem to="/schedule" icon={IoCalendarOutline} label="Schedule" />
              <NavItem to="/employees" icon={IoPeopleOutline} label="Employee" />
              <NavItem to="/departments" icon={IoBusinessOutline} label="Department" />
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2.5 px-3">
              Other
            </p>
            <div className="space-y-0.5">
              <NavItem to="/support" icon={IoHeadsetOutline} label="Support" />
              <NavItem to="/settings" icon={IoSettingsOutline} label="Settings" />
            </div>
          </div>
        </nav>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-neutral-900/30 backdrop-blur-[2px] z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;
