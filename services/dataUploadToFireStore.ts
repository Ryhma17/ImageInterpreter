import { db, addDoc, collection, Timestamp, runTransaction, increment, doc  } from "../firebase/Config"

const UploadData = async (
    userId: string,
    imageUrl: string,
    aiAnswer: string,
    userPrompt: string,
    location?: {
        lattitude: number,
        longitude: number
    },
    rating?: number
) => {
    try {
        const historyRef = collection(db, "data", userId, "history")
        const usageColRef = collection(db, "data", userId, "usage")
        const usageDocRef = doc(usageColRef, "allTime")
        
        // parse location func here

        const docRef = await addDoc(historyRef, {
            "image": imageUrl,
            "prompt": userPrompt,
            "answer": aiAnswer,
            "location": location ?? null,
            "rating": rating ?? null,
            "timestamp": Timestamp.now()
        })

        await runTransaction(db, async (tx) => {
           tx.set(usageDocRef,
            {
                total: increment(1),
                updatedAt: Timestamp.now()
            },
            { merge: true }
           )
        })
        
        return Timestamp.now()
    } catch (error) {
        console.log(error)
        throw error
    }

}

export { UploadData }