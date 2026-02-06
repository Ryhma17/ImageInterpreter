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
