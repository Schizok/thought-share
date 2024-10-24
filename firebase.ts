import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC6Jf_gYDPymLZ4S1PC_aXzBbW4oVbAIEc",
  authDomain: "url-short-62eff.firebaseapp.com",
  projectId: "url-short-62eff",
  storageBucket: "url-short-62eff.appspot.com",
  messagingSenderId: "454932158838",
  appId: "1:454932158838:web:1aadfdd47d36974bc94257",
  measurementId: "G-9JEJQZ7NGR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);