import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useGame } from '../game/GameContext';
import { useData } from '../data/DataContext';
import GameCanvas from '../components/game/GameCanvas';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const { width, height } = Dimensions.get('window');

const FishingScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { 
    gameState, 
    player, 
    equipment, 
    weather, 
    time, 
    fishingState, 
    inventory, 
    setGameState,
    setFishingState,
    setPlayer,
    setInventory,
    showNotification,
    settings,
    vibration,
  } = useGame();
  
  const { fishingScenes, weatherTypes, timeOfDay, seasons, WEATHER_TYPES } = useData();

  const [showFishCaught, setShowFishCaught] = useState(false);
  const [caughtFish, setCaughtFish] = useState<any>(null);

  useEffect(() => {
    // 游戏时间更新
    const timer = setInterval(() => {
      setTime(prev => {
        let newMinute = prev.minute + 1;
        let newHour = prev.hour;
        let newDay = prev.day;
        
        if (newMinute >= 60) {
          newHour = (newHour + 1) % 24;
          newMinute = 0;
          
          if (newHour === 0) {
            newDay = prev.day + 1;
          }
        }
        
        return {
          ...prev,
          hour: newHour,
          minute: newMinute,
          day: newDay,
        };
      });
    }, 60000); // 每分钟更新一次

    return () => clearInterval(timer);
  }, []);

  const getCurrentTimeType = () => {
    const hour = time.hour;
    if (hour >= 5 && hour < 8) return 'dawn';
    if (hour >= 8 && hour < 17) return 'day';
    if (hour >= 17 && hour < 20) return 'dusk';
    return 'night';
  };

  const getCurrentSeason = () => {
    return seasons.find(s => s.id === time.season);
  };

  const getCurrentWeather = () => {
    return weatherTypes.find(w => w.id === weather.condition);
  };

  const handleFishCaught = (fish: any) => {
    setCaughtFish(fish);
    setShowFishCaught(true);
    
    // 更新玩家数据
    const experience = Math.floor(fish.value * 0.5);
    const newExp = player.exp + experience;
    const levelUp = Math.floor(newExp / 1000);
    
    setPlayer(prev => ({
      ...prev,
      coins: prev.coins + fish.value,
      exp: newExp,
      totalFishCaught: prev.totalFishCaught + 1,
      totalValue: prev.totalValue + fish.value,
      level: prev.level + levelUp,
    }));
    
    setInventory(prev => ({
      ...prev,
      caughtFish: [...prev.caughtFish, fish]
    }));
    
    setFishingState(prev => ({ ...prev, stage: 'caught' }));
    
    showNotification(
      `成功钓到 ${fish.name}！重量: ${fish.weight}kg，价值: ${fish.value}金币，经验: ${experience}`,
      'success'
    );

    // 震动反馈
    if (settings.vibration) {
      // 这里可以添加震动逻辑
    }
  };

  const renderHeader = () => (
    <View style={[styles.header, { paddingTop: insets.top }]}>
      {/* 玩家信息 */}
      <View style={styles.playerInfo}>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>{player.level}</Text>
        </View>
        <View>
          <Text style={styles.playerName}>钓鱼大师</Text>
          <View style={styles.expBar}>
            <View 
              style={[
                styles.expFill, 
                { width: `${((player.exp % 1000) / 1000) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.expText}>EXP: {player.exp % 1000}/1000</Text>
        </View>
      </View>

      {/* 资源显示 */}
      <View style={styles.resources}>
        <View style={styles.resource}>
          <Ionicons name="cash" size={16} color="#fbbf24" />
          <Text style={styles.resourceText}>{player.coins}</Text>
        </View>
        <View style={styles.resource}>
          <Ionicons name="diamond" size={16} color="#60a5fa" />
          <Text style={styles.resourceText}>{player.diamonds}</Text>
        </View>
        <View style={styles.resource}>
          <Ionicons name="fish" size={16} color="#22c55e" />
          <Text style={styles.resourceText}>{player.totalFishCaught}</Text>
        </View>
      </View>
    </View>
  );

  const renderTimeWeather = () => (
    <View style={styles.timeWeather}>
      <View style={styles.timeInfo}>
        <Ionicons name="time" size={16} color="#9ca3af" />
        <Text style={styles.timeText}>
          {String(time.hour).padStart(2, '0')}:{String(time.minute).padStart(2, '0')}
        </Text>
        <Text style={styles.timeTypeText}>
          ({timeOfDay.find(t => t.id === getCurrentTimeType())?.name})
        </Text>
      </View>
      
      <View style={styles.weatherInfo}>
        <Text style={styles.weatherIcon}>
          {getCurrentWeather()?.icon}
        </Text>
        <Text style={styles.weatherText}>
          {getCurrentWeather()?.name}
        </Text>
      </View>

      <View style={styles.seasonInfo}>
        <View style={[styles.seasonDot, { backgroundColor: getCurrentSeason()?.color }]} />
        <Text style={styles.seasonText}>{getCurrentSeason()?.name}</Text>
      </View>
    </View>
  );

  const renderEquipment = () => (
    <View style={styles.equipment}>
      <View style={styles.equipmentItem}>
        <Ionicons name="build" size={16} color="#9ca3af" />
        <Text style={styles.equipmentText}>{equipment.rod.name}</Text>
      </View>
      <View style={styles.equipmentItem}>
        <Ionicons name="refresh-circle" size={16} color="#9ca3af" />
        <Text style={styles.equipmentText}>{equipment.reel.name}</Text>
      </View>
      <View style={styles.equipmentItem}>
        <Ionicons name="color-palette" size={16} color="#9ca3af" />
        <Text style={styles.equipmentText}>{equipment.lure.name}</Text>
      </View>
    </View>
  );

  const renderFishCaughtModal = () => {
    if (!showFishCaught || !caughtFish) return null;

    return (
      <View style={styles.fishCaughtModal}>
        <View style={styles.fishCaughtContent}>
          <View style={styles.fishCaughtHeader}>
            <Ionicons name="trophy" size={48} color="#fbbf24" />
            <Text style={styles.fishCaughtTitle}>钓鱼成功！</Text>
          </View>
          
          <View style={styles.fishCaughtInfo}>
            <Text style={styles.fishName}>{caughtFish.name}</Text>
            <View style={styles.fishStats}>
              <View style={styles.fishStat}>
                <Text style={styles.fishStatLabel}>重量</Text>
                <Text style={styles.fishStatValue}>{caughtFish.weight}kg</Text>
              </View>
              <View style={styles.fishStat}>
                <Text style={styles.fishStatLabel}>价值</Text>
                <Text style={styles.fishStatValue}>{caughtFish.value}金币</Text>
              </View>
              <View style={styles.fishStat}>
                <Text style={styles.fishStatLabel}>稀有度</Text>
                <Text style={styles.fishStatValue}>{caughtFish.rarity}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.fishCaughtActions}>
            <Button
              title="拍照留念"
              onPress={() => {
                setShowFishCaught(false);
                // 拍照功能
              }}
              variant="secondary"
            />
            <Button
              title="继续钓鱼"
              onPress={() => {
                setShowFishCaught(false);
                setFishingState(prev => ({ ...prev, stage: 'idle' }));
              }}
              variant="primary"
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderTimeWeather()}
      
      <GameCanvas onFishCaught={handleFishCaught} />
      
      {renderEquipment()}
      
      {renderFishCaughtModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    zIndex: 10,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  levelText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  expBar: {
    width: 120,
    height: 4,
    backgroundColor: '#374151',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 2,
  },
  expFill: {
    height: '100%',
    backgroundColor: '#22c55e',
    borderRadius: 2,
  },
  expText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  resources: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  resource: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  resourceText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  timeWeather: {
    position: 'absolute',
    top: 120,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 12,
    borderRadius: 12,
    zIndex: 5,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  timeTypeText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  weatherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  weatherIcon: {
    fontSize: 16,
  },
  weatherText: {
    fontSize: 14,
    color: '#ffffff',
  },
  seasonInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  seasonDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  seasonText: {
    fontSize: 14,
    color: '#ffffff',
  },
  equipment: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 12,
    borderRadius: 12,
    zIndex: 5,
  },
  equipmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  equipmentText: {
    fontSize: 12,
    color: '#ffffff',
  },
  fishCaughtModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  fishCaughtContent: {
    backgroundColor: '#1f2937',
    margin: 40,
    padding: 24,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fbbf24',
    alignItems: 'center',
  },
  fishCaughtHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  fishCaughtTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 12,
  },
  fishCaughtInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  fishName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  fishStats: {
    flexDirection: 'row',
    gap: 20,
  },
  fishStat: {
    alignItems: 'center',
  },
  fishStatLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
  },
  fishStatValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  fishCaughtActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
});

export default FishingScreen;