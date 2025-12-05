export const WEATHER_TYPES = [
  { id: 'sunny', name: '晴天', icon: '☀️', biteMultiplier: 1.0 },
  { id: 'cloudy', name: '多云', icon: '☁️', biteMultiplier: 0.9 },
  { id: 'rainy', name: '雨天', icon: '🌧️', biteMultiplier: 1.3 },
  { id: 'windy', name: '大风', icon: '💨', biteMultiplier: 0.7 },
  { id: 'storm', name: '暴风雨', icon: '⛈️', biteMultiplier: 1.5 },
];

export const TIME_OF_DAY = [
  { id: 'dawn', name: '清晨', hour: 6, biteMultiplier: 1.2 },
  { id: 'day', name: '白天', hour: 12, biteMultiplier: 1.0 },
  { id: 'dusk', name: '黄昏', hour: 18, biteMultiplier: 1.3 },
  { id: 'night', name: '夜晚', hour: 0, biteMultiplier: 1.1 },
];

export const SEASONS = [
  { id: 'spring', name: '春季', color: '#48bb78', biteMultiplier: 1.1 },
  { id: 'summer', name: '夏季', color: '#ed8936', biteMultiplier: 1.0 },
  { id: 'autumn', name: '秋季', color: '#9f7aea', biteMultiplier: 1.2 },
  { id: 'winter', name: '冬季', color: '#4299e1', biteMultiplier: 0.8 },
];

export const RARITY_CONFIG = {
  common: { 
    name: '普通', 
    color: '#94a3b8', 
    gradient: ['#64748b', '#94a3b8'],
    stars: 1,
    weight: 10 
  },
  uncommon: { 
    name: '罕见', 
    color: '#22c55e', 
    gradient: ['#16a34a', '#22c55e'],
    stars: 2,
    weight: 5 
  },
  rare: { 
    name: '稀有', 
    color: '#3b82f6', 
    gradient: ['#2563eb', '#3b82f6'],
    stars: 3,
    weight: 3 
  },
  epic: { 
    name: '史诗', 
    color: '#f59e0b', 
    gradient: ['#d97706', '#f59e0b'],
    stars: 4,
    weight: 2 
  },
  legendary: { 
    name: '传说', 
    color: '#ef4444', 
    gradient: ['#dc2626', '#ef4444'],
    stars: 5,
    weight: 1 
  },
};

export const GAME_CONSTANTS = {
  MAX_LEVEL: 100,
  EXP_PER_LEVEL: 1000,
  SKILL_LEVEL_MULTIPLIER: 0.1,
  CAST_POWER_MULTIPLIER: 0.05,
  REEL_SPEED_MULTIPLIER: 0.08,
  TENSION_WARNING_THRESHOLD: 80,
  TENSION_BREAK_THRESHOLD: 95,
  NOTIFICATION_DURATION: 3000,
  GAME_SPEED_MULTIPLIER: 10,
  WEATHER_CHANGE_INTERVAL: 120,
  DAY_LENGTH: 24,
  SEASON_LENGTH: 3,
};