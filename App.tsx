import { useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, LogBox } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppTabs from './navigation/BottomNavigation';
import LoginScreen from './screens/LoginScreen';
import PreviewScreen from './screens/PreviewScreen';
import MapScreen from './screens/MapScreen';
import { scheduleDailyReminder } from './services/notificationHelper';

import type { RootStackParamList } from './types/ParamListTypes';
import CameraScreen from './screens/CameraScreen';

if (__DEV__) {
  LogBox.ignoreLogs([
    'expo-notifications: Android Push notifications (remote notifications) functionality provided by expo-notifications was removed from Expo Go',
    '`expo-notifications` functionality is not fully supported in Expo Go',
  ]);
}

const Stack = createNativeStackNavigator<RootStackParamList>()

const RootNavigator = () => {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!user) return;
    scheduleDailyReminder().catch((e) => console.warn('Failed to schedule reminder:', e));
  }, [user]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Tabs" component={AppTabs} />
            <Stack.Screen name="Preview" component={PreviewScreen} />
            <Stack.Screen
              name="Map"
              component={MapScreen}
              options={{
                headerShown: true,
                title: 'Map',
                headerBackButtonDisplayMode: 'minimal',
                headerTintColor: '#fff',
                headerStyle: { backgroundColor: '#262626' },
              }}
            />
            <Stack.Screen name="Camera" component={CameraScreen} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
