import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBYQkptlCNWEANBH-Hb9GQ0BM5CO-ukvww",
  authDomain: "cell-test-a305f.firebaseapp.com",
  projectId: "cell-test-a305f",
  storageBucket: "cell-test-a305f.appspot.com",
  messagingSenderId: "660430066260",
  appId: "1:660430066260:web:d4b74a05af36aabd2b13c1",
  databaseURL:
    "https://cell-test-a305f-default-rtdb.europe-west1.firebasedatabase.app",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const database = getDatabase(app);
