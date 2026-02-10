import { ScannedItem, AllTimeData } from '../types/GraphTypes'


const AllTimeGraphData = (scans: ScannedItem[]): AllTimeData => {

    const sorted = [...scans].sort((a, b) => a.timestamp - b.timestamp)

    let count = 0

    const chartData = sorted.map((scan, index) => {
        count += 1

        return {
            value: count,
            label: index % 5 === 0 ? new Date(scan.timestamp).toLocaleDateString() : undefined
        }
    })

    return {
        totalCount: scans.length,
        chartData
    }
}

export default AllTimeGraphData