import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useRecipes } from '@/context/RecipeContext';
import { formatTime } from '@/utils/recipe-utils';

export default function CookingModeScreen() {
  const router = useRouter();
  const { recipeId } = useLocalSearchParams();
  const { recipes } = useRecipes();
  const recipe = recipes.find(r => r.id === recipeId);

  const [currentStep, setCurrentStep] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerAlertShown, setTimerAlertShown] = useState(false);
  const insets = useSafeAreaInsets();

  const step = recipe?.steps[currentStep];

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isTimerRunning && timeRemaining !== null && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev === null) return null;
          const newTime = prev - 1;
          if (newTime <= 0 && !timerAlertShown) {
            setTimerAlertShown(true);
            Alert.alert('Timer Finished!', `Time for step ${currentStep + 1} is up.`);
            setIsTimerRunning(false);
          }
          return Math.max(newTime, 0);
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timeRemaining, currentStep, timerAlertShown]);

  useEffect(() => {
    if (step?.timerSeconds) {
      setTimeRemaining(step.timerSeconds);
      setIsTimerRunning(false);
      setTimerAlertShown(false);
    } else {
      setTimeRemaining(null);
      setIsTimerRunning(false);
    }
  }, [currentStep, step?.timerSeconds]);

  if (!recipe) {
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={styles.errorContainer}
          accessible={true}
          accessibilityRole="text"
          accessibilityLabel="Recipe not found"
        >
          <Text style={styles.errorText}>Recipe not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleNextStep = () => {
    if (currentStep < recipe.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      Alert.alert('Finished!', 'You have completed all steps!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }
  };

  const handleStartTimer = () => {
    if (timeRemaining !== null && timeRemaining > 0) {
      setIsTimerRunning(true);
    }
  };

  const handlePauseTimer = () => {
    setIsTimerRunning(false);
  };

  const handleResetTimer = () => {
    if (step?.timerSeconds) {
      setTimeRemaining(step.timerSeconds);
      setIsTimerRunning(false);
      setTimerAlertShown(false);
    }
  };

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === recipe.steps.length - 1;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Back"
          accessibilityHint="Double tap to exit cooking mode"
        >
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text
          style={styles.title}
          accessibilityRole="header"
        >
          {recipe.title}
        </Text>
        <View
          style={styles.stepCounter}
          accessible={true}
          accessibilityRole="text"
          accessibilityLabel={`Step ${currentStep + 1} of ${recipe.steps.length}`}
        >
          <Text style={styles.stepCounterText}>
            {currentStep + 1} / {recipe.steps.length}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <View
          style={styles.progressBar}
          accessible={true}
          accessibilityRole="progressbar"
          accessibilityValue={{
            min: 0,
            max: recipe.steps.length,
            now: currentStep + 1,
          }}
          accessibilityLabel="Cooking progress"
        >
          <View
            style={[
              styles.progressFill,
              {
                width: `${((currentStep + 1) / recipe.steps.length) * 100}%`,
              },
            ]}
            accessible={false}
          />
        </View>

        <View
          style={styles.stepContainer}
          accessible={true}
          accessibilityRole="text"
          accessibilityLabel={`Step ${currentStep + 1}: ${step?.text}`}
        >
          <Text style={styles.stepText}>{step?.text}</Text>
        </View>

        {step?.timerSeconds && (
          <View
            style={styles.timerSection}
            accessible={true}
            accessibilityRole="timer"
          >
            <View
              style={styles.timerDisplay}
              accessible={true}
              accessibilityRole="text"
              accessibilityLabel={`Timer: ${formatTime(timeRemaining || 0)} remaining`}
            >
              <Text
                style={styles.timerText}
                accessible={false}
              >
                {formatTime(timeRemaining || 0)}
              </Text>
            </View>

            <View style={styles.timerControls}>
              {!isTimerRunning ? (
                <TouchableOpacity
                  style={styles.timerButton}
                  onPress={handleStartTimer}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Start timer"
                  accessibilityHint="Double tap to start the timer"
                >
                  <Text
                    style={styles.timerButtonText}
                    accessible={false}
                  >
                    Start
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.timerButton}
                  onPress={handlePauseTimer}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Pause timer"
                  accessibilityHint="Double tap to pause the timer"
                >
                  <Text
                    style={styles.timerButtonText}
                    accessible={false}
                  >
                    Pause
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.timerButtonSecondary}
                onPress={handleResetTimer}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Reset timer"
                accessibilityHint="Double tap to reset the timer to its initial value"
              >
                <Text
                  style={styles.timerButtonSecondaryText}
                  accessible={false}
                >
                  Reset
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      <View style={[styles.navigation, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity
          style={[styles.navButton, isFirstStep && styles.navButtonDisabled]}
          onPress={handlePreviousStep}
          disabled={isFirstStep}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Previous step"
          accessibilityHint={isFirstStep ? "You are on the first step" : "Double tap to go to the previous step"}
          accessibilityState={{ disabled: isFirstStep }}
        >
          <Text
            style={styles.navButtonText}
            accessible={false}
          >
            ← Previous
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={handleNextStep}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={isLastStep ? "Finish cooking" : "Next step"}
          accessibilityHint={isLastStep ? "Double tap to finish cooking and exit" : "Double tap to go to the next step"}
        >
          <Text
            style={styles.navButtonText}
            accessible={false}
          >
            {isLastStep ? 'Finish' : 'Next →'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 28,
    color: '#1f2937',
    fontWeight: '600',
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  stepCounter: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#fef08a',
    borderRadius: 6,
  },
  stepCounterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7c2d12',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
    justifyContent: 'space-between',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fef08a',
  },
  stepContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 32,
    marginVertical: 20,
  },
  stepText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1f2937',
    lineHeight: 36,
    textAlign: 'center',
  },
  timerSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 20,
    gap: 16,
  },
  timerDisplay: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  timerText: {
    fontSize: 56,
    fontWeight: '700',
    color: '#fef08a',
    fontFamily: 'Menlo',
  },
  timerControls: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
  },
  timerButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#fef08a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7c2d12',
  },
  timerButtonSecondary: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  timerButtonSecondaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
  },
  navigation: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  navButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#fef08a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7c2d12',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#6b7280',
  },
});
