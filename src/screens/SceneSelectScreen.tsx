import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useGame } from '../game/GameContext';
import { useData } from '../data/DataContext';
import Card, { CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';

type RootStackParamList = {
  FishingMain: undefined;
  SceneSelect: undefined;
  FishDetail: { fishId: number };
};

type SceneSelectScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SceneSelect'>;
type SceneSelectScreenRouteProp = RouteProp<RootStackParamList, 'SceneSelect'>;

interface Props {
  navigation: SceneSelectScreenNavigationProp;
  route: SceneSelectScreenRouteProp;
}

const { width } = Dimensions.get('window');

const SceneSelectScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { player, currentScene, setCurrentScene, unlockScene } = useGame();
  const { fishingScenes } = useData();

  const handleSceneSelect = (sceneId: string) => {
    const scene = fishingScenes.find(s => s.id === sceneId);
    if (!scene) return;

    if (player.unlockedScenes.includes(sceneId)) {
      setCurrentScene(sceneId);
      navigation.goBack();
    } else {
      unlockScene(sceneId);
    }
  };

  const SceneCard: React.FC<{ scene: any }> = ({ scene }) => {
    const isUnlocked = player.unlockedScenes.includes(scene.id);
    const isCurrent = currentScene === scene.id;
    const canAfford = player.coins >= scene.unlockCost;

    return (
      <TouchableOpacity
        style={[
          styles.sceneCard,
          isCurrent && styles.currentScene,
          !isUnlocked && styles.lockedScene,
        ]}
        onPress={() => handleSceneSelect(scene.id)}
        activeOpacity={0.8}
      >
        {/* 场景背景 */}
        <View style={[
          styles.sceneBackground,
          {
            backgroundColor: scene.colorGradient[0],
          }
        ]}>
          <View style={styles.sceneOverlay} />
          
          {/* 场景信息 */}
          <View style={styles.sceneInfo}>
            <View style={styles.sceneHeader}>
              <Text style={styles.sceneName}>{scene.name}</Text>
              <View style={styles.difficulty}>
                {Array.from({ length: scene.difficulty }).map((_, i) => (
                  <Ionicons key={i} name="star" size={16} color="#fbbf24" />
                ))}
              </View>
            </View>
            
            <Text style={styles.sceneDescription}>{scene.description}</Text>
            
            <View style={styles.sceneStats}>
              <View style={styles.stat}>
                <Text style={styles.statLabel}>常见鱼类</Text>
                <Text style={styles.statValue}>{scene.commonFish.length} 种</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statLabel}>稀有鱼类</Text>
                <Text style={styles.statValue}>{scene.rareFish.length} 种</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statLabel}>传说鱼类</Text>
                <Text style={styles.statValue}>{scene.legendaryFish.length} 种</Text>
              </View>
            </View>
          </View>

          {/* 锁定状态 */}
          {!isUnlocked && (
            <View style={styles.lockOverlay}>
              <Ionicons name="lock-closed" size={40} color="#6b7280" />
              <Text style={styles.lockText}>需要解锁</Text>
              <View style={styles.unlockCost}>
                <Ionicons name="cash" size={16} color="#fbbf24" />
                <Text style={styles.costText}>{scene.unlockCost}</Text>
              </View>
            </View>
          )}

          {/* 当前场景标记 */}
          {isCurrent && (
            <View style={styles.currentBadge}>
              <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
              <Text style={styles.currentText}>当前场景</Text>
            </View>
          )}
        </View>

        {/* 场景类型标签 */}
        <View style={styles.sceneType}>
          <Text style={styles.sceneTypeText}>
            {scene.type === 'freshwater' ? '淡水' : '海水'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>选择钓鱼场景</Text>
        <View style={styles.headerRight}>
          <View style={styles.moneyDisplay}>
            <Ionicons name="cash" size={16} color="#fbbf24" />
            <Text style={styles.moneyText}>{player.coins}</Text>
          </View>
        </View>
      </View>

      {/* Scenes Grid */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scenesList}
        showsVerticalScrollIndicator={false}
      >
        {fishingScenes.map(scene => (
          <SceneCard key={scene.id} scene={scene} />
        ))}
      </ScrollView>

      {/* Tips */}
      <Card style={styles.tipsCard} margin={16}>
        <CardHeader
          title="钓鱼提示"
          icon={<Ionicons name="bulb" size={24} color="#f59e0b" />}
        />
        <Text style={styles.tipsText}>
          • 每个场景都有不同的鱼类和环境条件
        </Text>
        <Text style={styles.tipsText}>
          • 天气会影响鱼类的咬钩概率
        </Text>
        <Text style={styles.tipsText}>
          • 高难度场景有更多稀有鱼类
        </Text>
        <Text style={styles.tipsText}>
          • 使用合适的拟饵能提高成功率
        </Text>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1f2937',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    marginLeft: 16,
  },
  headerRight: {
    width: 80,
  },
  moneyDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: '#1f2937',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  moneyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fbbf24',
  },
  scrollView: {
    flex: 1,
  },
  scenesList: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  sceneCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  currentScene: {
    borderWidth: 3,
    borderColor: '#22c55e',
  },
  lockedScene: {
    opacity: 0.7,
  },
  sceneBackground: {
    height: 200,
    position: 'relative',
  },
  sceneOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  sceneInfo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    justifyContent: 'space-between',
  },
  sceneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  sceneName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  difficulty: {
    flexDirection: 'row',
    gap: 2,
  },
  sceneDescription: {
    fontSize: 16,
    color: '#e5e7eb',
    lineHeight: 22,
    marginBottom: 16,
  },
  sceneStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 12,
    borderRadius: 8,
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 8,
    marginBottom: 8,
  },
  unlockCost: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f2937',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  costText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fbbf24',
  },
  currentBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  currentText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  sceneType: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sceneTypeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  tipsCard: {
    marginBottom: 20,
  },
  tipsText: {
    fontSize: 14,
    color: '#d1d5db',
    lineHeight: 20,
    marginBottom: 4,
    fontFamily: 'Inter-Regular',
  },
});

export default SceneSelectScreen;