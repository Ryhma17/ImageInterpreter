import { db, addDoc, collection, Timestamp, runTransaction, increment, doc, getDocs  } from "../firebase/Config"
<<<<<<< HEAD
import { UsageEvent } from "../types/GraphTypes"
=======
>>>>>>> 440c65bf1dee4ca37e1e42f0b7f3c3221afc3415

const UploadData = async (
    userId: string,
    imageUrl: string,
    aiAnswer: string,
    userPrompt: string,
    rating?: number
) => {
    try {
        const historyRef = collection(db, "data", userId, "history")
        const usageColRef = collection(db, "data", userId, "usageAmount")
        const usageAllTimeDocRef = doc(usageColRef, "allTime")
        const usageTimesColRef = collection(db, "data", userId, "timestampsForUsage")
        

        const location = await parseLocation(aiAnswer)
        const timeNow = Timestamp.now()

<<<<<<< HEAD
        const historyDocRef = await addDoc(historyRef, {
=======
            await addDoc(historyRef, {
>>>>>>> 440c65bf1dee4ca37e1e42f0b7f3c3221afc3415
            "image": imageUrl,
            "prompt": userPrompt,
            "answer": location?.cleaned ?? aiAnswer,
            "location": location?.location ?? null,
            "rating": rating ?? null,
            "timestamp": timeNow
        })

        await addDoc(usageTimesColRef, {
            "timestamp": timeNow
        })

        await runTransaction(db, async (tx) => {
           tx.set(usageAllTimeDocRef,
            {
                total: increment(1),
                updatedAt: timeNow
            },
            { merge: true }
           )
        })

        return { timeNow, location, id: historyDocRef.id }
    } catch (error) {
        console.log(error)
        throw error
    }

}

const parseLocation = async (aiAnswer: string) => {
    const match = aiAnswer.match(/Location:\s*{\s*Latitude:\s*([-\d.]+)\s*,?\s*Longitude:\s*([-\d.]+)\s*}/i)
    if (!match) return
    const location = {latitude: Number(match[1]), longitude: Number(match[2])}

    const cleaned = aiAnswer.replace(/Location:\s*{\s*[\s\S]*?\s*}/i, '').trim();
    return { location, cleaned }
}

const getGraphData = async (userId: string): Promise<UsageEvent[]> => {
    const querySnapshot = await getDocs(collection(db, "data", userId, "timestampsForUsage"))

    return querySnapshot.docs.flatMap((doc) => {
        const data = doc.data() as { timestamp?: Timestamp }

        const stamp = data.timestamp
        if (!stamp) return []

        return [{
            id: d.id,
            createdAt: stamp.toMillis()
        }]
    })
}

export { UploadData, parseLocation, getGraphData }