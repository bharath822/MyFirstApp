import { Tabs } from 'expo-router';
import { HapticTab } from '@/components/haptic-tab';
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ExpenseProvider } from '../(tabs)/context/ExpensesContext';

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
          name="expenseTracker"
          options={{
            title: 'expenseTracker',
            tabBarIcon: ({ color }) => <Ionicons size={28} name="home" color="grey" />
          }}
        /> 
        <Tabs.Screen
         name="statsScreen"
         options={{
           title: 'Stats',
           tabBarIcon: ({ color }) => <Ionicons size={28} name="stats-chart" color="grey" />
         }}
        />   
      </Tabs>
    </ExpenseProvider>
  );
}