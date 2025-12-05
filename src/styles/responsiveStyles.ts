import { StyleSheet } from 'react-native';
import { responsive, sizes, deviceAdaptation } from '../utils/responsive';

// 基础响应式样式
export const baseStyles = StyleSheet.create({
  // 容器样式
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  
  safeContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingTop: deviceAdaptation.getStatusBarHeight(),
  },

  // 间距
  padding: {
    small: { padding: sizes.spacing.sm },
    medium: { padding: sizes.spacing.md },
    large: { padding: sizes.spacing.lg },
  },

  margin: {
    small: { margin: sizes.spacing.sm },
    medium: { margin: sizes.spacing.md },
    large: { margin: sizes.spacing.lg },
  },

  // 字体
  text: {
    heading: {
      fontSize: sizes.fontSize.xxl,
      fontWeight: '700',
      color: '#ffffff',
      fontFamily: 'Inter-Bold',
    },
    title: {
      fontSize: sizes.fontSize.xl,
      fontWeight: '600',
      color: '#ffffff',
      fontFamily: 'Inter-SemiBold',
    },
    subtitle: {
      fontSize: sizes.fontSize.lg,
      fontWeight: '600',
      color: '#ffffff',
      fontFamily: 'Inter-SemiBold',
    },
    body: {
      fontSize: sizes.fontSize.md,
      color: '#ffffff',
      fontFamily: 'Inter-Regular',
    },
    caption: {
      fontSize: sizes.fontSize.sm,
      color: '#9ca3af',
      fontFamily: 'Inter-Regular',
    },
  },

  // 按钮
  button: {
    primary: {
      backgroundColor: '#3b82f6',
      paddingHorizontal: sizes.spacing.lg,
      paddingVertical: sizes.spacing.md,
      borderRadius: sizes.borderRadius.lg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    secondary: {
      backgroundColor: '#1f2937',
      paddingHorizontal: sizes.spacing.lg,
      paddingVertical: sizes.spacing.md,
      borderRadius: sizes.borderRadius.lg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    small: {
      paddingHorizontal: sizes.spacing.md,
      paddingVertical: sizes.spacing.sm,
      borderRadius: sizes.borderRadius.md,
    },
    large: {
      paddingHorizontal: sizes.spacing.xl,
      paddingVertical: sizes.spacing.lg,
      borderRadius: sizes.borderRadius.xl,
    },
  },

  // 卡片
  card: {
    backgroundColor: '#1f2937',
    borderRadius: sizes.borderRadius.lg,
    padding: sizes.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  // 输入框
  input: {
    backgroundColor: '#374151',
    borderRadius: sizes.borderRadius.md,
    paddingHorizontal: sizes.spacing.md,
    paddingVertical: sizes.spacing.sm,
    fontSize: sizes.fontSize.md,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#4b5563',
  },

  // 标签
  badge: {
    paddingHorizontal: sizes.spacing.sm,
    paddingVertical: sizes.spacing.xs / 2,
    borderRadius: sizes.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 图标按钮
  iconButton: {
    width: responsive.min(44),
    height: responsive.min(44),
    borderRadius: responsive.min(22),
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 分隔线
  divider: {
    height: 1,
    backgroundColor: '#374151',
    marginVertical: sizes.spacing.sm,
  },

  // Flexbox 工具
  flex: {
    row: {
      flexDirection: 'row',
    },
    column: {
      flexDirection: 'column',
    },
    center: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    between: {
      justifyContent: 'space-between',
    },
    around: {
      justifyContent: 'space-around',
    },
    evenly: {
      justifyContent: 'space-evenly',
    },
    start: {
      alignItems: 'flex-start',
    },
    end: {
      alignItems: 'flex-end',
    },
  },
});

// 游戏特定响应式样式
export const gameStyles = StyleSheet.create({
  // 游戏画布
  gameCanvas: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#0f172a',
  },

  // 控制按钮
  controlButton: {
    width: sizes.game.controlButtonSize,
    height: sizes.game.controlButtonSize,
    borderRadius: sizes.game.controlButtonSize / 2,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  controlButtonLarge: {
    width: sizes.game.controlButtonLargeSize,
    height: sizes.game.controlButtonLargeSize,
    borderRadius: sizes.game.controlButtonLargeSize / 2,
  },

  // 游戏界面元素
  fishIcon: {
    width: sizes.game.lureSize,
    height: sizes.game.lureSize,
    borderRadius: sizes.game.lureSize / 2,
    backgroundColor: '#fbbf24',
    alignItems: 'center',
    justifyContent: 'center',
  },

  fishShape: {
    width: sizes.game.fishSize,
    height: sizes.game.fishSize * 0.5,
    borderRadius: sizes.game.fishSize * 0.25,
  },

  // 进度条
  progressBar: {
    height: sizes.game.progressBarHeight,
    backgroundColor: '#374151',
    borderRadius: sizes.game.progressBarHeight / 2,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#22c55e',
    borderRadius: sizes.game.progressBarHeight / 2,
  },

  // 游戏信息面板
  infoPanel: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: sizes.spacing.md,
    borderRadius: sizes.borderRadius.lg,
    margin: sizes.spacing.sm,
  },

  // 底部控制区域
  controlsContainer: {
    position: 'absolute',
    bottom: deviceAdaptation.getTabBarHeight() + sizes.spacing.lg,
    left: sizes.spacing.md,
    right: sizes.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

// 导航样式
export const navigationStyles = StyleSheet.create({
  tabBar: {
    height: deviceAdaptation.getTabBarHeight(),
    backgroundColor: '#1f2937',
    borderTopWidth: 1,
    borderTopColor: '#374151',
    paddingBottom: deviceAdaptation.getSafeBottom(),
  },

  tabBarLabel: {
    fontSize: sizes.fontSize.sm,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },

  header: {
    height: deviceAdaptation.getStatusBarHeight() + sizes.spacing.lg,
    backgroundColor: '#1f2937',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: sizes.spacing.md,
  },

  headerTitle: {
    fontSize: sizes.fontSize.lg,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'Inter-SemiBold',
  },
});

// 图鉴样式
export const collectionStyles = StyleSheet.create({
  collectionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: sizes.spacing.md,
    paddingVertical: sizes.spacing.sm,
  },

  fishCard: {
    width: '48%',
    margin: '1%',
    backgroundColor: '#1f2937',
    borderRadius: sizes.borderRadius.lg,
    padding: sizes.spacing.sm,
    minHeight: responsive.height(160),
    borderWidth: 2,
    borderColor: '#374151',
  },

  fishIconContainer: {
    width: responsive.width(48),
    height: responsive.width(48),
    borderRadius: responsive.width(24),
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: sizes.spacing.sm,
  },

  fishName: {
    fontSize: sizes.fontSize.md,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },

  fishSpecies: {
    fontSize: sizes.fontSize.sm,
    color: '#9ca3af',
    fontFamily: 'Inter-Regular',
    marginBottom: sizes.spacing.sm,
  },
});

// 商店样式
export const shopStyles = StyleSheet.create({
  shopContainer: {
    flex: 1,
    paddingTop: deviceAdaptation.getStatusBarHeight(),
  },

  shopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: sizes.spacing.lg,
    paddingVertical: sizes.spacing.md,
  },

  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: sizes.spacing.md,
    marginBottom: sizes.spacing.md,
    backgroundColor: '#1f2937',
    borderRadius: sizes.borderRadius.lg,
    padding: 4,
  },

  tab: {
    flex: 1,
    paddingVertical: sizes.spacing.sm,
    borderRadius: sizes.borderRadius.md,
    alignItems: 'center',
  },

  shopItem: {
    marginHorizontal: sizes.spacing.sm,
    marginVertical: sizes.spacing.xs,
  },

  itemCard: {
    backgroundColor: '#1f2937',
    borderRadius: sizes.borderRadius.lg,
    padding: sizes.spacing.md,
  },
});

// 设置页面样式
export const settingsStyles = StyleSheet.create({
  settingsContainer: {
    flex: 1,
    paddingTop: deviceAdaptation.getStatusBarHeight(),
  },

  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: sizes.spacing.md,
    paddingHorizontal: sizes.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },

  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  settingText: {
    marginLeft: sizes.spacing.md,
    flex: 1,
  },

  settingTitle: {
    fontSize: sizes.fontSize.md,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'Inter-SemiBold',
  },

  settingDescription: {
    fontSize: sizes.fontSize.sm,
    color: '#9ca3af',
    marginTop: 2,
    fontFamily: 'Inter-Regular',
  },
});

// 工具函数：动态生成样式
export const createDynamicStyles = (dimensions: { width: number; height: number }) => {
  const scale = Math.min(dimensions.width / 390, dimensions.height / 844);
  
  return {
    // 动态字体大小
    fontSizes: {
      tiny: Math.round(10 * scale),
      small: Math.round(12 * scale),
      medium: Math.round(14 * scale),
      large: Math.round(16 * scale),
      xlarge: Math.round(18 * scale),
      huge: Math.round(20 * scale),
      massive: Math.round(24 * scale),
    },
    
    // 动态间距
    spacings: {
      xs: Math.round(4 * scale),
      sm: Math.round(8 * scale),
      md: Math.round(16 * scale),
      lg: Math.round(24 * scale),
      xl: Math.round(32 * scale),
      xxl: Math.round(48 * scale),
    },
    
    // 动态圆角
    borderRadius: {
      sm: Math.round(4 * scale),
      md: Math.round(8 * scale),
      lg: Math.round(12 * scale),
      xl: Math.round(16 * scale),
      full: 9999,
    },
  };
};