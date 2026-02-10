import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from 'react'
import { RootStackParamList } from "../types/ParamListTypes";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import WeeklyGraph from "../components/WeeklyGraph";
import DailyGraph from "../components/DailyGraph";
import AiReviewsGraph from "../components/AiReviewsGraph";
import AllTimeGraph from "../components/AllTimeGraph";

type Props = NativeStackScreenProps<RootStackParamList, "Graph">

const GraphsScreen = ({ navigation }: Props) => {

    return (
        <SafeAreaView style={styles.safeAreaContainer}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.headerButton}
                >
                    <Ionicons name="arrow-back-outline" size={26} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.title}>Statistics</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <WeeklyGraph />
                <DailyGraph />
                <AiReviewsGraph />
                <AllTimeGraph />
            </ScrollView>
        </SafeAreaView>
    )
}

export default GraphsScreen


const styles = StyleSheet.create({
    safeAreaContainer: {
        flex: 1,
        backgroundColor: '#262626'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerButton: {
        zIndex: 1,
        position: 'absolute',
        left: 16,
        marginTop: 4
    },
    title: {
        flex: 1,
        fontSize: 26,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    scrollContent: {
        paddingBottom: 20,
    }
})