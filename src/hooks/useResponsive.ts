import { useEffect, useState } from 'react';
import { Dimensions, Platform } from 'react-native';
import { responsive, mediaQuery, deviceAdaptation, sizes } from '../utils/responsive';

export const useResponsive = () => {
  const [dimensions, setDimensions] = useState(() => ({
    width: responsive.screen.width,
    height: responsive.screen.height,
  }));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({
        width: window.width,
        height: window.height,
      });
    });

    return () => subscription?.remove();
  }, []);

  return {
    dimensions,
    // 便捷的尺寸计算方法
    width: (size: number) => (dimensions.width / 390) * size, // 基准宽度390
    height: (size: number) => (dimensions.height / 844) * size, // 基准高度844
    min: (size: number) => Math.min(dimensions.width, dimensions.height) / 390 * size,
    
    // 屏幕信息
    isPortrait: dimensions.height > dimensions.width,
    isLandscape: dimensions.width > dimensions.height,
    isSmall: dimensions.width < 375,
    isMedium: dimensions.width >= 375 && dimensions.width < 414,
    isLarge: dimensions.width >= 414,
    isTablet: dimensions.width >= 768,
    
    // 设备适配
    getTabBarHeight: () => deviceAdaptation.getTabBarHeight(),
    getStatusBarHeight: () => deviceAdaptation.getStatusBarHeight(),
    getSafeBottom: () => deviceAdaptation.getSafeBottom(),
    hasNotch: () => deviceAdaptation.hasNotch(),
  };
};

export const useBreakpoints = () => {
  const { dimensions } = useResponsive();
  
  return {
    isSmall: dimensions.width < 375,
    isMedium: dimensions.width >= 375 && dimensions.width < 414,
    isLarge: dimensions.width >= 414 && dimensions.width < 768,
    isTablet: dimensions.width >= 768,
    isDesktop: dimensions.width >= 1024,
  };
};

export const useDeviceAdaptation = () => {
  const { dimensions } = useResponsive();
  
  return {
    // 安全区域
    safeAreaTop: deviceAdaptation.getStatusBarHeight(),
    safeAreaBottom: deviceAdaptation.getSafeBottom(),
    tabBarHeight: deviceAdaptation.getTabBarHeight(),
    
    // 游戏界面适配
    gameCanvasHeight: dimensions.height * 0.6,
    gameCanvasWidth: dimensions.width,
    controlButtonSize: Math.min(dimensions.width, dimensions.height) * 0.12,
    controlButtonLargeSize: Math.min(dimensions.width, dimensions.height) * 0.15,
    
    // 字体适配
    getFontSize: (baseSize: number) => (dimensions.width / 390) * baseSize,
    getSpacing: (baseSize: number) => (dimensions.width / 390) * baseSize,
    
    // 布局适配
    getColumns: () => {
      if (dimensions.width >= 768) return 3; // 平板
      if (dimensions.width >= 414) return 2; // 大屏手机
      return 2; // 标准手机
    },
    
    getCardWidth: () => {
      const spacing = dimensions.width * 0.04; // 4% 间距
      const columns = dimensions.width >= 768 ? 3 : 2;
      return (dimensions.width - spacing * (columns + 1)) / columns;
    },
  };
};