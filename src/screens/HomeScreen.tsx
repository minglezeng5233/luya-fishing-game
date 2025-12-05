import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useGame } from '../game/GameContext';
import Card, { StatCard } from '../components/ui/Card';
import Button from '../components/ui/Button';

const { width, height } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { player, setGameState, inventory, achievements, tasks } = useGame();

  const pendingTasks = tasks.filter(task => 
    task.progress < (task.type === 'weight' ? task.target.weight : task.target.count || 1)
  );

  const recentAchievements = achievements.filter(ach => ach.unlocked).slice(-3);

  return (
    <ScrollView 
      style={[styles.container, { paddingTop: insets.top }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <LinearGradient
        colors={['#1e40af', '#3b82f6', '#60a5fa']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.playerInfo}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={32} color="#ffffff" />
            </View>
            <View>
              <Text style={styles.playerName}>钓鱼大师</Text>
              <Text style={styles.playerLevel}>等级 {player.level}</Text>
            </View>
          </View>
          <View style={styles.resources}>
            <View style={styles.resource}>
              <Ionicons name="cash" size={20} color="#fbbf24" />
              <Text style={styles.resourceText}>{player.coins}</Text>
            </View>
            <View style={styles.resource}>
              <Ionicons name="diamond" size={20} color="#60a5fa" />
              <Text style={styles.resourceText}>{player.diamonds}</Text>
            </View>
          </View>
        </View>
        
        {/* Experience Bar */}
        <View style={styles.expBar}>
          <Text style={styles.expText}>
            EXP: {player.exp % 1000}/1000
          </Text>
          <View style={styles.expBarBg}>
            <View 
              style={[
                styles.expBarFill, 
                { width: `${((player.exp % 1000) / 1000) * 100}%` }
              ]} 
            />
          </View>
        </View>
      </LinearGradient>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <StatCard
          label="总钓鱼数"
          value={player.totalFishCaught}
          icon={<Ionicons name="fish" size={20} color="#3b82f6" />}
          color="#3b82f6"
        />
        <StatCard
          label="总价值"
          value={player.totalValue}
          icon={<Ionicons name="cash" size={20} color="#22c55e" />}
          color="#22c55e"
        />
        <StatCard
          label="收集进度"
          value={`${inventory.caughtFish.length}/8`}
          icon={<Ionicons name="book" size={20} color="#f59e0b" />}
          color="#f59e0b"
        />
      </View>

      {/* Quick Actions */}
      <Card style={styles.section} margin={16}>
        <CardHeader
          title="快速开始"
          icon={<Ionicons name="play-circle" size={24} color="#3b82f6" />}
        />
        <View style={styles.actionButtons}>
          <Button
            title="开始钓鱼"
            onPress={() => setGameState('fishing')}
            variant="primary"
            size="large"
            icon={<Ionicons name="fish" size={20} color="white" />}
          />
          <View style={styles.buttonRow}>
            <Button
              title="商店"
              onPress={() => setGameState('shop')}
              variant="secondary"
              size="medium"
              style={styles.halfButton}
              icon={<Ionicons name="cart" size={16} color="white" />}
            />
            <Button
              title="图鉴"
              onPress={() => setGameState('collection')}
              variant="secondary"
              size="medium"
              style={styles.halfButton}
              icon={<Ionicons name="book" size={16} color="white" />}
            />
          </View>
        </View>
      </Card>

      {/* Active Tasks */}
      {pendingTasks.length > 0 && (
        <Card style={styles.section} margin={16}>
          <CardHeader
            title="当前任务"
            subtitle={`${pendingTasks.length} 个任务进行中`}
            icon={<Ionicons name="list" size={24} color="#22c55e" />}
          />
          <View style={styles.taskList}>
            {pendingTasks.slice(0, 3).map(task => (
              <View key={task.id} style={styles.taskItem}>
                <View style={styles.taskInfo}>
                  <Text style={styles.taskName}>{task.name}</Text>
                  <Text style={styles.taskDescription}>{task.description}</Text>
                </View>
                <View style={styles.taskProgress}>
                  <Text style={styles.taskReward}>
                    <Ionicons name="cash" size={14} color="#fbbf24" />
                    {' '}{task.reward}
                  </Text>
                  <Text style={styles.taskProgressText}>
                    {task.progress}/{task.type === 'weight' ? task.target.weight : task.target.count || 1}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Card>
      )}

      {/* Recent Achievements */}
      {recentAchievements.length > 0 && (
        <Card style={styles.section} margin={16}>
          <CardHeader
            title="最近成就"
            icon={<Ionicons name="trophy" size={24} color="#f59e0b" />}
          />
          <View style={styles.achievementList}>
            {recentAchievements.map(achievement => (
              <View key={achievement.id} style={styles.achievementItem}>
                <Ionicons name="star" size={20} color="#fbbf24" />
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementName}>{achievement.name}</Text>
                  <Text style={styles.achievementDescription}>{achievement.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </Card>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  playerName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: 'Inter-Bold',
  },
  playerLevel: {
    fontSize: 14,
    color: '#e0e7ff',
    fontFamily: 'Inter-Regular',
  },
  resources: {
    flexDirection: 'row',
    gap: 16,
  },
  resource: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  resourceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'Inter-SemiBold',
  },
  expBar: {
    marginTop: 8,
  },
  expText: {
    fontSize: 12,
    color: '#e0e7ff',
    marginBottom: 4,
    fontFamily: 'Inter-Regular',
  },
  expBarBg: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  expBarFill: {
    height: '100%',
    backgroundColor: '#fbbf24',
    borderRadius: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 20,
    gap: 12,
  },
  section: {
    marginBottom: 20,
  },
  actionButtons: {
    gap: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfButton: {
    flex: 1,
  },
  taskList: {
    gap: 12,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  taskInfo: {
    flex: 1,
  },
  taskName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'Inter-SemiBold',
  },
  taskDescription: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 2,
    fontFamily: 'Inter-Regular',
  },
  taskProgress: {
    alignItems: 'flex-end',
  },
  taskReward: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fbbf24',
    marginBottom: 2,
  },
  taskProgressText: {
    fontSize: 12,
    color: '#6b7280',
  },
  achievementList: {
    gap: 12,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  achievementInfo: {
    marginLeft: 12,
    flex: 1,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'Inter-SemiBold',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 2,
    fontFamily: 'Inter-Regular',
  },
});

export default HomeScreen;