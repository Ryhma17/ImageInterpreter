import AsyncStorage from '@react-native-async-storage/async-storage'

interface LocalImages {
    localUri: string
    cloudUrl: string
    timestamp: number
}

export const saveImagesLocally = async (image: LocalImages) => {  // kuvan paikallista tallennusta varten
    try {
        const existingImages = await AsyncStorage.getItem('uploadedImages') // haetaan ensin vanhat kuvat jos niitä on jo olemassa
        const images: LocalImages[] = existingImages ? JSON.parse(existingImages) : [] // jos kuvia ei löydy niin luodaan tyhjä taulukko
        images.push(image) // lisätään uusi kuva luotuun taulukkoon
        await AsyncStorage.setItem('uploadedImages', JSON.stringify(images)) //tallennetaan päivitetty taulukko local storageen
    } catch (error) {
        console.error('Failed to save image locally:', error)
    }
}

export const getLocalImages = async (): Promise<LocalImages[]> => { // Haetaan tarvittaessa paikallisesti tallennetut kuvat
    try {
        const storedImages = await AsyncStorage.getItem('uploadedImages') // haetaan local storageen tallennetut kuvat
        return storedImages ? JSON.parse(storedImages) : [] // palautetaan kuvat, jos ei löydy kuvia niin palautetaan tyhjä taulukko
    } catch (error) {
        console.error('Failed to load local images:', error)
        return []
    }
}


export const deleteLocalImages = async () => { // kuvien poisto
    try {
        await AsyncStorage.removeItem('uploadedImages') // poistetaan kaikki kuvat local storagesta
    } catch (error) {
        console.error('Failed to delete local images:', error)
    }
}

export const deleteLocalImage = async (cloudUrl: string) => { // yhden kuvan poisto
    try {
        const storedImages = await AsyncStorage.getItem('uploadedImages')
        if (storedImages) {
            const images: LocalImages[] = JSON.parse(storedImages)
            const filteredImages = images.filter(img => img.cloudUrl !== cloudUrl)
            await AsyncStorage.setItem('uploadedImages', JSON.stringify(filteredImages))
        }
    } catch (error) {
        console.error('Failed to delete local image:', error)
    }
}