import React, { createContext, useContext } from 'react';
import { 
  FISH_DATABASE, 
  FISHING_SCENES, 
  LURE_TYPES, 
  ROD_TYPES, 
  REEL_TYPES,
  WEATHER_TYPES,
  TIME_OF_DAY,
  SEASONS,
  RARITY_CONFIG,
  GAME_CONSTANTS
} from './gameConfig';

interface DataContextType {
  fishDatabase: typeof FISH_DATABASE;
  fishingScenes: typeof FISHING_SCENES;
  lureTypes: typeof LURE_TYPES;
  rodTypes: typeof ROD_TYPES;
  reelTypes: typeof REEL_TYPES;
  weatherTypes: typeof WEATHER_TYPES;
  timeOfDay: typeof TIME_OF_DAY;
  seasons: typeof SEASONS;
  rarityConfig: typeof RARITY_CONFIG;
  gameConstants: typeof GAME_CONSTANTS;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value: DataContextType = {
    fishDatabase: FISH_DATABASE,
    fishingScenes: FISHING_SCENES,
    lureTypes: LURE_TYPES,
    rodTypes: ROD_TYPES,
    reelTypes: REEL_TYPES,
    weatherTypes: WEATHER_TYPES,
    timeOfDay: TIME_OF_DAY,
    seasons: SEASONS,
    rarityConfig: RARITY_CONFIG,
    gameConstants: GAME_CONSTANTS,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};