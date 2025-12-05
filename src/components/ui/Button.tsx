import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { useColorScheme } from 'react-native';
import LinearGradient from 'expo-linear-gradient';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const getGradientColors = () => {
    switch (variant) {
      case 'primary':
        return ['#3b82f6', '#1d4ed8'];
      case 'secondary':
        return ['#6b7280', '#4b5563'];
      case 'danger':
        return ['#ef4444', '#dc2626'];
      case 'success':
        return ['#22c55e', '#16a34a'];
      default:
        return ['#3b82f6', '#1d4ed8'];
    }
  };

  const getButtonStyle = () => {
    const baseStyle: ViewStyle = {
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    };

    switch (size) {
      case 'small':
        return {
          ...baseStyle,
          paddingHorizontal: 16,
          paddingVertical: 8,
          minHeight: 36,
        };
      case 'medium':
        return {
          ...baseStyle,
          paddingHorizontal: 24,
          paddingVertical: 12,
          minHeight: 44,
        };
      case 'large':
        return {
          ...baseStyle,
          paddingHorizontal: 32,
          paddingVertical: 16,
          minHeight: 56,
        };
      default:
        return baseStyle;
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontWeight: '600',
      fontFamily: 'Inter-SemiBold',
    };

    switch (size) {
      case 'small':
        return { ...baseStyle, fontSize: 14 };
      case 'medium':
        return { ...baseStyle, fontSize: 16 };
      case 'large':
        return { ...baseStyle, fontSize: 18 };
      default:
        return baseStyle;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[{ opacity: disabled ? 0.5 : 1 }, style]}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={disabled ? ['#9ca3af', '#6b7280'] : getGradientColors()}
        style={getButtonStyle()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {loading ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            {icon}
            <Text style={[getTextStyle(), { color: 'white' }, textStyle]}>
              {title}
            </Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default Button;