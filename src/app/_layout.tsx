import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Text } from 'react-native';
import { Tabs } from 'expo-router';
import { RecipeProvider } from '@/context/RecipeContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({});

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <RecipeProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarActiveTintColor: '#fef08a',
          tabBarInactiveTintColor: '#9ca3af',
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopColor: '#f3f4f6',
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '500',
            marginTop: 4,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarLabel: 'Home',
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 24 }}>🏠</Text>
            ),
          }}
        />
        <Tabs.Screen
          name="my-kitchen"
          options={{
            title: 'My Kitchen',
            tabBarLabel: 'Kitchen',
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 24 }}>🍳</Text>
            ),
          }}
        />
        <Tabs.Screen
          name="add-recipe"
          options={{
            title: 'Add Recipe',
            tabBarLabel: 'Add',
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 24 }}>➕</Text>
            ),
          }}
        />
      </Tabs>
    </RecipeProvider>
  );
}
