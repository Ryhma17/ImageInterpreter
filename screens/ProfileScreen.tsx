import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db, collection } from '../firebase/Config';
import { signOut } from 'firebase/auth';
import { onSnapshot, query } from 'firebase/firestore';
import { loadAllTimeScans } from '../services/dataUploadToFireStore';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/ParamListTypes';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

interface AccordionItem {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  content: string;
}

const LEGAL_ITEMS: AccordionItem[] = [
  {
    title: 'Terms of Service',
    icon: 'document-text-outline',
    content:
      'By using ImageInterpreter, you agree to these terms. The app provides AI-powered image analysis for informational purposes only. We reserve the right to modify or discontinue the service at any time. Users are responsible for the content they upload and must not use the service for any unlawful purpose.',
  },
  {
    title: 'Privacy Policy',
    icon: 'shield-checkmark-outline',
    content:
      'We collect your email address for authentication and store uploaded images and AI-generated analysis results. Your data is stored securely using Firebase services. We do not sell or share your personal information with third parties. You may request deletion of your data at any time by contacting support.',
  },
  {
    title: 'Licenses',
    icon: 'code-slash-outline',
    content:
      'ImageInterpreter is built with React Native, Expo, and Firebase. AI image analysis is powered by Google Gemini. All third-party libraries are used under their respective open-source licenses (MIT, Apache 2.0). Icon assets provided by Ionicons under the MIT License.',
  },
];

const ProfileScreen = ({ navigation }: Props) => {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [expandedIndices, setExpandedIndices] = useState<Set<number>>(new Set());
  const [allTimeScans, setAllTimeScans] = useState<number | null>(null);
  const [savedCount, setSavedCount] = useState<number | null>(null);

  const email = auth.currentUser?.email ?? '';
  const avatarLetter = email.charAt(0).toUpperCase() || '?';
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    if (!userId) return;
    const unsub = loadAllTimeScans(userId, setAllTimeScans);
    return () => unsub();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    const q = query(collection(db, 'data', userId, 'history'));
    const unsub = onSnapshot(q, (snapshot) => {
      setSavedCount(snapshot.size);
    });
    return () => unsub();
  }, [userId]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut(auth);
    } catch (error: any) {
      Alert.alert('Error', error.message);
      setIsSigningOut(false);
    }
  };

  const toggleAccordion = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndices(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarSection}>
          <LinearGradient
            colors={['#FFCA28', '#FF6F00']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatarCircle}
          >
            <Text style={styles.avatarLetter}>{avatarLetter}</Text>
          </LinearGradient>
          <Text style={styles.emailText}>{email}</Text>
        </View>

        <View style={styles.statRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{allTimeScans ?? '–'}</Text>
            <Text style={styles.statLabel}>All Time{"\n"}Scans</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{savedCount ?? '–'}</Text>
            <Text style={styles.statLabel}>Saved{"\n"}Items</Text>
          </View>
          <View style={styles.statBox}>
            <Ionicons name="diamond" size={20} color="#FFCA28" style={{ marginBottom: 2 }} />
            <Text style={[styles.statValue, { fontSize: 16 }]}>Pro</Text>
            <Text style={styles.statLabel}>Plan</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Account</Text>

          <TouchableOpacity
            style={styles.menuRow}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Graph')}
          >
            <View style={styles.menuRowLeft}>
              <Ionicons name="bar-chart-outline" size={22} color="#FFCA28" />
              <Text style={styles.menuRowText}>Your Stats</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Legal & Info</Text>

          {LEGAL_ITEMS.map((item, index) => {
            const isExpanded = expandedIndices.has(index);
            const isLast = index === LEGAL_ITEMS.length - 1;

            return (
              <View key={item.title}>
                <TouchableOpacity
                  style={[styles.menuRow,
                  !isExpanded && styles.separator,
                  isLast && !isExpanded && styles.menuRowLast]}
                  activeOpacity={0.7}
                  onPress={() => toggleAccordion(index)}
                >
                  <View style={styles.menuRowLeft}>
                    <Ionicons name={item.icon} size={22} color="#FFCA28" />
                    <Text style={styles.menuRowText}>{item.title}</Text>
                  </View>
                  <Ionicons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>

                {isExpanded && (
                  <View style={[styles.accordionBody, styles.separator, isLast && styles.accordionBodyLast]}>
                    <Text style={styles.accordionText}>{item.content}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <TouchableOpacity
          onPress={handleSignOut}
          disabled={isSigningOut}
          style={styles.signOutButton}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#FFCA28', '#FF6F00']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.signOutGradient}
          >
            {isSigningOut ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.signOutText}>SIGN OUT</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#262626',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  avatarSection: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 28,
  },
  avatarCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6F00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  avatarLetter: {
    fontSize: 38,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emailText: {
    marginTop: 12,
    fontSize: 15,
    color: '#AAAAAA',
  },

  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#2C2C2C',
    borderColor: "#363636",
    borderWidth: 1.5,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    lineHeight: 16,
  },

  sectionCard: {
    backgroundColor: '#2C2C2C',
    borderColor: "#363636",
    borderWidth: 1.5,
    borderRadius: 18,
    marginBottom: 16,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },

  separator: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#3A3A3A',
  },

  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuRowLast: {
    borderBottomWidth: 0,
  },
  menuRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuRowText: {
    fontSize: 16,
    color: '#FFFFFF',
  },

  accordionBody: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    paddingTop: 2,
  },
  accordionBodyLast: {
    borderBottomWidth: 0,
  },
  accordionText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#999',
  },

  signOutButton: {
    marginTop: 12,
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#FF6F00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  signOutGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
  signOutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },

});