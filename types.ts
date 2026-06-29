
export enum CardType {
  WEAPON = 'weapon',
  ARMOR = 'armor',
  LOOT = 'loot',
  CONSUMABLE = 'consumable',
  DOMAIN = 'domain',
  STORY = 'story', // Renamed label to Exclusive
  CLASS = 'class',
  SUBCLASS = 'subclass', // Renamed label to Subjob
  ANCESTRY = 'ancestry',
  COMMUNITY = 'community',
  NPC = 'npc',
  CALAMITY = 'calamity',
  INGREDIENT = 'ingredient',
  MEAL = 'meal',
  TRANSFORMATION = 'transformation',
  MATERIAL = 'material',
  VEHICLE = 'vehicle',
  MADNESS = 'madness',
  CLUE = 'clue',
  PROPHECY = 'prophecy',
  QUESTION = 'question',
  QUEST = 'quest',
  SUB_WEAPON = 'subweapon',
  WHEELCHAIR = 'wheelchair',
  ANOMALY = 'anomaly',
  STRONGHOLD = 'stronghold',
  ENVIRONMENT = 'environment',
  LANDMARK = 'landmark'
}

export interface BaseCardData {
  id: string;
  type: CardType;
  name: string;
  description: string; // Flavor text or general description
  creator: string;
  owner: string; // "Belongs to"
}

export interface WeaponData extends BaseCardData {
  trait: string; // e.g. Agility
  range: string;
  damage: string; // e.g. d8
  damageType: string; // Physical/Magic
  burden: string; // One/Two hands
  feature: string;
}

export interface ArmorData extends BaseCardData {
  score: string;
  majorThreshold: string;
  severeThreshold: string;
  feature: string;
}

export interface LootData extends BaseCardData {
  feature: string;
}

export interface ConsumableData extends BaseCardData {
  effect: string;
}

export interface DomainData extends BaseCardData {
  domainName: string;
  level: string; 
  category: string; 
  recallCost: string;
  ability: string;
}

export interface StoryData extends BaseCardData {
  trigger: string;
  effect: string;
}

export interface ClassData extends BaseCardData {
  evasion: string;
  hp: string;
  spellcastingAttribute: string; 
  classFeature: string;
  hopeFeature: string;
}

export interface SubclassData extends BaseCardData {
  baseClass: string;
  spellcastingAttribute: string; 
  foundationFeature?: string; // Made optional
  masteryFeature?: string;    // Made optional
  advancedFeature?: string;
}

export interface AncestryData extends BaseCardData {
  feature1Name: string;
  feature1Desc: string;
  feature2Name: string;
  feature2Desc: string;
}

export interface CommunityData extends BaseCardData {
  featureName: string;
  featureDesc: string;
  demeanor?: string; // New field: Usually Demeanor
}

export interface NpcFeature {
  name: string;
  choice: string;
  trigger: string;
  effect: string;
}

export interface NpcData extends BaseCardData {
  difficulty: string;
  motive: string;
  features: NpcFeature[];
}

export interface CalamityData extends BaseCardData {
  effect: string;
}

export interface IngredientFlavor {
  name: string; // e.g. Sweet
  die: string;  // e.g. d4
}

export interface IngredientData extends BaseCardData {
  flavors: IngredientFlavor[];
  feature: string;
}

export interface MealComponent {
  name: string; // Ingredient name
  die: string;  // Die contribution
}

export interface MealData extends BaseCardData {
  components: MealComponent[];
  effect: string;
  die: string;
}

export interface TransformationFeature {
  name: string;
  description: string;
}

export interface TransformationData extends BaseCardData {
  features: TransformationFeature[];
}

export interface MaterialFeature {
  name: string;
  description: string;
}

export interface MaterialData extends BaseCardData {
  source: string; // e.g. Dragon
  part: string;   // e.g. Scale
  features: MaterialFeature[];
}

export interface VehicleArmament {
  name: string;
  damage: string;
}

export interface VehicleFeature {
  name: string;
  description: string;
}

export interface VehicleData extends BaseCardData {
  armaments: VehicleArmament[];
  features: VehicleFeature[];
}

export interface MadnessData extends BaseCardData {
  // name is the Symptom Name
  effect: string;
  cureCondition: string;
}

export interface ClueData extends BaseCardData {
  content: string;
  note?: string;
}

export interface ProphecyData extends BaseCardData {
  content: string;
  successEffect: string;
  failureEffect: string;
}

export interface QuestionData extends BaseCardData {
  questionType?: string;
  options: string[];
}

export interface QuestData extends BaseCardData {
  questGiver: string;
  dangerLevel: string;
  deadline: string;
  objectives: string;
  reward: string;
}

export interface SubWeaponData extends BaseCardData {
  trait: string;
  range: string;
  damage: string;
  damageType: string;
  burden: string;
  feature: string;
}

export interface WheelchairData extends BaseCardData {
  frameType: string;
  tier: string;
  trait: string;
  range: string;
  damage: string;
  burden: string;
  evasionMod: string;
  feature: string;
  actions: string;
  consequences: string;
}

export interface AnomalyData extends BaseCardData {
  containmentClass: string;
  source: string;
  procedures: string;
  effects: string;
  drawback: string;
}

export interface StrongholdData extends BaseCardData {
  functions: string;
  restrictions: string;
}

export interface EnvironmentFeature {
  name: string;
  type: string;     // 动作 / 反应 / 被动
  isFear: boolean;  // 是否为恐惧特性
  fearCost: string; // 恐惧点花费 (仅 isFear 时有效)
  description: string;
  guidingQuestion: string; // 引导问题
}

export interface EnvironmentData extends BaseCardData {
  tier: string;           // 位阶
  envType: string;        // 探索型 / 社交型 / 险境型 / 事件型
  tendency: string;       // 趋向
  difficulty: string;     // 难度
  potentialEnemies: string; // 潜在敌人
  features: EnvironmentFeature[];
}

export interface LandmarkData extends BaseCardData {
  appearance: string; // 外观
  functions: string;  // 功能
  notes: string;      // 特殊备注
}

// Union type for all card data
export type CardData = 
  | WeaponData 
  | ArmorData 
  | LootData 
  | ConsumableData 
  | DomainData 
  | StoryData 
  | ClassData 
  | SubclassData 
  | AncestryData 
  | CommunityData 
  | NpcData 
  | CalamityData
  | IngredientData
  | MealData
  | TransformationData
  | MaterialData
  | VehicleData
  | MadnessData
  | ClueData
  | ProphecyData
  | QuestionData
  | QuestData
  | SubWeaponData
  | WheelchairData
  | AnomalyData
  | StrongholdData
  | EnvironmentData
  | LandmarkData;

export interface LibraryItem {
  id: string;
  data: CardData;
  updatedAt: number;
}
