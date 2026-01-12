import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useEventContext } from '../context/EventContext';
import { Heart, Maximize2, X, Upload } from 'lucide-react';

const Memories = () => {
  const { memories, saveMemory, settings } = useEventContext();
  const [activeCellIndex, setActiveCellIndex] = useState(null); 
  const [tempDescription, setTempDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);
  
  // Grid config
  const cols = 11;
  const heartPattern = [
    [2,3, 7,8],
    [1,2,3,4, 6,7,8,9],
    [0,1,2,3,4,5,6,7,8,9,10],
    [0,1,2,3,4,5,6,7,8,9,10],
    [0,1,2,3,4,5,6,7,8,9,10],
    [1,2,3,4,5,6,7,8,9],
    [2,3,4,5,6,7,8],
    [3,4,5,6,7],
    [4,5,6],
    [5]
  ];

  const validIndices = useMemo(() => {
    const set = new Set();
    heartPattern.forEach((rowIndices, rowIndex) => {
        rowIndices.forEach(colIndex => {
            set.add(rowIndex * cols + colIndex);
        });
    });
    return set;
  }, []);

  // Ensure memories is an array (fallback)
  const safeMemories = useMemo(() => Array.isArray(memories) ? memories : [], [memories]);

  // Derived state for the active cell's data from context
  const activeMemory = useMemo(() => {
      if (activeCellIndex === null) return {};
      return safeMemories.find(m => m.index === activeCellIndex) || {};
  }, [activeCellIndex, safeMemories]);

  // When opening a cell, sync tempDescription
  useEffect(() => {
      if (activeCellIndex !== null) {
          setTempDescription(activeMemory.description || '');
          if (!activeMemory.description) {
              setIsEditing(true);
          } else {
              setIsEditing(false);
          }
      }
  }, [activeCellIndex, activeMemory.description]);

  const handleCellClick = (index) => {
      setActiveCellIndex(index);
  };

  const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
          if (file.size > 20* 1024 * 1024) {
              alert('图片太大了，请上传20MB以内的图片');
              return;
          }
          const reader = new FileReader();
          reader.onloadend = () => {
              saveMemory(activeCellIndex, { image: reader.result });
          };
          reader.readAsDataURL(file);
      }
  };
  
  const saveDescription = () => {
      if (activeCellIndex !== null) {
        saveMemory(activeCellIndex, { description: tempDescription });
        setIsEditing(false);
      }
  }

  // Progress
  const totalSlots = validIndices.size;
  const filledSlots = safeMemories.filter(m => validIndices.has(m.index) && m.image).length;
  const progressPercent = Math.round((filledSlots / totalSlots) * 100);

  // Generate grid cells
  const renderGrid = () => {
      const cells = [];
      // 11 cols * 10 rows
      for (let i = 0; i < 110; i++) {
          if (validIndices.has(i)) {
              const memory = safeMemories.find(m => m.index === i);
              cells.push(
                  <div 
                    key={i}
                    onClick={() => handleCellClick(i)}
                    className={`aspect-square rounded-md overflow-hidden cursor-pointer transition-transform hover:scale-105 shadow-sm border border-white/40 relative ${
                        memory && memory.image ? '' : 'bg-primary-200/40 hover:bg-primary-300/40 backdrop-blur-sm'
                    }`}
                  >
                      {memory && memory.image ? (
                          <img src={memory.image} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                           <div className="w-full h-full" />
                      )}
                  </div>
              );
          } else {
              cells.push(<div key={i} className="aspect-square" />);
          }
      }
      return cells;
  };

  return (
    <div 
        className="min-h-full flex flex-col items-center py-6 px-4 pb-24"
        style={settings.memoriesBg ? {
            backgroundImage: `linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.7)), url(${settings.memoriesBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
        } : {}}
    >
        {/* Progress Bar */}
        <div className="w-full max-w-xs mb-8">
            <div className="flex justify-between text-xs text-primary mb-1 font-medium">
                <span>我们的一点一滴</span>
                <span>{filledSlots}/{totalSlots}</span>
            </div>
            <div className="w-full bg-white/50 rounded-full h-2.5 backdrop-blur-sm overflow-hidden border border-white/50">
                <div 
                    className="bg-primary h-2.5 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${progressPercent}%` }}
                />
            </div>
        </div>

        <div className="grid grid-cols-11 gap-1 w-full max-w-sm">
            {renderGrid()}
        </div>

        {/* Interaction Area (Modal) */}
        {activeCellIndex !== null && (
            <div className="fixed inset-0 z-50 flex items-end justify-center">
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] transition-opacity" onClick={() => setActiveCellIndex(null)} />
                
                <div className="bg-white w-full max-w-md p-5 rounded-t-3xl shadow-2xl z-10 animate-slide-up transform transition-transform">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-gray-700 text-lg">回忆碎片</h3>
                        <button onClick={() => setActiveCellIndex(null)} className="p-1 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200"><X size={20} /></button>
                    </div>

                    <div className="flex gap-4">
                        <div 
                            className="w-28 h-28 bg-gray-50 rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center cursor-pointer relative group border border-gray-100 shadow-inner"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {activeMemory.image ? (
                                <>
                                    <img src={activeMemory.image} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Upload className="text-white" size={24} />
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center text-gray-300">
                                    <Upload size={24} />
                                    <span className="text-[10px] mt-1">上传照片</span>
                                </div>
                            )}
                        </div>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />

                        <div className="flex-1 flex flex-col">
                            {isEditing ? (
                                <div className="flex-1 flex flex-col">
                                    <textarea 
                                        className="w-full bg-gray-50 rounded-lg p-3 text-sm border border-gray-100 focus:ring-2 focus:ring-primary-200 focus:border-primary outline-none resize-none flex-1 transition-all" 
                                        placeholder="记录下这一刻的美好..."
                                        value={tempDescription}
                                        onChange={(e) => setTempDescription(e.target.value)}
                                        onBlur={saveDescription}
                                        autoFocus
                                    />
                                    <div className="text-right mt-1">
                                        <button onClick={saveDescription} className="text-xs text-white bg-primary px-3 py-1 rounded-full shadow-sm">完成</button>
                                    </div>
                                </div>
                            ) : (
                                <div 
                                    onClick={() => setIsEditing(true)} 
                                    className="flex-1 cursor-text"
                                >
                                    {tempDescription ? (
                                        <p className="text-sm text-gray-700 leading-relaxed">
                                            {tempDescription}
                                        </p>
                                    ) : (
                                        <p className="text-sm text-gray-400 italic">点击添加描述...</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {activeMemory.image && (
                         <div className="mt-5 flex justify-end border-t border-gray-50 pt-3">
                             <button className="flex items-center gap-1.5 text-xs text-primary font-medium bg-primary-50 px-3 py-1.5 rounded-full" onClick={() => {
                                 const win = window.open("");
                                 win.document.write(`<body style="margin:0;background:black;display:flex;align-items:center;justify-content:center;height:100vh;"><img src="${activeMemory.image}" style="max-width:100%;max-height:100%;object-fit:contain;" /></body>`);
                             }}>
                                 <Maximize2 size={14} /> 查看大图
                             </button>
                         </div>
                    )}
                </div>
            </div>
        )}
    </div>
  );
};

export default Memories;