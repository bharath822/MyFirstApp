import { Image } from 'expo-image';
import { Linking, Platform, StyleSheet, Text, Button, View } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video'
import { WebView } from 'react-native-webview'
import { supabase } from '../lib/supabase';
export default function HomeScreen() {
  return (
    <View style={{justifyContent: 'space-between', paddingTop: 35, paddingBottom: 10, flex: 1}}>
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#1d451b', dark: '#c5d2d7' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>

      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">bharath's practice!</ThemedText>
        <HelloWave />
      </ThemedView>
      <Link href="../(practiceTabs)/counter">
        <Text style={{ color: 'blue', fontSize: 18 }}>checkout practice screens</Text>
      </Link>
      <Link href="../(expenseTabs)/expenseTracker">
        <Text style={{ color: 'blue', fontSize: 18 }}>Go to Expense Tracker</Text>
      </Link>
    </ParallaxScrollView>
     <View>
        <Button title="Logout" onPress={() => supabase.auth.signOut()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 180,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  contentImage: {
    height: 500,
    width: 400,
  },
});
