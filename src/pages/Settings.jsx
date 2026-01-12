import React from 'react';
import { useEventContext } from '../context/EventContext';
import { Github, Info, Moon } from 'lucide-react';

const Settings = () => {
  const { settings, updateSettings } = useEventContext();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 mt-2">设置</h1>

      <div className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden">
          <div className="p-4 flex items-center justify-between border-b border-gray-50">
              <span className="text-gray-700">默认显示首页</span>
              <div 
                  className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${settings.defaultHome ? 'bg-indigo-600' : 'bg-gray-300'}`}
                  onClick={() => updateSettings({ defaultHome: !settings.defaultHome })}
              >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${settings.defaultHome ? 'translate-x-6' : 'translate-x-0'}`} />
              </div>
          </div>
          {/* Add more settings here later */}
      </div>

      <div className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden">
          <div className="p-4 flex items-center gap-3 border-b border-gray-50">
              <Info className="text-gray-400" size={20} />
              <div>
                  <h3 className="text-gray-700">关于</h3>
                  <p className="text-xs text-gray-400">Moment Countdown v1.0.0</p>
              </div>
          </div>
      </div>
      
      <p className="text-center text-xs text-gray-300 mt-10">
          Made with ❤️ by Antigravity
      </p>
    </div>
  );
};

export default Settings;