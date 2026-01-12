import React, { useState, useRef } from 'react';
import { useEventContext } from '../context/EventContext';
import { Heart, Maximize2, X, Upload } from 'lucide-react';

const Memories = () => {
  const { memories, saveMemory, settings } = useEventContext();
  const [activeCell, setActiveCell] = useState(null); // { index, data }
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

  // Flatten valid indices
  const validIndices = new Set();
  heartPattern.forEach((rowIndices, rowIndex) => {
      rowIndices.forEach(colIndex => {
          validIndices.add(rowIndex * cols + colIndex);
      });
  });

  const handleCellClick = (index) => {
      const memory = memories.find(m => m.index === index);
      if (memory) {
          setActiveCell({ index, ...memory });
          setIsEditing(false);
      } else {
          setActiveCell({ index });
          setIsEditing(true);
      }
  };

  const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
          if (file.size > 2 * 1024 * 1024) {
              alert('图片太大了，请上传2MB以内的图片');
              return;
          }
          const reader = new FileReader();
          reader.onloadend = () => {
              saveMemory(activeCell.index, { image: reader.result });
              setActiveCell(prev => ({ ...prev, image: reader.result }));
          };
          reader.readAsDataURL(file);
      }
  };

  const handleDescriptionChange = (e) => {
      const description = e.target.value;
      setActiveCell(prev => ({ ...prev, description }));
  };
  
  const saveDescription = () => {
      saveMemory(activeCell.index, { description: activeCell.description });
      setIsEditing(false);
  }

  // Generate grid cells
  const renderGrid = () => {
      const cells = [];
      for (let i = 0; i < 11 * 10; i++) {
          if (validIndices.has(i)) {
              const memory = memories.find(m => m.index === i);
              cells.push(
                  <div 
                    key={i}
                    onClick={() => handleCellClick(i)}
                    className={`aspect-square rounded-md overflow-hidden cursor-pointer transition-transform hover:scale-105 shadow-sm border border-white/20 relative ${
                        memory ? '' : 'bg-pink-200/50 hover:bg-pink-300/50'
                    }`}
                  >
                      {memory && memory.image ? (
                          <img src={memory.image} className="w-full h-full object-cover" />
                      ) : (
                          // memory exists but no image? or empty slot
                          !memory && <div className="w-full h-full" />
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
        className="min-h-full flex flex-col items-center py-6 px-2"
        style={settings.memoriesBg ? {
            backgroundImage: `linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.7)), url(${settings.memoriesBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
        } : {
            backgroundImage: 'linear-gradient(to bottom right, #e0f2fe, #fce7f3)'
        }}
    >
        <h1 className="text-xl font-bold text-gray-700 mb-6 flex items-center gap-2">
            <Heart className="text-pink-500 fill-pink-500" /> 一起堆雪人
        </h1>

        <div className="grid grid-cols-11 gap-1 w-full max-w-sm">
            {renderGrid()}
        </div>

        {/* Interaction Area */}
        {activeCell && (
            <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
                {/* Backdrop for click outside */}
                <div className="absolute inset-0 bg-black/20 pointer-events-auto" onClick={() => setActiveCell(null)} />
                
                <div className="bg-white w-full max-w-md p-4 rounded-t-2xl shadow-xl pointer-events-auto animate-slide-up">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-gray-700">回忆碎片</h3>
                        <button onClick={() => setActiveCell(null)} className="p-1"><X size={20} /></button>
                    </div>

                    <div className="flex gap-4">
                        <div 
                            className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center cursor-pointer relative group"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {activeCell.image ? (
                                <>
                                    <img src={activeCell.image} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Upload className="text-white" size={20} />
                                    </div>
                                </>
                            ) : (
                                <Upload className="text-gray-400" />
                            )}
                        </div>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />

                        <div className="flex-1">
                            {isEditing || !activeCell.description ? (
                                <div>
                                    <textarea 
                                        className="w-full bg-gray-50 rounded p-2 text-sm border-none focus:ring-1 focus:ring-pink-300 resize-none h-20" 
                                        placeholder="写下这一刻..."
                                        value={activeCell.description || ''}
                                        onChange={handleDescriptionChange}
                                        onBlur={saveDescription}
                                    />
                                </div>
                            ) : (
                                <div onClick={() => setIsEditing(true)}>
                                    <p className="text-sm text-gray-600 leading-relaxed min-h-[3rem]">
                                        {activeCell.description}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {activeCell.image && (
                         <div className="mt-4 flex justify-end">
                             {/* Mock enlarge functionality - just full screen overlay usually */}
                             <button className="flex items-center gap-1 text-xs text-indigo-600 font-medium" onClick={() => {
                                 // Simple full screen view
                                 const win = window.open("");
                                 win.document.write(`<img src="${activeCell.image}" style="width:100%;height:100%;object-fit:contain;background:black;" />`);
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