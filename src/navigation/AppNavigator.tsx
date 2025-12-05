import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';

// Screens
import HomeScreen from '../screens/HomeScreen';
import FishingScreen from '../screens/FishingScreen';
import CollectionScreen from '../screens/CollectionScreen';
import ShopScreen from '../screens/ShopScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SceneSelectScreen from '../screens/SceneSelectScreen';
import FishDetailScreen from '../screens/FishDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const GameStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#0f172a' },
      }}
    >
      <Stack.Screen name="FishingMain" component={FishingScreen} />
      <Stack.Screen name="SceneSelect" component={SceneSelectScreen} />
      <Stack.Screen name="FishDetail" component={FishDetailScreen} />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Fishing') {
            iconName = focused ? 'fish' : 'fish-outline';
          } else if (route.name === 'Collection') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Shop') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else {
            iconName = 'ellipse';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          backgroundColor: isDark ? '#1f2937' : '#ffffff',
          borderTopColor: isDark ? '#374151' : '#e5e7eb',
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
        },
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ tabBarLabel: '首页' }}
      />
      <Tab.Screen 
        name="Fishing" 
        component={GameStack}
        options={{ tabBarLabel: '钓鱼' }}
      />
      <Tab.Screen 
        name="Collection" 
        component={CollectionScreen}
        options={{ tabBarLabel: '图鉴' }}
      />
      <Tab.Screen 
        name="Shop" 
        component={ShopScreen}
        options={{ tabBarLabel: '商店' }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ tabBarLabel: '设置' }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;