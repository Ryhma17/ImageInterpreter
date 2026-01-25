import { storage } from './Config'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { getExtensionFromMime, mimeExtensionMap } from '../utility/mimeExtensions'

//
export const uploadFile = async (fileOrUri: File | Blob | string, userId: string): Promise<string> => {
    try {
        let file: Blob // Blob hoitaa tallennuksen koska se kattaa kaikenlaisen datan tallennuksen
        let fileName: string

        if (typeof fileOrUri === 'string') { // kuvan polku tulee stringinä
            const response = await fetch(fileOrUri) // tallennetaan responseen kuvan data
            const blob = await response.blob() // muunnetaan data blobiksi

            const extension = getExtensionFromMime(blob.type) // haetaan tiedostopääte mime-tyypin perusteella
            file = blob
            fileName = `image_${Date.now()}.${extension}` // nyt tiedosto saa tiedostoformaatin mukaisen päätteen nimeen selkeyden vuoksi
        } else {
            file = fileOrUri
            const mime = (fileOrUri as File).type
            const extension = getExtensionFromMime(mime) // ajaa samanasian mutta 
            fileName = (fileOrUri as File).name || `image_${Date.now()}.${extension}`
        }


        // Tsekkaus että, hyväksytään yleisimmät kuvan formaatit, katso tai lisää tyyppejä utility/mimeExtensions.ts 
        if (!mimeExtensionMap[file.type]) { 
            throw new Error('Unsupported image format')
        }

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