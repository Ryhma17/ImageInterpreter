import { StyleSheet, Text, Image, TextInput, View, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native'
import { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import BasicButton from '../components/BasicButton'
import { getAiAnswer } from '../firebase/AiConfig'
import { UploadData, parseLocation } from '../services/dataUploadToFireStore'
import { auth, Timestamp, db, doc } from '../firebase/Config'
import DetailsModal from '../components/DetailsModal'
import { uploadFile } from '../firebase/storageService'
import { getLocalImages, saveImagesLocally } from '../services/localStorageService'
import { saveDataLocally, LocalData, updateLocalDataRating } from '../services/localStorageForData'
import { CommonActions } from '@react-navigation/native'
import { updateDoc } from 'firebase/firestore'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { RootStackParamList } from '../types/ParamListTypes'
import type { location } from '../types/LocationTypes'


type Props = NativeStackScreenProps<RootStackParamList, "Preview">

const PreviewScreen = ({ route, navigation }: Props) => {
  const { imageLocal } = route.params
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [location, setLocation] = useState<location | null>(null)
  const [prompt, setPrompt] = useState<string | null>(null)
  const [answer, setAnswer] = useState<string | null>(null)
  const [uploadedAt, setUploadedAt] = useState<Timestamp | null>(null)
  const [uploadedDocId, setUploadedDocId] = useState<string | null>(null)
  const [localTimestamp, setLocalTimestamp] = useState<number | null>(null)
  const [rating, setRating] = useState<number>(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [navigateAfterClose, setNavigateAfterClose] = useState(false)
  const userId = auth.currentUser?.uid

  useEffect(() => {
    if (!showModal && navigateAfterClose) {
      setNavigateAfterClose(false)
      navigation.navigate("Tabs", { screen: "History" })
    }
  }, [showModal, navigateAfterClose, navigation])

  useEffect(() => {
    const uploadImageToCloudAndLocalStorage = async () => {
      if (!userId || imageUrl) return

      try {
        setUploading(true)

        // firebase cloud storageen tallennus
        const downloadURL = await uploadFile(imageLocal, userId)
        setImageUrl(downloadURL)

        // local storageen tallennus
        await saveImagesLocally({ localUri: imageLocal, cloudUrl: downloadURL, timestamp: Date.now() })

      } catch (error) {
        console.error('Failed to upload image:', error)
        Alert.alert('Upload failed', 'Please try again later.')
      } finally {
        setUploading(false)
      }
    }

    uploadImageToCloudAndLocalStorage()
  }, [imageLocal, userId])


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
      setRating(0) // Reset rating for new analysis

      const text = await getAiAnswer(imageLocal, trimmed)

      const parsedTextandLocation = await parseLocation(text)

      setAnswer(parsedTextandLocation?.cleaned ?? text)
      setLocation(parsedTextandLocation?.location ?? null)
      const uploaded = await UploadData(userId!, imageUrl!, text, trimmed)
      setUploadedAt(uploaded.timeNow)
      if (uploaded.id) {
        setUploadedDocId(uploaded.id)
      }

      const timestamp = Date.now()
      setLocalTimestamp(timestamp)

      const localData: LocalData = { // objektin luonti jotta voi tallentaa local storageen
        userId: userId!,
        imageUrl: imageUrl!,
        aiAnswer: text,
        userPrompt: trimmed,
        timestamp: timestamp
      }
      await saveDataLocally(localData)


      if (uploaded) {
        setNavigateAfterClose(true)
        setShowModal(true)
      }
    } catch (e) {
      console.error('getAiAnswer failed:', e)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleRate = async (newRating: number) => {
    setRating(newRating);

    // Update Firestore if we have a doc ID
    if (userId && uploadedDocId) {
      try {
        await updateDoc(doc(db, "data", userId, "history", uploadedDocId), {
          rating: newRating
        });
      } catch (error) {
        console.error("Failed to update Firestore rating in Preview:", error);
      }
    }

    // Update Local Storage
    if (localTimestamp) {
      await updateLocalDataRating(localTimestamp, newRating)
    }
  }

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <DetailsModal
        visible={showModal}
        item={{
          image: { uri: imageLocal },
          title: prompt!,
          subtitle: answer!,
          date: uploadedAt!,
          location: location,
          rating: rating
        }}
        onRate={handleRate}
        onOpenMap={(loc) => {
          setNavigateAfterClose(false)
          setShowModal(false)
          navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [
                { name: 'Tabs', params: { screen: 'History' } },
                { name: 'Map', params: { location: loc } },
              ],
            })
          )
        }}
        onClose={() => setShowModal(false)} />
      {isAnalyzing ?
        <View style={styles.loading}>
          <ActivityIndicator size='large' color="#FF6F00" />
        </View> : null}
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
          >
        <Image source={{ uri: imageLocal }} style={styles.image} />
        <Text style={styles.title}>Ask a question about this image:</Text>
        <View style={styles.textInputContainer}>
          
          <TextInput
            style={styles.text}
            placeholder='e.g What is in the picture?'
            placeholderTextColor="#6d6c6c"
            onChangeText={setPrompt}
            value={prompt ?? ""}
            editable={!isAnalyzing} />
          
        </View>
        
        <View style={styles.buttonContainer}>
          <BasicButton text="Cancel" onPress={onCancel} BgColor='#2c2c2c' />
          <BasicButton text="Analyze" onPress={onAnalyze} BgColor='#ffae03' />
        </View>
        </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default PreviewScreen

const styles = StyleSheet.create({
  container: {
        flex: 1,
        backgroundColor: "#262626",
        justifyContent: "center",
        paddingHorizontal: 16

  },
  safeAreaContainer: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#262626",
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
  },
  loading: {
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "#14141479"
  }
})