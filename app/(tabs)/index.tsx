import { Image } from 'expo-image';
import { Linking, Platform, StyleSheet, Text } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video'
import { WebView } from 'react-native-webview'
export default function HomeScreen() {
  const myName = 'Bharath'
  const myAge = 25
  const myCity = 'Bengaluru'

  console.log(myName, myAge, myCity)
  const user = {
  name: 'Bharath',
  age: 25,
  isLoggedIn: true,
  profilePic: null,
  skills: ['JavaScript', 'React Native']
}

console.log(user)
console.log(user.name)
console.log(user.skills)
console.log(user.skills[0])  // first item in array
const apps = ['Instagram', 'YouTube', 'Twitter', 'Netflix']

// Get only apps with more than 7 characters in name
const longNames = apps.filter((app) => app.length > 7)
console.log(longNames)
  const player = useVideoPlayer('https://www.youtube.com/watch?v=MCDVcQIA3UM')
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#153a13', dark: '#020e12' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
        <Link href="/user">
  <Text style={{ color: 'blue', fontSize: 18 }}>See Users</Text>
</Link>
<Link href="/menu">
  <Text style={{ color: 'blue', fontSize: 18 }}>See Menu</Text>
</Link>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">bharath's practice!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">changed default text</ThemedText>
        <ThemedText>
          This is default ThemedText{'\n'}<Text>This is default Text{'\n'}</Text>
          <Text style={{ fontFamily: 'System', fontWeight: 'bold', color: 'skyblue' }} onPress={() => Linking.openURL('https://www.youtube.com/watch?v=0-S5a0eXPoc')}>
            tap here to open youtube video
          </Text>
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <Link href="/modal">
          <Link.Trigger>
            <ThemedText type="link">Step 2: Explore  leaving this block unedited</ThemedText>
          </Link.Trigger>
          <Link.Preview />
          <Link.Menu>
            <Link.MenuAction title="Action" icon="cube" onPress={() => alert('Action pressed')} />
            <Link.MenuAction
              title="Share"
              icon="square.and.arrow.up"
              onPress={() => alert('Share pressed')}
            />
            <Link.Menu title="More" icon="ellipsis">
              <Link.MenuAction
                title="Delete"
                icon="trash"
                destructive
                onPress={() => alert('Delete pressed')}
              />
            </Link.Menu>
          </Link.Menu>
        </Link>

        <ThemedText>
          {`Tap the Explore tab to learn more about what's included in this starter app.`}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: adding image</ThemedText>
        <Image
          source={require('@/assets/images/kindpng_1905171.png')}
          style={styles.contentImage}
        />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 4: adding video</ThemedText>
        <WebView
          style={{ width: 400, height: 300 }}
          source={{ uri: 'https://www.youtube.com/watch?v=MCDVcQIA3UM?autoplay=0&controls=1&showinfo=0&rel=0&modestbranding=1' }}
        />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 5: adding YouTube video</ThemedText>
        <VideoView
          player={player}
          style={{ width: 400, height: 300 }}
          contentFit="contain"
          nativeControls
        />
      </ThemedView>
    

<Link href="/counter">
  <Text style={{ color: 'blue', fontSize: 18 }}>Go to Counter</Text>
</Link>
    </ParallaxScrollView>
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
