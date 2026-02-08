import React, { useState, useMemo } from "react";
import { View, StyleSheet, Text } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { getAiReviewsPieData } from "../services/getAiReviewsData";

interface AiReviewsPieChartProps {
    data: { rating?: number }[];
}

const AiReviewsPieChart = ({ data }: AiReviewsPieChartProps) => {
    const pieData = useMemo(() => getAiReviewsPieData(data), [data]);
    const total = pieData.reduce((sum, item) => sum + item.value, 0);
    const [containerReady, setContainerReady] = useState(false);

    const pieDataForChart = useMemo(() => {
        return pieData.map((item) => {
            const percent = (item.value / total) * 100;

            return {
                ...item,
                text: item.text,
                value: item.value,
                color: item.color,
                shiftTextX: -1,
            };
        });
    }, [pieData, total]);

    if (pieData.length === 0) return null;

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
                        showText
                        radius={130}
                        innerRadius={30}
                        innerCircleColor="#1F1F1F"
                        textColor="#fff"
                        textSize={26}
                        showValuesAsLabels={false}
                        isAnimated
                        animationDuration={600}
                        centerLabelComponent={() => (
                            <View style={{ alignItems: "center" }}>
                                <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
                                    {total}
                                </Text>
                                <Text style={{ color: "#888", fontSize: 12 }}>reviews</Text>
                            </View>
                        )}
                    />
                )}
            </View>

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
                                {item.text} {item.value} ({percent}%)
                            </Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

export default AiReviewsPieChart;

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
