import AsyncStorage from '@react-native-async-storage/async-storage'

interface LocalData {
    userId: string
    imageUrl: string
    aiAnswer: string
    userPrompt: string
    rating?: number
}

const STORAGE_KEY = 'uploadedData'

export const saveDataLocally = async (data: LocalData) => {
    try {
        const existingData = await AsyncStorage.getItem(STORAGE_KEY)
        const allData: LocalData[] = existingData ? JSON.parse(existingData) : []
        allData.push(data)
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(allData))
    } catch (error) {
        console.error('Failed to save data locally', error)
    }
}

export const getLocalData = async (): Promise<LocalData[]> => {
    try {
        const storedData = await AsyncStorage.getItem(STORAGE_KEY)
        return storedData ? JSON.parse(storedData) : []
    } catch (error) {
        console.error('Failed to load local data', error)
        return []
    }
}

export const deleteLocalData = async () => {
    try {
        await AsyncStorage.removeItem(STORAGE_KEY)
    } catch (error) {
        console.error('Failed to delete local data', error)
    }
}