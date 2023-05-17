// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.REACT_APP_APIKEY,
  authDomain: import.meta.env.REACT_APP_AUTHDOMAIN,
  projectId: import.meta.env.REACT_APP_PID,
  storageBucket: import.meta.env.REACT_APP_SB,
  messagingSenderId: import.meta.env.REACT_APP_SID,
  appId: import.meta.env.REACT_APP_APPID,
  measurementId: import.meta.env.REACT_APP_MID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
