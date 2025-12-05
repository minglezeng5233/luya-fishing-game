import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useData } from '../../data/DataContext';
import { Fish } from '../../types';

interface FishCardProps {
  fish: Fish;
  isCaught: boolean;
  caughtData?: Fish;
  onPress: () => void;
}

const FishCard: React.FC<FishCardProps> = ({ fish, isCaught, caughtData, onPress }) => {
  const { rarityConfig } = useData();
  const rarity = rarityConfig[fish.rarity];
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getCaughtCount = () => {
    if (!isCaught) return 0;
    return caughtData ? 1 : 1;
  };

  const getWeightText = () => {
    if (!isCaught || !caughtData) return '--';
    return `${caughtData.weight?.toFixed(1) || '0.0'} kg`;
  };

  const getValueText = () => {
    if (!isCaught || !caughtData) return '--';
    return `${caughtData.value || fish.baseValue} 金币`;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <Animated.View
        style={[
          styles.container,
          {
            borderColor: isCaught ? rarity.color : '#374151',
            backgroundColor: isCaught ? `${rarity.color}15` : '#1f2937',
            transform: [{ scale: scaleAnim }],
          }
        ]}
      >
        {/* 鱼类图标区域 */}
        <View style={styles.iconSection}>
          <View style={[
            styles.iconContainer,
            { 
              backgroundColor: isCaught ? `${rarity.color}30` : '#374151',
              borderColor: isCaught ? rarity.color : '#4b5563',
            }
          ]}>
            <Ionicons 
              name="fish" 
              size={32} 
              color={isCaught ? rarity.color : '#6b7280'} 
            />
            {isCaught && (
              <View style={[styles.caughtBadge, { backgroundColor: rarity.color }]}>
                <Ionicons name="checkmark" size={10} color="#ffffff" />
              </View>
            )}
          </View>
          
          {/* 稀有度星级 */}
          <View style={styles.stars}>
            {Array.from({ length: rarity.stars }).map((_, i) => (
              <Ionicons 
                key={i} 
                name="star" 
                size={8} 
                color={isCaught ? rarity.color : '#4b5563'} 
              />
            ))}
          </View>
        </View>

        {/* 鱼类信息区域 */}
        <View style={styles.infoSection}>
          <Text style={[
            styles.fishName,
            { color: isCaught ? '#ffffff' : '#6b7280' }
          ]}>
            {fish.name}
          </Text>
          
          <Text style={[
            styles.fishSpecies,
            { color: isCaught ? '#9ca3af' : '#4b5563' }
          ]}>
            {fish.species}
          </Text>
          
          <View style={styles.rarityBadge}>
            <View style={[
              styles.rarityDot,
              { backgroundColor: isCaught ? rarity.color : '#4b5563' }
            ]} />
            <Text style={[
              styles.rarityText,
              { color: isCaught ? rarity.color : '#6b7280' }
            ]}>
              {rarity.name}
            </Text>
          </View>
        </View>

        {/* 统计信息区域 */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>重量</Text>
            <Text style={[
              styles.statValue,
              { color: isCaught ? '#ffffff' : '#6b7280' }
            ]}>
              {getWeightText()}
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>价值</Text>
            <Text style={[
              styles.statValue,
              { color: isCaught ? '#fbbf24' : '#6b7280' }
            ]}>
              {getValueText()}
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>尺寸</Text>
            <Text style={[
              styles.statValue,
              { color: isCaught ? '#ffffff' : '#6b7280' }
            ]}>
              {isCaught && caughtData ? 
                `${caughtData.size?.toFixed(1) || '0.0'}kg` : 
                `${fish.minSize}-${fish.maxSize}kg`
              }
            </Text>
          </View>
        </View>

        {/* 锁定状态覆盖 */}
        {!isCaught && (
          <View style={styles.lockOverlay}>
            <Ionicons name="lock-closed" size={24} color="#4b5563" />
            <Text style={styles.lockText}>未捕获</Text>
          </View>
        )}

        {/* 特殊标记 */}
        {isCaught && fish.rarity === 'legendary' && (
          <View style={styles.legendaryEffect}>
            <Ionicons name="star" size={16} color="#fbbf24" />
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '48%',
    margin: '1%',
    borderRadius: 16,
    borderWidth: 2,
    padding: 12,
    minHeight: 180,
    position: 'relative',
    overflow: 'hidden',
  },
  iconSection: {
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  caughtBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stars: {
    flexDirection: 'row',
    marginTop: 4,
    gap: 2,
  },
  infoSection: {
    alignItems: 'center',
    marginBottom: 8,
  },
  fishName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 2,
    fontFamily: 'Inter-SemiBold',
  },
  fishSpecies: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
    fontFamily: 'Inter-Regular',
  },
  rarityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  rarityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  rarityText: {
    fontSize: 10,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  statsSection: {
    gap: 4,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
  },
  statValue: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
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
    borderRadius: 16,
  },
  lockText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
  legendaryEffect: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FishCard;