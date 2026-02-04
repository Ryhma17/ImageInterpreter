import React, { useMemo } from "react";
import { BarChart } from "react-native-gifted-charts";
import { getCurrentWeekUsage } from "../services/getCurrentWeek";
import type { UsageEvent } from "../types/GraphTypes";

const WeeklyUsageChart = ({ events }: { events: UsageEvent[] }) => {
  const barData = getCurrentWeekUsage(events);

  const chartData = useMemo(() => {
    return barData.map((item) => ({
      ...item,
      frontColor: "#FFCA28",
      gradientColor: "#FF6F00",
    }));
  }, [barData]);

  return (
    <BarChart
      data={chartData}
      barWidth={26}
      spacing={18}
      roundedTop
      showGradient
      hideRules
      yAxisThickness={0}
      xAxisThickness={1}
    />
  );
};

export default WeeklyUsageChart;
