import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import PressableButton from '../components/PressableButton'
import { Ionicons } from "@expo/vector-icons"

type Props = {}

const CameraScreen = (props: Props) => {

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <Text style={styles.title}> New Scan</Text>
      <PressableButton icon={"camera"} text='Take Photo'/>
      <PressableButton icon={"images"} text='Chooose from Gallery'/>
    </SafeAreaView>
  )
}

export default CameraScreen

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