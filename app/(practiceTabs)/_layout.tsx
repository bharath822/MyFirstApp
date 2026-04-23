import { Tabs } from 'expo-router';
import { HapticTab } from '@/components/haptic-tab';
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="counter"
        options={{
          title: 'counter',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="home" color={color} />
        }}
      /> 
        <Tabs.Screen
         name="menu"
         options={{
           title: 'Menu',
           tabBarIcon: ({ color }) => <Ionicons size={28} name="list" color={color} />
         }}
        />
        <Tabs.Screen
          name="user"
          options={{
            title: 'User',
            tabBarIcon: ({ color }) => <Ionicons size={28} name="person" color={color} />
          }}
        />
    </Tabs>
  );
}