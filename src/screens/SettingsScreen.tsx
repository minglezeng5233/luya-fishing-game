import React from 'react';
import { View, Text, ScrollView, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useGame } from '../game/GameContext';
import Card, { CardHeader } from '../components/ui/Card';

const SettingsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { settings, setSettings } = useGame();

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings({
      ...settings,
      [key]: !settings[key]
    });
  };

  const setGraphics = (level: 'low' | 'medium' | 'high') => {
    setSettings({
      ...settings,
      graphics: level
    });
  };

  const setControls = (type: 'touch' | 'gyro') => {
    setSettings({
      ...settings,
      controls: type
    });
  };

  const SettingItem: React.FC<{
    title: string;
    subtitle?: string;
    value: boolean;
    onToggle: () => void;
    icon: keyof typeof Ionicons.glyphMap;
  }> = ({ title, subtitle, value, onToggle, icon }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={24} color="#9ca3af" />
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#374151', true: '#3b82f6' }}
        thumbColor={value ? '#ffffff' : '#9ca3af'}
      />
    </View>
  );

  const SelectionItem: React.FC<{
    title: string;
    subtitle?: string;
    value: string;
    options: { value: string; label: string }[];
    onSelect: (value: string) => void;
    icon: keyof typeof Ionicons.glyphMap;
  }> = ({ title, subtitle, value, options, onSelect, icon }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={24} color="#9ca3af" />
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.optionsContainer}>
        {options.map(option => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionButton,
              value === option.value && styles.selectedOption
            ]}
            onPress={() => onSelect(option.value)}
          >
            <Text style={[
              styles.optionText,
              value === option.value && styles.selectedOptionText
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView 
      style={[styles.container, { paddingTop: insets.top }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>设置</Text>
        <Text style={styles.headerSubtitle}>自定义你的游戏体验</Text>
      </View>

      {/* Game Settings */}
      <Card style={styles.section} margin={16}>
        <CardHeader
          title="游戏设置"
          icon={<Ionicons name="game-controller" size={24} color="#3b82f6" />}
        />
        
        <SettingItem
          title="音效"
          subtitle="开启游戏音效"
          value={settings.sound}
          onToggle={() => toggleSetting('sound')}
          icon="volume-high"
        />
        
        <SettingItem
          title="震动"
          subtitle="开启触觉反馈"
          value={settings.vibration}
          onToggle={() => toggleSetting('vibration')}
          icon="phone-portrait"
        />

        <SelectionItem
          title="画面质量"
          subtitle="调整游戏画质"
          value={settings.graphics}
          options={[
            { value: 'low', label: '低' },
            { value: 'medium', label: '中' },
            { value: 'high', label: '高' }
          ]}
          onSelect={setGraphics}
          icon="image"
        />

        <SelectionItem
          title="控制方式"
          subtitle="选择操作模式"
          value={settings.controls}
          options={[
            { value: 'touch', label: '触屏' },
            { value: 'gyro', label: '重力感应' }
          ]}
          onSelect={setControls}
          icon="hardware-chip"
        />
      </Card>

      {/* Display Settings */}
      <Card style={styles.section} margin={16}>
        <CardHeader
          title="显示设置"
          icon={<Ionicons name="color-palette" size={24} color="#22c55e" />}
        />
        
        <SettingItem
          title="暗黑模式"
          subtitle="使用深色主题"
          value={settings.darkMode}
          onToggle={() => toggleSetting('darkMode')}
          icon="moon"
        />
      </Card>

      {/* About */}
      <Card style={styles.section} margin={16}>
        <CardHeader
          title="关于"
          icon={<Ionicons name="information-circle" size={24} color="#f59e0b" />}
        />
        
        <View style={styles.aboutItem}>
          <Text style={styles.aboutTitle}>路亚钓鱼大师</Text>
          <Text style={styles.aboutVersion}>版本 1.0.0</Text>
        </View>
        
        <View style={styles.aboutItem}>
          <Text style={styles.aboutDescription}>
            一款专为移动设备设计的钓鱼模拟游戏，体验真实的路亚钓鱼乐趣！
          </Text>
        </View>
      </Card>

      {/* Storage Info */}
      <Card style={styles.section} margin={16}>
        <CardHeader
          title="存储信息"
          icon={<Ionicons id="save" name="save" size={24} color="#ef4444" />}
        />
        
        <View style={styles.storageItem}>
          <Text style={styles.storageLabel}>游戏数据已本地保存</Text>
          <Text style={styles.storageDetail}>
            包括进度、成就、图鉴等所有游戏内容
          </Text>
        </View>
      </Card>
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
  section: {
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 16,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'Inter-SemiBold',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 2,
    fontFamily: 'Inter-Regular',
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#374151',
    backgroundColor: '#1f2937',
  },
  selectedOption: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  optionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9ca3af',
    fontFamily: 'Inter-Medium',
  },
  selectedOptionText: {
    color: '#ffffff',
  },
  aboutItem: {
    paddingVertical: 12,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  aboutVersion: {
    fontSize: 14,
    color: '#9ca3af',
    fontFamily: 'Inter-Regular',
  },
  aboutDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: '#d1d5db',
    fontFamily: 'Inter-Regular',
  },
  storageItem: {
    paddingVertical: 12,
  },
  storageLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  storageDetail: {
    fontSize: 14,
    color: '#9ca3af',
    fontFamily: 'Inter-Regular',
  },
});

export default SettingsScreen;