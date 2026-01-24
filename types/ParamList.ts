import type { NavigatorScreenParams } from '@react-navigation/native'

export type TabParamList = {
  History: undefined
  Main: undefined
  Profile: undefined
}


export type RootStackParamList = {
    Tabs: NavigatorScreenParams<TabParamList>
    Preview: {imageLocal: string, imageUrl?: string }
    Login: undefined
    Camera: undefined
}