import { getAuth } from 'firebase/auth';
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

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
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };