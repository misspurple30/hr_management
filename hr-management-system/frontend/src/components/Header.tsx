import { useState, useEffect } from 'react';
import { FiSearch, FiBell, FiChevronDown, FiMenu } from 'react-icons/fi';
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
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data.data);
    } catch {
      // token invalid or expired
    } finally {
      setLoading(false);
    }
  };

  const getRoleDisplay = (role: string) => {
    const roles: Record<string, string> = {
      ADMIN: 'Administrator',
      HR_MANAGER: 'HR Manager',
      USER: 'Employee',
    };
    return roles[role] || role;
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleSidebar}
            className="lg:hidden p-2 text-gray-600 hover:text-red-600 rounded-lg hover:bg-red-50"
          >
            <FiMenu size={22} />
          </button>

         <div className="flex-1 max-w-md">
  <div className="relative">
    <button className="sm:hidden p-2 rounded-lg text-gray-500 hover:text-red-500 transition">
      <FiSearch size={20} />
    </button>

    <div className="hidden sm:block relative">
      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
      <input
        type="search"
        placeholder="Search"
        className="w-full py-2.5 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
      />
    </div>
  </div>
</div>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Notifications */}
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <FiBell size={22} />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-message-square-more-icon lucide-message-square-more"><path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"/><path d="M12 11h.01"/><path d="M16 11h.01"/><path d="M8 11h.01"/></svg>
          <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

          {/* Profil utilisateur */}
          {loading ? (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="hidden md:block space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-3 cursor-pointer group"
              >
                {/* Avatar */}
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100 group-hover:ring-red-200 transition-all"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center ring-2 ring-gray-100 group-hover:ring-red-200 transition-all">
                    <span className="text-red-600 font-semibold text-sm">
                      {getInitials(user.firstName, user.lastName)}
                    </span>
                  </div>
                )}

                {/* Nom et rôle */}
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-gray-800 group-hover:text-red-600 transition-colors">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {getRoleDisplay(user.role)}
                  </p>
                </div>
                <FiChevronDown 
                  className={`text-gray-400 group-hover:text-red-600 transition-all hidden md:block ${
                    showProfileMenu ? 'rotate-180' : ''
                  }`} 
                  size={18} 
                />
              </button>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-10"
                    onClick={() => setShowProfileMenu(false)}
                  ></div>

                  {/* Menu */}
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-red-50 text-red-600 rounded-full">
                        {getRoleDisplay(user.role)}
                      </span>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        👤 My Profile
                      </button>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-100 pt-2">
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          logout();
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                      >
                        Déconnexion
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-3 text-gray-500">
              <span className="text-sm">Not logged in</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;