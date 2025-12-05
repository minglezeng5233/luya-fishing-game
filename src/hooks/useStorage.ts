import { useEffect, useCallback, useState } from 'react';
import { useGame } from '../game/GameContext';
import { StorageManager, STORAGE_KEYS } from '../utils/storage';

export const useStorage = () => {
  const {
    player,
    equipment,
    inventory,
    achievements,
    tasks,
    settings,
    gameState,
    currentScene,
    setPlayer,
    setEquipment,
    setInventory,
    setAchievements,
    setTasks,
    setSettings,
  } = useGame();

  const [isLoading, setIsLoading] = useState(true);
  const [lastSave, setLastSave] = useState<number | null>(null);

  /**
   * 加载所有游戏数据
   */
  const loadGameData = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('🔄 Loading game data...');

      // 并行加载所有数据
      const [
        loadedPlayer,
        loadedEquipment,
        loadedInventory,
        loadedAchievements,
        loadedTasks,
        loadedSettings,
      ] = await Promise.all([
        StorageManager.loadData(STORAGE_KEYS.PLAYER_DATA, player),
        StorageManager.loadData(STORAGE_KEYS.EQUIPMENT, equipment),
        StorageManager.loadData(STORAGE_KEYS.INVENTORY, inventory),
        StorageManager.loadData(STORAGE_KEYS.ACHIEVEMENTS, achievements),
        StorageManager.loadData(STORAGE_KEYS.TASKS, tasks),
        StorageManager.loadData(STORAGE_KEYS.SETTINGS, settings),
      ]);

      // 设置加载的数据
      setPlayer(loadedPlayer);
      setEquipment(loadedEquipment);
      setInventory(loadedInventory);
      setAchievements(loadedAchievements);
      setTasks(loadedTasks);
      setSettings(loadedSettings);

      // 获取最后保存时间
      const lastSaveTime = await StorageManager.loadData(
        STORAGE_KEYS.LAST_SAVE, 
        null as number | null
      );
      setLastSave(lastSaveTime);

      console.log('✅ Game data loaded successfully');
    } catch (error) {
      console.error('❌ Failed to load game data:', error);
      // 加载失败时使用默认值
    } finally {
      setIsLoading(false);
    }
  }, [
    player, equipment, inventory, achievements, tasks, settings,
    setPlayer, setEquipment, setInventory, setAchievements, setTasks, setSettings
  ]);

  /**
   * 保存所有游戏数据
   */
  const saveGameData = useCallback(async () => {
    try {
      console.log('💾 Saving game data...');

      // 并行保存所有数据
      const savePromises = [
        StorageManager.saveData(STORAGE_KEYS.PLAYER_DATA, player),
        StorageManager.saveData(STORAGE_KEYS.EQUIPMENT, equipment),
        StorageManager.saveData(STORAGE_KEYS.INVENTORY, inventory),
        StorageManager.saveData(STORAGE_KEYS.ACHIEVEMENTS, achievements),
        StorageManager.saveData(STORAGE_KEYS.TASKS, tasks),
        StorageManager.saveData(STORAGE_KEYS.SETTINGS, settings),
        StorageManager.saveData(STORAGE_KEYS.GAME_STATE, {
          gameState,
          currentScene,
        }),
      ];

      const results = await Promise.all(savePromises);
      const allSuccess = results.every(result => result === true);

      if (allSuccess) {
        console.log('✅ Game data saved successfully');
        setLastSave(Date.now());
      } else {
        console.log('⚠️ Some data failed to save');
      }

      return allSuccess;
    } catch (error) {
      console.error('❌ Failed to save game data:', error);
      return false;
    }
  }, [
    player, equipment, inventory, achievements, tasks, settings,
    gameState, currentScene
  ]);

  /**
   * 保存特定类型的数据
   */
  const saveDataType = useCallback(async (
    dataType: 'player' | 'equipment' | 'inventory' | 'achievements' | 'tasks' | 'settings',
    data: any
  ) => {
    try {
      let key: string;
      
      switch (dataType) {
        case 'player':
          key = STORAGE_KEYS.PLAYER_DATA;
          break;
        case 'equipment':
          key = STORAGE_KEYS.EQUIPMENT;
          break;
        case 'inventory':
          key = STORAGE_KEYS.INVENTORY;
          break;
        case 'achievements':
          key = STORAGE_KEYS.ACHIEVEMENTS;
          break;
        case 'tasks':
          key = STORAGE_KEYS.TASKS;
          break;
        case 'settings':
          key = STORAGE_KEYS.SETTINGS;
          break;
        default:
          return false;
      }

      return await StorageManager.saveData(key, data);
    } catch (error) {
      console.error(`❌ Failed to save ${dataType} data:`, error);
      return false;
    }
  }, []);

  /**
   * 重置游戏数据
   */
  const resetGameData = useCallback(async () => {
    try {
      const success = await StorageManager.clearAllData();
      
      if (success) {
        console.log('🔄 Game data reset, reloading...');
        await loadGameData();
        setLastSave(null);
      }
      
      return success;
    } catch (error) {
      console.error('❌ Failed to reset game data:', error);
      return false;
    }
  }, [loadGameData]);

  /**
   * 导出游戏数据
   */
  const exportGameData = useCallback(async () => {
    try {
      const exportData = await StorageManager.exportData();
      return exportData;
    } catch (error) {
      console.error('❌ Failed to export game data:', error);
      return null;
    }
  }, []);

  /**
   * 导入游戏数据
   */
  const importGameData = useCallback(async (jsonData: string) => {
    try {
      const success = await StorageManager.importData(jsonData);
      
      if (success) {
        console.log('🔄 Import successful, reloading game data...');
        await loadGameData();
      }
      
      return success;
    } catch (error) {
      console.error('❌ Failed to import game data:', error);
      return false;
    }
  }, [loadGameData]);

  /**
   * 获取存储信息
   */
  const getStorageInfo = useCallback(async () => {
    try {
      return await StorageManager.getStorageInfo();
    } catch (error) {
      console.error('❌ Failed to get storage info:', error);
      return {
        totalKeys: 0,
        lastSave: null,
        dataExists: {},
      };
    }
  }, []);

  /**
   * 验证数据完整性
   */
  const validateGameData = useCallback(async () => {
    try {
      return await StorageManager.validateData();
    } catch (error) {
      console.error('❌ Failed to validate game data:', error);
      return {
        isValid: false,
        issues: ['Validation process failed'],
      };
    }
  }, []);

  // 应用启动时加载数据
  useEffect(() => {
    loadGameData();
  }, []);

  // 自动保存设置变更
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        saveDataType('settings', settings);
      }, 1000); // 1秒延迟保存设置
      
      return () => clearTimeout(timer);
    }
  }, [settings, isLoading, saveDataType]);

  // 自动保存玩家数据变更
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        saveDataType('player', player);
      }, 2000); // 2秒延迟保存玩家数据
      
      return () => clearTimeout(timer);
    }
  }, [player, isLoading, saveDataType]);

  // 应用切换到后台时保存数据
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'background') {
        saveGameData();
      }
    };

    // 在实际应用中，这里应该监听应用状态变化
    // AppState.addEventListener('change', handleAppStateChange);

    return () => {
      // AppState.removeEventListener('change', handleAppStateChange);
    };
  }, [saveGameData]);

  return {
    isLoading,
    lastSave,
    loadGameData,
    saveGameData,
    saveDataType,
    resetGameData,
    exportGameData,
    importGameData,
    getStorageInfo,
    validateGameData,
  };
};