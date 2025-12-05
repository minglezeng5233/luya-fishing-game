export interface Fish {
  id: number;
  name: string;
  species: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  minSize: number;
  maxSize: number;
  baseValue: number;
  preferredBait: string[];
  activeSeasons: string[];
  activeTime: string[];
  struggle: number;
  speed: number;
  size?: number;
  weight?: number;
  value?: number;
}

export interface FishingScene {
  id: string;
  name: string;
  type: 'freshwater' | 'saltwater';
  difficulty: number;
  unlockCost: number;
  description: string;
  colorGradient: string[];
  commonFish: number[];
  rareFish: number[];
  legendaryFish: number[];
  weatherEffects: {
    [key: string]: {
      biteRate: number;
      difficulty: number;
    };
  };
}

export interface Lure {
  id: string;
  name: string;
  type: 'metal' | 'hard' | 'surface' | 'soft' | 'special';
  cost: number;
  effectiveness: {
    freshwater: number;
    saltwater: number;
  };
  description: string;
  durability: number;
  quantity?: number;
}

export interface Rod {
  id: string;
  name: string;
  cost: number;
  power: number;
  accuracy: number;
  durability: number;
  castingDistance: number;
}

export interface Reel {
  id: string;
  name: string;
  cost: number;
  speed: number;
  smoothness: number;
  drag: number;
}

export interface Line {
  name: string;
  strength: number;
  durability: number;
}

export interface Equipment {
  rod: Rod;
  reel: Reel;
  lure: Lure;
  line: Line;
}

export interface Weather {
  condition: string;
  temperature: number;
  windSpeed: number;
  windDirection: number;
  nextChange: number;
}

export interface GameTime {
  hour: number;
  minute: number;
  season: string;
  day: number;
}

export interface FishingState {
  stage: 'idle' | 'casting' | 'waiting' | 'hooked' | 'reeling' | 'caught' | 'failed';
  castDistance: number;
  castAccuracy: number;
  lurePosition: { x: number; y: number; depth: number };
  lureVelocity: { x: number; y: number };
  targetFish: Fish | null;
  fishPosition: { x: number; y: number };
  fishStruggle: number;
  tension: number;
  maxTension: number;
  progress: number;
  timer: number;
  waterDepth: number;
  currentSpeed: number;
}

export interface Player {
  level: number;
  exp: number;
  coins: number;
  diamonds: number;
  totalFishCaught: number;
  totalValue: number;
  unlockedScenes: string[];
  unlockedAchievements: string[];
  fishingSkill: number;
  castingSkill: number;
  reelingSkill: number;
}

export interface Inventory {
  lures: Lure[];
  caughtFish: Fish[];
  photoAlbum: Fish[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  reward: number;
  unlocked: boolean;
}

export interface Task {
  id: number;
  name: string;
  description: string;
  type: 'quantity' | 'specific' | 'weight';
  target: { fishId?: number; count?: number; weight?: number };
  reward: number;
  progress: number;
}

export interface Settings {
  sound: boolean;
  vibration: boolean;
  graphics: 'low' | 'medium' | 'high';
  controls: 'touch' | 'gyro';
  darkMode: boolean;
}

export interface GameContextType {
  gameState: 'mainMenu' | 'fishing' | 'sceneSelect' | 'shop' | 'collection' | 'settings';
  currentScene: string;
  player: Player;
  equipment: Equipment;
  weather: Weather;
  time: GameTime;
  fishingState: FishingState;
  inventory: Inventory;
  achievements: Achievement[];
  tasks: Task[];
  notification: { message: string; type: string } | null;
  settings: Settings;
  setGameState: (state: string) => void;
  setCurrentScene: (scene: string) => void;
  setPlayer: (player: Player) => void;
  setEquipment: (equipment: Equipment) => void;
  setWeather: (weather: Weather) => void;
  setTime: (time: GameTime) => void;
  setFishingState: (state: FishingState) => void;
  setInventory: (inventory: Inventory) => void;
  setAchievements: (achievements: Achievement[]) => void;
  setTasks: (tasks: Task[]) => void;
  setNotification: (notification: { message: string; type: string } | null) => void;
  setSettings: (settings: Settings) => void;
  castLine: () => void;
  reelIn: () => void;
  switchLure: (lure: Lure) => void;
  buyEquipment: (type: string, item: any) => void;
  unlockScene: (sceneId: string) => void;
  claimTaskReward: (taskId: number) => void;
}