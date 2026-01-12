import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Home, PlusCircle, Settings, CalendarDays, Heart } from 'lucide-react';
import { clsx } from 'clsx';

const Layout = () => {
  const location = useLocation();
  const hideNav = location.pathname.startsWith('/event') || location.pathname === '/add';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>

      {!hideNav && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-1 py-3 flex justify-around items-center z-50 safe-area-bottom">
          <NavLink 
            to="/" 
            className={({ isActive }) => clsx("flex flex-col items-center gap-1 w-12", isActive ? "text-indigo-600" : "text-gray-400")}
          >
            <Home size={22} />
            <span className="text-[10px]">首页</span>
          </NavLink>

          <NavLink 
            to="/holidays" 
            className={({ isActive }) => clsx("flex flex-col items-center gap-1 w-12", isActive ? "text-indigo-600" : "text-gray-400")}
          >
            <CalendarDays size={22} />
            <span className="text-[10px]">节假日</span>
          </NavLink>
          
          <NavLink 
            to="/add" 
            className="flex flex-col items-center -mt-8 mx-1"
          >
            <div className="bg-indigo-600 text-white p-3 rounded-full shadow-lg shadow-indigo-200">
              <PlusCircle size={26} />
            </div>
            <span className="text-[10px] text-gray-500 mt-1">添加</span>
          </NavLink>

          <NavLink 
            to="/memories" 
            className={({ isActive }) => clsx("flex flex-col items-center gap-1 w-12", isActive ? "text-indigo-600" : "text-gray-400")}
          >
            <Heart size={22} />
            <span className="text-[10px]">事迹</span>
          </NavLink>

          <NavLink 
            to="/settings" 
            className={({ isActive }) => clsx("flex flex-col items-center gap-1 w-12", isActive ? "text-indigo-600" : "text-gray-400")}
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