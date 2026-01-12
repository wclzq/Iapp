import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEventContext } from '../context/EventContext';
import { ChevronLeft, Image as ImageIcon, X } from 'lucide-react';
import { Solar } from 'lunar-javascript';

const AddEditEvent = () => {
  const navigate = useNavigate();
  const { addEvent } = useEventContext();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    isLunar: false,
    type: 'birthday',
    repeat: 'none',
    backgroundImage: '',
    topSticky: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
          alert('图片大小不能超过 20MB');
          return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, backgroundImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removeImage = () => {
      setFormData(prev => ({ ...prev, backgroundImage: '' }));
      if(fileInputRef.current) fileInputRef.current.value = '';
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title) {
        alert('请输入标题');
        return;
    }
    
    addEvent(formData);
    navigate('/');
  };

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 flex items-center border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="p-1">
          <ChevronLeft size={24} />
        </button>
        <h1 className="flex-1 text-center font-bold text-lg">添加倒数日</h1>
        <button onClick={handleSubmit} className="text-indigo-600 font-bold text-sm px-2">
          保存
        </button>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="例如：Ta的生日"
              className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-100 outline-none"
            />
          </div>

          {/* Date & Lunar Toggle */}
          <div>
            <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-gray-700">日期</label>
                <div className="flex items-center gap-2">
                    <span className={`text-xs ${!formData.isLunar ? 'text-indigo-600 font-bold' : 'text-gray-400'}`}>公历</span>
                    <div 
                        className={`w-10 h-5 rounded-full p-1 cursor-pointer transition-colors ${formData.isLunar ? 'bg-indigo-600' : 'bg-gray-300'}`}
                        onClick={() => setFormData(p => ({...p, isLunar: !p.isLunar}))}
                    >
                        <div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${formData.isLunar ? 'translate-x-5' : 'translate-x-0'}`} />
                    </div>
                    <span className={`text-xs ${formData.isLunar ? 'text-indigo-600 font-bold' : 'text-gray-400'}`}>农历</span>
                </div>
            </div>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-3 bg-gray-50 rounded-xl border-none outline-none"
            />
            {formData.isLunar && (
                <p className="text-xs text-orange-500 mt-1">
                    * 请选择对应的公历日期，系统会自动转换为农历
                </p>
            )}
          </div>

          {/* Category */}
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">分类</label>
             <div className="flex gap-2">
                {['birthday', 'anniversary', 'holiday', 'other'].map(type => (
                    <button
                        key={type}
                        type="button"
                        onClick={() => setFormData(p => ({...p, type}))}
                        className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${
                            formData.type === type 
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                            : 'bg-gray-100 text-gray-500'
                        }`}
                    >
                        {type === 'birthday' && '生日'}
                        {type === 'anniversary' && '纪念日'}
                        {type === 'holiday' && '节假日'}
                        {type === 'other' && '其他'}
                    </button>
                ))}
             </div>
          </div>
          
          {/* Repeat */}
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">重复</label>
             <div className="flex gap-2">
                {['none', 'yearly', 'monthly'].map(repeat => (
                    <button
                        key={repeat}
                        type="button"
                        onClick={() => setFormData(p => ({...p, repeat}))}
                        className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${
                            formData.repeat === repeat 
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                            : 'bg-gray-100 text-gray-500'
                        }`}
                    >
                        {repeat === 'none' && '不重复'}
                        {repeat === 'yearly' && '每年'}
                        {repeat === 'monthly' && '每月'}
                    </button>
                ))}
             </div>
          </div>

          {/* Background Image */}
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">背景图片</label>
             
             {formData.backgroundImage ? (
                 <div className="relative w-full h-40 rounded-xl overflow-hidden group">
                     <img src={formData.backgroundImage} alt="Background" className="w-full h-full object-cover" />
                     <button 
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-black/50 p-1 rounded-full text-white"
                     >
                         <X size={16} />
                     </button>
                 </div>
             ) : (
                 <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-indigo-400 hover:text-indigo-500 transition-colors"
                 >
                     <ImageIcon size={32} />
                     <span className="text-xs mt-2">点击上传图片 (最大2MB)</span>
                 </div>
             )}
             <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageUpload} 
             />
          </div>
          
          {/* Sticky */}
          <div className="flex items-center gap-3 pt-2">
              <div 
                  className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${formData.topSticky ? 'bg-indigo-600' : 'bg-gray-300'}`}
                  onClick={() => setFormData(p => ({...p, topSticky: !p.topSticky}))}
              >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${formData.topSticky ? 'translate-x-6' : 'translate-x-0'}`} />
              </div>
              <span className="text-sm font-medium text-gray-700">置顶</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AddEditEvent;