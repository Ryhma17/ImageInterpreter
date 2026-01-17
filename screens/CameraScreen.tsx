import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { RootStackParamList } from '../types/ParamList'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as ImagePicker from 'expo-image-picker'

type Props = NativeStackScreenProps<RootStackParamList, "Camera">

const CameraScreen = ({navigation}: Props) => {
  const [opening, setOpening] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const launchedRef = useRef(false)

  const openCamera = async () => {
    try {
      setError(null)
      setOpening(true)

      const permission = await ImagePicker.requestCameraPermissionsAsync()
      if (!permission.granted) {
        setError('Camera permission is required.')
        setOpening(false)
        return
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: "images",
        cameraType: ImagePicker.CameraType.back,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      })

      if (result.canceled) {
        setOpening(false)
        navigation.goBack()
        return
      }

      const uri = result.assets?.[0]?.uri
      if (!uri) {
        setError('Failed to capture image.')
        setOpening(false)
        return
      }

      setOpening(false)
      navigation.navigate('Preview', { image: uri })
    } catch (e) {
      setOpening(false)
      setError('Failed to open camera.')
    }
  }

  useEffect(() => {
    if (launchedRef.current) return
    launchedRef.current = true
    openCamera()
  }, [])
  
  return (
    <SafeAreaView style={styles.cameraContainer}>
      <View style={styles.placeholder}>
        {opening && <ActivityIndicator />}
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
    </SafeAreaView>
  )
}

export default CameraScreen

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    alignItems: "stretch",
    backgroundColor: "black",
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  error: {
    color: '#ff6b6b',
    marginTop: 12,
    textAlign: 'center',
  },
})