import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, PanGestureHandler, State } from 'react-native';
import { PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Canvas, Group, Rect, Circle, Line, Skia, Path, usePaint, Paint, LinearGradient } from '@shopify/react-native-skia';
import { useGame } from '../../game/GameContext';
import { useData } from '../../data/DataContext';

const { width, height } = Dimensions.get('window');

const FishingCanvas: React.FC = () => {
  const canvasRef = useRef(null);
  const { fishingState, equipment, weather, castLine, reelIn } = useGame();
  const { fishingScenes, rarityConfig } = useData();
  const [canvasSize, setCanvasSize] = useState({ width, height: height * 0.6 });

  // 手势处理
  const castGestureX = useSharedValue(0);
  const castGestureY = useSharedValue(0);
  const isCasting = useSharedValue(false);

  const castGestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onStart: (_, context) => {
      if (fishingState.stage === 'idle') {
        isCasting.value = true;
        castGestureX.value = 0;
        castGestureY.value = 0;
      }
    },
    onActive: (event, context) => {
      if (isCasting.value && fishingState.stage === 'idle') {
        castGestureX.value = event.translationX;
        castGestureY.value = event.translationY;
      }
    },
    onEnd: () => {
      if (isCasting.value) {
        // 计算抛竿力度和角度
        const power = Math.sqrt(castGestureX.value ** 2 + castGestureY.value ** 2);
        const angle = Math.atan2(castGestureY.value, castGestureX.value);
        
        if (power > 50) {
          runOnJS(castLine)();
        }
        
        isCasting.value = false;
        castGestureX.value = withSpring(0);
        castGestureY.value = withSpring(0);
      }
    },
  });

  const canvasStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: isCasting.value ? castGestureX.value : 0 },
        { translateY: isCasting.value ? castGestureY.value * 0.3 : 0 },
      ],
    };
  });

  const renderScene = () => {
    const currentScene = fishingScenes.find(s => s.id === 'lake'); // 这里应该是实际的当前场景
    if (!currentScene) return null;

    return (
      <View style={styles.canvas}>
        {/* 天空背景 */}
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          colors={currentScene.colorGradient}
          style={styles.sky}
        />
        
        {/* 水面 */}
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          colors={['rgba(59, 130, 246, 0.6)', 'rgba(30, 58, 138, 0.8)', 'rgba(15, 23, 42, 0.9)']}
          style={styles.water}
        />

        {/* 钓鱼者剪影 */}
        <View style={styles.fisher}>
          <View style={styles.fisherBody} />
          <View style={styles.fisherHead} />
          <View style={styles.fishingRod}>
            <View style={[styles.rodLine, { transform: [{ rotate: '-30deg' } }]} />
          </View>
        </View>

        {/* 拟饵位置 */}
        {fishingState.stage !== 'idle' && (
          <View
            style={[
              styles.lure,
              {
                left: fishingState.lurePosition.x - 8,
                top: fishingState.lurePosition.y - 8,
              }
            ]}
          >
            <View style={styles.lureDot} />
          </View>
        )}

        {/* 鱼线 */}
        {fishingState.stage !== 'idle' && (
          <Line
            p1={{ x: 100, y: 100 }}
            p2={{ 
              x: fishingState.lurePosition.x, 
              y: fishingState.lurePosition.y 
            }}
            color={fishingState.tension > 80 ? '#ef4444' : '#ffffff'}
            strokeWidth={2}
            style={styles.fishingLine}
          />
        )}

        {/* 目标鱼 */}
        {fishingState.targetFish && (
          <View
            style={[
              styles.fish,
              {
                left: fishingState.fishPosition.x - 30,
                top: fishingState.fishPosition.y - 15,
                backgroundColor: rarityConfig[fishingState.targetFish.rarity].color,
              }
            ]}
          >
            <View style={styles.fishBody} />
            <View style={styles.fishTail} />
          </View>
        )}

        {/* 进度条 */}
        {fishingState.stage === 'reeling' && (
          <View style={styles.progressBar}>
            <View style={styles.progressBg}>
              <View 
                style={[
                  styles.progressFill,
                  { width: `${fishingState.progress}%` }
                ]}
              />
            </View>
            <View style={styles.tensionBar}>
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
          </View>
        )}
      </View>
    );
  };

  return (
    <PanGestureHandler onGestureEvent={castGestureHandler}>
      <Animated.View style={[styles.container, canvasStyle]}>
        {renderScene()}
        
        {/* 控制按钮覆盖层 */}
        <View style={styles.controls}>
          <View style={styles.leftControls}>
            <CastControl 
              isActive={fishingState.stage === 'idle'}
              onCast={castLine}
            />
          </View>
          
          <View style={styles.rightControls}>
            <ReelControl 
              isActive={fishingState.stage === 'hooked'}
              onReel={reelIn}
              tension={fishingState.tension}
            />
          </View>
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
};

const CastControl: React.FC<{ isActive: boolean; onCast: () => void }> = ({ isActive, onCast }) => (
  <View style={[styles.controlButton, { backgroundColor: isActive ? '#3b82f6' : '#374151' }]}>
    <Text style={styles.controlText}>抛竿</Text>
  </View>
);

const ReelControl: React.FC<{ isActive: boolean; onReel: () => void; tension: number }> = ({ 
  isActive, 
  onReel, 
  tension 
}) => (
  <View style={[
    styles.controlButton, 
    styles.reelButton,
    { 
      backgroundColor: isActive ? '#22c55e' : '#374151',
      borderColor: tension > 80 ? '#ef4444' : '#22c55e',
      borderWidth: 2
    }
  ]}>
    <Text style={styles.controlText}>收线</Text>
    {tension > 80 && <Text style={styles.tensionWarning}>!</Text>}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  canvas: {
    flex: 1,
    position: 'relative',
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
    transformOrigin: 'left center',
  },
  lure: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lureDot: {
    width: 12,
    height: 12,
    backgroundColor: '#fbbf24',
    borderRadius: 6,
  },
  fishingLine: {
    position: 'absolute',
  },
  fish: {
    position: 'absolute',
    width: 60,
    height: 30,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fishBody: {
    flex: 1,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
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
  progressBar: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
  },
  progressBg: {
    height: 20,
    backgroundColor: '#374151',
    borderRadius: 10,
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#22c55e',
    borderRadius: 10,
  },
  tensionBar: {
    height: 12,
    backgroundColor: '#374151',
    borderRadius: 6,
  },
  tensionFill: {
    height: '100%',
    borderRadius: 6,
  },
  controls: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  reelButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  controlText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  tensionWarning: {
    position: 'absolute',
    top: 5,
    right: 5,
    color: '#ef4444',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FishingCanvas;