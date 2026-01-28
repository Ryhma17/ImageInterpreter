import type { NavigatorScreenParams } from '@react-navigation/native'
import type { location } from './locationTypes'

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
    Camera: undefined
}