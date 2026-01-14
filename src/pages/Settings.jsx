import React, { useRef } from 'react';
import { useEventContext } from '../context/EventContext';
import { Info, Image as ImageIcon, X, Palette } from 'lucide-react';

const Settings = () => {
  const { settings, updateSettings } = useEventContext();
  const homeBgRef = useRef(null);
  const holidaysBgRef = useRef(null);
  const memoriesBgRef = useRef(null);

  const handleImageUpload = (e, key) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 20* 1024 * 1024) {
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
  
  const themes = [
      { id: 'rose', name: '浪漫粉', color: '#ec4899' },
      { id: 'blue', name: '天空蓝', color: '#3b82f6' },
      { id: 'green', name: '清新绿', color: '#22c55e' },
      { id: 'purple', name: '梦幻紫', color: '#a855f7' },
      { id: 'amber', name: '温暖黄', color: '#f59e0b' },
  ];

  return (
    <div className="relative flex h-full min-h-full flex-col">
      <div className="px-4 pt-6 pb-3 flex-shrink-0">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 mt-1">设置</h1>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-24 flex-shrink">

      {/* Theme Switcher */}
      <h2 className="text-sm font-bold text-gray-500 mb-2 px-1">主题颜色</h2>
      <div className="bg-white rounded-xl shadow-sm mb-6 p-4">
          <div className="flex gap-3 overflow-x-auto pb-1">
              {themes.map(t => (
                  <button
                    key={t.id}
                    onClick={() => updateSettings({ theme: t.id })}
                    className={`flex flex-col items-center gap-1 min-w-[60px] p-2 rounded-lg transition-all ${settings.theme === t.id ? 'bg-gray-100 ring-2 ring-offset-2 ring-gray-300' : 'hover:bg-gray-50'}`}
                  >
                      <div className="w-8 h-8 rounded-full shadow-sm" style={{ backgroundColor: t.color }} />
                      <span className="text-xs text-gray-600">{t.name}</span>
                  </button>
              ))}
          </div>
      </div>

      <h2 className="text-sm font-bold text-gray-500 mb-2 px-1">常规</h2>
      <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
          <div className="p-4 flex items-center justify-between border-b border-gray-50">
              <span className="text-gray-700">默认显示首页</span>
              <div 
                  className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${settings.defaultHome ? 'bg-primary' : 'bg-gray-300'}`}
                  onClick={() => updateSettings({ defaultHome: !settings.defaultHome })}
              >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${settings.defaultHome ? 'translate-x-6' : 'translate-x-0'}`} />
              </div>
          </div>
      </div>

      <h2 className="text-sm font-bold text-gray-500 mb-2 px-1">自定义背景</h2>
      <div className="bg-white rounded-xl shadow-sm mb-6 p-4 space-y-4">
          
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
                    className="w-full h-24 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-primary-400 hover:text-primary transition-colors"
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
                    className="w-full h-24 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-primary-400 hover:text-primary transition-colors"
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
                    className="w-full h-24 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-primary-400 hover:text-primary transition-colors"
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
                  <p className="text-xs text-gray-400">记录 v1.3.0</p>
              </div>
          </div>
      </div>
      
      <p className="text-center text-xs text-gray-300 mt-10">
          Made with ❤️ by wangchaolei
      </p>
      </div>
    </div>
  );
};

export default Settings;
