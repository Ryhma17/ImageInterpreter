import React from 'react';
import { View, Text, StyleSheet, Image, Modal, TouchableOpacity, ScrollView, Dimensions, StatusBar, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Timestamp } from '../firebase/Config';


const { width } = Dimensions.get('window');

interface DetailsModalProps {
    visible: boolean;
    onClose: () => void;
    onDelete?: () => void;
    onOpenMap?: (location: { latitude: number; longitude: number }) => void;
    item: {
        image: any;
        date: Timestamp;
        location?: { latitude: number; longitude: number } | null;
        title: string;
        subtitle: string;
    } | null;
}

const DetailsModal: React.FC<DetailsModalProps> = ({ visible, onClose, onDelete, onOpenMap, item }) => {
    if (!item) return null;
    const formattedDate = item.date ? item.date.toDate().toLocaleString() : '';

    const handleOpenMap = () => {
        if (!item.location) return;
        onClose();
        onOpenMap?.(item.location);
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
            statusBarTranslucent={true}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    {/* Header Buttons */}
                    <View style={styles.headerBar}>
                        <TouchableOpacity style={styles.iconButtonLeft} onPress={onDelete}>
                            <Ionicons name="trash-outline" size={24} color="#FF5252" />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.iconButtonRight} onPress={onClose}>
                            <Ionicons name="close" size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        <Image source={item.image} style={styles.image} resizeMode="cover" />

                        <View style={styles.detailsContent}>
                            <View style={styles.rowContainer}>
                                <View style={styles.columnContainer}>
                                    <View style={styles.dateContainer}>
                                        <Text style={styles.dateText}>{formattedDate}</Text>
                                    </View>
                                    <Text style={styles.promptTitle}>"{item.title}"</Text>
                                </View>
                                {item.location ?
                                <TouchableOpacity style={styles.locationButton} onPress={handleOpenMap}>
                                    <Ionicons name="compass" size={50} color="#FFCA28" />
                                </TouchableOpacity> : null }  
                            </View>
                            <View style={styles.separatorLine} />

                            <Text style={styles.interpretationLabel}>AI INTERPRETATION:</Text>

                            <Text style={styles.interpretationText}>{item.subtitle}</Text>

                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    modalView: {
        width: '100%',
        height: '92%',
        backgroundColor: '#1C1C1E',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
        paddingTop: 16,
    },
    headerBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 16,
        zIndex: 10,
    },
    iconButtonLeft: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#2C2C2E',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconButtonRight: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#2C2C2E',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    image: {
        width: '100%',
        height: 300,
        borderRadius: 0,
        marginBottom: 20,
    },
    detailsContent: {
        paddingHorizontal: 20,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    dateText: {
        color: '#999',
        fontSize: 14,
    },
    promptTitle: {
        color: '#d8d8d8d8',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        lineHeight: 32,
    },
    separatorLine: {
        height: 1,
        backgroundColor: '#333',
        marginBottom: 24,
    },
    interpretationLabel: {
        color: '#FFCA28',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
        letterSpacing: 1,
    },
    interpretationText: {
        color: '#d8d8d8d8',
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 16,
    },
    rowContainer: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    columnContainer: {
        flexDirection: "column",
        flex: 1
    },
    locationButton: {
        alignSelf: "center"
    }
});

export default DetailsModal;
