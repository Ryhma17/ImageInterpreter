import { StyleSheet, Text, Image, TextInput, View, Alert } from 'react-native'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import BasicButton from '../components/BasicButton'
import { getAiAnswer } from '../firebase/AiConfig'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { RootStackParamList } from '../types/ParamList'
import { UploadData } from '../services/dataUploadToFireStore'
import { auth } from '../firebase/Config'


type Props = NativeStackScreenProps<RootStackParamList, "Preview">

const PreviewScreen = ({ route, navigation }: Props) => {
  const { imageLocal, imageUrl } = route.params
  const [prompt, setPrompt] = useState<string | null>(null)
  const [answer, setAnswer] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const userId = auth.currentUser?.uid

  const onCancel = () => {
    navigation.navigate("Tabs", { screen: "Main" })
  }

  const onAnalyze = async () => {

    const trimmed = (prompt ?? '').trim()
    if (!trimmed) {
      Alert.alert('Missing question', 'Please type a question first.')
      return
    }

    try {

      setIsAnalyzing(true)
      setAnswer(null)
      const text = await getAiAnswer(imageLocal, trimmed)
      setAnswer(text)
      await UploadData(userId!,imageUrl!,text,trimmed,21,2.12,10)
    } catch (e) {
      console.error('getAiAnswer failed:', e)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <SafeAreaView style={styles.safeAreaContainer}>

      {isAnalyzing ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <Image source={{ uri: imageLocal }} style={styles.image} />
          <Text style={styles.title}>Ask a question about this image:</Text>
          <View style={styles.textInputContainer}>
            <TextInput style={styles.text} placeholder='e.g What is in the picture?' placeholderTextColor="#6d6c6c" onChangeText={setPrompt} value={prompt ?? ""} />
          </View>
          {!!answer && <Text style={styles.answer}>{answer}</Text>}
          <View style={styles.buttonContainer}>
            <BasicButton text="Cancel" onPress={onCancel} BgColor='#2c2c2c' />
            <BasicButton text="Analyze" onPress={onAnalyze} BgColor='#ffae03' />
          </View>
        </>
      )}
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
  },
  answer: {
    marginTop: 14,
    color: "#b6b6b6",
    lineHeight: 20
  }
})