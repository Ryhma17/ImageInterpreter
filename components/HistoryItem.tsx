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
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={image} style={styles.image} />

      <View style={styles.textContainer}>
        <Text style={styles.dateText}>{date}</Text>
        <Text style={styles.locationText}>{location}</Text>
        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.subtitleText}>{subtitle}</Text>
      </View>

      <Ionicons name="chevron-forward" size={24} color="#666" />
      
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
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
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  dateText: {
    color: '#999',
    fontSize: 12,
    marginBottom: 4,
  },
  locationText: {
    color: '#DDD',
    fontSize: 12,
    marginBottom: 4,
  },
  titleText: {
    color: '#FFCA28',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  subtitleText: {
    color: '#DDD',
    fontSize: 14,
    lineHeight: 20,
  },
});

export default HistoryItem;