import type { NavigatorScreenParams } from '@react-navigation/native'
import type { location } from './LocationTypes'

export type TabParamList = {
  History: undefined
  Main: undefined
  Profile: undefined
}


export type RootStackParamList = {
    Tabs: NavigatorScreenParams<TabParamList>
    Preview: {imageLocal: string, imageUrl?: string }
  Map: { location: location }
    Login: undefined
    Graph: undefined
    Camera: undefined
    Profile: undefined
}