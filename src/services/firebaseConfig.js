import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
// Note: In production, use environment variables
const firebaseConfig = {
    apiKey: "DEMO-API-KEY-REPLACE-IN-PRODUCTION",
    authDomain: "scm-demo.firebaseapp.com",
    projectId: "scm-demo",
    storageBucket: "scm-demo.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
