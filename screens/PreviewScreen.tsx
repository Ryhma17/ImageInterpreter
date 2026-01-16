import { StyleSheet, Text, Image, TextInput, View } from 'react-native'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import BasicButton from '../components/BasicButton'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { RootStackParamList } from '../types/ParamList'

type Props = NativeStackScreenProps<RootStackParamList, "Preview">

const PreviewScreen = ({route, navigation}: Props) => {
    const { image } = route.params
    const [prompt, setPrompt] = useState<string | null>(null)

    const onCancel = () => {
        navigation.goBack()
    }

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <Image source={{uri: image}} style={styles.image}/>
      <Text style={styles.title}>Ask a question about this image:</Text>
      <View style={styles.textInputContainer}>
        <TextInput style={styles.text} placeholder='e.g Is this plant healthy?' placeholderTextColor="#6d6c6c" onChangeText={setPrompt} value={prompt?? ""} />
      </View>
      <View style={styles.buttonContainer}>
        <BasicButton text="Cancel" onPress={onCancel} BgColor='#2c2c2c'/>
        <BasicButton text="Analyze" onPress={() => {}} BgColor='#ffae03'/>
      </View>
    </SafeAreaView>
  )
}

export default PreviewScreen

const styles = StyleSheet.create({
    safeAreaContainer: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#262626",
    justifyContent: "center",
    paddingHorizontal: 16
  },
  image: {
    width: "100%",
    height: 320,
    borderRadius: 14,
    marginBottom: 14
  },
  text: {
    color: "#b6b6b6",
  },
  title: {
    paddingTop: 10,
    color: "#838383"
  },
  textInputContainer: {
    padding: 4,
    marginTop: 8,
    borderColor: "#684916",
    borderWidth: 2,
    height: "15%",
    borderRadius: 12,
    backgroundColor: "#2c2c2c"
  },
  buttonContainer: {
    paddingTop: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "space-evenly",
    marginHorizontal: 10
  }
})