import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../firebase/Config';
import { signOut } from 'firebase/auth';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList } from '../types/ParamListTypes';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getGraphData } from '../services/dataUploadToFireStore';

type Props = NativeStackScreenProps<RootStackParamList, "Profile">

const ProfileScreen = (props: Props) => {
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut(auth);
    } catch (error: any) {
      Alert.alert('Error', error.message);
      setIsSigningOut(false);
    }
  };

  useEffect(() => {
    const dataFetch = async() =>{
      const data = await getGraphData(auth.currentUser?.uid!)
      console.log(data)
    }
    

    dataFetch()
  },[])
 
  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.graphButtonContainer}>
          <TouchableOpacity 
            onPress={() => {props.navigation.navigate('Graph')}}
            style={styles.buttonContainer}
          >
            <LinearGradient
              colors={['#FFCA28', '#FF6F00']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >

              <Text style={styles.graphButtonText}>Your stats</Text>

            </LinearGradient>
          </TouchableOpacity>
        </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>{auth.currentUser?.email}</Text>

        <TouchableOpacity
          onPress={handleSignOut}
          disabled={isSigningOut}
          style={styles.buttonContainer}
        >
          <LinearGradient
            colors={['#FFCA28', '#FF6F00']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            {isSigningOut ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>SIGN OUT</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: "#262626"
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#AAAAAA',
    marginBottom: 32,
  },
  buttonContainer: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#FF6F00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  button: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  graphButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1
  },
  graphButton: {
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 25,
  },
  graphButtonContainer: {
    paddingHorizontal: 24,
    marginTop: 22
  }
});