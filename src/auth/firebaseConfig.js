// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAxuUffWb5Y2Ro2jvVscxr6omuIo7yZH3E",
  authDomain: "todo-apps-a5cdc.firebaseapp.com",
  projectId: "todo-apps-a5cdc",
  storageBucket: "todo-apps-a5cdc.appspot.com",
  messagingSenderId: "229862997790",
  appId: "1:229862997790:web:d39005cb0bc734a9b4d30f",
  measurementId: "G-M6376J6Y1B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };