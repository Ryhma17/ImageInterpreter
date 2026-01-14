import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = {}

const HistoryScreen = (props: Props) => {
  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <Text>HistoryScreen</Text>
    </SafeAreaView>
  )
}

export default HistoryScreen

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: "#262626"
  }
})