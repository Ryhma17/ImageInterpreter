import { db, addDoc, collection, Timestamp, runTransaction, increment, doc  } from "../firebase/Config"


// Functions for uploading info to firestore
// Gets user id, image url, checks for map coordinates, parses Ai answer and saves user prompt.
// Later add, values for how good answer was to track data and show graphs.

const UploadData = async (
    userId: string,
    imageUrl: string,
    aiAnswer: string,
    userPrompt: string,
    lat?: number,
    lng?: number,
    rating?: number
) => {
    try {
        const historyRef = collection(db, "data", userId, "history")
        const usageColRef = collection(db, "data", userId, "usage")
        const usageDocRef = doc(usageColRef, "allTime")

        const docRef = await addDoc(historyRef, {
            imageUrl,
            prompt: userPrompt,
            answer: aiAnswer,
            latitude: lat,
            longitude: lng,
            rating,
            timestamp: Timestamp.now()
        })

        console.log("usageDocRef:", usageDocRef.path)
        await runTransaction(db, async (tx) => {
           tx.set(usageDocRef,
            {
                total: increment(1),
                updatedAt: Timestamp.now()
            },
            { merge: true }
           )
        })
        
        return docRef
    } catch (error) {
        console.log(error)
        throw error
    }

}

export {UploadData}