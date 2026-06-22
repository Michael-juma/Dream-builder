import { STARTER_DREAMS } from '@dream-builder/game-core'
import { useState } from 'react'
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'

import { useGame } from '../hooks/use-game'

const districts = [
  { id: 'knowledge', label: 'Knowledge District', emoji: '📚' },
  { id: 'engineering', label: 'Engineering District', emoji: '⚙️' },
  { id: 'creativity', label: 'Creativity District', emoji: '🎨' },
  { id: 'wellness', label: 'Wellness District', emoji: '🌿' },
] as const

export function OnboardingScreen() {
  const { finishOnboarding } = useGame()
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [civilizationName, setCivilizationName] = useState('')
  const [firstDream, setFirstDream] = useState(STARTER_DREAMS[0])
  const [customDream, setCustomDream] = useState('')
  const [district, setDistrict] =
    useState<(typeof districts)[number]['id']>('knowledge')

  const chosenDream = firstDream === 'Create My Own Goal' ? customDream : firstDream

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.eyebrow}>Chapter 1 · The First Spark</Text>
      <Text style={styles.title}>Become a Dream Architect</Text>
      <Text style={styles.body}>
        The world was fractured when dreams were abandoned. Awaken The Cradle and
        begin rebuilding.
      </Text>

      {step === 0 && (
        <View style={styles.card}>
          <Text style={styles.label}>Your name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Dream Architect"
            placeholderTextColor="#7a7a90"
          />
          <Text style={styles.label}>Civilization name</Text>
          <TextInput
            style={styles.input}
            value={civilizationName}
            onChangeText={setCivilizationName}
            placeholder="Cradle of Hope"
            placeholderTextColor="#7a7a90"
          />
        </View>
      )}

      {step === 1 && (
        <View style={styles.card}>
          <Text style={styles.label}>Choose your first dream</Text>
          {[...STARTER_DREAMS, 'Create My Own Goal'].map((dream) => (
            <Pressable
              key={dream}
              style={[styles.option, firstDream === dream && styles.optionActive]}
              onPress={() => setFirstDream(dream)}
            >
              <Text style={styles.optionText}>{dream}</Text>
            </Pressable>
          ))}
          {firstDream === 'Create My Own Goal' && (
            <TextInput
              style={styles.input}
              value={customDream}
              onChangeText={setCustomDream}
              placeholder="Describe your dream"
              placeholderTextColor="#7a7a90"
            />
          )}
        </View>
      )}

      {step === 2 && (
        <View style={styles.card}>
          <Text style={styles.label}>Awaken your first district</Text>
          {districts.map((item) => (
            <Pressable
              key={item.id}
              style={[styles.option, district === item.id && styles.optionActive]}
              onPress={() => setDistrict(item.id)}
            >
              <Text style={styles.optionText}>
                {item.emoji} {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      <View style={styles.actions}>
        {step > 0 && (
          <Pressable style={styles.secondaryButton} onPress={() => setStep(step - 1)}>
            <Text style={styles.secondaryButtonText}>Back</Text>
          </Pressable>
        )}
        {step < 2 ? (
          <Pressable
            style={styles.primaryButton}
            onPress={() => setStep(step + 1)}
            disabled={
              (step === 0 && (!name.trim() || !civilizationName.trim())) ||
              (step === 1 && !chosenDream.trim())
            }
          >
            <Text style={styles.primaryButtonText}>Continue</Text>
          </Pressable>
        ) : (
          <Pressable
            style={styles.primaryButton}
            onPress={() =>
              finishOnboarding({
                name,
                civilizationName,
                firstDream: chosenDream,
                district,
              })
            }
          >
            <Text style={styles.primaryButtonText}>Awaken The Cradle</Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 16,
    backgroundColor: '#0f0f18',
    flexGrow: 1,
  },
  eyebrow: {
    color: '#a1a1b5',
    fontSize: 13,
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '700',
  },
  body: {
    color: '#c7c7d5',
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 18,
    padding: 16,
    gap: 12,
  },
  label: {
    color: '#ffffff',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#12121f',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#2d2d45',
  },
  option: {
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#2d2d45',
  },
  optionActive: {
    borderColor: '#7c6cff',
    backgroundColor: '#2a2550',
  },
  optionText: {
    color: '#ffffff',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#7c6cff',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  secondaryButton: {
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: '#2d2d45',
  },
  secondaryButtonText: {
    color: '#ffffff',
  },
})
