import { collection, getDocs, limit, orderBy, query } from "firebase/firestore"
import { db } from "../firebase/Config"

const getScanDates = async (userId: string) => {
    const historyRef = collection(db, "data", userId, "history")


    //Ensimmäinen date
    const firstQuery = query(historyRef, orderBy("timestamp", "asc"), limit(1))
    const firstSnap = await getDocs(firstQuery)

    // Viimeinen date
    const lastQuery = query(historyRef, orderBy("timestamp", "desc"), limit(1))
    const lastSnap = await getDocs(lastQuery)

    // 
    const firstDate = !firstSnap.empty ? firstSnap.docs[0].data().timestamp.toDate() : null

    const lastDate = !lastSnap.empty ? lastSnap.docs[0].data().timestamp.toDate() : null

    return { firstDate, lastDate }
}

export default getScanDates

