
import React from 'react';
import { CardData, CardType, NpcData, NpcFeature, IngredientData, IngredientFlavor, MealComponent, MealData, SubclassData, TransformationData, TransformationFeature, MaterialData, MaterialFeature, VehicleData, VehicleArmament, VehicleFeature, MadnessData, ClassData, DomainData, CommunityData, ClueData, ProphecyData, QuestionData, QuestData, SubWeaponData } from '../types';
import { TOOL_CONFIG } from '../constants';
import { Plus, Trash2 } from 'lucide-react';
import RichTextArea from './RichTextArea';

interface Props {
  data: CardData;
  onChange: (data: CardData) => void;
}

// --- Helper Components ---

const Input = ({ label, value, onChange, placeholder, full = false }: { label: string, value: string, onChange: (val: string) => void, placeholder?: string, full?: boolean }) => (
  <div className={`flex flex-col gap-1 ${full ? 'col-span-2' : ''}`}>
    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">{label}</label>
    <input 
      type="text" 
      value={value || ''} 
      onChange={(e) => onChange(e.target.value)}
      className="bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded px-3 py-2 text-slate-900 dark:text-zinc-200 focus:outline-none focus:border-blue-500 dark:focus:border-amber-500 transition-colors"
      placeholder={placeholder}
    />
  </div>
);

const TextArea = ({ label, value, onChange, placeholder }: { label: string, value: string, onChange: (val: string) => void, placeholder?: string }) => (
  <RichTextArea label={label} value={value} onChange={onChange} placeholder={placeholder} />
);

// Generic list editor component
function ListEditor<T>({
  title,
  items,
  onUpdate,
  onAdd,
  onRemove,
  renderItem
}: {
  title: string;
  items: T[];
  onUpdate: (index: number, key: keyof T, val: any) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  renderItem: (item: T, index: number, update: (key: keyof T, val: any) => void) => React.ReactNode;
}) {
  return (
    <div className="col-span-2 space-y-3 border-t border-slate-200 dark:border-zinc-800 pt-4 mt-2">
      <div className="flex justify-between items-center">
        <label className="text-xs font-bold text-zinc-500 uppercase">{title}</label>
        <button onClick={onAdd} className="flex items-center gap-1 text-xs bg-slate-200 dark:bg-zinc-800 hover:bg-slate-300 dark:hover:bg-zinc-700 px-2 py-1 rounded text-slate-700 dark:text-amber-500 transition-colors">
          <Plus size={14} /> 添加
        </button>
      </div>
      {items.map((item, i) => (
        <div key={i} className="relative group">
           {renderItem(item, i, (key, val) => onUpdate(i, key, val))}
           <button onClick={() => onRemove(i)} className="absolute right-2 top-2.5 text-slate-400 dark:text-zinc-500 hover:text-red-500 p-1 z-10">
              <Trash2 size={16} />
           </button>
        </div>
      ))}
    </div>
  );
}

// --- Main Component ---

const CardEditor: React.FC<Props> = ({ data, onChange }) => {
  
  const handleChange = (field: string, value: any) => {
    let newData = { ...data, [field]: value } as CardData;
    // Auto-update name for Material
    if (data.type === CardType.MATERIAL && (field === 'source' || field === 'part')) {
        const source = field === 'source' ? value : (data as MaterialData).source;
        const part = field === 'part' ? value : (data as MaterialData).part;
        newData = { ...newData, name: `${source} · ${part}` };
    }
    onChange(newData);
  };

  const renderFields = () => {
    switch (data.type) {
      case CardType.WEAPON:
      case CardType.SUB_WEAPON:
        return (
          <>
            <Input label="属性" value={(data as any).trait} onChange={v => handleChange('trait', v)} placeholder="例如: 敏捷" />
            <Input label="距离" value={(data as any).range} onChange={v => handleChange('range', v)} placeholder="例如: 近战" />
            <Input label="伤害骰" value={(data as any).damage} onChange={v => handleChange('damage', v)} placeholder="例如: d8" />
            <Input label="类型" value={(data as any).damageType} onChange={v => handleChange('damageType', v)} placeholder="物理/魔法" />
            <Input label="负荷" value={(data as any).burden} onChange={v => handleChange('burden', v)} placeholder="单手/双手" />
            <TextArea label="特性" value={(data as any).feature} onChange={v => handleChange('feature', v)} />
          </>
        );
      case CardType.ARMOR:
        return (
          <>
            <Input label="护甲值" value={(data as any).score} onChange={v => handleChange('score', v)} />
            <div className="grid grid-cols-2 gap-4 col-span-2">
              <Input label="重度阈值" value={(data as any).majorThreshold} onChange={v => handleChange('majorThreshold', v)} />
              <Input label="严重阈值" value={(data as any).severeThreshold} onChange={v => handleChange('severeThreshold', v)} />
            </div>
            <TextArea label="特性" value={(data as any).feature} onChange={v => handleChange('feature', v)} />
          </>
        );
      case CardType.LOOT:
        return <TextArea label="战利品特性" value={(data as any).feature} onChange={v => handleChange('feature', v)} />;
      case CardType.CONSUMABLE:
        return <TextArea label="使用效果" value={(data as any).effect} onChange={v => handleChange('effect', v)} />;
      case CardType.DOMAIN:
        return (
          <>
            <div className="grid grid-cols-2 gap-4 col-span-2">
               <Input label="领域名称" value={(data as any).domainName} onChange={v => handleChange('domainName', v)} placeholder="如: 元素" />
               <Input label="等级" value={(data as DomainData).level} onChange={v => handleChange('level', v)} placeholder="1" />
            </div>
            <Input label="类别" value={(data as DomainData).category} onChange={v => handleChange('category', v)} placeholder="如: 法术/魔法书" full />
            <Input label="回想费用" value={(data as any).recallCost} onChange={v => handleChange('recallCost', v)} placeholder="1" full />
            <TextArea label="卡牌能力" value={(data as any).ability} onChange={v => handleChange('ability', v)} />
          </>
        );
      case CardType.STORY:
        return (
          <>
            <TextArea label="触发条件" value={(data as any).trigger} onChange={v => handleChange('trigger', v)} />
            <TextArea label="效果/收益" value={(data as any).effect} onChange={v => handleChange('effect', v)} />
          </>
        );
      case CardType.CLASS:
        return (
          <>
            <div className="grid grid-cols-2 gap-4 col-span-2">
              <Input label="基础闪避" value={(data as any).evasion} onChange={v => handleChange('evasion', v)} />
              <Input label="基础HP" value={(data as any).hp} onChange={v => handleChange('hp', v)} />
            </div>
            <Input label="施法属性 (可选)" value={(data as ClassData).spellcastingAttribute} onChange={v => handleChange('spellcastingAttribute', v)} placeholder="例如: 智力" full />
            <TextArea label="职业特性" value={(data as any).classFeature} onChange={v => handleChange('classFeature', v)} />
            <TextArea label="希望特性" value={(data as any).hopeFeature} onChange={v => handleChange('hopeFeature', v)} />
          </>
        );
      case CardType.SUBCLASS:
        const sub = data as SubclassData;
        return (
          <>
            <Input label="基础职业" value={sub.baseClass} onChange={v => handleChange('baseClass', v)} />
            <Input label="施法属性 (可选)" value={sub.spellcastingAttribute} onChange={v => handleChange('spellcastingAttribute', v)} placeholder="例如: 魅力" />
            <TextArea label="基础特性 (可选)" value={sub.foundationFeature || ''} onChange={v => handleChange('foundationFeature', v)} />
            <TextArea label="进阶特性 (可选)" value={sub.advancedFeature || ''} onChange={v => handleChange('advancedFeature', v)} placeholder="高等级解锁的能力..." />
            <TextArea label="精通特性 (可选)" value={sub.masteryFeature || ''} onChange={v => handleChange('masteryFeature', v)} />
          </>
        );
      case CardType.ANCESTRY:
        return (
          <>
            <Input label="特性 1 名称" value={(data as any).feature1Name} onChange={v => handleChange('feature1Name', v)} full />
            <TextArea label="特性 1 描述" value={(data as any).feature1Desc} onChange={v => handleChange('feature1Desc', v)} />
            <Input label="特性 2 名称" value={(data as any).feature2Name} onChange={v => handleChange('feature2Name', v)} full />
            <TextArea label="特性 2 描述" value={(data as any).feature2Desc} onChange={v => handleChange('feature2Desc', v)} />
          </>
        );
      case CardType.COMMUNITY:
        return (
          <>
            <Input label="特性名称" value={(data as any).featureName} onChange={v => handleChange('featureName', v)} full />
            <TextArea label="特性描述" value={(data as any).featureDesc} onChange={v => handleChange('featureDesc', v)} />
            <TextArea label="通常表现 (可选)" value={(data as CommunityData).demeanor || ''} onChange={v => handleChange('demeanor', v)} placeholder="例如：警惕，团结，排外..." />
          </>
        );
      case CardType.NPC:
        return (
          <>
            <Input label="难度" value={(data as any).difficulty} onChange={v => handleChange('difficulty', v)} placeholder="12" />
            <Input label="动机" value={(data as any).motive} onChange={v => handleChange('motive', v)} placeholder="保卫巢穴" />
            <ListEditor<NpcFeature>
              title="NPC 特性"
              items={(data as NpcData).features || []}
              onAdd={() => handleChange('features', [...((data as NpcData).features || []), { name: '新特性', choice: '', trigger: '', effect: '' }])}
              onRemove={(i) => handleChange('features', (data as NpcData).features.filter((_, idx) => idx !== i))}
              onUpdate={(i, k, v) => {
                 const newFeatures = [...(data as NpcData).features];
                 newFeatures[i] = { ...newFeatures[i], [k]: v };
                 handleChange('features', newFeatures);
              }}
              renderItem={(f, i, update) => (
                <div className="bg-slate-50 dark:bg-zinc-900/50 p-3 rounded border border-slate-200 dark:border-zinc-800 space-y-2">
                   <input className="bg-white dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 rounded px-2 py-1 text-sm w-full font-bold mb-2 mr-6" value={f.name} onChange={(e) => update('name', e.target.value)} placeholder="特性名称" />
                   <div className="space-y-2">
                      <input className="w-full bg-white dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 rounded px-2 py-1 text-sm" value={f.choice} onChange={(e) => update('choice', e.target.value)} placeholder="选择 (可选)" />
                      <input className="w-full bg-white dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 rounded px-2 py-1 text-sm" value={f.trigger} onChange={(e) => update('trigger', e.target.value)} placeholder="触发" />
                      <RichTextArea inline={true} minHeight="min-h-[60px]" value={f.effect} onChange={(v) => update('effect', v)} placeholder="效果描述..." />
                   </div>
                </div>
              )}
            />
          </>
        );
      case CardType.CALAMITY:
        return <TextArea label="灾厄效果" value={(data as any).effect} onChange={v => handleChange('effect', v)} />;
      case CardType.INGREDIENT:
        return (
          <>
            <ListEditor<IngredientFlavor>
              title="味型配置"
              items={(data as IngredientData).flavors || []}
              onAdd={() => handleChange('flavors', [...((data as IngredientData).flavors || []), { name: '甜味', die: 'd4' }])}
              onRemove={(i) => handleChange('flavors', (data as IngredientData).flavors.filter((_, idx) => idx !== i))}
              onUpdate={(i, k, v) => {
                  const list = [...(data as IngredientData).flavors];
                  list[i] = { ...list[i], [k]: v };
                  handleChange('flavors', list);
              }}
              renderItem={(f, i, update) => (
                <div className="flex gap-2 items-center bg-slate-50 dark:bg-zinc-900/50 p-2 rounded border border-slate-200 dark:border-zinc-800 mr-6">
                  <select 
                      value={f.name} 
                      onChange={(e) => {
                         let die = 'd4';
                         switch(e.target.value) {
                             case '甜味': die = 'd4'; break;
                             case '咸味': die = 'd6'; break;
                             case '苦味': die = 'd8'; break;
                             case '酸味': die = 'd10'; break;
                             case '鲜味': die = 'd12'; break;
                             case '怪味': die = 'd20'; break;
                         }
                         update('name', e.target.value);
                         update('die', die);
                      }}
                      className="flex-grow bg-white dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 rounded px-2 py-1 text-sm text-slate-900 dark:text-zinc-200"
                  >
                      <option value="甜味">甜味 (d4)</option>
                      <option value="咸味">咸味 (d6)</option>
                      <option value="苦味">苦味 (d8)</option>
                      <option value="酸味">酸味 (d10)</option>
                      <option value="鲜味">鲜味 (d12)</option>
                      <option value="怪味">怪味 (d20)</option>
                  </select>
                  <div className="w-16 text-center text-sm font-bold text-slate-500 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded py-1">
                      {f.die}
                  </div>
                </div>
              )}
            />
            <TextArea label="特性" value={(data as any).feature} onChange={v => handleChange('feature', v)} />
          </>
        );
      case CardType.MEAL:
        return (
          <>
            <ListEditor<MealComponent>
              title="所用食材"
              items={(data as MealData).components || []}
              onAdd={() => handleChange('components', [...((data as MealData).components || []), { name: '', die: '' }])}
              onRemove={(i) => handleChange('components', (data as MealData).components.filter((_, idx) => idx !== i))}
              onUpdate={(i, k, v) => {
                  const list = [...(data as MealData).components];
                  list[i] = { ...list[i], [k]: v };
                  handleChange('components', list);
              }}
              renderItem={(c, i, update) => (
                 <div className="flex gap-2 items-center bg-slate-50 dark:bg-zinc-900/50 p-2 rounded border border-slate-200 dark:border-zinc-800 mr-6">
                    <input type="text" value={c.name} onChange={(e) => update('name', e.target.value)} className="flex-grow bg-white dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 rounded px-2 py-1 text-sm text-slate-900 dark:text-zinc-200" placeholder="食材名称" />
                    <input type="text" value={c.die} onChange={(e) => update('die', e.target.value)} className="w-20 bg-white dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 rounded px-2 py-1 text-sm text-center text-slate-900 dark:text-zinc-200" placeholder="d4" />
                 </div>
              )}
            />
            <Input label="总对应骰" value={(data as any).die} onChange={v => handleChange('die', v)} placeholder="例如: 1d20+4" full/>
            <TextArea label="额外效果" value={(data as any).effect} onChange={v => handleChange('effect', v)} />
          </>
        );
      case CardType.TRANSFORMATION:
        return (
          <>
            <ListEditor<TransformationFeature>
              title="转变特性"
              items={(data as TransformationData).features || []}
              onAdd={() => handleChange('features', [...((data as TransformationData).features || []), { name: '新特性', description: '' }])}
              onRemove={(i) => handleChange('features', (data as TransformationData).features.filter((_, idx) => idx !== i))}
              onUpdate={(i, k, v) => {
                  const list = [...(data as TransformationData).features];
                  list[i] = { ...list[i], [k]: v };
                  handleChange('features', list);
              }}
              renderItem={(f, i, update) => (
                <div className="bg-slate-50 dark:bg-zinc-900/50 p-3 rounded border border-slate-200 dark:border-zinc-800 space-y-2 relative">
                  <div className="flex justify-between mb-2 mr-6">
                      <input 
                        className="bg-white dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 rounded px-2 py-1 text-sm w-full font-bold text-slate-900 dark:text-zinc-200" 
                        value={f.name} 
                        onChange={(e) => update('name', e.target.value)}
                        placeholder="特性名称 (例如: 獠牙)"
                      />
                  </div>
                  <RichTextArea 
                    inline={true} 
                    minHeight="min-h-[60px]" 
                    value={f.description} 
                    onChange={(v) => update('description', v)} 
                    placeholder="特性描述..." 
                  />
                </div>
              )}
            />
          </>
        );
      case CardType.MATERIAL:
        return (
          <>
            <div className="grid grid-cols-2 gap-4 col-span-2">
               <Input label="出处" value={(data as MaterialData).source} onChange={v => handleChange('source', v)} placeholder="例如: 巨龙" />
               <Input label="部位" value={(data as MaterialData).part} onChange={v => handleChange('part', v)} placeholder="例如: 逆鳞" />
            </div>
            <ListEditor<MaterialFeature>
              title="附加特性"
              items={(data as MaterialData).features || []}
              onAdd={() => handleChange('features', [...((data as MaterialData).features || []), { name: '', description: '' }])}
              onRemove={(i) => handleChange('features', (data as MaterialData).features.filter((_, idx) => idx !== i))}
              onUpdate={(i, k, v) => {
                  const list = [...(data as MaterialData).features];
                  list[i] = { ...list[i], [k]: v };
                  handleChange('features', list);
              }}
              renderItem={(f, i, update) => (
                <div className="bg-slate-50 dark:bg-zinc-900/50 p-3 rounded border border-slate-200 dark:border-zinc-800 space-y-2 relative">
                  <div className="flex justify-between mb-2 mr-6">
                      <input 
                        className="bg-white dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 rounded px-2 py-1 text-sm w-full font-bold text-slate-900 dark:text-zinc-200" 
                        value={f.name} 
                        onChange={(e) => update('name', e.target.value)}
                        placeholder="特性名称"
                      />
                  </div>
                  <RichTextArea 
                    inline={true} 
                    minHeight="min-h-[60px]" 
                    value={f.description} 
                    onChange={(v) => update('description', v)} 
                    placeholder="描述..." 
                  />
                </div>
              )}
            />
          </>
        );
      case CardType.VEHICLE:
        return (
          <>
            <ListEditor<VehicleArmament>
              title="武装列表"
              items={(data as VehicleData).armaments || []}
              onAdd={() => handleChange('armaments', [...((data as VehicleData).armaments || []), { name: '', damage: '' }])}
              onRemove={(i) => handleChange('armaments', (data as VehicleData).armaments.filter((_, idx) => idx !== i))}
              onUpdate={(i, k, v) => {
                  const list = [...(data as VehicleData).armaments];
                  list[i] = { ...list[i], [k]: v };
                  handleChange('armaments', list);
              }}
              renderItem={(f, i, update) => (
                <div className="flex gap-2 items-center bg-slate-50 dark:bg-zinc-900/50 p-2 rounded border border-slate-200 dark:border-zinc-800 relative mr-6">
                   <input type="text" value={f.name} onChange={(e) => update('name', e.target.value)} className="flex-1 bg-white dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 rounded px-2 py-1 text-sm" placeholder="武装名称" />
                   <input type="text" value={f.damage} onChange={(e) => update('damage', e.target.value)} className="w-24 bg-white dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 rounded px-2 py-1 text-sm text-center" placeholder="伤害 (3d8)" />
                </div>
              )}
            />
            <ListEditor<VehicleFeature>
              title="载具特性"
              items={(data as VehicleData).features || []}
              onAdd={() => handleChange('features', [...((data as VehicleData).features || []), { name: '', description: '' }])}
              onRemove={(i) => handleChange('features', (data as VehicleData).features.filter((_, idx) => idx !== i))}
              onUpdate={(i, k, v) => {
                  const list = [...(data as VehicleData).features];
                  list[i] = { ...list[i], [k]: v };
                  handleChange('features', list);
              }}
              renderItem={(f, i, update) => (
                <div className="bg-slate-50 dark:bg-zinc-900/50 p-3 rounded border border-slate-200 dark:border-zinc-800 space-y-2 relative">
                  <div className="flex justify-between mb-2 mr-6">
                      <input 
                        className="bg-white dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 rounded px-2 py-1 text-sm w-full font-bold text-slate-900 dark:text-zinc-200" 
                        value={f.name} 
                        onChange={(e) => update('name', e.target.value)}
                        placeholder="特性名称"
                      />
                  </div>
                  <RichTextArea 
                    inline={true} 
                    minHeight="min-h-[60px]" 
                    value={f.description} 
                    onChange={(v) => update('description', v)} 
                    placeholder="描述..." 
                  />
                </div>
              )}
            />
          </>
        );
      case CardType.MADNESS:
        return (
          <>
             <div className="col-span-2 space-y-4">
                <TextArea label="效果" value={(data as MadnessData).effect} onChange={v => handleChange('effect', v)} placeholder="对玩家造成的负面影响..." />
                <TextArea label="失效条件" value={(data as MadnessData).cureCondition} onChange={v => handleChange('cureCondition', v)} placeholder="如何治愈..." />
             </div>
          </>
        );
      case CardType.CLUE:
        return (
           <>
              <TextArea label="内容" value={(data as ClueData).content} onChange={v => handleChange('content', v)} placeholder="线索的具体内容..." />
              <Input label="备注 (可选)" value={(data as ClueData).note || ''} onChange={v => handleChange('note', v)} full />
           </>
        );
      case CardType.PROPHECY:
        return (
           <>
              <TextArea label="预言内容" value={(data as ProphecyData).content} onChange={v => handleChange('content', v)} placeholder="命运的启示..." />
              <TextArea label="应验效果" value={(data as ProphecyData).successEffect} onChange={v => handleChange('successEffect', v)} />
              <TextArea label="失败效果" value={(data as ProphecyData).failureEffect} onChange={v => handleChange('failureEffect', v)} />
           </>
        );
      case CardType.QUESTION:
        return (
           <>
              <Input label="类型 (可选)" value={(data as QuestionData).questionType || ''} onChange={v => handleChange('questionType', v)} full />
              <div className="col-span-2 space-y-3 border-t border-slate-200 dark:border-zinc-800 pt-4 mt-2">
                 <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-zinc-500 uppercase">填写内容</label>
                    <button onClick={() => {
                        const currentOpts = (data as QuestionData).options || [];
                        handleChange('options', [...currentOpts, '']);
                    }} className="flex items-center gap-1 text-xs bg-slate-200 dark:bg-zinc-800 hover:bg-slate-300 dark:hover:bg-zinc-700 px-2 py-1 rounded text-slate-700 dark:text-amber-500 transition-colors">
                      <Plus size={14} /> 添加
                    </button>
                 </div>
                 {((data as QuestionData).options || []).map((opt, i) => (
                    <div key={i} className="relative group">
                       <RichTextArea 
                           inline={true} 
                           minHeight="min-h-[50px]" 
                           value={opt} 
                           onChange={(v) => {
                              const newOpts = [...(data as QuestionData).options];
                              newOpts[i] = v;
                              handleChange('options', newOpts);
                           }}
                           placeholder={`内容 ${i+1}...`}
                        />
                       {((data as QuestionData).options || []).length > 3 && (
                           <button onClick={() => {
                               const currentOpts = (data as QuestionData).options || [];
                               const newOpts = currentOpts.filter((_, idx) => idx !== i);
                               handleChange('options', newOpts);
                           }} className="absolute right-2 top-2 text-slate-400 dark:text-zinc-500 hover:text-red-500 p-1">
                              <Trash2 size={16} />
                           </button>
                       )}
                    </div>
                 ))}
                 {/* Ensure at least 3 items exist */}
                 {((data as QuestionData).options || []).length < 3 && (
                    <div className="text-xs text-amber-600 dark:text-amber-500 italic">至少需要保留3个内容项。</div>
                 )}
              </div>
           </>
        );
      case CardType.QUEST: {
        const q = data as QuestData;
        return (
          <>
            <div className="grid grid-cols-2 gap-4 col-span-2">
              <Input label="委托方" value={q.questGiver || ''} onChange={v => handleChange('questGiver', v)} placeholder="例如: 银叶村村长" />
              <Input label="时限" value={q.deadline || ''} onChange={v => handleChange('deadline', v)} placeholder="例如: 长休之前" />
            </div>
            <Input label="危险等级" value={q.dangerLevel || ''} onChange={v => handleChange('dangerLevel', v)} placeholder="例如: 中等 (危险骰 d8)" full />
            <TextArea label="任务目标" value={q.objectives || ''} onChange={v => handleChange('objectives', v)} placeholder="填写任务的具体目标，可分行描述..." />
            <TextArea label="任务奖励" value={q.reward || ''} onChange={v => handleChange('reward', v)} placeholder="任务完成后可获得的奖励..." />
          </>
        );
      }
      default:
        return <TextArea label="详细内容" value={(data as any).description} onChange={v => handleChange('description', v)} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 dark:border-zinc-800 pb-4">
        <h3 className="text-lg font-serif text-blue-800 dark:text-amber-500 mb-1">{TOOL_CONFIG[data.type].label} 编辑器</h3>
        <p className="text-slate-500 dark:text-zinc-500 text-sm">填写下方信息以生成卡牌。</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {data.type === CardType.MATERIAL ? (
           <div className="col-span-2 p-2 bg-slate-100 dark:bg-zinc-800 rounded text-center text-sm text-slate-500 dark:text-zinc-400">
              名称将自动生成: {data.name}
           </div>
        ) : data.type === CardType.MADNESS ? (
           <Input label="症状名称" value={data.name} onChange={v => handleChange('name', v)} full />
        ) : (
           <Input label="名称" value={data.name} onChange={v => handleChange('name', v)} full />
        )}

        {data.type === CardType.TRANSFORMATION && (
           <TextArea label="风味描述" value={data.description} onChange={v => handleChange('description', v)} placeholder="关于此生物的描述..." />
        )}
        
        {renderFields()}
        
        {data.type !== CardType.TRANSFORMATION && data.type !== CardType.MADNESS && data.type !== CardType.CLUE && (
          <TextArea label="描述/风味文字" value={data.description} onChange={v => handleChange('description', v)} />
        )}

        <div className="col-span-2 grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-zinc-800">
          <Input label="创作者" value={data.creator} onChange={v => handleChange('creator', v)} />
          <Input label="所属角色" value={data.owner} onChange={v => handleChange('owner', v)} />
        </div>
      </div>
    </div>
  );
};

export default CardEditor;
