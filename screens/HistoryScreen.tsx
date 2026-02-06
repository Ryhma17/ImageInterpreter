import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, Animated, Dimensions, ActivityIndicator } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import HistoryItem from '../components/HistoryItem'
import DetailsModal from '../components/DetailsModal'
// import { TESTI_HISTORIA } from '../testData/testiHistoriaa'
import { Ionicons } from '@expo/vector-icons'
import { auth, db, collection, Timestamp } from '../firebase/Config'
import { onSnapshot, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { deleteLocalImage } from '../services/localStorageService'
import { Alert } from 'react-native'
import { updateLocalDataRating } from '../services/localStorageForData'

import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { CommonActions } from '@react-navigation/native'
import type { CompositeScreenProps } from '@react-navigation/native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { RootStackParamList, TabParamList } from '../types/ParamListTypes'
import { insertTestTimestamps } from '../services/dataUploadToFireStore'

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'History'>,
  NativeStackScreenProps<RootStackParamList>
>

const SCREEN_WIDTH = Dimensions.get('window').width;

interface HistoryDataItem {
  id: string;
  image: any;
  date: Timestamp;
  location: {
    latitude: number;
    longitude: number;
  } | null;
  title: string;
  subtitle: string;
  rating?: number;
}

const HistoryScreen = ({ navigation }: Props) => {
  const [searchText, setSearchText] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchAnim = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);

  const [historyData, setHistoryData] = useState<HistoryDataItem[]>([]);
  const [filteredData, setFilteredData] = useState<HistoryDataItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      setLoading(false);
      return;
    }

    insertTestTimestamps(userId)

    const q = query(collection(db, "data", userId, "history"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items: HistoryDataItem[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();

        let loc = null;
        if (data.location) {
          loc = {
            latitude: data.location.latitude || 0,
            longitude: data.location.longitude || 0
          };
        }

        items.push({
          id: doc.id,
          image: data.image ? { uri: data.image } : null,
          date: data.timestamp,
          location: loc,
          title: data.prompt || "No Title",
          subtitle: data.answer || "No description available",
          rating: data.rating || 0
        });
      });
      setHistoryData(items);
      setFilteredData(items);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching history:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (searchText) {
      const lowerText = searchText.toLowerCase();

      const dateToSearchText = (timestamp: Timestamp) => {
        if (!timestamp) return '';
        return timestamp.toDate().toLocaleString();
      };

      const filtered = historyData.filter(item =>
        (item.title ?? '').toLowerCase().includes(lowerText) ||
        (item.subtitle ?? '').toLowerCase().includes(lowerText) ||
        dateToSearchText(item.date).toLowerCase().includes(lowerText) ||
        (item.location && `${item.location.latitude.toFixed(4)}, ${item.location.longitude.toFixed(4)}`.includes(lowerText))
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(historyData);
    }
  }, [searchText, historyData]);

  const toggleSearch = () => {
    if (isSearchOpen) {
      // Close search
      setSearchText('');
      Animated.timing(searchAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setIsSearchOpen(false));
      inputRef.current?.blur();
    } else {
      // Open search
      setIsSearchOpen(true);
      Animated.timing(searchAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start(() => inputRef.current?.focus());
    }
  };

  const openModal = (item: any) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  const handleDelete = async () => {
    if (!selectedItem || !auth.currentUser) return;

    try {
      const userId = auth.currentUser.uid;
      await deleteDoc(doc(db, "data", userId, "history", selectedItem.id));

      if (selectedItem.image && selectedItem.image.uri) {

        await deleteLocalImage(selectedItem.image.uri);
      }

      setModalVisible(false);
      setSelectedItem(null);
    } catch (error) {
      console.error("Error deleting item:", error);
      Alert.alert("Error", "Failed to delete item.");
    }
  };

  const handleRate = async (rating: number) => {
    if (!selectedItem || !auth.currentUser) return;

    try {
      const userId = auth.currentUser.uid;
      // Update Firestore
      await updateDoc(doc(db, "data", userId, "history", selectedItem.id), {
        rating: rating
      });

      // Update local state for immediate feedback provided by onSnapshot, but we can also update selectedItem locally
      setSelectedItem((prev: any) => ({ ...prev, rating }));

      // Update local storage if applicable (not strictly linked here but good practice if synced)
      // Since HistoryScreen fetches from Firestore, local storage update is for "Preview" flow mostly, 
      // but if we want to sync them:
      // Local storage uses timestamp as ID sort of.
      // We have selectedItem.date which is a Timestamp. 
      // Convert to millis for localStorage match if needed.
      if (selectedItem.date && typeof selectedItem.date.toMillis === 'function') {
        await updateLocalDataRating(selectedItem.date.toMillis(), rating);
      } else if (selectedItem.date && typeof selectedItem.date === 'number') {
        await updateLocalDataRating(selectedItem.date, rating);
      }

    } catch (error) {
      console.error("Error updating rating:", error);
      Alert.alert("Error", "Failed to update rating.");
    }
  }

  const searchWidth = searchAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SCREEN_WIDTH - 80]
  });

  const titleOpacity = searchAnim.interpolate({
    inputRange: [0, 0.5],
    outputRange: [1, 0]
  });

  return (
    <SafeAreaView style={styles.safeAreaContainer} edges={['top', 'left', 'right']}>
      <View style={styles.headerContainer}>
        <Animated.Text style={[styles.title, { opacity: titleOpacity }]}>
          History
        </Animated.Text>

        <View style={styles.rightContainer}>
          <Animated.View style={[styles.searchContainer, { width: searchWidth }]}>
            {isSearchOpen && (
              <TextInput
                ref={inputRef}
                style={styles.searchInput}
                placeholder="Search history..."
                placeholderTextColor="#999"
                value={searchText}
                onChangeText={setSearchText}
              />
            )}
          </Animated.View>

          <TouchableOpacity onPress={toggleSearch} style={styles.iconButton}>
            <Ionicons
              name={isSearchOpen ? "close" : "search"}
              size={24}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#FFCA28" />
        </View>
      ) : (
        <FlatList
          data={filteredData}
          style={styles.flatList}
          contentContainerStyle={styles.contentContainer}
          renderItem={({ item }) => (
            <HistoryItem
              image={item.image}
              date={item.date}
              location={item.location}
              title={item.title}
              subtitle={item.subtitle}
              onPress={() => openModal(item)}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      )}

      <DetailsModal
        visible={modalVisible}
        onClose={closeModal}
        onOpenMap={(loc) => {
          closeModal()
          navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [
                { name: 'Tabs', params: { screen: 'History' } },
                { name: 'Map', params: { location: loc } },
              ],
            })
          )
        }}
        item={selectedItem}
        onDelete={handleDelete}
        onRate={handleRate}
      />
    </SafeAreaView>
  )
}

export default HistoryScreen

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: "#262626"
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 50,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d8d8d8d8',
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  searchContainer: {
    backgroundColor: '#333',
    borderRadius: 8,
    height: 40,
    justifyContent: 'center',
    overflow: 'hidden',
    marginRight: 8,
  },
  searchInput: {
    color: '#d8d8d8d8',
    paddingHorizontal: 10,
    fontSize: 16,
    flex: 1,
  },
  iconButton: {
    padding: 8,
    zIndex: 2,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 80,
    backgroundColor: "#262626"
  },
  flatList: {
    flex: 1,
  },
})