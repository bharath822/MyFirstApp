import { Tabs } from 'expo-router';
import { HapticTab } from '@/components/haptic-tab';
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ExpenseProvider } from './context/ExpensesContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <ExpenseProvider>
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="home" color={color} />
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="compass-outline" color={color} />

        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: 'Menu',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="restaurant-outline" color={color} />
        }}
      />
      <Tabs.Screen
        name="user"
        options={{
          title: 'User',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="people-outline" color={color} />
        }}
      />
      <Tabs.Screen
        name="counter"
        options={{
          title: 'Counter',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="calculator-outline" color={color} />
        }}
      />
      <Tabs.Screen
        name="expenseTracker"
        options={{
          title: 'Expense Tracker',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="wallet-outline" color={color} />
        }}
      />
    </Tabs>
    </ExpenseProvider>
  );
}
