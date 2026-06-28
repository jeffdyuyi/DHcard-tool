
import React from 'react';
import { CardType } from './types';
import { 
  Sword, Shield, Gem, FlaskConical, Flame, ScrollText, Crown, Sparkles, Dna, Tent, UserCircle2, Skull, Carrot, Utensils,
  Moon as MoonIcon, Hammer, Ship, Brain, Search, Eye, HelpCircle, Compass, Swords
} from 'lucide-react';

export const TOOL_ICONS: Record<CardType, React.ReactNode> = {
  [CardType.WEAPON]: <Sword size={24} strokeWidth={1.5} />,
  [CardType.SUB_WEAPON]: <Swords size={24} strokeWidth={1.5} />,
  [CardType.ARMOR]: <Shield size={24} strokeWidth={1.5} />,
  [CardType.LOOT]: <Gem size={24} strokeWidth={1.5} />,
  [CardType.CONSUMABLE]: <FlaskConical size={24} strokeWidth={1.5} />,
  [CardType.DOMAIN]: <Flame size={24} strokeWidth={1.5} />,
  [CardType.STORY]: <ScrollText size={24} strokeWidth={1.5} />,
  [CardType.CLASS]: <Crown size={24} strokeWidth={1.5} />,
  [CardType.SUBCLASS]: <Sparkles size={24} strokeWidth={1.5} />,
  [CardType.ANCESTRY]: <Dna size={24} strokeWidth={1.5} />,
  [CardType.COMMUNITY]: <Tent size={24} strokeWidth={1.5} />,
  [CardType.NPC]: <UserCircle2 size={24} strokeWidth={1.5} />,
  [CardType.CALAMITY]: <Skull size={24} strokeWidth={1.5} />,
  [CardType.INGREDIENT]: <Carrot size={24} strokeWidth={1.5} />,
  [CardType.MEAL]: <Utensils size={24} strokeWidth={1.5} />,
  [CardType.TRANSFORMATION]: <MoonIcon size={24} strokeWidth={1.5} />,
  [CardType.MATERIAL]: <Hammer size={24} strokeWidth={1.5} />,
  [CardType.VEHICLE]: <Ship size={24} strokeWidth={1.5} />,
  [CardType.MADNESS]: <Brain size={24} strokeWidth={1.5} />,
  [CardType.CLUE]: <Search size={24} strokeWidth={1.5} />,
  [CardType.PROPHECY]: <Eye size={24} strokeWidth={1.5} />,
  [CardType.QUESTION]: <HelpCircle size={24} strokeWidth={1.5} />,
  [CardType.QUEST]: <Compass size={24} strokeWidth={1.5} />,
};
