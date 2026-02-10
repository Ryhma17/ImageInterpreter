import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { useEffect, useState } from 'react'
import { AllTimeData, ScannedItem, UsageEvent } from '../types/GraphTypes'
import { getLocalData } from '../services/localStorageForData'
import AllTimeGraphData from '../services/getAllTimeData'
import AllTimeUsageChart  from './AllTimeUsageChart'
import { auth } from '../firebase/Config'


type Props = {
  title?: string
}


const AllTimeGraph = ({ title = "All time scans" }: Props) => {
    const [graphData, setGraphData] = useState<AllTimeData | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
      const load = async () => {
        const userId = auth.currentUser?.uid
        if (!userId) {
          setGraphData(null)
          return
        }
        setIsLoading(true)
        setError(null)
        try {
          //const fetchedEvents = await getGraphData(userId)
          const localData = await getLocalData()
          const scans: ScannedItem[] = localData.map(item => ({ timestamp: item.timestamp }))
          const built = AllTimeGraphData(scans)
          setGraphData(built)
        } catch (e: any) {
          setError(e?.message ?? "Failed to load alltime scans")
          setGraphData(null)
        } finally {
          setIsLoading(false)
        }
      }
      load()
    }, [])

    if (!graphData) return null
    

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>
        {isLoading ? <ActivityIndicator size="small" color="#FFCA28" /> : null}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <View style={styles.chartWrap}>
        <AllTimeUsageChart data={graphData} />
      </View>
    </View>
  )
}

export default AllTimeGraph

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#1F1F1F",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  errorText: {
    marginTop: 8,
    color: "#FFCA28",
    fontSize: 12,
  },
  chartWrap: {
    marginTop: 16,
    overflow: 'hidden',
    width: '100%',
  },
});