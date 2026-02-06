import React, { useMemo } from "react";
import { BarChart } from "react-native-gifted-charts";
import { getCurrentWeekUsage } from "../services/getCurrentWeekData";
import type { UsageEvent } from "../types/GraphTypes";
import { isSameDay } from "date-fns";


const WeeklyUsageChart = ({ events }: { events: UsageEvent[] }) => {
  const barData = useMemo(() => getCurrentWeekUsage(events), [events])
  const today = new Date()

  const chartData = useMemo(() => {

    return barData.map((item) => {
      
      const isToday = isSameDay(item.date, today)
      
      return {
        ...item,
        frontColor: isToday ? "#00E676" : "#FFCA28",
        gradientColor: isToday ? "#00C853" : "#FF6F00",
      }
    });
  }, [barData]);

  return (
    <BarChart
      key={JSON.stringify(chartData)}
      data={chartData}
      barWidth={26}
      spacing={18}
      roundedTop
      showGradient
      hideRules
      showValuesAsTopLabel
      isAnimated
      yAxisThickness={0}
      xAxisThickness={1}
      topLabelTextStyle={{
        color: "#FFF"
      }}
      yAxisTextStyle={{
        color: "#FFF"
      }}
      xAxisLabelTextStyle={{
        color: "#FFF"
      }}

    />
  );
};

export default WeeklyUsageChart;
