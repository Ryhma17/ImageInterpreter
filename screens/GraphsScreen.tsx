import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from 'react'


const GraphsScreen = () => {
    return (
        <SafeAreaView style={styles.safeAreaContainer}>
            <View style={styles.contentContainer}>
                <Text style={styles.title}>Statistics</Text>
            </View>
        </SafeAreaView>
    )
}

export default GraphsScreen


const styles = StyleSheet.create({
    safeAreaContainer: {
        flex: 1,
        backgroundColor: '#262626'
    },
    contentContainer: {
        paddingHorizontal: 24,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF'
    }
})