import { useState, useEffect, useRef } from 'react';
import { FiSearch, FiBell, FiChevronDown, FiMenu, FiLogOut, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import api from '../api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatar?: string;
}

type HeaderProps = {
  toggleSidebar: () => void;
};

const Header = ({ toggleSidebar }: HeaderProps) => {
  const { logout } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data.data);
    } catch {
      // token invalid
    } finally {
      setLoading(false);
    }
  };

  const getRoleDisplay = (role: string) => {
    const roles: Record<string, string> = { ADMIN: 'Administrator', HR_MANAGER: 'HR Manager', USER: 'Employee' };
    return roles[role] || role;
  };

  const getInitials = (firstName: string, lastName: string) =>
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  return (
    <header className="bg-white border-b border-neutral-200 px-4 sm:px-6 h-16 flex items-center sticky top-0 z-10">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <FiMenu size={20} />
          </button>

          {/* Search */}
          <div className="hidden sm:block relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
            <input
              type="search"
              placeholder="Search..."
              className="w-64 py-2 pl-9 pr-4 text-sm text-neutral-700 placeholder-neutral-400 bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button className="relative p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors">
            <FiBell size={19} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full ring-2 ring-white" />
          </button>

          <div className="h-6 w-px bg-neutral-200 mx-1 hidden sm:block" />

          {/* Profile */}
          {loading ? (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-neutral-200 rounded-full skeleton" />
              <div className="hidden md:block space-y-1.5">
                <div className="h-3.5 w-24 skeleton rounded" />
                <div className="h-3 w-16 skeleton rounded" />
              </div>
            </div>
          ) : user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2.5 cursor-pointer group p-1.5 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center ring-2 ring-neutral-100 group-hover:ring-primary-200 transition-all">
                  <span className="text-primary-700 font-semibold text-xs">
                    {getInitials(user.firstName, user.lastName)}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-neutral-800 leading-tight">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-[11px] text-neutral-400">{getRoleDisplay(user.role)}</p>
                </div>
                <FiChevronDown
                  className={`text-neutral-400 transition-transform hidden md:block ${showProfileMenu ? 'rotate-180' : ''}`}
                  size={14}
                />
              </button>

              {/* Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-1 w-56 bg-white rounded-xl shadow-lg border border-neutral-200 py-1.5 z-20 animate-slide-down">
                  <div className="px-4 py-3 border-b border-neutral-100">
                    <p className="text-sm font-semibold text-neutral-900">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-neutral-500 mt-0.5">{user.email}</p>
                    <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-semibold bg-primary-50 text-primary-700 rounded-full">
                      {getRoleDisplay(user.role)}
                    </span>
                  </div>
                  <div className="py-1">
                    <button className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50 transition-colors">
                      <FiUser size={15} />
                      My Profile
                    </button>
                  </div>
                  <div className="border-t border-neutral-100 pt-1">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-error-600 hover:bg-error-50 transition-colors font-medium"
                    >
                      <FiLogOut size={15} />
                      Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};

export default Header;
