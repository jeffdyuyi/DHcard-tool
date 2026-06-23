import React, { useState } from 'react';
import { ChevronLeft, Library, Sun, Moon, Filter, ArrowRight } from 'lucide-react';
import { CardType, LibraryItem } from '../types';
import { TOOL_CONFIG } from '../constants';
import { TOOL_ICONS } from '../icons';

interface Props {
  library: LibraryItem[];
  isDark: boolean;
  onToggleTheme: () => void;
  onGoHome: () => void;
  onSelectLibItem: (item: LibraryItem) => void;
}

const LibraryView: React.FC<Props> = ({ library, isDark, onToggleTheme, onGoHome, onSelectLibItem }) => {
  const [libFilter, setLibFilter] = useState<CardType | 'all'>('all'); 
  
  // Explicitly type libraryTypes to avoid inference issues (unknown[])
  const libraryTypes = Array.from(new Set(library.map(item => item.data.type))) as CardType[];
  
  const typeCounts = library.reduce((acc, item) => {
    acc[item.data.type] = (acc[item.data.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const filteredLibrary = library
    .filter(item => {
      if (libFilter === 'all') return true;
      return item.data.type === libFilter;
    })
    .sort((a, b) => b.updatedAt - a.updatedAt); 

  return (
    <div className="min-h-screen bg-paper-50 dark:bg-zinc-950 transition-colors duration-500 flex flex-col">
         <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-slate-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-20">
             <div className="flex items-center gap-4">
                <button onClick={onGoHome} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors">
                   <ChevronLeft size={24} className="text-slate-600 dark:text-zinc-400" />
                </button>
                <div className="flex items-center gap-2">
                   <Library size={24} className="text-blue-900 dark:text-amber-500" />
                   <h1 className="text-xl font-serif font-bold text-slate-800 dark:text-zinc-200">
                     本地库
                   </h1>
                </div>
             </div>
             <button onClick={onToggleTheme} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-400">
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
             </button>
         </header>

         <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
            <div className="mb-8 overflow-x-auto pb-4 no-scrollbar">
               <div className="flex gap-2">
                 <button onClick={() => setLibFilter('all')} className={`px-4 py-2 rounded-full font-bold transition-all border flex items-center gap-2 ${libFilter === 'all' ? 'bg-slate-800 text-white border-slate-800 dark:bg-amber-600 dark:text-white dark:border-amber-600 shadow-md' : 'bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800'}`}>
                    全部 <span className="ml-1 opacity-70 text-xs bg-black/20 px-1.5 rounded-full">{library.length}</span>
                 </button>
                 {libraryTypes.map(type => (
                    <button key={type} onClick={() => setLibFilter(type)} className={`px-4 py-2 rounded-full font-bold transition-all border flex items-center gap-2 ${libFilter === type ? 'bg-slate-800 text-white border-slate-800 dark:bg-amber-600 dark:text-white dark:border-amber-600 shadow-md' : 'bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800'}`}>
                       <span className={`${libFilter === type ? 'text-white' : TOOL_CONFIG[type].color}`}>{React.cloneElement(TOOL_ICONS[type] as React.ReactElement, { size: 16 })}</span>
                       {TOOL_CONFIG[type].label}
                       <span className="ml-1 opacity-70 text-xs bg-black/20 px-1.5 rounded-full">{typeCounts[type]}</span>
                    </button>
                 ))}
               </div>
            </div>

            {filteredLibrary.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-zinc-600">
                  <div className="p-6 rounded-full bg-slate-100 dark:bg-zinc-900 mb-4">
                     <Filter size={48} className="opacity-50" />
                  </div>
                  <h3 className="text-lg font-bold">暂无内容</h3>
                  <p className="text-sm">该分类下没有保存的卡牌</p>
               </div>
            ) : (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-500">
                  {filteredLibrary.map(item => (
                     <div key={item.id} onClick={() => onSelectLibItem(item)} className="group bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-[180px]">
                        <div className="p-4 flex gap-4 items-start border-b border-slate-100 dark:border-zinc-800/50">
                            <div className={`p-3 rounded-lg bg-slate-50 dark:bg-zinc-800 ${TOOL_CONFIG[item.data.type].color} ring-1 ring-slate-200 dark:ring-zinc-700`}>
                                {React.cloneElement(TOOL_ICONS[item.data.type] as React.ReactElement, { size: 28 })}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-lg text-slate-800 dark:text-zinc-200 truncate">{item.data.name}</h3>
                                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-500">
                                    {TOOL_CONFIG[item.data.type].label}
                                </span>
                            </div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col justify-between">
                            <p className="text-sm text-slate-500 dark:text-zinc-500 line-clamp-2 italic">
                                "{item.data.description || '无描述'}"
                            </p>
                            <div className="flex justify-between items-center text-xs text-slate-400 dark:text-zinc-600 mt-2">
                                <span>{new Date(item.updatedAt).toLocaleDateString()}</span>
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 dark:text-amber-500 font-bold flex items-center gap-1">
                                    点击查看详情 <ArrowRight size={12} />
                                </span>
                            </div>
                        </div>
                     </div>
                  ))}
               </div>
            )}
         </main>
    </div>
  );
};
export default LibraryView;