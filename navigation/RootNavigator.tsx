import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AppTabs from './BottomNavigation'
import PreviewScreen from '../screens/PreviewScreen'
import MapScreen from '../screens/MapScreen'

import type { RootStackParamList } from '../types/ParamListTypes'
import CameraScreen from '../screens/CameraScreen'

const Stack = createNativeStackNavigator<RootStackParamList>()

const RootNavigator = () => {
  return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={AppTabs} />
        <Stack.Screen name="Preview" component={PreviewScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="Camera" component={CameraScreen} />
      </Stack.Navigator>
  )
}

export default RootNavigator