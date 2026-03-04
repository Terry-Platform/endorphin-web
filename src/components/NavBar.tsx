import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { ProjectSwitcher } from './ProjectSwitcher';

const navItems = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/stores', label: 'Winkels' },
  { path: '/referral', label: 'Referral' },
  { path: '/summary', label: 'Overzicht' },
];

export function NavBar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="font-bold text-lg">Terry</span>
            <ProjectSwitcher />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">{user?.name || user?.email}</span>
            <button
              onClick={logout}
              className="text-sm text-red-600 hover:underline"
            >
              Uitloggen
            </button>
          </div>
        </div>

        <div className="flex gap-1 overflow-x-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                location.pathname === item.path
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
