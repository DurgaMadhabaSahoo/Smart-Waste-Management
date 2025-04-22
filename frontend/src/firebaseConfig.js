import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "wastemangement-2011e.firebaseapp.com",
  projectId: "wastemangement-2011e",
  storageBucket: "wastemangement-2011e.appspot.com",
  messagingSenderId: "543285986741",
  appId: "1:543285986741:web:d92ed5e1f5039f4819c5fc"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

export { storage };
