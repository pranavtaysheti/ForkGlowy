// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD-SbbSnmdpwLLUA_fCqFvkn9jE67RzbX0",
  authDomain: "forkglowy.firebaseapp.com",
  databaseURL: "https://forkglowy-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "forkglowy",
  storageBucket: "forkglowy.appspot.com",
  messagingSenderId: "614206734376",
  appId: "1:614206734376:web:87f35a247317d1bb1e751d",
  measurementId: "G-52D982M2HQ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);