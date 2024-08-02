// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDOt2G4aMjVmnT4tCtMOv4W32Jr44ikKV4",
    authDomain: "inventory-management-6cfc6.firebaseapp.com",
    projectId: "inventory-management-6cfc6",
    storageBucket: "inventory-management-6cfc6.appspot.com",
    messagingSenderId: "457041485778",
    appId: "1:457041485778:web:4090b49d09352ad657320b",
    measurementId: "G-1RMXDYNN6N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export {firestore};