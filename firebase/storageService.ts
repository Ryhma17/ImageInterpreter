import { storage } from './Config'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

//
export const uploadFile = async (fileOrUri: File | Blob | string, userId: string): Promise<string> => {
    try {
        let file: File | Blob
        let fileName: string

        // Muutetaan URI -> Blob:ksi tarvittaessa
        if (typeof fileOrUri === 'string') {
            const response = await fetch(fileOrUri)
            const blob = await response.blob()
            file = blob
            fileName = `image_${Date.now()}.jpg` // Annetaan tiedostolle nimi
        } else {
            file = fileOrUri
            fileName = (fileOrUri as File).name || `image_${Date.now()}.jpg`
        }


        // Tsekkaus että, hyväksytään yleisimmät kuvan formaatit
        const validTypes = ['image/jpeg', 'image/png', 'image/webp']
        if (!validTypes.includes(file.type)) throw new Error('Only JPEG, PNG or WEBP images are allowed')

        const maxFileSize = 8 * 1024 * 1024 // 8MB maksimikoko alkuun
        //katsotaan että tiedoston koko ei ylitä maksimikokoa
        if (file.size > maxFileSize) throw new Error('Max file size 8MB')
        
        // luodaan uniikki tiedostopolku Date.now():lla
        const timeStamp = Date.now()
        const fileRef = ref(storage, `files/${userId}/${timeStamp}_${fileName}`)


        const snapshot = await uploadBytes(fileRef, file)
        const downloadURL = await getDownloadURL(snapshot.ref)
        return downloadURL
    } catch (error) {
        console.error('Failed to upload file:', error)
        throw error
    }
}