import { initializeApp } from 'firebase/app';
import {getDatabase, ref} from "firebase/database";
// import { getAuth, signInAnonymously } from "firebase/auth";

import { initializeAuth, getReactNativePersistence, signInAnonymously} from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';




// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDHG4F27hxTeqgmswYqe6LFdlcHo_YYLm0",
  authDomain: "radioroom-98d76.firebaseapp.com",
  projectId: "radioroom-98d76",
  storageBucket: "radioroom-98d76.appspot.com",
  messagingSenderId: "178257429078",
  appId: "1:178257429078:web:6f389b16bd78b82e4731f7",
  databaseURL: "https://radioroom-98d76-default-rtdb.asia-southeast1.firebasedatabase.app/"
};


const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const dbRef = ref(db)
// export const auth = getAuth(app
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export function useFirebaseSignInAnon(){
  async function doSignIn(){
    await signInAnonymously(auth)
  }
  return [doSignIn]
}

// console.log(database)
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
