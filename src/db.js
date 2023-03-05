import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBkXsXdphYIikiYzZrEBRJNpD8biETfRAg",
  authDomain: "clicker-duel.firebaseapp.com",
  projectId: "clicker-duel",
  storageBucket: "clicker-duel.appspot.com",
  messagingSenderId: "976949107518",
  appId: "1:976949107518:web:0237c87b3512663bf66a6f",
  databaseURL: "https://clicker-duel-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
