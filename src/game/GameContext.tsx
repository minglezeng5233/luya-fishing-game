import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { GameContextType, Player, Equipment, Weather, GameTime, FishingState, Inventory, Achievement, Task, Settings } from '../types';
import { useData } from '../data/DataContext';
import { useStorage } from '../hooks/useStorage';
import { LURE_TYPES, ROD_TYPES, REEL_TYPES } from '../data/equipment';

const initialPlayer: Player = {
  level: 1,
  exp: 0,
  coins: 1000,
  diamonds: 10,
  totalFishCaught: 0,
  totalValue: 0,
  unlockedScenes: ['lake'],
  unlockedAchievements: [],
  fishingSkill: 1,
  castingSkill: 1,
  reelingSkill: 1,
};

const initialEquipment: Equipment = {
  rod: ROD_TYPES[0],
  reel: REEL_TYPES[0],
  lure: LURE_TYPES[0],
  line: { name: '尼龙线', strength: 50, durability: 100 },
};

const initialWeather: Weather = {
  condition: 'sunny',
  temperature: 22,
  windSpeed: 3,
  windDirection: 45,
  nextChange: 120,
};

const initialTime: GameTime = {
  hour: 12,
  minute: 0,
  season: 'spring',
  day: 1,
};

const initialFishingState: FishingState = {
  stage: 'idle',
  castDistance: 0,
  castAccuracy: 100,
  lurePosition: { x: 400, y: 300, depth: 0 },
  lureVelocity: { x: 0, y: 0 },
  targetFish: null,
  fishPosition: { x: 0, y: 0 },
  fishStruggle: 0,
  tension: 0,
  maxTension: 100,
  progress: 0,
  timer: 0,
  waterDepth: 10,
  currentSpeed: 0.5,
};

const initialInventory: Inventory = {
  lures: LURE_TYPES.slice(0, 3).map(lure => ({ ...lure, quantity: 1 })),
  caughtFish: [],
  photoAlbum: [],
};

const initialAchievements: Achievement[] = [
  { id: 'first_catch', name: '初次收获', description: '钓到第一条鱼', reward: 100, unlocked: false },
  { id: 'master_angler', name: '钓鱼大师', description: '钓到100条鱼', reward: 500, unlocked: false },
  { id: 'big_catch', name: '巨物挑战', description: '钓到超过10kg的鱼', reward: 300, unlocked: false },
  { id: 'rare_collector', name: '稀有收藏家', description: '钓到所有稀有鱼种', reward: 1000, unlocked: false },
];

const initialTasks: Task[] = [
  { id: 1, name: '新手训练', description: '钓到3条鲤鱼', type: 'quantity', target: { fishId: 1, count: 3 }, reward: 200, progress: 0 },
  { id: 2, name: '鲈鱼挑战', description: '钓到一条黑鲈', type: 'specific', target: { fishId: 2 }, reward: 300, progress: 0 },
  { id: 3, name: '重量比拼', description: '钓到总重5kg的鱼', type: 'weight', target: { weight: 5 }, reward: 400, progress: 0 },
];

const initialSettings: Settings = {
  sound: true,
  vibration: true,
  graphics: 'medium',
  controls: 'touch',
  darkMode: true,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<'mainMenu' | 'fishing' | 'sceneSelect' | 'shop' | 'collection' | 'settings'>('mainMenu');
  const [currentScene, setCurrentScene] = useState('lake');
  const [player, setPlayer] = useState(initialPlayer);
  const [equipment, setEquipment] = useState(initialEquipment);
  const [weather, setWeather] = useState(initialWeather);
  const [time, setTime] = useState(initialTime);
  const [fishingState, setFishingState] = useState(initialFishingState);
  const [inventory, setInventory] = useState(initialInventory);
  const [achievements, setAchievements] = useState(initialAchievements);
  const [tasks, setTasks] = useState(initialTasks);
  const [notification, setNotification] = useState<{ message: string; type: string } | null>(null);
  const [settings, setSettings] = useState(initialSettings);

  const { fishingScenes, fishDatabase } = useData();
  const { isLoading, saveGameData, loadGameData, saveDataType } = useStorage();

  // 加载游戏数据
  useEffect(() => {
    if (!isLoading) {
      loadGameData();
    }
  }, [isLoading, loadGameData]);

  // 自动保存重要数据变更
  useEffect(() => {
    if (!isLoading && inventory.caughtFish.length > 0) {
      const timer = setTimeout(() => {
        saveDataType('inventory', inventory);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [inventory.caughtFish, isLoading, saveDataType]);

  // 保存成就解锁
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        saveDataType('achievements', achievements);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [achievements, isLoading, saveDataType]);

  // 定期自动保存
  useEffect(() => {
    if (!isLoading) {
      const autoSaveInterval = setInterval(() => {
        saveGameData();
      }, 60000); // 每分钟自动保存一次

      return () => clearInterval(autoSaveInterval);
    }
  }, [isLoading, saveGameData, player, equipment, inventory, achievements, tasks, settings, gameState, currentScene]);

  const showNotification = useCallback((message: string, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const castLine = useCallback(() => {
    if (fishingState.stage !== 'idle') return;
    
    const rod = equipment.rod;
    const skillBonus = player.castingSkill * 10;
    
    const baseDistance = rod.castingDistance + Math.random() * 20;
    const accuracy = rod.accuracy - Math.random() * 20 + skillBonus;
    
    const windEffect = weather.windSpeed * Math.cos((weather.windDirection - 90) * Math.PI / 180);
    const distance = Math.max(20, Math.min(100, baseDistance + windEffect));
    
    const angle = -60 + (100 - accuracy) * 0.6;
    const rad = angle * Math.PI / 180;
    const x = 400 + distance * Math.cos(rad) * 4;
    const y = 300 + distance * Math.sin(rad) * 2;
    
    setFishingState(prev => ({
      ...prev,
      stage: 'casting',
      castDistance: distance,
      castAccuracy: accuracy,
      lurePosition: { x, y, depth: 0 },
      lureVelocity: { x: Math.cos(rad) * 10, y: Math.sin(rad) * 10 },
      timer: 0,
    }));
    
    setEquipment(prev => ({
      ...prev,
      lure: { ...prev.lure, durability: Math.max(0, prev.lure.durability - 1) }
    }));
    
    showNotification('抛竿中...', 'info');
    
    setTimeout(() => {
      setFishingState(prev => ({ ...prev, stage: 'waiting' }));
      showNotification('等待鱼儿上钩...', 'info');
    }, 1500);
  }, [fishingState.stage, equipment, player, weather, showNotification]);

  const reelIn = useCallback(() => {
    if (fishingState.stage !== 'hooked') return;
    
    showNotification('开始收线！', 'info');
    // 收线逻辑将在后续实现
  }, [fishingState.stage, showNotification]);

  const switchLure = useCallback((lure: typeof LURE_TYPES[0]) => {
    setEquipment(prev => ({ ...prev, lure }));
    showNotification(`切换拟饵：${lure.name}`, 'info');
  }, [showNotification]);

  const buyEquipment = useCallback((type: string, item: any) => {
    if (player.coins < item.cost) {
      showNotification('金币不足！', 'error');
      return;
    }
    
    setPlayer(prev => ({ ...prev, coins: prev.coins - item.cost }));
    
    switch (type) {
      case 'rod':
        setEquipment(prev => ({ ...prev, rod: item }));
        break;
      case 'reel':
        setEquipment(prev => ({ ...prev, reel: item }));
        break;
      case 'lure':
        const existingLure = inventory.lures.find(l => l.id === item.id);
        if (existingLure) {
          setInventory(prev => ({
            ...prev,
            lures: prev.lures.map(l => 
              l.id === item.id ? { ...l, quantity: l.quantity + 1 } : l
            )
          }));
        } else {
          setInventory(prev => ({
            ...prev,
            lures: [...prev.lures, { ...item, quantity: 1 }]
          }));
        }
        break;
    }
    
    showNotification(`购买成功：${item.name}`, 'success');
  }, [player.coins, inventory.lures, showNotification]);

  const unlockScene = useCallback((sceneId: string) => {
    const scene = fishingScenes.find(s => s.id === sceneId);
    if (!scene || player.coins < scene.unlockCost) {
      showNotification('金币不足或场景已解锁！', 'error');
      return;
    }
    
    setPlayer(prev => ({
      ...prev,
      coins: prev.coins - scene.unlockCost,
      unlockedScenes: [...prev.unlockedScenes, sceneId]
    }));
    
    setCurrentScene(sceneId);
    showNotification(`解锁新场景：${scene.name}`, 'success');
  }, [fishingScenes, player.coins, showNotification]);

  const claimTaskReward = useCallback((taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.progress < (task.type === 'weight' ? task.target.weight : task.target.count || 1)) {
      showNotification('任务尚未完成！', 'error');
      return;
    }
    
    setPlayer(prev => ({ ...prev, coins: prev.coins + task.reward }));
    setTasks(prev => prev.filter(t => t.id !== taskId));
    showNotification(`领取任务奖励：${task.reward}金币`, 'success');
  }, [tasks, showNotification]);

  const value: GameContextType = {
    gameState,
    currentScene,
    player,
    equipment,
    weather,
    time,
    fishingState,
    inventory,
    achievements,
    tasks,
    notification,
    settings,
    setGameState,
    setCurrentScene,
    setPlayer,
    setEquipment,
    setWeather,
    setTime,
    setFishingState,
    setInventory,
    setAchievements,
    setTasks,
    setNotification,
    setSettings,
    castLine,
    reelIn,
    switchLure,
    buyEquipment,
    unlockScene,
    claimTaskReward,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};