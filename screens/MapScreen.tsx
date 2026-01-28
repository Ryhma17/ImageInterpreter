import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { RootStackParamList } from '../types/ParamListTypes'

type Props = NativeStackScreenProps<RootStackParamList, 'Map'>

const MapScreen = ({ route }: Props) => {
  const { location } = route.params

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Location</Text>
      <Text style={styles.coords}>{location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}</Text>
      <Text style={styles.hint}>Hook up react-native-maps here when ready.</Text>
    </View>
  )
}

export default MapScreen

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#262626',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 16,
    },
    title: {
      color: '#d8d8d8d8',
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    coords: {
      color: '#FFCA28',
      fontSize: 16,
      marginBottom: 12,
    },
    hint: {
      color: '#999',
      fontSize: 12,
    },
})