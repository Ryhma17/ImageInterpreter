import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import MainScreen from "../screens/MainScreen"
import HistoryScreen from "../screens/HistoryScreen"
import ProfileScreen from "../screens/ProfileScreen"
import { Ionicons } from "@expo/vector-icons"

import type { TabParamList } from "../types/ParamListTypes"

const Tab = createBottomTabNavigator<TabParamList>()

const AppTabs = () => {
  return (
    <Tab.Navigator initialRouteName="Main" screenOptions={{
        tabBarStyle: {
            backgroundColor: "#2c2c2c",
            paddingTop: 9,
            borderTopWidth: 0,
            borderTopColor: "transparent",
            elevation: 0,
            shadowOpacity: 0,
            shadowColor: "transparent",
        },
        headerShown: false,
    }}>
        <Tab.Screen name="History" component={HistoryScreen} options={{
            title: "",
            tabBarIcon: ({color, size, focused}) => (
                <Ionicons name="list-circle-outline" color={focused ? "#ebb031" : "#e4dede"} size={30} />
            )
        }}
        />
        <Tab.Screen name="Main" component={MainScreen} options={{
            title: "",
            tabBarIcon: ({color, size, focused}) => (
                <Ionicons name="camera-outline" color={focused ? "#ebb031" : "#e4dede"} size={30} />
            )
        }}
        />
        <Tab.Screen name="Profile" component={ProfileScreen} options={{
            
            title: "",
            tabBarIcon: ({color, size, focused}) => (
                <Ionicons name="person-circle-outline" color={focused ? "#ebb031" : "#e4dede"} size={30} />
            )
        }}
        />
    </Tab.Navigator>
  )
}

export default AppTabs

