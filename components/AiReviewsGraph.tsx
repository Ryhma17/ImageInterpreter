import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { auth } from "../firebase/Config";
import { getAiReviews } from "../services/dataUploadToFireStore";
import AiReviewsPieChart from "./AiReviewsPieChart";

type Props = {
    title?: string;
};

const AiReviewsGraph = ({ title = "AI Reviews" }: Props) => {
    const [reviews, setReviews] = useState<{ rating?: number }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const run = async () => {
            const userId = auth.currentUser?.uid;
            if (!userId) {
                setReviews([]);
                return;
            }

            setIsLoading(true);
            setError(null);
            try {
                const fetchedReviews = await getAiReviews(userId);
                setReviews(fetchedReviews);
            } catch (e: any) {
                setError(e?.message ?? "Failed to load reviews data");
                setReviews([]);
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
                <AiReviewsPieChart data={reviews} />
            </View>
        </View>
    );
};

export default AiReviewsGraph;

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
