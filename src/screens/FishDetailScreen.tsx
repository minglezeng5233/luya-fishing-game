import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useData } from '../data/DataContext';
import { useGame } from '../game/GameContext';
import Card, { CardHeader, StatCard } from '../components/ui/Card';
import Button from '../components/ui/Button';

type RootStackParamList = {
  FishingMain: undefined;
  SceneSelect: undefined;
  FishDetail: { fishId: number };
};

type FishDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'FishDetail'>;
type FishDetailScreenRouteProp = RouteProp<RootStackParamList, 'FishDetail'>;

interface Props {
  navigation: FishDetailScreenNavigationProp;
  route: FishDetailScreenRouteProp;
}

const { width } = Dimensions.get('window');

const FishDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { fishDatabase, rarityConfig } = useData();
  const { inventory } = useGame();
  
  const { fishId } = route.params;
  
  const allFish = [...fishDatabase.freshwater, ...fishDatabase.saltwater];
  const fish = allFish.find(f => f.id === fishId);
  const caughtFish = inventory.caughtFish.find(f => f.id === fishId);
  const isCaught = !!caughtFish;
  const rarity = fish ? rarityConfig[fish.rarity] : null;

  if (!fish) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={styles.notFoundText}>鱼类未找到</Text>
      </View>
    );
  }

  const getRarityColor = () => {
    return rarity?.color || '#6b7280';
  };

  const getActiveSeasonsText = () => {
    return fish.activeSeasons.map(season => {
      const seasonNames: { [key: string]: string } = {
        spring: '春季',
        summer: '夏季', 
        autumn: '秋季',
        winter: '冬季',
        all: '全年'
      };
      return seasonNames[season] || season;
    }).join(', ');
  };

  const getActiveTimeText = () => {
    const timeNames: { [key: string]: string } = {
      day: '白天',
      night: '夜晚',
      dawn: '清晨',
      dusk: '黄昏'
    };
    return fish.activeTime.map(time => timeNames[time] || time).join(', ');
  };

  const getPreferredBaitText = () => {
    const baitNames: { [key: string]: string } = {
      spoon: '匙形拟饵',
      spinner: '旋转亮片',
      crankbait: '摇摆拟饵',
      jerkbait: '抽动拟饵',
      popper: '波趴拟饵',
      softbait: '软胶拟饵',
      special: '传奇拟饵'
    };
    return fish.preferredBait.map(bait => baitNames[bait] || bait).join(', ');
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
        <Text style={styles.headerTitle}>{fish.name}</Text>
        <View style={styles.headerRight}>
          {isCaught && (
            <View style={styles.caughtBadge}>
              <Ionicons name="checkmark" size={16} color="#22c55e" />
              <Text style={styles.caughtText}>已捕获</Text>
            </View>
          )}
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 鱼类展示卡片 */}
        <Card style={styles.fishDisplay} margin={16}>
          <View style={[
            styles.fishIcon,
            { backgroundColor: getRarityColor() + '20' }
          ]}>
            <Ionicons name="fish" size={64} color={getRarityColor()} />
          </View>
          
          <Text style={styles.fishName}>{fish.name}</Text>
          <Text style={styles.fishSpecies}>{fish.species}</Text>
          
          <View style={[styles.rarityBadge, { backgroundColor: getRarityColor() }]}>
            <Text style={styles.rarityText}>{rarity?.name}</Text>
            <View style={styles.stars}>
              {Array.from({ length: rarity?.stars || 0 }).map((_, i) => (
                <Ionicons key={i} name="star" size={12} color="#ffffff" />
              ))}
            </View>
          </View>
        </Card>

        {/* 基础信息 */}
        <Card style={styles.infoCard} margin={16}>
          <CardHeader
            title="基础信息"
            icon={<Ionicons name="information-circle" size={24} color="#3b82f6" />}
          />
          
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>最小尺寸</Text>
              <Text style={styles.infoValue}>{fish.minSize} kg</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>最大尺寸</Text>
              <Text style={styles.infoValue}>{fish.maxSize} kg</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>基础价值</Text>
              <Text style={styles.infoValue}>{fish.baseValue} 金币</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>挣扎强度</Text>
              <Text style={styles.infoValue}>{fish.struggle}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>游速</Text>
              <Text style={styles.infoValue}>{fish.speed}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>稀有度</Text>
              <Text style={[styles.infoValue, { color: getRarityColor() }]}>
                {rarity?.name}
              </Text>
            </View>
          </View>
        </Card>

        {/* 捕获条件 */}
        <Card style={styles.infoCard} margin={16}>
          <CardHeader
            title="捕获条件"
            icon={<Ionicons name="settings" size={24} color="#22c55e" />}
          />
          
          <View style={styles.conditionItem}>
            <Ionicons name="calendar" size={20} color="#9ca3af" />
            <Text style={styles.conditionLabel}>活跃季节</Text>
            <Text style={styles.conditionValue}>{getActiveSeasonsText()}</Text>
          </View>
          
          <View style={styles.conditionItem}>
            <Ionicons name="time" size={20} color="#9ca3af" />
            <Text style={styles.conditionLabel}>活跃时段</Text>
            <Text style={styles.conditionValue}>{getActiveTimeText()}</Text>
          </View>
          
          <View style={styles.conditionItem}>
            <Ionicons name="color-palette" size={20} color="#9ca3af" />
            <Text style={styles.conditionLabel}>偏好拟饵</Text>
            <Text style={styles.conditionValue}>{getPreferredBaitText()}</Text>
          </View>
        </Card>

        {/* 捕获记录 */}
        {isCaught && caughtFish && (
          <Card style={styles.infoCard} margin={16}>
            <CardHeader
              title="捕获记录"
              icon={<Ionicons name="trophy" size={24} color="#f59e0b" />}
            />
            
            <View style={styles.recordGrid}>
              <StatCard
                label="捕获重量"
                value={`${caughtFish.weight?.toFixed(1)} kg`}
                icon={<Ionicons name="scale" size={20} color="#3b82f6" />}
                color="#3b82f6"
              />
              <StatCard
                label="获得价值"
                value={`${caughtFish.value} 金币`}
                icon={<Ionicons name="cash" size={20} color="#22c55e" />}
                color="#22c55e"
              />
              <StatCard
                label="捕获难度"
                value="★★★★☆"
                icon={<Ionicons name="star" size={20} color="#f59e0b" />}
                color="#f59e0b"
              />
            </View>
          </Card>
        )}

        {/* 捕获提示 */}
        <Card style={styles.tipsCard} margin={16}>
          <CardHeader
            title="捕获技巧"
            icon={<Ionicons name="bulb" size={24} color="#8b5cf6" />}
          />
          
          <Text style={styles.tipText}>
            • 选择合适的拟饵能提高捕获成功率
          </Text>
          <Text style={styles.tipText}>
            • 在鱼类活跃的时段和季节钓鱼效果更好
          </Text>
          <Text style={styles.tipText}>
            • 高价值的鱼类通常挣扎更激烈，需要更好的装备
          </Text>
          <Text style={styles.tipText}>
            • 天气条件会影响鱼类的咬钩概率
          </Text>
        </Card>

        {!isCaught && (
          <View style={styles.actionContainer}>
            <Button
              title="开始钓鱼"
              onPress={() => {
                navigation.navigate('FishingMain');
              }}
              variant="primary"
              size="large"
              icon={<Ionicons name="fish" size={20} color="white" />}
            />
          </View>
        )}
      </ScrollView>
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
  caughtBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#22c55e20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
    alignSelf: 'flex-end',
  },
  caughtText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#22c55e',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  fishDisplay: {
    alignItems: 'center',
    padding: 20,
  },
  fishIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  fishName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  fishSpecies: {
    fontSize: 16,
    color: '#9ca3af',
    marginBottom: 12,
  },
  rarityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  rarityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  infoCard: {
    marginBottom: 16,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  infoItem: {
    width: (width - 64) / 2,
    backgroundColor: '#1f2937',
    padding: 12,
    borderRadius: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  conditionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  conditionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 12,
    flex: 1,
  },
  conditionValue: {
    fontSize: 14,
    color: '#9ca3af',
    flex: 2,
    textAlign: 'right',
  },
  recordGrid: {
    gap: 12,
  },
  tipsCard: {
    marginBottom: 16,
  },
  tipText: {
    fontSize: 14,
    color: '#d1d5db',
    lineHeight: 20,
    marginBottom: 8,
    fontFamily: 'Inter-Regular',
  },
  actionContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  notFoundText: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 100,
  },
});

export default FishDetailScreen;