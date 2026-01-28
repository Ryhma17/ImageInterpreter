import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, Animated, Dimensions } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import HistoryItem from '../components/HistoryItem'
import DetailsModal from '../components/DetailsModal'
import { TESTI_HISTORIA } from '../testData/testiHistoriaa'
import { Ionicons } from '@expo/vector-icons'

import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { CommonActions } from '@react-navigation/native'
import type { CompositeScreenProps } from '@react-navigation/native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { RootStackParamList, TabParamList } from '../types/ParamListTypes'

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'History'>,
  NativeStackScreenProps<RootStackParamList>
>

const SCREEN_WIDTH = Dimensions.get('window').width;

const HistoryScreen = ({ navigation }: Props) => {
  const [searchText, setSearchText] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchAnim = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);

  const [filteredData, setFilteredData] = useState(TESTI_HISTORIA);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (searchText) {
      const lowerText = searchText.toLowerCase();

      const dateToSearchText = (dateValue: any) => {
        if (!dateValue) return '';
        if (typeof dateValue === 'string') return dateValue;
        if (dateValue instanceof Date) return dateValue.toLocaleString();
        if (typeof dateValue?.toDate === 'function') {
          try {
            return dateValue.toDate().toLocaleString();
          } catch {
            return '';
          }
        }
        return String(dateValue);
      };

      const filtered = TESTI_HISTORIA.filter(item =>
        (item.title ?? '').toLowerCase().includes(lowerText) ||
        (item.subtitle ?? '').toLowerCase().includes(lowerText) ||
        dateToSearchText(item.date).toLowerCase().includes(lowerText)
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(TESTI_HISTORIA);
    }
  }, [searchText]);

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