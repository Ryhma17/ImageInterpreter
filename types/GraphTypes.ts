export interface UsageEvent {
  id: string;
  /** Unix epoch milliseconds */
  createdAt: number;
}

export interface BarData {
  label: string;
  value: number;
  date: Date
}

export type PieData = {
  value: number;
  color: string;
  text: string;
}

// Yksittäinen skannaus
export interface ScannedItem {
  timestamp: number
}

// Piste linecharttia varten
export interface LineChartPoint {
  value: number
  label?: string
}

// Kaikki tallennukset
export interface AllTimeData {
  totalCount: number
  chartData: LineChartPoint[]
}
