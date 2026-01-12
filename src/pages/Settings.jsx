import React, { useRef } from 'react';
import { useEventContext } from '../context/EventContext';
import { Info, Image as ImageIcon, X } from 'lucide-react';

const Settings = () => {
  const { settings, updateSettings } = useEventContext();
  const homeBgRef = useRef(null);
  const holidaysBgRef = useRef(null);
  const memoriesBgRef = useRef(null);

  const handleImageUpload = (e, key) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
          alert('图片大小不能超过 2MB');
          return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        updateSettings({ [key]: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (key) => {
      updateSettings({ [key]: '' });
  };

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
      </div>

      <h2 className="text-sm font-bold text-gray-500 mb-2 px-1">自定义背景</h2>
      <div className="bg-white rounded-xl shadow-sm mb-4 p-4 space-y-4">
          
          {/* Home Background */}
          <div>
              <label className="block text-sm text-gray-700 mb-2">首页背景</label>
              {settings.homeBg ? (
                 <div className="relative w-full h-32 rounded-lg overflow-hidden group">
                     <img src={settings.homeBg} alt="Home Background" className="w-full h-full object-cover" />
                     <button 
                        onClick={() => removeImage('homeBg')}
                        className="absolute top-2 right-2 bg-black/50 p-1 rounded-full text-white"
                     >
                         <X size={16} />
                     </button>
                 </div>
              ) : (
                 <div 
                    onClick={() => homeBgRef.current?.click()}
                    className="w-full h-24 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-indigo-400 hover:text-indigo-500 transition-colors"
                 >
                     <ImageIcon size={24} />
                     <span className="text-xs mt-1">点击上传</span>
                 </div>
              )}
              <input 
                type="file" 
                ref={homeBgRef} 
                className="hidden" 
                accept="image/*" 
                onChange={(e) => handleImageUpload(e, 'homeBg')} 
              />
          </div>

          {/* Holidays Background */}
          <div>
              <label className="block text-sm text-gray-700 mb-2">节假日页背景</label>
              {settings.holidaysBg ? (
                 <div className="relative w-full h-32 rounded-lg overflow-hidden group">
                     <img src={settings.holidaysBg} alt="Holidays Background" className="w-full h-full object-cover" />
                     <button 
                        onClick={() => removeImage('holidaysBg')}
                        className="absolute top-2 right-2 bg-black/50 p-1 rounded-full text-white"
                     >
                         <X size={16} />
                     </button>
                 </div>
              ) : (
                 <div 
                    onClick={() => holidaysBgRef.current?.click()}
                    className="w-full h-24 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-indigo-400 hover:text-indigo-500 transition-colors"
                 >
                     <ImageIcon size={24} />
                     <span className="text-xs mt-1">点击上传</span>
                 </div>
              )}
              <input 
                type="file" 
                ref={holidaysBgRef} 
                className="hidden" 
                accept="image/*" 
                onChange={(e) => handleImageUpload(e, 'holidaysBg')} 
              />
          </div>

          {/* Memories Background */}
          <div>
              <label className="block text-sm text-gray-700 mb-2">事迹页背景</label>
              {settings.memoriesBg ? (
                 <div className="relative w-full h-32 rounded-lg overflow-hidden group">
                     <img src={settings.memoriesBg} alt="Memories Background" className="w-full h-full object-cover" />
                     <button 
                        onClick={() => removeImage('memoriesBg')}
                        className="absolute top-2 right-2 bg-black/50 p-1 rounded-full text-white"
                     >
                         <X size={16} />
                     </button>
                 </div>
              ) : (
                 <div 
                    onClick={() => memoriesBgRef.current?.click()}
                    className="w-full h-24 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-indigo-400 hover:text-indigo-500 transition-colors"
                 >
                     <ImageIcon size={24} />
                     <span className="text-xs mt-1">点击上传</span>
                 </div>
              )}
              <input 
                type="file" 
                ref={memoriesBgRef} 
                className="hidden" 
                accept="image/*" 
                onChange={(e) => handleImageUpload(e, 'memoriesBg')} 
              />
          </div>

      </div>

      <div className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden">
          <div className="p-4 flex items-center gap-3 border-b border-gray-50">
              <Info className="text-gray-400" size={20} />
              <div>
                  <h3 className="text-gray-700">关于</h3>
                  <p className="text-xs text-gray-400">Moment Countdown v1.2.0</p>
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