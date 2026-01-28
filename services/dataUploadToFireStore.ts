import { db, addDoc, collection, Timestamp, runTransaction, increment, doc  } from "../firebase/Config"

const UploadData = async (
    userId: string,
    imageUrl: string,
    aiAnswer: string,
    userPrompt: string,
    rating?: number
) => {
    try {
        const historyRef = collection(db, "data", userId, "history")
        const usageColRef = collection(db, "data", userId, "usage")
        const usageDocRef = doc(usageColRef, "allTime")
        
        const location = await parseLocation(aiAnswer)
        const timeNow = Timestamp.now()

        const docRef = await addDoc(historyRef, {
            "image": imageUrl,
            "prompt": userPrompt,
            "answer": location?.cleaned ?? aiAnswer,
            "location": location?.location ?? null,
            "rating": rating ?? null,
            "timestamp": timeNow
        })

        await runTransaction(db, async (tx) => {
           tx.set(usageDocRef,
            {
                total: increment(1),
                updatedAt: timeNow
            },
            { merge: true }
           )
        })
        
        return {timeNow, location}
    } catch (error) {
        console.log(error)
        throw error
    }

}

const parseLocation = async (aiAnswer: string) => {
    const match = aiAnswer.match(/Location:\s*{\s*Latitude:\s*([-\d.]+)\s*,?\s*Longitude:\s*([-\d.]+)\s*}/i)
    if (!match) return
    const location = {latitude: Number(match[1]), longitude: Number(match[2])}
    console.log(location)

    const cleaned = aiAnswer.replace(/Location:\s*{\s*[\s\S]*?\s*}/i,'').trim();
    return {location, cleaned}
}

export { UploadData, parseLocation }