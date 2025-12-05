import AsyncStorage from '@react-native-async-storage/async-storage';

interface StorageKeys {
  PLAYER_DATA: '@lure_fishing_player';
  EQUIPMENT: '@lure_fishing_equipment';
  INVENTORY: '@lure_fishing_inventory';
  ACHIEVEMENTS: '@lure_fishing_achievements';
  TASKS: '@lure_fishing_tasks';
  SETTINGS: '@lure_fishing_settings';
  GAME_STATE: '@lure_fishing_game_state';
  STATISTICS: '@lure_fishing_statistics';
  LAST_SAVE: '@lure_fishing_last_save';
}

export const STORAGE_KEYS: StorageKeys = {
  PLAYER_DATA: '@lure_fishing_player',
  EQUIPMENT: '@lure_fishing_equipment',
  INVENTORY: '@lure_fishing_inventory',
  ACHIEVEMENTS: '@lure_fishing_achievements',
  TASKS: '@lure_fishing_tasks',
  SETTINGS: '@lure_fishing_settings',
  GAME_STATE: '@lure_fishing_game_state',
  STATISTICS: '@lure_fishing_statistics',
  LAST_SAVE: '@lure_fishing_last_save',
};

export class StorageManager {
  /**
   * 保存数据到本地存储
   */
  static async saveData<T>(key: string, data: T): Promise<boolean> {
    try {
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem(key, jsonValue);
      
      // 更新最后保存时间
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_SAVE, Date.now().toString());
      
      console.log(`✅ Successfully saved data to ${key}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to save data to ${key}:`, error);
      return false;
    }
  }

  /**
   * 从本地存储加载数据
   */
  static async loadData<T>(key: string, defaultValue: T): Promise<T> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      if (jsonValue !== null) {
        const data = JSON.parse(jsonValue);
        console.log(`✅ Successfully loaded data from ${key}`);
        return data;
      }
    } catch (error) {
      console.error(`❌ Failed to load data from ${key}:`, error);
    }
    
    return defaultValue;
  }

  /**
   * 删除指定键的数据
   */
  static async removeData(key: string): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(key);
      console.log(`✅ Successfully removed data from ${key}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to remove data from ${key}:`, error);
      return false;
    }
  }

  /**
   * 清空所有游戏数据
   */
  static async clearAllData(): Promise<boolean> {
    try {
      const keys = Object.values(STORAGE_KEYS);
      await AsyncStorage.multiRemove(keys);
      console.log('✅ Successfully cleared all game data');
      return true;
    } catch (error) {
      console.error('❌ Failed to clear all game data:', error);
      return false;
    }
  }

  /**
   * 获取存储空间使用情况
   */
  static async getStorageInfo(): Promise<{
    totalKeys: number;
    lastSave: number | null;
    dataExists: { [key: string]: boolean };
  }> {
    try {
      const keys = Object.values(STORAGE_KEYS);
      const keyPairs = await AsyncStorage.multiGet(keys);
      
      const dataExists: { [key: string]: boolean } = {};
      let existingKeysCount = 0;
      
      keyPairs.forEach(([key, value]) => {
        const exists = value !== null;
        dataExists[key] = exists;
        if (exists) existingKeysCount++;
      });

      const lastSaveStr = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SAVE);
      const lastSave = lastSaveStr ? parseInt(lastSaveStr, 10) : null;

      return {
        totalKeys: existingKeysCount,
        lastSave,
        dataExists,
      };
    } catch (error) {
      console.error('❌ Failed to get storage info:', error);
      return {
        totalKeys: 0,
        lastSave: null,
        dataExists: {},
      };
    }
  }

  /**
   * 备份数据（导出为JSON字符串）
   */
  static async exportData(): Promise<string | null> {
    try {
      const keys = Object.values(STORAGE_KEYS);
      const keyPairs = await AsyncStorage.multiGet(keys);
      
      const backup: { [key: string]: any } = {};
      keyPairs.forEach(([key, value]) => {
        if (value) {
          backup[key] = JSON.parse(value);
        }
      });

      backup['export_date'] = Date.now();
      backup['app_version'] = '1.0.0';
      
      console.log('✅ Successfully exported game data');
      return JSON.stringify(backup, null, 2);
    } catch (error) {
      console.error('❌ Failed to export game data:', error);
      return null;
    }
  }

  /**
   * 导入数据（从JSON字符串恢复）
   */
  static async importData(jsonData: string): Promise<boolean> {
    try {
      const backup = JSON.parse(jsonData);
      
      const savePromises: Promise<boolean>[] = [];
      
      Object.entries(backup).forEach(([key, value]) => {
        // 跳过元数据
        if (key === 'export_date' || key === 'app_version') return;
        
        if (Object.values(STORAGE_KEYS).includes(key as StorageKeys[keyof StorageKeys])) {
          savePromises.push(this.saveData(key, value));
        }
      });

      const results = await Promise.all(savePromises);
      const allSuccess = results.every(result => result === true);
      
      if (allSuccess) {
        console.log('✅ Successfully imported game data');
      } else {
        console.log('⚠️ Partial import completed');
      }
      
      return allSuccess;
    } catch (error) {
      console.error('❌ Failed to import game data:', error);
      return false;
    }
  }

  /**
   * 检查数据完整性
   */
  static async validateData(): Promise<{
    isValid: boolean;
    issues: string[];
  }> {
    const issues: string[] = [];
    
    try {
      // 检查必需的数据是否存在
      const playerData = await AsyncStorage.getItem(STORAGE_KEYS.PLAYER_DATA);
      const equipmentData = await AsyncStorage.getItem(STORAGE_KEYS.EQUIPMENT);
      const inventoryData = await AsyncStorage.getItem(STORAGE_KEYS.INVENTORY);
      
      if (!playerData) issues.push('Missing player data');
      if (!equipmentData) issues.push('Missing equipment data');
      if (!inventoryData) issues.push('Missing inventory data');
      
      // 检查数据格式
      if (playerData) {
        try {
          const player = JSON.parse(playerData);
          if (typeof player.level !== 'number' || player.level < 1) {
            issues.push('Invalid player level');
          }
          if (typeof player.coins !== 'number' || player.coins < 0) {
            issues.push('Invalid coins amount');
          }
        } catch {
          issues.push('Corrupted player data');
        }
      }
      
      return {
        isValid: issues.length === 0,
        issues,
      };
    } catch (error) {
      console.error('❌ Data validation failed:', error);
      return {
        isValid: false,
        issues: ['Validation process failed'],
      };
    }
  }

  /**
   * 自动保存管理器
   */
  static createAutoSave(): {
    startAutoSave: (saveFunction: () => Promise<void>, intervalMs: number) => void;
    stopAutoSave: () => void;
    saveNow: () => Promise<void>;
  } {
    let autoSaveTimer: NodeJS.Timeout | null = null;
    let saveFunction: (() => Promise<void>) | null = null;

    const startAutoSave = (func: () => Promise<void>, intervalMs: number) => {
      stopAutoSave(); // 清除之前的定时器
      saveFunction = func;
      
      autoSaveTimer = setInterval(async () => {
        try {
          if (saveFunction) {
            await saveFunction();
          }
        } catch (error) {
          console.error('❌ Auto-save failed:', error);
        }
      }, intervalMs);
      
      console.log(`🔄 Auto-save started with ${intervalMs}ms interval`);
    };

    const stopAutoSave = () => {
      if (autoSaveTimer) {
        clearInterval(autoSaveTimer);
        autoSaveTimer = null;
        console.log('⏹️ Auto-save stopped');
      }
    };

    const saveNow = async () => {
      if (saveFunction) {
        await saveFunction();
      }
    };

    return {
      startAutoSave,
      stopAutoSave,
      saveNow,
    };
  }
}