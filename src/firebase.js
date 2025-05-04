// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDEfn5AXkA_OiirSmI-8-XHht5c7wyLWMo",
  authDomain: "cpit405-457723.firebaseapp.com",
  projectId: "cpit405-457723",
  storageBucket: "cpit405-457723.appspot.com",
  messagingSenderId: "341977713980",
  appId: "1:341977713980:web:87e07462f2cdb7f822239",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider };
