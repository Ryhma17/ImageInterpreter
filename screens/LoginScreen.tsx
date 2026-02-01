import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/Config';
import { logAllAsyncStorageItems } from '../services/localStorageService';
import { getLastLocalSession, LocalData } from '../services/localStorageForData';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [lastSession, setLastSession] = useState<LocalData | null>(null);

    React.useEffect(() => {
        logAllAsyncStorageItems();
        getLastLocalSession().then(setLastSession);
    }, []);

    const handleAuth = async () => {

        if (!email || !password) {
            Alert.alert('Error', 'Please enter email and password');
            return;
        }

        if (isSignUp && password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        setIsLoggingIn(true);
        try {
            if (isSignUp) {
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
        } catch (error: any) {
            let errorMessage = "Authentication failed. Please try again.";
            switch (error.code) {
                case 'auth/invalid-credential':
                    errorMessage = "Invalid email or password.";
                    break;
                case 'auth/user-not-found':
                    errorMessage = "User not found.";
                    break;
                case 'auth/wrong-password':
                    errorMessage = "Wrong password.";
                    break;
                case 'auth/invalid-email':
                    errorMessage = "Please enter a valid email address.";
                    break;
                case 'auth/email-already-in-use':
                    errorMessage = "Email is already in use. Please sign in instead.";
                    break;
                case 'auth/weak-password':
                    errorMessage = "Password should be at least 6 characters.";
                    break;
                case 'auth/too-many-requests':
                    errorMessage = "Too many attempts. Please try again later.";
                    break;
                case 'auth/network-request-failed':
                    errorMessage = "Network error. Please check your internet connection.";
                    break;
                default:
                    errorMessage = error.message;
            }
            Alert.alert(isSignUp ? 'Sign Up Failed' : 'Login Failed', errorMessage);
        } finally {
            setIsLoggingIn(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <SafeAreaView style={styles.safeArea}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.contentContainer}
                >
                    <View style={styles.headerContainer}>
                        <Text style={styles.title}>{isSignUp ? "Create Account" : "Sign In"}</Text>
                    </View>

                    <View style={styles.formContainer}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your email"
                                placeholderTextColor="#888"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={styles.passwordInput}
                                    placeholder="Enter your password"
                                    placeholderTextColor="#888"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    style={styles.eyeIcon}
                                >
                                    <Ionicons
                                        name={showPassword ? "eye-off" : "eye"}
                                        size={24}
                                        color="#888"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {isSignUp && (
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Confirm Password</Text>
                                <View style={styles.passwordContainer}>
                                    <TextInput
                                        style={styles.passwordInput}
                                        placeholder="Confirm your password"
                                        placeholderTextColor="#888"
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        secureTextEntry={!showConfirmPassword}
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                        style={styles.eyeIcon}
                                    >
                                        <Ionicons
                                            name={showConfirmPassword ? "eye-off" : "eye"}
                                            size={24}
                                            color="#888"
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}

                        <TouchableOpacity
                            onPress={handleAuth}
                            disabled={isLoggingIn}
                            style={styles.buttonContainer}
                        >
                            <LinearGradient
                                colors={['#FFCA28', '#FF6F00']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.button}
                            >
                                {isLoggingIn ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.buttonText}>{isSignUp ? "SIGN UP" : "SIGN IN"}</Text>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.footerLink}
                            onPress={() => {
                                setIsSignUp(!isSignUp);
                                setConfirmPassword(''); // Reset confirm password on toggle
                            }}
                        >
                            <Text style={styles.footerText}>
                                {isSignUp ? "Already have an account?" : "Don't have an account?"} <Text style={styles.signUpText}>{isSignUp ? "Sign In" : "Sign Up"}</Text>
                            </Text>
                        </TouchableOpacity>

                        {lastSession && (
                            <View style={styles.lastSessionContainer}>
                                <Text style={styles.lastSessionTitle}>Last Session:</Text>
                                <Text style={styles.lastSessionPrompt}>"{lastSession.userPrompt}"</Text>
                                <Text style={styles.lastSessionAnswer} numberOfLines={2} ellipsizeMode='tail'>
                                    {lastSession.aiAnswer}
                                </Text>
                            </View>
                        )}
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#262626",
    },
    safeArea: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    headerContainer: {
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'left',
    },
    formContainer: {
        width: '100%',
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#2C2C2C',
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#FFFFFF',
        borderWidth: 0,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2C2C2C',
        borderRadius: 8,
        borderWidth: 0,
    },
    passwordInput: {
        flex: 1,
        paddingVertical: 14,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#FFFFFF',
    },
    eyeIcon: {
        padding: 10,
    },
    buttonContainer: {
        marginTop: 16,
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
    footerLink: {
        marginTop: 24,
        alignItems: 'center',
    },
    footerText: {
        color: '#AAAAAA',
        fontSize: 14,
    },
    signUpText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    lastSessionContainer: {
        marginTop: 40,
        backgroundColor: '#333',
        padding: 16,
        borderRadius: 12,
        width: '100%',
    },
    lastSessionTitle: {
        color: '#FFCA28',
        fontWeight: 'bold',
        marginBottom: 4,
    },
    lastSessionPrompt: {
        color: '#AAAAAA',
        fontStyle: 'italic',
        marginBottom: 8,
    },
    lastSessionAnswer: {
        color: '#FFFFFF',
    }
});

export default LoginScreen;