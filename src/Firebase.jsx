import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyD9Ou5vdbhPE6Iw08hYul7H_zrHLULnu3g",
  authDomain: "iot-project-agro-e1776.firebaseapp.com",
  databaseURL: "https://iot-project-agro-e1776-default-rtdb.firebaseio.com/",  // ADD SLASH
  projectId: "iot-project-agro-e1776",
  storageBucket: "iot-project-agro-e1776.firebasestorage.app",
  messagingSenderId: "546170244240",
  appId: "1:546170244240:web:4ed4f90bb1091ea0bc1c15"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

// 🔥 FORCE CORRECT DATABASE INSTANCE
export const db = getDatabase(app, "https://iot-project-agro-e1776-default-rtdb.firebaseio.com/");
