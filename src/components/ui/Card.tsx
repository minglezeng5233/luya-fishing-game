import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useColorScheme } from 'react-native';
import LinearGradient from 'expo-linear-gradient';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  gradient?: boolean;
  gradientColors?: string[];
  padding?: number;
  margin?: number;
  borderRadius?: number;
  shadow?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  style,
  gradient = false,
  gradientColors,
  padding = 16,
  margin = 0,
  borderRadius = 12,
  shadow = true,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const cardStyle: ViewStyle = {
    margin,
    padding,
    borderRadius,
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: shadow ? 0.25 : 0,
    shadowRadius: shadow ? 3.84 : 0,
    elevation: shadow ? 5 : 0,
    borderWidth: isDark ? 1 : 0,
    borderColor: isDark ? '#374151' : 'transparent',
  };

  if (gradient) {
    return (
      <LinearGradient
        colors={gradientColors || ['#3b82f6', '#1d4ed8']}
        style={[cardStyle, style]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {children}
      </LinearGradient>
    );
  }

  return <View style={[cardStyle, style]}>{children}</View>;
};

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  rightComponent?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  icon,
  rightComponent,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <View>
          <Text style={[styles.title, { color: isDark ? '#ffffff' : '#111827' }]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.subtitle, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {rightComponent && <View>{rightComponent}</View>}
    </View>
  );
};

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
  size?: 'small' | 'medium' | 'large';
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  color = '#3b82f6',
  size = 'medium',
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return { padding: 12, minHeight: 60 };
      case 'medium':
        return { padding: 16, minHeight: 80 };
      case 'large':
        return { padding: 20, minHeight: 100 };
      default:
        return { padding: 16, minHeight: 80 };
    }
  };

  return (
    <Card
      style={[getSizeStyle(), styles.statCard]}
      gradient
      gradientColors={[color + '20', color + '10']}
      shadow
    >
      <View style={styles.statContent}>
        {icon && <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>{icon}</View>}
        <View style={styles.statInfo}>
          <Text style={[styles.statValue, { color }]}>{value}</Text>
          <Text style={[styles.statLabel, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
            {label}
          </Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
    fontFamily: 'Inter-Regular',
  },
  statCard: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
});

export default Card;