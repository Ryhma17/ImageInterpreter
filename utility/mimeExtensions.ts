export const mimeExtensionMap: Record<string, string> = { // Mappiin laitetaan mime avainten tyypit ja arvoiksi tiedostopäätteet, tätä käytetään myös storageServicessä tiedostotyyppien tarkistukseen
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/heic': 'heic',
    'image/heif': 'heif',
}

// mime kertoo tiedoston tyypin, datan sisällön perusteella 

export const getExtensionFromMime = (mime: string): string => {
    return mimeExtensionMap[mime] // haetaan mapista tiedostopääte mime tyypin perusteella
}

