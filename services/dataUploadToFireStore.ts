import { db, addDoc, collection, Timestamp, runTransaction, increment, doc } from "../firebase/Config"
import { getDocs } from "firebase/firestore"
import type { UsageEvent } from "../types/GraphTypes"

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

        const historyDocRef = await addDoc(historyRef, {
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

    return querySnapshot.docs.flatMap((d) => {
        const data = d.data() as { timestamp?: Timestamp }

        const stamp = data.timestamp
        if (!stamp) return []

        return [{
            id: d.id,
            createdAt: stamp.toMillis()
        }]
    })
}



const insertTestTimestamps = async (userId: string) => {
    const col = collection(db, "data", userId, "timestampsForUsage");

    const dates = [
        "2026-02-06T00:15:12+02:00",
        "2026-02-06T02:43:55+02:00",
        "2026-02-06T05:59:01+02:00",
        "2026-02-06T06:01:33+02:00",
        "2026-02-06T08:22:17+02:00",
        "2026-02-06T11:58:49+02:00",
        "2026-02-06T12:10:05+02:00",
        "2026-02-06T14:37:22+02:00",
        "2026-02-06T17:59:59+02:00",
        "2026-02-06T18:00:01+02:00",
        "2026-02-06T20:44:13+02:00",
        "2026-02-06T23:51:42+02:00",
    ];

    for (const d of dates) {
        await addDoc(col, {
            timestamp: Timestamp.fromDate(new Date(d))
        });
    }
};

const getAiReviews = async (userId: string): Promise<{ rating?: number }[]> => {
    const querySnapshot = await getDocs(collection(db, "data", userId, "history"));

    return querySnapshot.docs.map((d) => {
        const data = d.data();
        return {
            rating: data.rating
        };
    });
};

export { UploadData, parseLocation, getGraphData, insertTestTimestamps, getAiReviews }