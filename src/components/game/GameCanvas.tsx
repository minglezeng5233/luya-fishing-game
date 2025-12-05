import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Animated, PanGestureHandler, State } from 'react-native';
import { PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { useGame } from '../../game/GameContext';
import { useData } from '../../data/DataContext';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface GameCanvasProps {
  onFishCaught: (fish: any) => void;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ onFishCaught }) => {
  const { 
    fishingState, 
    equipment, 
    weather, 
    castLine, 
    reelIn, 
    setGameState 
  } = useGame();
  const { fishingScenes, rarityConfig } = useData();

  const [lurePosition, setLurePosition] = useState({ x: width * 0.6, y: height * 0.4 });
  const [fishPosition, setFishPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [castPower, setCastPower] = useState(0);

  const currentScene = fishingScenes.find(s => s.id === 'lake'); // 简化示例

  useEffect(() => {
    if (fishingState.stage === 'hooked' && fishingState.targetFish) {
      const interval = setInterval(() => {
        setFishPosition(prev => ({
          x: lurePosition.x + Math.sin(Date.now() / 500) * 50,
          y: lurePosition.y + Math.cos(Date.now() / 700) * 30,
        }));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [fishingState.stage, fishingState.targetFish, lurePosition]);

  const handlePanGesture = (event: any) => {
    if (fishingState.stage !== 'idle') return;

    switch (event.nativeEvent.state) {
      case State.ACTIVE:
        setIsDragging(true);
        const distance = Math.sqrt(
          Math.pow(event.nativeEvent.translationX, 2) + 
          Math.pow(event.nativeEvent.translationY, 2)
        );
        setCastPower(Math.min(distance / 3, 100));
        break;

      case State.END:
        if (isDragging && castPower > 30) {
          performCast();
        }
        setIsDragging(false);
        setCastPower(0);
        break;
    }
  };

  const performCast = () => {
    const angle = -Math.PI / 4; // 45度角
    const distance = (castPower / 100) * 200 + 100;
    
    const newX = width * 0.6 + Math.cos(angle) * distance;
    const newY = height * 0.4 + Math.sin(angle) * distance;
    
    setLurePosition({ x: newX, y: newY });
    castLine();
    
    // 模拟等待鱼上钩
    setTimeout(() => {
      if (Math.random() > 0.3) {
        // 鱼上钩了
        onFishCaught({
          id: 1,
          name: '鲤鱼',
          rarity: 'common',
          weight: 3.5,
          value: 50
        });
      }
    }, 2000 + Math.random() * 3000);
  };

  const getRarityColor = (rarity: string) => {
    return rarityConfig[rarity as keyof typeof rarityConfig]?.color || '#6b7280';
  };

  return (
    <View style={styles.container}>
      {/* 天空背景 */}
      <LinearGradient
        colors={currentScene?.colorGradient || ['#4a90e2', '#2e5c8a']}
        style={styles.sky}
      />

      {/* 水面 */}
      <LinearGradient
        colors={['rgba(59, 130, 246, 0.6)', 'rgba(30, 58, 138, 0.8)', 'rgba(15, 23, 42, 0.9)']}
        style={styles.water}
      />

      {/* 钓鱼者 */}
      <View style={styles.fisher}>
        <View style={styles.fisherBody} />
        <View style={styles.fisherHead} />
        <View style={styles.fishingRod}>
          <View style={[styles.rodLine]} />
        </View>
      </View>

      {/* 鱼线 */}
      {(fishingState.stage !== 'idle') && (
        <Animated.View style={[
          styles.fishingLine,
          {
            left: 80,
            top: 120,
            width: Math.sqrt(
              Math.pow(lurePosition.x - 80, 2) + 
              Math.pow(lurePosition.y - 120, 2)
            ),
            transform: [
              {
                rotate: `${Math.atan2(
                  lurePosition.y - 120, 
                  lurePosition.x - 80
                )}rad`
              }
            ]
          }
        ]} />
      )}

      {/* 拟饵 */}
      {(fishingState.stage !== 'idle') && (
        <View 
          style={[
            styles.lure,
            {
              left: lurePosition.x - 8,
              top: lurePosition.y - 8,
            }
          ]}
        >
          <View style={styles.lureDot} />
        </View>
      )}

      {/* 目标鱼 */}
      {fishingState.targetFish && (
        <View
          style={[
            styles.fish,
            {
              left: fishPosition.x - 30,
              top: fishPosition.y - 15,
              backgroundColor: getRarityColor(fishingState.targetFish.rarity),
            }
          ]}
        >
          <View style={styles.fishBody} />
          <View style={styles.fishTail} />
          <Text style={styles.fishName}>{fishingState.targetFish.name}</Text>
        </View>
      )}

      {/* 抛竿力度指示器 */}
      {isDragging && (
        <View style={styles.powerIndicator}>
          <Text style={styles.powerText}>抛竿力度</Text>
          <View style={styles.powerBar}>
            <View 
              style={[
                styles.powerFill, 
                { width: `${castPower}%` }
              ]} 
            />
          </View>
        </View>
      )}

      {/* 进度条 */}
      {fishingState.stage === 'reeling' && (
        <View style={styles.progressBar}>
          <View style={styles.progressBg}>
            <Text style={styles.progressLabel}>收线进度</Text>
            <View style={styles.progressTrack}>
              <View 
                style={[
                  styles.progressFill,
                  { width: `${fishingState.progress}%` }
                ]}
              />
            </View>
            <Text style={styles.progressPercent}>
              {Math.round(fishingState.progress)}%
            </Text>
          </View>
          
          <View style={styles.tensionBg}>
            <Text style={styles.progressLabel}>线张力</Text>
            <View style={styles.tensionTrack}>
              <View 
                style={[
                  styles.tensionFill,
                  { 
                    width: `${fishingState.tension}%`,
                    backgroundColor: fishingState.tension > 80 ? '#ef4444' : '#22c55e'
                  }
                ]}
              />
            </View>
            {fishingState.tension > 80 && (
              <Text style={styles.tensionWarning}>⚠️ 线要断了！</Text>
            )}
          </View>
        </View>
      )}

      {/* 手势区域 */}
      <PanGestureHandler onGestureEvent={handlePanGesture}>
        <View style={styles.gestureArea} />
      </PanGestureHandler>

      {/* 控制按钮 */}
      <View style={styles.controls}>
        <View style={styles.leftControls}>
          <ControlButton
            icon="arrow-forward"
            label="抛竿"
            isActive={fishingState.stage === 'idle'}
            onPress={() => performCast()}
          />
        </View>
        
        <View style={styles.rightControls}>
          <ControlButton
            icon="refresh"
            label="收线"
            isActive={fishingState.stage === 'hooked'}
            onPress={reelIn}
            size="large"
          />
        </View>
      </View>
    </View>
  );
};

const ControlButton: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  isActive: boolean;
  onPress: () => void;
  size?: 'normal' | 'large';
}> = ({ icon, label, isActive, onPress, size = 'normal' }) => (
  <View
    style={[
      styles.controlButton,
      size === 'large' && styles.controlButtonLarge,
      {
        backgroundColor: isActive 
          ? (size === 'large' ? '#22c55e' : '#3b82f6') 
          : '#374151',
        opacity: isActive ? 1 : 0.5
      }
    ]}
  >
    <Ionicons 
      name={icon} 
      size={size === 'large' ? 32 : 24} 
      color="#ffffff" 
    />
    <Text style={styles.controlText}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#0f172a',
  },
  sky: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
  },
  water: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    bottom: 0,
  },
  fisher: {
    position: 'absolute',
    top: 80,
    left: 50,
    alignItems: 'center',
  },
  fisherBody: {
    width: 30,
    height: 40,
    backgroundColor: '#374151',
    borderRadius: 10,
    marginTop: 20,
  },
  fisherHead: {
    width: 25,
    height: 25,
    backgroundColor: '#374151',
    borderRadius: 12.5,
    marginBottom: -5,
  },
  fishingRod: {
    position: 'absolute',
    top: 25,
    left: 15,
  },
  rodLine: {
    width: 120,
    height: 3,
    backgroundColor: '#8b4513',
    transform: [{ rotate: '-30deg' }],
    transformOrigin: 'left center',
  },
  fishingLine: {
    position: 'absolute',
    height: 2,
    backgroundColor: '#ffffff',
    transformOrigin: 'left center',
  },
  lure: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  lureDot: {
    width: 12,
    height: 12,
    backgroundColor: '#fbbf24',
    borderRadius: 6,
    shadowColor: '#fbbf24',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  fish: {
    position: 'absolute',
    width: 80,
    height: 30,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  fishBody: {
    flex: 1,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginRight: 5,
  },
  fishTail: {
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderLeftWidth: 15,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'rgba(255,255,255,0.3)',
  },
  fishName: {
    position: 'absolute',
    top: -20,
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  powerIndicator: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  powerText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  powerBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#374151',
    borderRadius: 4,
    overflow: 'hidden',
  },
  powerFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 4,
  },
  progressBar: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 16,
    borderRadius: 12,
  },
  progressBg: {
    marginBottom: 16,
  },
  tensionBg: {
    marginBottom: 0,
  },
  progressLabel: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  progressTrack: {
    width: '100%',
    height: 12,
    backgroundColor: '#374151',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#22c55e',
    borderRadius: 6,
  },
  progressPercent: {
    color: '#ffffff',
    fontSize: 12,
    textAlign: 'right',
  },
  tensionTrack: {
    width: '100%',
    height: 10,
    backgroundColor: '#374151',
    borderRadius: 5,
    overflow: 'hidden',
  },
  tensionFill: {
    height: '100%',
    borderRadius: 5,
  },
  tensionWarning: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  gestureArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  controls: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 2,
  },
  leftControls: {
    alignItems: 'flex-start',
  },
  rightControls: {
    alignItems: 'flex-end',
  },
  controlButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  controlButtonLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  controlText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default GameCanvas;