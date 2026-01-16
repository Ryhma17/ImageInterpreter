import { StyleSheet, Text, View, Pressable, Image} from 'react-native'
import React from 'react'

type Props = {
    text: string,
    BgColor: string,
    onPress: () => void
}

const BasicButton = ({text, BgColor, onPress}: Props) => {
  return (
        <Pressable
          onPress={onPress}
          style={({ pressed }) => [
            [styles.container, {backgroundColor: BgColor}],
            pressed && styles.containerPressed
          ]}
          >
            <Text style={styles.text}>{text}</Text>
        </Pressable>
  )
}

export default BasicButton

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        borderColor: "#363636",
        borderWidth: 1.5,
        borderRadius: 18,
        padding: 16,
        paddingHorizontal: 26,
        width: "52%", 
        marginHorizontal: 5
    },
    containerPressed: {
        backgroundColor: "#3a3a3a",
    },
    text: {
        textAlign: "center",
        color: "white",
        fontSize: 16,
        tintColor: "#d8d8d8",
        fontWeight: "bold"
    }
})