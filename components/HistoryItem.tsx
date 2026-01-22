import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HistoryItemProps {
  image: any;
  date: string;
  location: string;
  title: string;
  subtitle: string;
  onPress: () => void;
}

const HistoryItem: React.FC<HistoryItemProps> = ({ image, date, location, title, subtitle, onPress }) => {
  return (
    <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
      <Image source={image} style={styles.image} />

      <View style={styles.infoColumn}>
        <Text style={styles.dateText}>{date}</Text>
        <Text style={styles.promptTitle}>"{title}"</Text>
        {location ? <Text style={styles.locationText}>Location: {location}</Text> : null}
        <Text style={styles.previewText}>{subtitle}</Text>
      </View>

      <Ionicons name="chevron-forward" size={24} color="#666" />

    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2C',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    borderWidth: 0.5,
    borderColor: '#FFCA28',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  infoColumn: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  dateText: {
    color: '#d8d8d8d8',
    fontSize: 12,
    marginBottom: 4,
  },
  locationText: {
    color: '#d8d8d8d8',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  promptTitle: {
    color: '#FFCA28',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  previewText: {
    color: '#d8d8d8d8',
    fontSize: 14,
    lineHeight: 20,
  },
});

export default HistoryItem;