import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = {}

const ProfileScreen = (props: Props) => {
  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <Text>ProfileScreen</Text>
    </SafeAreaView>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: "#262626"
  }
})