import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { auth } from "../firebase/Config";
import { getGraphData } from "../services/dataUploadToFireStore";
import type { UsageEvent } from "../types/GraphTypes";
import DailyUsageChart from "./DailyUsageChart";

type Props = {
  title?: string;
};

const DailyGraph = ({ title = "Todays usage" }: Props) => {
  const [events, setEvents] = useState<UsageEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        setEvents([]);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const fetchedEvents = await getGraphData(userId);
        setEvents(fetchedEvents);
      } catch (e: any) {
        setError(e?.message ?? "Failed to load usage data");
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    run();
  }, []);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>
        {isLoading ? <ActivityIndicator size="small" color="#FFCA28" /> : null}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.chartWrap}>
        <DailyUsageChart events={events}/>
      </View>
    </View>
  );
};

export default DailyGraph;

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
    alignItems: "center",
    justifyContent: "center",
  },
});
