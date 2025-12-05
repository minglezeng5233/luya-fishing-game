import { Dimensions, Platform, PixelRatio } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// 基准设计尺寸 (iPhone 12)
const baseWidth = 390;
const baseHeight = 844;

// 响应式尺寸计算
export const responsive = {
  /**
   * 根据屏幕宽度计算响应式尺寸
   */
  width: (size: number): number => {
    return (screenWidth / baseWidth) * size;
  },

  /**
   * 根据屏幕高度计算响应式尺寸
   */
  height: (size: number): number => {
    return (screenHeight / baseHeight) * size;
  },

  /**
   * 根据屏幕最小边计算响应式尺寸（适用于正方形元素）
   */
  min: (size: number): number => {
    const scale = Math.min(screenWidth / baseWidth, screenHeight / baseHeight);
    return scale * size;
  },

  /**
   * 根据屏幕最大边计算响应式尺寸
   */
  max: (size: number): number => {
    const scale = Math.max(screenWidth / baseWidth, screenHeight / baseHeight);
    return scale * size;
  },

  /**
   * 计算字体大小
   */
  fontSize: (size: number): number => {
    const scale = Math.min(screenWidth / baseWidth, screenHeight / baseHeight);
    return Math.round(size * scale);
  },

  /**
   * 获取当前屏幕信息
   */
  screen: {
    width: screenWidth,
    height: screenHeight,
    aspectRatio: screenWidth / screenHeight,
    isPortrait: screenHeight > screenWidth,
    isLandscape: screenWidth > screenHeight,
    isTablet: screenWidth >= 768,
    isSmallScreen: screenWidth <= 320,
    isLargeScreen: screenWidth >= 414,
  },

  /**
   * 获取安全区域适配值
   */
  safeArea: {
    // 基于不同设备的默认值
    top: Platform.select({
      ios: 44,
      android: 24,
      default: 0,
    }),
    bottom: Platform.select({
      ios: 34,
      android: 0,
      default: 0,
    }),
    left: 0,
    right: 0,
  },

  /**
   * 获取设备特定信息
   */
  device: {
    pixelRatio: PixelRatio.get(),
    scale: PixelRatio.getFontScale(),
    isAndroid: Platform.OS === 'android',
    isIOS: Platform.OS === 'ios',
  },
};

// 断点定义
export const breakpoints = {
  small: 320,   // 小屏幕手机
  medium: 375,  // 标准手机
  large: 414,   // 大屏手机
  tablet: 768,  // 平板
  desktop: 1024, // 桌面
};

// 媒体查询工具
export const mediaQuery = {
  /**
   * 检查是否为小屏幕
   */
  isSmall: (): boolean => screenWidth < breakpoints.medium,

  /**
   * 检查是否为中等屏幕
   */
  isMedium: (): boolean => screenWidth >= breakpoints.medium && screenWidth < breakpoints.large,

  /**
   * 检查是否为大屏幕
   */
  isLarge: (): boolean => screenWidth >= breakpoints.large && screenWidth < breakpoints.tablet,

  /**
   * 检查是否为平板
   */
  isTablet: (): boolean => screenWidth >= breakpoints.tablet,

  /**
   * 检查是否为桌面（虽然主要是移动应用）
   */
  isDesktop: (): boolean => screenWidth >= breakpoints.desktop,

  /**
   * 获取当前屏幕尺寸类型
   */
  getScreenSize: (): 'small' | 'medium' | 'large' | 'tablet' | 'desktop' => {
    if (screenWidth < breakpoints.medium) return 'small';
    if (screenWidth < breakpoints.large) return 'medium';
    if (screenWidth < breakpoints.tablet) return 'large';
    if (screenWidth < breakpoints.desktop) return 'tablet';
    return 'desktop';
  },
};

// 动态样式工具
export const createResponsiveStyle = <T extends Record<string, any>>(
  baseStyles: T,
  responsiveStyles?: {
    small?: Partial<T>;
    medium?: Partial<T>;
    large?: Partial<T>;
    tablet?: Partial<T>;
    desktop?: Partial<T>;
  }
): T => {
  const screenSize = mediaQuery.getScreenSize();
  const responsiveOverrides = responsiveStyles?.[screenSize] || {};
  
  return {
    ...baseStyles,
    ...responsiveOverrides,
  };
};

// 常用响应式尺寸预设
export const sizes = {
  // 字体大小
  fontSize: {
    xs: responsive.fontSize(12),
    sm: responsive.fontSize(14),
    md: responsive.fontSize(16),
    lg: responsive.fontSize(18),
    xl: responsive.fontSize(20),
    xxl: responsive.fontSize(24),
    xxxl: responsive.fontSize(28),
  },

  // 间距
  spacing: {
    xs: responsive.width(4),
    sm: responsive.width(8),
    md: responsive.width(16),
    lg: responsive.width(24),
    xl: responsive.width(32),
    xxl: responsive.width(48),
  },

  // 圆角
  borderRadius: {
    sm: responsive.width(4),
    md: responsive.width(8),
    lg: responsive.width(12),
    xl: responsive.width(16),
    full: 9999,
  },

  // 按钮高度
  buttonHeight: {
    sm: responsive.height(36),
    md: responsive.height(44),
    lg: responsive.height(56),
  },

  // 图标大小
  iconSize: {
    sm: responsive.width(16),
    md: responsive.width(20),
    lg: responsive.width(24),
    xl: responsive.width(32),
  },

  // 卡片尺寸
  card: {
    small: {
      width: responsive.width(160),
      height: responsive.height(200),
    },
    medium: {
      width: responsive.width(180),
      height: responsive.height(220),
    },
    large: {
      width: responsive.width(200),
      height: responsive.height(240),
    },
  },

  // 游戏界面特定尺寸
  game: {
    canvasHeight: responsive.height(400),
    controlButtonSize: responsive.min(80),
    controlButtonLargeSize: responsive.min(100),
    lureSize: responsive.width(16),
    fishSize: responsive.width(60),
    progressBarHeight: responsive.height(12),
  },
};

// 设备适配工具
export const deviceAdaptation = {
  /**
   * 获取设备特定的导航栏高度
   */
  getTabBarHeight: (): number => {
    if (Platform.OS === 'ios') {
      return responsive.height(88); // iOS 标准标签栏高度
    }
    return responsive.height(64); // Android 标签栏高度
  },

  /**
   * 获取状态栏高度
   */
  getStatusBarHeight: (): number => {
    if (Platform.OS === 'ios') {
      return responsive.height(44); // iOS 状态栏
    }
    return responsive.height(24); // Android 状态栏
  },

  /**
   * 检查是否需要特殊处理刘海屏
   */
  hasNotch: (): boolean => {
    if (Platform.OS === 'ios') {
      // iPhone X 及更新机型
      const iPhoneXModels = [
        'iPhone10,3', 'iPhone10,6', // iPhone X
        'iPhone11,2', 'iPhone11,4', 'iPhone11,6', // iPhone XS 系列
        'iPhone12,1', 'iPhone12,3', 'iPhone12,5', // iPhone 12 系列
        'iPhone13,1', 'iPhone13,2', 'iPhone13,3', 'iPhone13,4', // iPhone 13 系列
        'iPhone14,2', 'iPhone14,3', 'iPhone14,4', 'iPhone14,5', // iPhone 14 系列
      ];
      
      // 这里简化处理，实际应用中需要更精确的检测
      return responsive.screen.height >= 812;
    }
    return false;
  },

  /**
   * 获取安全区域底部高度（用于处理底部指示器）
   */
  getSafeBottom: (): number => {
    if (Platform.OS === 'ios' && deviceAdaptation.hasNotch()) {
      return responsive.height(34);
    }
    return responsive.height(0);
  },
};

// 监听屏幕尺寸变化
export const useDimensions = () => {
  const [dimensions, setDimensions] = React.useState({
    width: screenWidth,
    height: screenHeight,
  });

  React.useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({
        width: window.width,
        height: window.height,
      });
    });

    return () => subscription?.remove();
  }, []);

  return {
    ...dimensions,
    isPortrait: dimensions.height > dimensions.width,
    isLandscape: dimensions.width > dimensions.height,
    aspectRatio: dimensions.width / dimensions.height,
  };
};