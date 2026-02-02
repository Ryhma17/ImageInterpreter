import AsyncStorage from '@react-native-async-storage/async-storage'

export interface LocalData {
    userId: string
    imageUrl: string
    aiAnswer: string
    userPrompt: string
    rating?: number
    timestamp: number
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

export const deleteAllLocalData = async () => { // kaiken datan poisto
    try {
        await AsyncStorage.removeItem(STORAGE_KEY)
    } catch (error) {
        console.error('Failed to delete all local data', error)
    }
}

export const deleteLocalData = async (timestamp: number) => { // yhden datan poisto
    try {
        const existingData = await AsyncStorage.getItem(STORAGE_KEY)
        if (!existingData) return

        const allData: LocalData[] = JSON.parse(existingData)

        const filteredData = allData.filter(item => item.timestamp !== timestamp)
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredData))

    } catch (error) {
        console.error('Failed to delete local data', error)
    }
}

export const getLastLocalSession = async (): Promise<LocalData | null> => {
    try {
        const storedData = await AsyncStorage.getItem(STORAGE_KEY)
        if (storedData) {
            const data: LocalData[] = JSON.parse(storedData)
            return data.length > 0 ? data[data.length - 1] : null
        }
        return null
    } catch (error) {
        console.error('Failed to get last local session:', error)
        return null
    }
}