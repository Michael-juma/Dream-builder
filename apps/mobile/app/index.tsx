import { Link } from 'expo-router'
import { Pressable, StyleSheet, Text, View } from 'react-native'

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>Life-growth civilization game</Text>
      <Text style={styles.title}>Dream Builder</Text>
      <Text style={styles.body}>
        Transform real-world progress into a living civilization on The Cradle.
        Set goals, earn Dream Energy, meet citizens, and grow the World Tree.
      </Text>

      <View style={styles.cards}>
        <Feature emoji="🎯" title="Real-life goals" />
        <Feature emoji="🏝" title="The Cradle" />
        <Feature emoji="🌳" title="World Tree" />
      </View>

      <Link href="/game" asChild>
        <Pressable style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Start building</Text>
        </Pressable>
      </Link>
    </View>
  )
}

function Feature({ emoji, title }: { emoji: string; title: string }) {
  return (
    <View style={styles.feature}>
      <Text style={styles.featureEmoji}>{emoji}</Text>
      <Text style={styles.featureTitle}>{title}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f18',
    padding: 24,
    justifyContent: 'center',
    gap: 16,
  },
  eyebrow: {
    color: '#a1a1b5',
    fontSize: 14,
    textAlign: 'center',
  },
  title: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: '700',
    textAlign: 'center',
  },
  body: {
    color: '#c7c7d5',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  cards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 8,
  },
  feature: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
  },
  featureEmoji: {
    fontSize: 24,
  },
  featureTitle: {
    color: '#ffffff',
    marginTop: 8,
    fontSize: 12,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#7c6cff',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
})
