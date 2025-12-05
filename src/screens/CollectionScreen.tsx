import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useGame } from '../game/GameContext';
import { useData } from '../data/DataContext';
import FishCard from '../components/collection/FishCard';
import CollectionStats from '../components/collection/CollectionStats';
import { Fish } from '../types';

type RootStackParamList = {
  FishDetail: { fishId: number };
};

type CollectionScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');

const CollectionScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<CollectionScreenNavigationProp>();
  const { inventory } = useGame();
  const { fishDatabase, rarityConfig } = useData();
  const [selectedRarity, setSelectedRarity] = useState<string | null>(null);

  const allFish = [...fishDatabase.freshwater, ...fishDatabase.saltwater];
  const caughtFishMap = new Map(inventory.caughtFish.map(fish => [fish.id, fish]));

  const filteredFish = selectedRarity
    ? allFish.filter(fish => fish.rarity === selectedRarity)
    : allFish;

  const getCaughtStatus = (fish: Fish) => {
    return caughtFishMap.has(fish.id);
  };

  const getCaughtCount = () => {
    return inventory.caughtFish.length;
  };

  const getTotalCount = () => {
    return allFish.length;
  };

  const getCompletionRate = () => {
    return Math.round((getCaughtCount() / getTotalCount()) * 100);
  };

  const rarityOptions = Object.keys(rarityConfig).map(key => ({
    id: key,
    name: rarityConfig[key as keyof typeof rarityConfig].name,
    color: rarityConfig[key as keyof typeof rarityConfig].color,
  }));

  const handleFishPress = (fishId: number) => {
    navigation.navigate('FishDetail', { fishId });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>图鉴</Text>
        <Text style={styles.headerSubtitle}>
          已收集 {getCaughtCount()}/{getTotalCount} ({getCompletionRate()}%)
        </Text>
      </View>

      {/* 统计信息 */}
      <CollectionStats />

      {/* Rarity Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.rarityFilter}
        contentContainerStyle={styles.rarityFilterContent}
      >
        <TouchableOpacity
          style={[
            styles.rarityChip,
            selectedRarity === null && styles.selectedRarityChip
          ]}
          onPress={() => setSelectedRarity(null)}
        >
          <Text style={[
            styles.rarityChipText,
            selectedRarity === null && styles.selectedRarityChipText
          ]}>
            全部
          </Text>
        </TouchableOpacity>
        
        {rarityOptions.map(option => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.rarityChip,
              selectedRarity === option.id && styles.selectedRarityChip,
              { borderColor: option.color }
            ]}
            onPress={() => setSelectedRarity(option.id)}
          >
            <Text style={[
              styles.rarityChipText,
              selectedRarity === option.id && styles.selectedRarityChipText,
              selectedRarity === option.id && { color: option.color }
            ]}>
              {option.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Fish Grid */}
      <View style={styles.fishGrid}>
        {filteredFish.map(fish => (
          <FishCard
            key={fish.id}
            fish={fish}
            isCaught={getCaughtStatus(fish)}
            caughtData={caughtFishMap.get(fish.id)}
            onPress={() => handleFishPress(fish.id)}
          />
        ))}
      </View>

      {/* Completion Summary */}
      {getCaughtCount() === getTotalCount() && (
        <View style={styles.completionBanner}>
          <Ionicons name="trophy" size={48} color="#fbbf24" />
          <Text style={styles.completionTitle}>图鉴完成！</Text>
          <Text style={styles.completionText}>
            恭喜你收集了所有鱼类！
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#9ca3af',
    fontFamily: 'Inter-Regular',
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#374151',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 4,
  },
  rarityFilter: {
    marginBottom: 20,
  },
  rarityFilterContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  rarityChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#374151',
    backgroundColor: '#1f2937',
  },
  selectedRarityChip: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  rarityChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9ca3af',
    fontFamily: 'Inter-SemiBold',
  },
  selectedRarityChipText: {
    color: '#ffffff',
  },
  fishGrid: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 12,
  },
  fishCard: {
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 2,
    borderRadius: 16,
    padding: 16,
    minHeight: 160,
    position: 'relative',
  },
  fishCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  fishIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  fishInfo: {
    flex: 1,
  },
  fishName: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  fishSpecies: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  rarityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: 'center',
  },
  rarityText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'Inter-SemiBold',
  },
  fishStats: {
    gap: 8,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#9ca3af',
    fontFamily: 'Inter-Regular',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'Inter-SemiBold',
  },
  lockedOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5,
  },
  lockedText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    fontFamily: 'Inter-Regular',
  },
  completionBanner: {
    margin: 20,
    padding: 20,
    backgroundColor: '#1f2937',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#fbbf24',
    alignItems: 'center',
  },
  completionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 12,
    fontFamily: 'Inter-Bold',
  },
  completionText: {
    fontSize: 16,
    color: '#9ca3af',
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
});

export default CollectionScreen;