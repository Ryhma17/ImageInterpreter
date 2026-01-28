import { Alert, StyleSheet, Text } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import PressableButton from '../components/PressableButton'
import * as ImagePicker from 'expo-image-picker'

import type { CompositeScreenProps } from '@react-navigation/native'
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { RootStackParamList, TabParamList } from '../types/ParamListTypes'


type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Main'>,
  NativeStackScreenProps<RootStackParamList>
>

const MainScreen = ({navigation}: Props) => {
  const [opening, setOpening] = useState<boolean>(false)

  const OpenGalleryModal = async () => {
    if (opening) return
    setOpening(true)
    try {
      const permissionRes = await ImagePicker.requestMediaLibraryPermissionsAsync()

      if (!permissionRes.granted) {
      Alert.alert("Permission for gallery required", permissionRes.canAskAgain ?
         "Permission to access the media library is required" : "Permission denied")
      return
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [4,3],
      quality: 1
    })
    
    if(result.canceled) {
      setOpening(false)
      return
    }
    
      const uri = result.assets?.[0]?.uri
      if (!uri) {
        Alert.alert("No image selected")
        setOpening(false)
        return
      }

      navigation.navigate('Preview', { imageLocal: uri })

    } catch (e) {
      Alert.alert("Failed to open gallery")
    }
}

const openCamera = async () => {
  const res = await ImagePicker.requestCameraPermissionsAsync()
  if (!res.granted) {
    Alert.alert('Camera permission required', 'Enable camera permission to take a photo.')
    return
  }
  navigation.navigate("Camera")
} 


  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <Text style={styles.title}> New Scan</Text>
      <PressableButton icon="camera" text='Take Photo' onPress={openCamera}/>
      <PressableButton icon="images" text='Chooose from Gallery' onPress={OpenGalleryModal}/>
    </SafeAreaView>
  )
}

export default MainScreen

const styles = StyleSheet.create({
    safeAreaContainer: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#262626",
    justifyContent: "center",
    paddingHorizontal: 16
  },
  title: {
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
    fontSize: 26,
    color: "#d8d8d8d8",
    fontWeight: "bold",
    paddingBottom: 16
  }
})