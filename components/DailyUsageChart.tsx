import React, { useState, useMemo } from "react";
import { View, StyleSheet, Text } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import type { UsageEvent } from "../types/GraphTypes";
import { getTodayHourlyPieData } from "../services/getCurrentDayData";

const DailyUsageChart = ({ events }: { events: UsageEvent[] }) => {
  const pieData = useMemo(() => getTodayHourlyPieData(events), [events]);
  const [containerReady, setContainerReady] = useState(false);

  if (pieData.length === 0) return null;

  const total = pieData.reduce((sum, item) => sum + item.value, 0);

  // Abbreviate labels for slice text to prevent clipping
  const pieDataForChart = pieData.map(item => {
    const percent = (item.value / total) * 100;

    return {
      ...item,
      text: `${percent.toFixed(1)}%`, // inside slice
      value: item.value,
      color: item.color,
    };
  });

  return (
    <View style={styles.container}>
      <View
        style={styles.chartWrap}
        onLayout={() => !containerReady && setContainerReady(true)}
      >
        {containerReady && (
          <PieChart
            data={pieDataForChart}
            donut
            radius={130}
            innerRadius={30}
            innerCircleColor="#1F1F1F"
            textColor="#fff"
            textSize={10}
            showValuesAsLabels={false}
            isAnimated
            animationDuration={400}
            centerLabelComponent={() => (
              <View style={{ alignItems: "center" }}>
                <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
                  {total}
                </Text>
                <Text style={{ color: "#888", fontSize: 12 }}>today</Text>
              </View>
            )}
          />
        )}
      </View>

      {/* External legend */}
      <View style={styles.legend}>
        {pieData.map((item, index) => {
          const percent = ((item.value / total) * 100).toFixed(1);
          return (
            <View key={index} style={styles.legendItem}>
              <View
                style={{
                  width: 12,
                  height: 12,
                  backgroundColor: item.color,
                  marginRight: 6,
                  borderRadius: 2,
                }}
              />
              <Text style={{ color: "#fff", fontSize: 12 }}>
                {item.text} {percent}%
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default DailyUsageChart;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  chartWrap: {
    width: 280,
    height: 280,
    alignItems: "center",
    justifyContent: "center",
  },
  legend: {
    marginTop: 10,
    width: 280,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
});
