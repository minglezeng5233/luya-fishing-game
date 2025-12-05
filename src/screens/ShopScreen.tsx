import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useGame } from '../game/GameContext';
import { useData } from '../data/DataContext';
import Card, { CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';

const ShopScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { player, equipment, buyEquipment, setGameState } = useGame();
  const { lureTypes, rodTypes, reelTypes } = useData();
  const [selectedTab, setSelectedTab] = useState<'rods' | 'reels' | 'lures'>('rods');

  const tabs = [
    { id: 'rods', name: '钓竿', icon: 'build' as const },
    { id: 'reels', name: '卷线器', icon: 'refresh-circle' as const },
    { id: 'lures', name: '拟饵', icon: 'color-palette' as const },
  ];

  const getItems = () => {
    switch (selectedTab) {
      case 'rods':
        return rodTypes;
      case 'reels':
        return reelTypes;
      case 'lures':
        return lureTypes;
      default:
        return [];
    }
  };

  const isOwned = (item: any) => {
    switch (selectedTab) {
      case 'rods':
        return equipment.rod.id === item.id;
      case 'reels':
        return equipment.reel.id === item.id;
      case 'lures':
        return equipment.lure.id === item.id || 
               inventory.lures.some((l: any) => l.id === item.id);
      default:
        return false;
    }
  };

  const inventory = {
    lures: [], // 这里应该从game context获取
  };

  const ShopItemCard: React.FC<{ item: any }> = ({ item }) => {
    const owned = isOwned(item);
    const canAfford = player.coins >= item.cost;

    return (
      <Card style={styles.itemCard} margin={8}>
        <View style={styles.itemHeader}>
          <View style={styles.itemIcon}>
            <Ionicons 
              name={
                selectedTab === 'rods' ? 'build' :
                selectedTab === 'reels' ? 'refresh-circle' : 'color-palette'
              } 
              size={32} 
              color={owned ? '#22c55e' : '#3b82f6'} 
            />
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDescription}>{item.description}</Text>
            {owned && (
              <Text style={styles.ownedText}>已拥有</Text>
            )}
          </View>
          {selectedTab === 'lures' && (
            <View style={styles.quantityBadge}>
              <Text style={styles.quantityText}>
                {inventory.lures.find((l: any) => l.id === item.id)?.quantity || 0}
              </Text>
            </View>
          )}
        </View>

        {(selectedTab === 'rods' || selectedTab === 'reels') && (
          <View style={styles.itemStats}>
            {selectedTab === 'rods' && (
              <>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>力量</Text>
                  <Text style={styles.statValue}>{item.power}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>精准</Text>
                  <Text style={styles.statValue}>{item.accuracy}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>距离</Text>
                  <Text style={styles.statValue}>{item.castingDistance}m</Text>
                </View>
              </>
            )}
            {selectedTab === 'reels' && (
              <>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>速度</Text>
                  <Text style={styles.statValue}>{item.speed}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>顺滑</Text>
                  <Text style={styles.statValue}>{item.smoothness}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>拖力</Text>
                  <Text style={styles.statValue}>{item.drag}</Text>
                </View>
              </>
            )}
          </View>
        )}

        {selectedTab === 'lures' && (
          <View style={styles.lureEffectiveness}>
            <Text style={styles.effectivenessTitle}>有效性</Text>
            <View style={styles.effectivenessBar}>
              <View style={[
                styles.effectivenessFill,
                { width: `${item.effectiveness.freshwater * 50}%` }
              ]}>
                <Text style={styles.effectivenessText}>
                  淡水 {Math.round(item.effectiveness.freshwater * 100)}%
                </Text>
              </View>
              <View style={[
                styles.effectivenessFill,
                { width: `${item.effectiveness.saltwater * 50}%` }
              ]}>
                <Text style={styles.effectivenessText}>
                  海水 {Math.round(item.effectiveness.saltwater * 100)}%
                </Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.itemFooter}>
          <View style={styles.price}>
            <Ionicons name="cash" size={16} color="#fbbf24" />
            <Text style={styles.priceText}>{item.cost}</Text>
          </View>
          
          <Button
            title={owned ? '装备' : '购买'}
            onPress={() => {
              if (owned) {
                buyEquipment(selectedTab, item);
              } else {
                buyEquipment(selectedTab, item);
              }
            }}
            variant={owned ? 'secondary' : (canAfford ? 'primary' : 'secondary')}
            size="small"
            disabled={!owned && !canAfford}
            style={styles.buyButton}
          />
        </View>
      </Card>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>商店</Text>
        <View style={styles.playerMoney}>
          <Ionicons name="cash" size={20} color="#fbbf24" />
          <Text style={styles.moneyText}>{player.coins}</Text>
        </View>
      </View>

      {/* Tab Selection */}
      <View style={styles.tabContainer}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              selectedTab === tab.id && styles.selectedTab
            ]}
            onPress={() => setSelectedTab(tab.id as any)}
          >
            <Ionicons 
              name={tab.icon} 
              size={20} 
              color={selectedTab === tab.id ? '#3b82f6' : '#9ca3af'} 
            />
            <Text style={[
              styles.tabText,
              selectedTab === tab.id && styles.selectedTabText
            ]}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Items List */}
      <FlatList
        data={getItems()}
        renderItem={({ item }) => <ShopItemCard item={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.itemsList}
        showsVerticalScrollIndicator={false}
      />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
  },
  playerMoney: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f2937',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  moneyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fbbf24',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
    borderRadius: 8,
  },
  selectedTab: {
    backgroundColor: '#3b82f6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9ca3af',
  },
  selectedTabText: {
    color: '#ffffff',
  },
  itemsList: {
    paddingHorizontal: 8,
    paddingBottom: 20,
  },
  itemCard: {
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  itemIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#1f2937',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 20,
  },
  ownedText: {
    fontSize: 12,
    color: '#22c55e',
    fontWeight: '600',
    marginTop: 4,
  },
  quantityBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  itemStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  lureEffectiveness: {
    marginBottom: 16,
  },
  effectivenessTitle: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
    marginBottom: 8,
  },
  effectivenessBar: {
    gap: 4,
  },
  effectivenessFill: {
    backgroundColor: '#3b82f6',
    padding: 4,
    borderRadius: 4,
  },
  effectivenessText: {
    fontSize: 12,
    color: '#ffffff',
    textAlign: 'center',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fbbf24',
  },
  buyButton: {
    minWidth: 80,
  },
});

export default ShopScreen;