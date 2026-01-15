import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Home, PlusCircle, Settings, CalendarDays, Heart } from 'lucide-react';
import { clsx } from 'clsx';

const Layout = () => {
  const location = useLocation();
  const hideNav = location.pathname.startsWith('/event') || location.pathname === '/add' || location.pathname.startsWith('/edit');

  return (
    <div className="min-h-screen bg-page flex flex-col transition-colors duration-300">
      <main className="flex-1 min-h-0 overflow-hidden">
        <Outlet />
      </main>

      {!hideNav && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-100 px-1 py-3 flex justify-around items-center z-50 safe-area-bottom shadow-2xl">
          <NavLink
            to="/"
            className={({ isActive }) => clsx(
              "flex flex-col items-center gap-1 w-12 transition-all duration-200",
              isActive ? "text-primary scale-110" : "text-gray-400"
            )}
          >
            <Home size={22} />
            <span className="text-[10px]">首页</span>
          </NavLink>

          <NavLink
            to="/holidays"
            className={({ isActive }) => clsx(
              "flex flex-col items-center gap-1 w-12 transition-all duration-200",
              isActive ? "text-primary scale-110" : "text-gray-400"
            )}
          >
            <CalendarDays size={22} />
            <span className="text-[10px]">节假日</span>
          </NavLink>

          <NavLink
            to="/add"
            className="flex flex-col items-center -mt-8 mx-1"
          >
            <div className="bg-gradient-to-br from-primary to-primary-600 text-white p-3.5 rounded-full shadow-2xl active:scale-95 transition-transform duration-200">
              <PlusCircle size={28} strokeWidth={2.5} />
            </div>
            <span className="text-[10px] text-gray-500 mt-1">添加</span>
          </NavLink>

          <NavLink
            to="/memories"
            className={({ isActive }) => clsx(
              "flex flex-col items-center gap-1 w-12 transition-all duration-200",
              isActive ? "text-primary scale-110" : "text-gray-400"
            )}
          >
            <Heart size={22} />
            <span className="text-[10px]">事迹</span>
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) => clsx(
              "flex flex-col items-center gap-1 w-12 transition-all duration-200",
              isActive ? "text-primary scale-110" : "text-gray-400"
            )}
          >
            <Settings size={22} />
            <span className="text-[10px]">设置</span>
          </NavLink>
        </nav>
      )}
    </div>
  );
};

export default Layout;
