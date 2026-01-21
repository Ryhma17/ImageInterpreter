import { initializeApp } from 'firebase/app';
// @ts-ignore
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBQofRpse5BKYuewZrQKUYPKKBfggLsSjw",
    authDomain: "imageinterpreter-a3520.firebaseapp.com",
    projectId: "imageinterpreter-a3520",
    storageBucket: "imageinterpreter-a3520.firebasestorage.app",
    messagingSenderId: "91091125344",
    appId: "1:91091125344:web:424901c8f581767e012f05"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const storage = getStorage(app)

export { auth, storage, app };
