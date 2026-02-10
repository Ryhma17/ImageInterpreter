import { StyleSheet, Text, View } from 'react-native'
import { LineChart } from 'react-native-gifted-charts'
import { AllTimeData } from '../types/GraphTypes'

interface Props {
    data: AllTimeData
}

const AllTimeUsageChart = ({ data }: Props) => {
    return (
      <View style={styles.container}>
        <Text style={{ color: '#FFCA28', fontSize: 32, marginBottom: 16 }}>{data.totalCount}</Text>
        
        <LineChart 
            data={data.chartData}
            curved
            showArrow1
            dashGap={0}
            initialSpacing={24}
            thickness={2}
            hideDataPoints
            color="#FFCA28"
            yAxisTextStyle={{ color: '#aaa' }}
            xAxisLabelTextStyle={{ 
              color: '#aaa',
              fontSize: 10,
              width: 60,
              textAlign: 'center'
            }}
            
        />
      </View>
    )
  }

  export default AllTimeUsageChart

const styles = StyleSheet.create({
  container: {
    
  }
})