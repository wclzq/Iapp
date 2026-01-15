import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useEventContext } from '../context/EventContext';
import { Heart, Maximize2, X, Upload, ChevronLeft, ChevronRight, Edit2 } from 'lucide-react';
import PageBackground from '../components/PageBackground';

const Memories = () => {
  const { memories, saveMemory, settings } = useEventContext();
  const [activeCellIndex, setActiveCellIndex] = useState(null); 
  const [tempDescription, setTempDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState(null);
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

  const safeMemories = useMemo(() => Array.isArray(memories) ? memories : [], [memories]);

  const activeMemory = useMemo(() => {
      if (activeCellIndex === null) return {};
      return safeMemories.find(m => m.index === activeCellIndex) || {};
  }, [activeCellIndex, safeMemories]);

  useEffect(() => {
      if (activeCellIndex !== null) {
          setTempDescription(activeMemory.description || '');
      }
  }, [activeCellIndex, activeMemory.description]);

  const handleTouchStart = (index) => {
      const timer = setTimeout(() => {
          handleLongPress(index);
      }, 600);
      setLongPressTimer(timer);
  }

  const handleTouchEnd = () => {
      if (longPressTimer) clearTimeout(longPressTimer);
  }

  const handleLongPress = (index) => {
      if (longPressTimer) clearTimeout(longPressTimer);
      // Long press triggers edit mode
      setActiveCellIndex(index);
      setIsEditing(true);
  }

  const handleCellClick = (index) => {
      if (longPressTimer) clearTimeout(longPressTimer);
      // Short click
      setActiveCellIndex(index);
      // If empty, go to edit
      const memory = safeMemories.find(m => m.index === index);
      if (!memory || !memory.image) {
          setIsEditing(true);
      } else {
          setIsEditing(false); // View mode
      }
  };

  const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
          if (file.size > 20 * 1024 * 1024) { // 20MB limit
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
        setIsEditing(false); // Switch to view mode after save
      }
  }

  const navigateMemory = (direction) => {
      if (activeCellIndex === null) return;
      
      // Find all filled indices
      const filledIndices = safeMemories.filter(m => m.image && validIndices.has(m.index))
                                        .map(m => m.index)
                                        .sort((a, b) => a - b);
      
      if (filledIndices.length === 0) return;

      const currentPos = filledIndices.indexOf(activeCellIndex);
      let nextIndex;
      
      if (currentPos === -1) {
          // Current cell empty, go to first filled?
          nextIndex = filledIndices[0];
      } else {
          if (direction === 'next') {
              nextIndex = filledIndices[(currentPos + 1) % filledIndices.length];
          } else {
              nextIndex = filledIndices[(currentPos - 1 + filledIndices.length) % filledIndices.length];
          }
      }
      setActiveCellIndex(nextIndex);
      setIsEditing(false);
  }

  // Progress
  const totalSlots = validIndices.size;
  const filledSlots = safeMemories.filter(m => validIndices.has(m.index) && m.image).length;
  const progressPercent = Math.round((filledSlots / totalSlots) * 100);

  const renderGrid = () => {
      const cells = [];
      for (let i = 0; i < 110; i++) {
          if (validIndices.has(i)) {
              const memory = safeMemories.find(m => m.index === i);
              cells.push(
                  <div 
                    key={i}
                    onMouseDown={() => handleTouchStart(i)}
                    onMouseUp={handleTouchEnd}
                    onMouseLeave={handleTouchEnd}
                    onTouchStart={() => handleTouchStart(i)}
                    onTouchEnd={handleTouchEnd}
                    onClick={() => handleCellClick(i)}
                    className={`aspect-square rounded-md overflow-hidden cursor-pointer transition-transform hover:scale-105 shadow-sm border border-white/40 relative ${
                        memory && memory.image ? '' : 'bg-pink-300/60 backdrop-blur-sm'
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
        className="relative flex h-full min-h-full flex-col"
    >
        <PageBackground image={settings.memoriesBg} />
        <div className="px-4 pt-6 pb-3 flex flex-col items-center flex-shrink-0">
        {/* Progress Bar */}
        <div className="w-full max-w-xs">
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

        </div>

        <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-24 flex justify-center flex-shrink">
        <div className="grid grid-cols-11 gap-1 w-full max-w-sm select-none">
            {renderGrid()}
        </div>
        </div>

        {/* Modal */}
        {activeCellIndex !== null && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
                <div className="absolute top-4 right-4 z-50">
                    <button onClick={() => setActiveCellIndex(null)} className="p-2 bg-white/20 rounded-full text-white hover:bg-white/30"><X size={24} /></button>
                </div>

                {!isEditing ? (
                    // View Mode
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 relative" onClick={(e) => e.target === e.currentTarget && setActiveCellIndex(null)}>
                        {/* Navigation Areas */}
                        <div className="absolute left-0 top-0 bottom-0 w-1/4 z-10" onClick={() => navigateMemory('prev')} />
                        <div className="absolute right-0 top-0 bottom-0 w-1/4 z-10" onClick={() => navigateMemory('next')} />

                        <div className="relative max-w-lg w-full aspect-[3/4] flex flex-col items-center justify-center">
                            {activeMemory.image ? (
                                <img src={activeMemory.image} className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl" />
                            ) : (
                                <div className="text-white/50">暂无图片</div>
                            )}
                        </div>
                        
                        <div className="mt-6 text-white text-center max-w-md px-4">
                            <p className="text-lg font-medium leading-relaxed drop-shadow-md">
                                {activeMemory.description || <span className="opacity-50 text-sm">没有描述...</span>}
                            </p>
                        </div>

                        <button 
                            onClick={() => setIsEditing(true)}
                            className="absolute bottom-10 right-10 p-3 bg-white/20 rounded-full text-white backdrop-blur-md hover:bg-white/30 z-20"
                        >
                            <Edit2 size={20} />
                        </button>
                    </div>
                ) : (
                    // Edit Mode
                    <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-2xl m-4 animate-slide-up">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-800 text-lg">编辑回忆</h3>
                            <button onClick={() => setIsEditing(false)} className="text-sm text-gray-500">取消</button>
                        </div>

                        <div className="space-y-4">
                            <div 
                                className="w-full aspect-video bg-gray-100 rounded-xl flex items-center justify-center cursor-pointer relative group overflow-hidden border-2 border-dashed border-gray-300 hover:border-primary"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {activeMemory.image ? (
                                    <>
                                        <img src={activeMemory.image} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-white font-medium flex items-center gap-2"><Upload size={20}/> 更换照片</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center text-gray-400">
                                        <Upload size={32} />
                                        <span className="text-sm mt-2">点击上传照片 (最大20MB)</span>
                                    </div>
                                )}
                            </div>
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                                <textarea 
                                    className="w-full bg-gray-50 rounded-xl p-3 text-sm border-none focus:ring-2 focus:ring-primary/50 resize-none h-32" 
                                    placeholder="写下这一刻的故事..."
                                    value={tempDescription}
                                    onChange={(e) => setTempDescription(e.target.value)}
                                />
                            </div>

                            <button onClick={saveDescription} className="w-full bg-primary text-white py-3 rounded-xl font-bold shadow-lg shadow-primary/30 active:scale-95 transition-transform">
                                保存
                            </button>
                        </div>
                    </div>
                )}
            </div>
        )}
    </div>
  );
};

export default Memories;
