import { storage } from './Config'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

//
export const uploadFile = async (file: File, userId: string): Promise<string> => {
    try {
        // Tsekkaus että, hyväksytään yleisimmät kuvan formaatit
        const validTypes = ['image/jpeg', 'image/png', 'image/webp']
        if (!validTypes.includes(file.type)) throw new Error('Only JPEG, PNG or WEBP images are allowed')

        const maxFileSize = 8 * 1024 * 1024 // 8MB maksimikoko alkuun
        //katsotaan että tiedoston koko ei ylitä maksimikokoa
        if (file.size > maxFileSize) throw new Error('Max file size 8MB')
        
        // luodaan uniikki tiedostopolku Date.now():lla
        const timeStamp = Date.now()
        const fileRef = ref(storage, `files/${userId}/${timeStamp}_${file.name}`)


        const snapshot = await uploadBytes(fileRef, file)
        const downloadURL = await getDownloadURL(snapshot.ref)
        return downloadURL
    } catch (error) {
        console.error('Failed to upload file:', error)
        throw error
    }
}