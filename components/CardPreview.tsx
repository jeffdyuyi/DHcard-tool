
import React from 'react';
import { CardData, CardType, WeaponData, ArmorData, NpcData, ClassData, DomainData, SubclassData, AncestryData, CommunityData, StoryData, LootData, ConsumableData, CalamityData, IngredientData, MealData, TransformationData, MaterialData, VehicleData, MadnessData, ClueData, ProphecyData, QuestionData, QuestData, SubWeaponData, WheelchairData } from '../types';
import { Markdown, parseInline } from './Markdown';

interface Props {
  data: CardData;
  elementId?: string; // Optional custom ID for the wrapper
}

// --- Styled Components ---

const Wrapper = ({ children, className = "", id }: { children?: React.ReactNode; className?: string; id?: string }) => (
  <div 
    id={id || "card-preview"}
    className={`relative w-[400px] min-h-[560px] flex flex-col p-6 overflow-hidden transition-colors duration-300
      bg-white text-slate-900 border-[6px] border-double border-slate-800
      dark:bg-zinc-950 dark:text-zinc-200 dark:border-amber-700/60 dark:shadow-2xl
      ${className}`}
    style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
  >
    {/* 
      FIX: Replaced external texture URLs with inline SVG Data URIs.
      This solves the CORS (Cross-Origin) issue that prevents html2canvas from working on GitHub Pages.
    */}
    
    {/* Noise Texture (Universal) */}
    <div 
      className="absolute inset-0 pointer-events-none opacity-10 dark:opacity-5 mix-blend-overlay"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
      }}
    ></div>

    {/* Gradient Overlay for Dark Mode */}
    <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black opacity-0 dark:opacity-90 z-0"></div>
    
    {/* Decorative Corners */}
    <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-slate-900 dark:border-amber-600/50 z-10"></div>
    <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-slate-900 dark:border-amber-600/50 z-10"></div>
    <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-slate-900 dark:border-amber-600/50 z-10"></div>
    <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-slate-900 dark:border-amber-600/50 z-10"></div>

    <div className="relative z-10 flex-grow flex flex-col">
      {children}
    </div>
  </div>
);

const Header = ({ title, subtitle, type }: { title: string, subtitle?: string, type: string }) => (
  <div className="border-b-2 border-slate-800/20 dark:border-amber-800/50 pb-3 mb-4">
    <div className="flex justify-between items-baseline">
      <h2 className="text-2xl font-serif font-bold text-blue-900 dark:text-amber-500 tracking-wide whitespace-pre-wrap">{title}</h2>
      <span className="text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-500 font-serif ml-2 shrink-0">{type}</span>
    </div>
    {subtitle && <div className="text-sm text-slate-600 dark:text-zinc-400 italic font-serif mt-1">{subtitle}</div>}
  </div>
);

const Section = ({ title, children }: { title?: string, children?: React.ReactNode }) => (
  <div className="mb-4 last:mb-0">
    {title && <h3 className="text-red-800 dark:text-amber-700/80 text-xs font-bold uppercase tracking-wider mb-1">{title}</h3>}
    <div className="text-sm leading-relaxed text-slate-800 dark:text-zinc-300 whitespace-pre-wrap">{children}</div>
  </div>
);

const KeyValue = ({ label, value, full = false }: { label: string, value: string, full?: boolean }) => (
  <div className={`flex flex-col bg-slate-50 dark:bg-zinc-900/50 p-2 rounded border border-slate-200 dark:border-zinc-800 ${full ? 'w-full' : ''}`}>
    <span className="text-xs text-slate-500 dark:text-zinc-500 uppercase">{label}</span>
    <span className="font-medium text-slate-900 dark:text-amber-100/90 whitespace-pre-wrap">{value}</span>
  </div>
);

const StatBox = ({ label, value, colorClass = "text-blue-800 dark:text-amber-500" }: { label: string, value: string, colorClass?: string }) => (
  <div className="flex-1 flex flex-col items-center p-2 bg-slate-50 dark:bg-zinc-900 rounded border border-slate-200 dark:border-zinc-800 shadow-sm">
    <span className="text-[10px] text-slate-500 dark:text-zinc-500 uppercase mb-1 tracking-wide">{label}</span>
    <span className={`text-xl font-bold ${colorClass}`}>{value}</span>
  </div>
);

const Footer = ({ creator, owner }: { creator: string, owner: string }) => (
  <div className="mt-4 pt-2 border-t border-slate-200 dark:border-zinc-800 flex justify-between items-center text-[10px] text-slate-400 dark:text-zinc-600 uppercase font-serif tracking-widest">
    <span>Designed by {creator || 'Unknown'}</span>
    <span>{owner || 'Unassigned'}</span>
  </div>
);

// --- Main Component ---

const CardPreview: React.FC<Props> = ({ data, elementId }) => {

  const renderContent = () => {
    switch (data.type) {
      case CardType.WEAPON:
      case CardType.SUB_WEAPON: {
        const d = data as WeaponData;
        return (
          <>
            <Header title={d.name} type={d.type === CardType.SUB_WEAPON ? "副武器" : "武器"} />
            <div className="grid grid-cols-2 gap-2 mb-4">
              <KeyValue label="属性" value={d.trait} />
              <KeyValue label="距离" value={d.range} />
              <KeyValue label="伤害" value={`${d.damage} (${d.damageType})`} />
              <KeyValue label="负荷" value={d.burden} />
            </div>
            <Section title="特性">
              <Markdown text={d.feature} className="font-medium text-slate-900 dark:text-amber-200/90" />
            </Section>
            <div className="mt-auto pt-4 border-t border-slate-200 dark:border-zinc-800/50">
              <Section>
                <Markdown text={d.description} className="italic text-slate-500 dark:text-zinc-500" />
              </Section>
            </div>
          </>
        );
      }
      case CardType.ARMOR: {
        const d = data as ArmorData;
        return (
          <>
            <Header title={d.name} type="护甲" />
            <div className="flex gap-4 mb-6 justify-center">
              <div className="flex flex-col items-center p-3 bg-slate-50 dark:bg-zinc-900 rounded border border-slate-200 dark:border-amber-900/30 min-w-[80px] shadow-sm">
                <span className="text-3xl font-bold text-blue-800 dark:text-amber-500">{d.score}</span>
                <span className="text-xs text-slate-500 dark:text-zinc-500 mt-1">护甲值</span>
              </div>
              <div className="flex flex-col gap-2 justify-center">
                 <div className="px-3 py-1 bg-slate-100 dark:bg-zinc-800 rounded text-xs border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 flex justify-between min-w-[100px]">
                    <span>重度阈值</span> <span className="text-blue-900 dark:text-amber-200 font-bold ml-2">{d.majorThreshold}</span>
                 </div>
                 <div className="px-3 py-1 bg-slate-100 dark:bg-zinc-800 rounded text-xs border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 flex justify-between min-w-[100px]">
                    <span>严重阈值</span> <span className="text-red-800 dark:text-red-200 font-bold ml-2">{d.severeThreshold}</span>
                 </div>
              </div>
            </div>
            <Section title="特性">
              <Markdown text={d.feature} className="font-medium text-slate-900 dark:text-amber-200/90" />
            </Section>
            <div className="mt-auto pt-4">
              <Section>
                <Markdown text={d.description} className="italic text-slate-500 dark:text-zinc-500" />
              </Section>
            </div>
          </>
        );
      }
      case CardType.NPC: {
        const d = data as NpcData;
        return (
          <>
            <Header title={d.name} subtitle={d.motive ? `动机: ${d.motive}` : undefined} type="NPC" />
            <div className="grid grid-cols-1 mb-4">
              <KeyValue label="难度" value={d.difficulty} />
            </div>
            <div className="space-y-4 mb-4">
              {d.features.map((f, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-zinc-900/40 p-3 rounded border border-slate-200 dark:border-zinc-800/50">
                  <div className="mb-2 border-b border-slate-200 dark:border-zinc-800 pb-1">
                    <span className="font-bold text-blue-900 dark:text-amber-400 text-base">{f.name}</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    {f.choice && (
                        <div className="text-slate-700 dark:text-zinc-300">
                            <strong className="text-slate-900 dark:text-zinc-400">选择: </strong>
                            {parseInline(f.choice)}
                        </div>
                    )}
                    <div className="text-slate-700 dark:text-zinc-300">
                         <strong className="text-slate-900 dark:text-zinc-400">触发: </strong>
                        {parseInline(f.trigger)}
                    </div>
                    <div className="text-slate-700 dark:text-zinc-300">
                        <strong className="text-slate-900 dark:text-zinc-400">效果: </strong>
                        {parseInline(f.effect)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-auto">
               <Markdown text={d.description} className="italic text-slate-500 dark:text-zinc-500 text-sm border-t border-slate-200 dark:border-zinc-800 pt-2" />
            </div>
          </>
        );
      }
      case CardType.CLASS: {
        const d = data as ClassData;
        return (
          <>
            <Header title={d.name} type="职业" />
            <div className="flex gap-4 mb-6">
              <StatBox label="基础闪避" value={d.evasion} />
              <StatBox label="基础 HP" value={d.hp} colorClass="text-red-700 dark:text-red-400" />
              {d.spellcastingAttribute && <StatBox label="施法属性" value={d.spellcastingAttribute} colorClass="text-purple-700 dark:text-purple-400" />}
            </div>
            <Section title="职业特性">
              <Markdown text={d.classFeature} />
            </Section>
            <Section title="希望特性 (3希望)">
              <Markdown text={d.hopeFeature} className="text-blue-800 dark:text-amber-200" />
            </Section>
            <div className="mt-auto pt-4">
              <Section>
                <Markdown text={d.description} className="italic text-slate-500 dark:text-zinc-500" />
              </Section>
            </div>
          </>
        );
      }
      case CardType.SUBCLASS: {
        const d = data as SubclassData;
        return (
          <>
            <Header title={d.name} subtitle={`基础职业: ${d.baseClass}`} type="子职" />
            
            {d.spellcastingAttribute && (
              <div className="mb-4 inline-flex items-center px-3 py-1 rounded bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700">
                <span className="text-[10px] uppercase text-slate-500 dark:text-zinc-500 mr-2">施法属性</span>
                <span className="text-sm font-bold text-purple-700 dark:text-purple-400">{d.spellcastingAttribute}</span>
              </div>
            )}

            <div className="space-y-5 mt-2">
              {d.foundationFeature && (
                <div className="bg-slate-50 dark:bg-zinc-900/30 p-3 rounded border-l-4 border-blue-600 dark:border-cyan-600 shadow-sm">
                    <h3 className="text-sm font-bold text-blue-900 dark:text-cyan-400 mb-2 uppercase tracking-wider">基础特性</h3>
                    <Markdown text={d.foundationFeature} className="text-sm text-slate-800 dark:text-zinc-300" />
                </div>
              )}
              {d.advancedFeature && (
                <div className="bg-slate-50 dark:bg-zinc-900/30 p-3 rounded border-l-4 border-purple-600 dark:border-purple-500 shadow-sm">
                  <h3 className="text-sm font-bold text-purple-900 dark:text-purple-400 mb-2 uppercase tracking-wider">进阶特性</h3>
                  <Markdown text={d.advancedFeature} className="text-sm text-slate-800 dark:text-zinc-300" />
                </div>
              )}
              {d.masteryFeature && (
                <div className="bg-slate-50 dark:bg-zinc-900/30 p-3 rounded border-l-4 border-amber-500 dark:border-amber-600 shadow-sm">
                    <h3 className="text-sm font-bold text-amber-700 dark:text-amber-500 mb-2 uppercase tracking-wider">精通特性</h3>
                    <Markdown text={d.masteryFeature} className="text-sm text-slate-800 dark:text-zinc-300" />
                </div>
              )}
            </div>
            <div className="mt-auto pt-4">
              <Section>
                <Markdown text={d.description} className="italic text-slate-500 dark:text-zinc-500" />
              </Section>
            </div>
          </>
        );
      }
      case CardType.DOMAIN: {
        const d = data as DomainData;
        return (
          <>
            <div className="flex justify-between items-start border-b-2 border-purple-900/20 dark:border-purple-500/30 pb-2 mb-4">
              <div>
                <h2 className="text-xl font-serif font-bold text-purple-900 dark:text-purple-400 whitespace-pre-wrap">{d.name}</h2>
                <div className="text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-500 font-serif mt-1 flex flex-wrap gap-2">
                  {d.level && <span className="font-bold text-purple-700 dark:text-purple-300">等级 {d.level}</span>}
                  <span>{d.domainName} 领域</span>
                  {d.category && <span className="text-slate-400 dark:text-zinc-600">· {d.category}</span>}
                </div>
              </div>
              <div className="flex flex-col items-end shrink-0">
                <span className="text-[10px] text-slate-400 dark:text-zinc-600 uppercase">回想</span>
                <span className="text-xl font-bold text-purple-700 dark:text-purple-300">{d.recallCost}</span>
              </div>
            </div>
            
            <div className="flex-grow">
              <Markdown text={d.ability} className="text-sm leading-relaxed text-slate-800 dark:text-zinc-200" />
            </div>

            <div className="mt-auto pt-4 border-t border-slate-200 dark:border-zinc-800/50">
              <Markdown text={d.description} className="italic text-xs text-slate-500 dark:text-zinc-500" />
            </div>
          </>
        );
      }
      case CardType.ANCESTRY: {
        const d = data as AncestryData;
        return (
          <>
            <Header title={d.name} type="种族" />
            <div className="space-y-4 mt-2">
              <div>
                <h3 className="text-emerald-800 dark:text-emerald-400 font-bold text-sm mb-1">{parseInline(d.feature1Name)}</h3>
                <Markdown text={d.feature1Desc} className="text-sm text-slate-700 dark:text-zinc-300" />
              </div>
              <div className="border-t border-slate-200 dark:border-zinc-800/50 pt-4">
                <h3 className="text-emerald-800 dark:text-emerald-400 font-bold text-sm mb-1">{parseInline(d.feature2Name)}</h3>
                <Markdown text={d.feature2Desc} className="text-sm text-slate-700 dark:text-zinc-300" />
              </div>
            </div>
            <div className="mt-auto pt-4">
              <Section>
                <Markdown text={d.description} className="italic text-slate-500 dark:text-zinc-500" />
              </Section>
            </div>
          </>
        );
      }
      case CardType.COMMUNITY: {
        const d = data as CommunityData;
        return (
          <>
            <Header title={d.name} type="社群" />
            <div className="mt-4 p-4 bg-slate-50 dark:bg-zinc-900/30 rounded border border-orange-200 dark:border-orange-900/30 shadow-sm">
              <h3 className="text-orange-800 dark:text-orange-400 font-bold text-sm mb-2 text-center">{parseInline(d.featureName)}</h3>
              <Markdown text={d.featureDesc} className="text-sm text-slate-700 dark:text-zinc-300 text-center italic" />
            </div>
            
            {d.demeanor && (
               <div className="mt-4 px-4 py-2 border-l-2 border-orange-300 dark:border-orange-700">
                  <span className="text-xs font-bold text-orange-800 dark:text-orange-500 uppercase mr-2 tracking-wider">通常表现</span>
                  <span className="text-sm text-slate-700 dark:text-zinc-300">{parseInline(d.demeanor)}</span>
               </div>
            )}

            <div className="mt-auto pt-6">
              <Markdown text={d.description} className="text-slate-700 dark:text-zinc-300 leading-relaxed" />
            </div>
          </>
        );
      }
      case CardType.STORY: {
        const d = data as StoryData;
        return (
          <>
            <Header title={d.name} type="专属" />
            <div className="space-y-6 mt-4">
              <div>
                <h3 className="text-pink-800 dark:text-pink-400 text-xs font-bold uppercase tracking-wider mb-2">触发条件</h3>
                <Markdown text={d.trigger} className="text-sm text-slate-800 dark:text-zinc-200 bg-pink-50 dark:bg-pink-950/20 p-3 rounded border border-pink-100 dark:border-pink-900/30 shadow-sm" />
              </div>
              <div>
                <h3 className="text-pink-800 dark:text-pink-400 text-xs font-bold uppercase tracking-wider mb-2">效果</h3>
                <Markdown text={d.effect} className="text-sm text-slate-800 dark:text-zinc-200 bg-pink-50 dark:bg-pink-950/20 p-3 rounded border border-pink-100 dark:border-pink-900/30 shadow-sm" />
              </div>
            </div>
            <div className="mt-auto pt-4">
              <Markdown text={d.description} className="italic text-slate-500 dark:text-zinc-500 text-sm" />
            </div>
          </>
        );
      }
      case CardType.LOOT: {
        const d = data as LootData;
        return (
          <>
            <Header title={d.name} type="战利品" />
            <div className="my-auto">
              <div className="p-4 border-y-2 border-yellow-600/20 dark:border-yellow-600/40 bg-yellow-50/50 dark:bg-yellow-900/10">
                <Markdown text={d.feature} className="text-center font-medium text-yellow-900 dark:text-yellow-100 text-lg" />
              </div>
            </div>
            <div className="mt-auto">
              <Markdown text={d.description} className="italic text-slate-500 dark:text-zinc-500 text-sm text-center" />
            </div>
          </>
        );
      }
      case CardType.CONSUMABLE: {
        const d = data as ConsumableData;
        return (
          <>
            <Header title={d.name} type="消耗品" />
            <div className="my-auto">
              <div className="p-4 border border-green-600/20 dark:border-green-600/40 rounded-lg bg-green-50/50 dark:bg-green-900/10 shadow-sm animate-in zoom-in-95">
                <h3 className="text-green-800 dark:text-green-400 text-xs font-bold uppercase tracking-wider mb-2 text-center">使用效果</h3>
                <Markdown text={d.effect} className="text-center text-slate-800 dark:text-zinc-200" />
              </div>
            </div>
            <div className="mt-auto">
              <Markdown text={d.description} className="italic text-slate-500 dark:text-zinc-500 text-sm text-center" />
            </div>
          </>
        );
      }
      case CardType.CALAMITY: {
        const d = data as CalamityData;
        return (
          <>
            <div className="border-b-4 border-slate-900 dark:border-zinc-200 pb-3 mb-4">
              <h2 className="text-3xl font-serif font-bold text-center text-slate-900 dark:text-zinc-100 tracking-widest uppercase whitespace-pre-wrap">{d.name}</h2>
              <div className="text-center text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-zinc-500 mt-1">全球灾厄</div>
            </div>
            
            <div className="flex-grow flex flex-col justify-center items-center text-center space-y-6">
              <Markdown text={d.description} className="text-lg leading-relaxed font-serif text-slate-800 dark:text-zinc-300 italic" />
              <div className="w-12 h-1 bg-red-800 dark:bg-red-600"></div>
              <Markdown text={d.effect} className="text-base font-medium text-slate-900 dark:text-white" />
            </div>
          </>
        );
      }
      case CardType.INGREDIENT: {
        const d = data as IngredientData;
        return (
          <>
            <Header title={d.name} type="食材" />
            <div className="mb-6 space-y-2">
                {(d.flavors || []).map((f, i) => (
                    <div key={i} className="flex gap-4 items-center">
                        <div className="flex-grow flex flex-col items-center p-2 bg-lime-50 dark:bg-lime-950/30 rounded border border-lime-200 dark:border-lime-800 shadow-sm">
                            <span className="text-xs text-lime-700 dark:text-lime-400 uppercase mb-1">味型</span>
                            <span className="text-lg font-bold text-lime-900 dark:text-lime-200">{f.name || '-'}</span>
                        </div>
                        <div className="w-20 flex flex-col items-center p-2 bg-slate-50 dark:bg-zinc-900 rounded border border-slate-200 dark:border-zinc-800 shadow-sm">
                            <span className="text-xs text-slate-500 dark:text-zinc-500 uppercase mb-1">骰</span>
                            <span className="text-xl font-bold text-slate-800 dark:text-zinc-200">{f.die || '-'}</span>
                        </div>
                    </div>
                ))}
            </div>
            <Section title="特性">
              <Markdown text={d.feature} className="font-medium text-slate-900 dark:text-amber-100/90" />
            </Section>
            <div className="mt-auto pt-4">
              <Section>
                <Markdown text={d.description} className="italic text-slate-500 dark:text-zinc-500" />
              </Section>
            </div>
          </>
        );
      }
      case CardType.MEAL: {
        const d = data as MealData;
        return (
          <>
            <Header title={d.name} type="料理" />
            <div className="mb-4 bg-amber-50 dark:bg-amber-950/20 p-3 rounded border border-amber-200 dark:border-amber-900/30 shadow-sm">
                <h3 className="text-amber-800 dark:text-amber-500 text-xs font-bold uppercase tracking-wider mb-2">所用食材 & 骰池</h3>
                <div className="space-y-2">
                    {(d.components || []).map((c, i) => (
                        <div key={i} className="flex justify-between items-center border-b border-amber-200 dark:border-amber-800/50 pb-1 last:border-0">
                            <span className="text-sm text-amber-900 dark:text-amber-100">{c.name}</span>
                            <span className="text-sm font-bold text-amber-700 dark:text-amber-400">{c.die}</span>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="flex justify-center mb-6">
               <div className="flex flex-col items-center p-3 bg-slate-50 dark:bg-zinc-900 rounded border border-slate-200 dark:border-zinc-800 min-w-[140px] shadow-sm">
                <span className="text-xs text-slate-500 dark:text-zinc-500 uppercase mb-1">总骰池</span>
                <span className="text-2xl font-bold text-blue-800 dark:text-amber-500">{d.die}</span>
              </div>
            </div>

            <Section title="额外效果">
              <Markdown text={d.effect} className="font-medium text-slate-900 dark:text-zinc-200" />
            </Section>
            
            <div className="mt-auto pt-4 border-t border-slate-200 dark:border-zinc-800/50">
              <Markdown text={d.description} className="italic text-slate-500 dark:text-zinc-500 text-sm" />
            </div>
          </>
        );
      }
      case CardType.TRANSFORMATION: {
        const d = data as TransformationData;
        return (
            <>
                <Header title={d.name} type="转变卡" />
                
                <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-lg italic text-slate-700 dark:text-zinc-300 text-sm leading-relaxed shadow-sm">
                    <Markdown text={d.description} />
                </div>

                <div className="mb-4">
                   <h3 className="text-rose-800 dark:text-rose-400 font-bold text-lg border-b-2 border-rose-200 dark:border-rose-800/50 pb-1 mb-3">转变特性</h3>
                   <div className="space-y-2">
                        {d.features.map((f, i) => (
                            <div key={i} className="text-sm">
                                <span className="font-bold text-slate-900 dark:text-zinc-100 mr-2">{parseInline(f.name)}:</span>
                                <span className="text-slate-800 dark:text-zinc-300 leading-relaxed">{parseInline(f.description)}</span>
                            </div>
                        ))}
                   </div>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-200 dark:border-zinc-800/50">
                    <div className="flex justify-between text-[10px] text-rose-300 dark:text-rose-900 uppercase font-bold tracking-widest">
                       <span>TRANSFORMATION</span>
                       <span>DAGGERHEART</span>
                    </div>
                </div>
            </>
        );
      }
      case CardType.MATERIAL: {
        const d = data as MaterialData;
        return (
            <>
               <div className="border-b-2 border-slate-800/20 dark:border-zinc-700 pb-3 mb-4">
                   <div className="flex justify-between items-baseline">
                     <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-stone-300 tracking-wide">
                        {d.source} <span className="text-slate-400">·</span> {d.part}
                     </h2>
                     <span className="text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-500 font-serif ml-2 shrink-0">材料</span>
                   </div>
               </div>

               <div className="mb-6">
                   <Section>
                       <Markdown text={d.description} className="italic text-slate-600 dark:text-zinc-400" />
                   </Section>
               </div>

               <div className="space-y-3">
                  {d.features.map((f, i) => (
                      <div key={i} className="bg-slate-50 dark:bg-zinc-900/30 p-3 rounded border border-slate-200 dark:border-zinc-800 shadow-sm">
                          <h3 className="text-sm font-bold text-slate-800 dark:text-stone-200 mb-1">{parseInline(f.name)}</h3>
                          <Markdown text={f.description} className="text-sm text-slate-700 dark:text-zinc-400" />
                      </div>
                  ))}
               </div>
               
               <div className="mt-auto pt-4"></div>
            </>
        );
      }
      case CardType.VEHICLE: {
        const d = data as VehicleData;
        return (
            <>
               <Header title={d.name} type="载具" />
               
               <div className="mb-4">
                  <Section>
                      <Markdown text={d.description} className="italic text-slate-600 dark:text-zinc-400" />
                  </Section>
               </div>

               <div className="mb-6 bg-slate-50 dark:bg-sky-950/20 p-4 rounded-lg border border-slate-200 dark:border-sky-900/30 shadow-sm">
                  <h3 className="text-sky-800 dark:text-sky-400 font-bold text-sm uppercase tracking-wider mb-3 border-b border-sky-200 dark:border-sky-800/50 pb-1">武装</h3>
                  <div className="space-y-2">
                     {d.armaments.map((a, i) => (
                        <div key={i} className="flex justify-between items-center text-sm">
                            <span className="font-bold text-slate-800 dark:text-sky-100">{a.name}</span>
                            <span className="text-slate-600 dark:text-sky-300">{a.damage}</span>
                        </div>
                     ))}
                     {(!d.armaments || d.armaments.length === 0) && <span className="text-xs text-slate-400 italic">无武装</span>}
                  </div>
               </div>

               <div className="space-y-3">
                  {d.features.map((f, i) => (
                      <div key={i}>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-200 mb-1">{parseInline(f.name)}</h3>
                          <Markdown text={f.description} className="text-sm text-slate-700 dark:text-zinc-400" />
                      </div>
                  ))}
               </div>

               <div className="mt-auto pt-4"></div>
            </>
        );
      }
      case CardType.MADNESS: {
        const d = data as MadnessData;
        return (
            <>
               <div className="border-b-4 border-double border-fuchsia-900/50 dark:border-fuchsia-500/50 pb-4 mb-6 text-center">
                   <h2 className="text-3xl font-serif font-bold text-fuchsia-900 dark:text-fuchsia-400 tracking-widest uppercase mb-1">{d.name}</h2>
                   <span className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-zinc-500">异化症状</span>
               </div>

               <div className="flex-grow flex flex-col gap-6">
                   <div className="bg-fuchsia-50 dark:bg-fuchsia-950/20 p-4 rounded-lg border border-fuchsia-100 dark:border-fuchsia-900/30 shadow-sm animate-in zoom-in-95">
                       <h3 className="text-center text-fuchsia-800 dark:text-fuchsia-300 font-bold text-sm uppercase mb-2">效果</h3>
                       <Markdown text={d.effect} className="text-center text-slate-800 dark:text-zinc-200 leading-relaxed font-medium" />
                   </div>

                   <div className="text-center px-4">
                       <Markdown text={d.description} className="italic text-slate-500 dark:text-zinc-500 text-sm text-center" />
                   </div>
               </div>

               <div className="mt-auto pt-6 border-t border-slate-200 dark:border-zinc-800">
                   <h3 className="text-center text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-2">失效条件</h3>
                   <Markdown text={d.cureCondition} className="text-center text-sm text-slate-700 dark:text-zinc-300" />
               </div>
            </>
        );
      }
      case CardType.CLUE: {
        const d = data as ClueData;
        return (
            <>
               <Header title={d.name} type="线索" />
               
               <div className="flex-grow flex flex-col justify-center my-6">
                  <div className="p-6 bg-teal-50 dark:bg-teal-950/20 rounded border border-teal-100 dark:border-teal-900/30 relative shadow-sm">
                     <div className="text-lg text-slate-900 dark:text-zinc-200 font-serif leading-relaxed relative z-10">
                        <Markdown text={d.content} />
                     </div>
                     {/* Watermark-like decoration */}
                     <div className="absolute right-2 bottom-2 text-6xl text-teal-900/5 dark:text-teal-500/10 pointer-events-none">?</div>
                  </div>
               </div>

               {d.note && (
                   <div className="mt-6 -rotate-1 transform transition-transform hover:rotate-0">
                       <div className="bg-yellow-100 dark:bg-yellow-900/80 p-3 shadow-md text-slate-800 dark:text-yellow-100 text-sm font-serif italic border-l-4 border-yellow-400">
                           <span className="font-bold not-italic mr-2 text-xs uppercase text-yellow-700 dark:text-yellow-500">Note:</span>
                           {parseInline(d.note)}
                       </div>
                   </div>
               )}
               
               <div className="mt-auto pt-4"></div>
            </>
        );
      }
      case CardType.PROPHECY: {
        const d = data as ProphecyData;
        return (
            <>
               <div className="text-center border-b border-violet-200 dark:border-violet-900/50 pb-4 mb-6">
                  <h2 className="text-2xl font-serif font-bold text-violet-900 dark:text-violet-400 mb-1">{d.name}</h2>
                  <div className="text-[10px] uppercase tracking-[0.4em] text-slate-400 dark:text-zinc-500">PROPHECY</div>
               </div>

               <div className="mb-8 px-4 text-center">
                  <Markdown text={d.content} className="text-lg font-serif italic text-slate-800 dark:text-zinc-300 leading-relaxed" />
               </div>

               <div className="space-y-4 mb-6">
                   <div className="bg-emerald-50 dark:bg-emerald-950/20 p-3 border-l-4 border-emerald-500 rounded-r shadow-sm">
                       <h3 className="text-emerald-800 dark:text-emerald-500 text-xs font-bold uppercase mb-1">应验</h3>
                       <Markdown text={d.successEffect} className="text-sm text-slate-800 dark:text-zinc-300" />
                   </div>
                   <div className="bg-rose-50 dark:bg-rose-950/20 p-3 border-l-4 border-rose-500 rounded-r shadow-sm">
                       <h3 className="text-rose-800 dark:text-rose-500 text-xs font-bold uppercase mb-1">失败</h3>
                       <Markdown text={d.failureEffect} className="text-sm text-slate-800 dark:text-zinc-300" />
                   </div>
               </div>

               <div className="mt-auto pt-4 border-t border-slate-200 dark:border-zinc-800">
                  <Markdown text={d.description} className="text-xs text-slate-500 dark:text-zinc-600 italic text-center" />
               </div>
            </>
        );
      }
      case CardType.QUESTION: {
        const d = data as QuestionData;
        return (
            <>
               <div className="border-b-2 border-indigo-900 dark:border-indigo-500 pb-2 mb-6 flex justify-between items-end">
                   <h2 className="text-3xl font-bold text-indigo-900 dark:text-indigo-400">{d.name}</h2>
                   {d.questionType && <span className="text-sm font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-wider mb-1">{d.questionType}</span>}
               </div>

               <div className="space-y-6">
                   {(d.options || []).map((opt, i) => (
                       <div key={i} className="flex gap-4">
                           <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-800 dark:text-indigo-300 font-bold font-serif">
                               {i + 1}
                           </div>
                           <div className="pt-1 text-base text-slate-800 dark:text-zinc-200 font-medium leading-relaxed border-b border-slate-200 dark:border-zinc-800 pb-4 w-full border-dashed">
                                <Markdown text={opt} />
                            </div>
                       </div>
                   ))}
               </div>

               <div className="mt-auto"></div>
            </>
        );
      }
      case CardType.QUEST: {
        const d = data as QuestData;
        return (
          <>
            <Header title={d.name} type="任务" />
            <div className="grid grid-cols-2 gap-2 mb-4">
              <KeyValue label="委托方" value={d.questGiver || '-'} />
              <KeyValue label="时限" value={d.deadline || '-'} />
              <KeyValue label="危险等级" value={d.dangerLevel || '-'} full />
            </div>
            
            <div className="flex-grow flex flex-col gap-3">
              <div className="bg-amber-50/50 dark:bg-amber-950/10 p-3 rounded border border-amber-200 dark:border-amber-900/30 shadow-sm flex-grow">
                <h3 className="text-amber-800 dark:text-amber-500 text-xs font-bold uppercase tracking-wider mb-2">任务目标</h3>
                <Markdown text={d.objectives} className="text-sm text-slate-800 dark:text-zinc-200 leading-relaxed" />
              </div>

              <div className="bg-yellow-50/50 dark:bg-yellow-900/10 p-3 border-l-4 border-yellow-500 dark:border-amber-500 rounded-r shadow-sm">
                <h3 className="text-yellow-800 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">任务奖励</h3>
                <Markdown text={d.reward} className="text-sm font-medium text-slate-900 dark:text-white" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-zinc-800/50">
              <Markdown text={d.description} className="italic text-xs text-slate-500 dark:text-zinc-500" />
            </div>
          </>
        );
      }
      case CardType.WHEELCHAIR: {
        const w = data as WheelchairData;
        return (
          <>
            <Header title={w.name} type="战斗轮椅" />
            <div className="grid grid-cols-2 gap-2 mb-3">
              <KeyValue label="框架型号" value={w.frameType || '-'} />
              <KeyValue label="位阶" value={w.tier || '-'} />
              <KeyValue label="属性" value={w.trait || '-'} />
              <KeyValue label="距离" value={w.range || '-'} />
              <KeyValue label="伤害骰" value={w.damage || '-'} />
              <KeyValue label="负荷" value={w.burden || '-'} />
              <KeyValue label="闪避修正" value={w.evasionMod || '-'} full />
            </div>

            <div className="flex-grow flex flex-col gap-3">
              {w.feature && (
                <div className="bg-amber-50/50 dark:bg-amber-950/10 p-3 rounded border border-amber-200 dark:border-amber-900/30 shadow-sm">
                  <h3 className="text-amber-800 dark:text-amber-500 text-xs font-bold uppercase tracking-wider mb-1">核心特性</h3>
                  <Markdown text={w.feature} className="text-sm text-slate-800 dark:text-zinc-200" />
                </div>
              )}
              
              <div className="grid grid-cols-1 gap-2">
                {w.actions && (
                  <div className="p-3 bg-slate-50 dark:bg-zinc-900/40 rounded border border-slate-200 dark:border-zinc-800/50">
                    <h3 className="text-blue-900 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">动作与移动</h3>
                    <Markdown text={w.actions} className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed" />
                  </div>
                )}
                {w.consequences && (
                  <div className="p-3 bg-red-50/30 dark:bg-rose-950/10 rounded border border-red-100 dark:border-rose-900/30">
                    <h3 className="text-red-800 dark:text-red-400 text-xs font-bold uppercase tracking-wider mb-1">后果描述</h3>
                    <Markdown text={w.consequences} className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed" />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-zinc-800/50">
              <Markdown text={w.description} className="italic text-xs text-slate-500 dark:text-zinc-500" />
            </div>
          </>
        );
      }
      default: 
        return null;
    }
  };

  return (
    <Wrapper id={elementId || "card-preview"}>
      {renderContent()}
      <Footer creator={data.creator} owner={data.owner} />
    </Wrapper>
  );
};

export default CardPreview;
