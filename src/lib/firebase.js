// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth,GoogleAuthProvider, FacebookAuthProvider  } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCdNW0AE__tJX3yQ1Jg0JATGxNE59E_VZ8",
  authDomain: "motorservice-3.firebaseapp.com",
  projectId: "motorservice-3",
  storageBucket: "motorservice-3.appspot.com",
  messagingSenderId: "869169837126",
  appId: "1:869169837126:web:a4038e74bb0f8d667f8647"
};

// apiKey: "AIzaSyDEx_T5zJHFG4k7qkp3f4weCUjFpiCnzdI",
// authDomain: "motorservice-project.firebaseapp.com",
// projectId: "motorservice-project",
// storageBucket: "motorservice-project.appspot.com",
// messagingSenderId: "393695948233",
// appId: "1:393695948233:web:f3a50ceb57f17648620c18"
// const firebaseConfig = {
//   apiKey: process.env.REACT_API_KEY,
//   authDomain: process.env.REACT_AUTH_DOMAIN,
//   projectId: process.env.REACT_PROJECT_ID,
//   storageBucket: process.env.REACT_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_MESSAGE_ID,
//   appId: process.env.REACT_APP_ID
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)
export const storage = getStorage(app)
export const authentication = getAuth();
export const google = new GoogleAuthProvider()
export const facebook = new FacebookAuthProvider()
export const messaging =  getMessaging(app)
