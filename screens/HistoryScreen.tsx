import { StyleSheet, Text, View, FlatList } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import HistoryItem from '../components/HistoryItem'
import { TESTI_HISTORIA } from '../testData/testiHistoriaa'

type Props = {}

const HistoryScreen = (props: Props) => {
  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <Text style={styles.title}>History</Text>
      <FlatList
        data={TESTI_HISTORIA}
        contentContainerStyle={styles.contentContainer}
        renderItem={({ item }) => (
          <HistoryItem
            image={item.image}
            date={item.date}
            location={item.location}
            title={item.title}
            subtitle={item.subtitle}
            onPress={() => {}}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  )
}

export default HistoryScreen

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: "#262626"
  },
  contentContainer: {
    padding: 16,
    backgroundColor: "#262626"
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    paddingLeft: 16,
  }
})