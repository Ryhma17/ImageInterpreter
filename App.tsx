import { StyleSheet, Text, View } from 'react-native';
import AppTabs from './navigation/bottomNav';
import { NavigationContainer } from '@react-navigation/native';


export default function App() {
  return (
      <NavigationContainer>
        <AppTabs />
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff4d',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
