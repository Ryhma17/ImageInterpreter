import { StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useRef } from 'react'
import MapView, { Marker } from 'react-native-maps'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { RootStackParamList } from '../types/ParamListTypes'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect } from '@react-navigation/native'


type Props = NativeStackScreenProps<RootStackParamList, 'Map'>
const DEFAULT_DELTA = 0.07

const MapScreen = ({ route }: Props) => {
  const { location } = route.params
  const mapRef = useRef<MapView>(null)

  useFocusEffect(
    useCallback(() => {
      mapRef.current?.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: DEFAULT_DELTA,
          longitudeDelta: DEFAULT_DELTA,
        },
        250
      )
    }, [location.latitude, location.longitude])
  )

  return (

      <MapView
        ref={mapRef}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: DEFAULT_DELTA,
          longitudeDelta: DEFAULT_DELTA,
        }}
        
        style={styles.map}
      >
      <Marker 
        coordinate={{latitude: location.latitude, longitude: location.longitude}} 
        title='Your image'
        pinColor="Red"
      />
      </MapView>

  )
}

export default MapScreen

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#262626"
    },
    map: {
    width: '100%',
    height: '100%',
  },
})