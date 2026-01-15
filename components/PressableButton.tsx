import { StyleSheet, Text, View, Pressable, Image} from 'react-native'
import React from 'react'
import { IoniconsType } from '../types/IconTypes'
import { Ionicons } from "@expo/vector-icons"


type Props = {
    icon: IoniconsType,
    text: string,
}

const PressableButton = ({icon, text}: Props) => {
  return (
        <Pressable
          onPress={() => ""}
          style={({ pressed }) => [
            styles.container,
            pressed && styles.containerPressed
          ]}
          >
            <Ionicons name={icon} size={32} color="yellow" />
            <Text style={styles.text}>{text}</Text>
        </Pressable>
  )
}

export default PressableButton

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        borderColor: "#363636",
        borderWidth: 1.5,
        borderRadius: 18,
        flexDirection: "row",
        width: "100%",
        padding: 26,
        backgroundColor: "#2e2d2d",
        marginVertical: 8
    },
    containerPressed: {
        backgroundColor: "#3a3a3a",
    },
    text: {
        textAlign: "center",
        paddingLeft: 20,
        color: "white",
        fontSize: 20,
        tintColor: "#d8d8d8"
        //font?
    }
})