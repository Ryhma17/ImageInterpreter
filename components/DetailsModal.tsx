import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Modal, TouchableOpacity, ScrollView, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Timestamp } from '../firebase/Config';

interface DetailsModalProps {
    visible: boolean;
    onClose: () => void;
    onDelete?: () => void;
    onOpenMap?: (location: { latitude: number; longitude: number }) => void;
    onRate?: (rating: number) => void;
    item: {
        image: any;
        date: Timestamp;
        location?: { latitude: number; longitude: number } | null;
        title: string;
        subtitle: string;
        rating?: number | null;
    } | null;
}

const DetailsModal: React.FC<DetailsModalProps> = ({ visible, onClose, onDelete, onOpenMap, onRate, item }) => {
    const [showRating, setShowRating] = useState(false);
    const slideAnim = useRef(new Animated.Value(-50)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (showRating) {
            slideAnim.setValue(-50);
            fadeAnim.setValue(0);

            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [showRating]);

    if (!item) return null;
    const formattedDate = item.date ? item.date.toDate().toLocaleString() : '';

    const handleOpenMap = () => {
        if (!item.location) return;
        onClose();
        onOpenMap?.(item.location);
    };

    const handleRatingFinish = (rating: number) => {
        if (onRate) {
            onRate(rating);
        }
    }

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
                    <View style={styles.headerBar}>
                        <TouchableOpacity style={styles.iconButtonLeft} onPress={onDelete}>
                            <Ionicons name="trash-outline" size={24} color="#FF5252" />
                        </TouchableOpacity>

                        {onRate && (
                            <View style={styles.ratingWrapper}>
                                <TouchableOpacity
                                    style={[styles.iconButtonLeft, { marginLeft: 16 }]}
                                    onPress={() => setShowRating(!showRating)}
                                >
                                    <Ionicons name="star-outline" size={24} color={item.rating ? "#FFCA28" : "#FFFFFF"} />
                                </TouchableOpacity>

                                {showRating && (
                                    <Animated.View style={[
                                        styles.headerRatingContainer,
                                        {
                                            opacity: fadeAnim,
                                            transform: [{ translateX: slideAnim }]
                                        }
                                    ]}>
                                        {['😡', '🙁', '😐', '🙂', '🤩'].map((emoji, index) => (
                                            <TouchableOpacity
                                                key={index}
                                                onPress={() => {
                                                    handleRatingFinish(index + 1);
                                                }}
                                                style={styles.emojiButton}
                                            >
                                                <Text style={[
                                                    styles.emojiText,
                                                    item.rating === index + 1 && styles.selectedEmoji
                                                ]}>
                                                    {emoji}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </Animated.View>
                                )}
                            </View>
                        )}

                        <TouchableOpacity style={styles.iconButtonRight}
                            onPress={() => {
                                onClose();
                                setShowRating(false);
                            }}>
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
                                    </TouchableOpacity> : null}
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
        alignItems: 'center',
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
        marginLeft: 'auto',
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
    ratingContainer: {
        marginBottom: 24,
        alignItems: 'center',
        backgroundColor: '#2C2C2E',
        padding: 16,
        borderRadius: 12,
    },
    ratingLabel: {
        color: '#FFCA28',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
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
    },
    ratingWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerRatingContainer: {
        flexDirection: 'row',
        marginLeft: 16,
        paddingHorizontal: 12,
        paddingVertical: 4,
        backgroundColor: '#2C2C2E',
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    emojiButton: {
        padding: 2,
    },
    emojiText: {
        fontSize: 22,
        opacity: 1,
    },
    selectedEmoji: {
        transform: [{ scale: 1.4 }]
    },
});

export default DetailsModal;
