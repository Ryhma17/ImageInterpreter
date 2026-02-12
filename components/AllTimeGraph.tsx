import { View, Text, StyleSheet, ActivityIndicator, Dimensions } from 'react-native'
import { useEffect, useState } from 'react'
import { auth } from '../firebase/Config'
import { loadAllTimeScans } from '../services/dataUploadToFireStore'
import { LineChart } from 'react-native-chart-kit'

const screenWidth = Dimensions.get("window").width

type Props = {
  title?: string
}


const AllTimeGraph = ({ title = "All time scans" }: Props) => {
    const [isLoading, setIsLoading] = useState(true)
    const [total, setTotal] = useState<number>(0)

    useEffect(() => {
      const userId = auth.currentUser?.uid
      if (!userId) {
        setIsLoading(false)
        return
      }

      const unsubscribe = loadAllTimeScans(userId, (value) => {
        setTotal(value)
        setIsLoading(false)
      })
      return unsubscribe
    }, [])

    if (isLoading) return null
    
    const half = total / 2
    
    const chartData = {
      labels: ["", ""],
      datasets: [
        {
          data: [0, half ,total]
        }
      ]
    }


  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>
        {isLoading ? <ActivityIndicator size="small" color="#FFCA28" /> : null}
      </View>
      <View style={styles.chartWrap}>
        <Text style={{ color: '#FFCA28', fontSize: 32, marginBottom: 16 }}>{total}</Text>
                
          <LineChart 
              data={chartData}
                width={screenWidth} 
                height={220}
                withDots={false}
                withVerticalLines={false}
                withInnerLines={true}
                withOuterLines={true}
                withHorizontalLabels={true}
                withVerticalLabels={true}
                yAxisInterval={1}
                chartConfig={{
                  backgroundColor: "#1F1F1F",
                  backgroundGradientFrom: "#1F1F1F",
                  backgroundGradientTo: "#1F1F1F",
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(255, 202, 40, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(170, 170, 170, ${opacity})`,
                  propsForBackgroundLines: {
                      strokeWidth: 1,
                      stroke: "#ffffff"
                    },
                }}
                bezier
                style={{
                  paddingRight: 28,
                  borderRadius: 16
                  
                }}
                  />
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