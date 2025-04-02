// utils/firebaseClient.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAcCAqX6lFDX-cFtqyy7X05ONpGaXmpEX0",
  authDomain: "projectx-9a991.firebaseapp.com",
  projectId: "projectx-9a991",
  storageBucket: "projectx-9a991.appspot.com",
  messagingSenderId: "645342064868",
  appId: "1:645342064868:web:b95b82b1a783d9b199fcf1",
  measurementId: "G-BLZELWVM6G"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
