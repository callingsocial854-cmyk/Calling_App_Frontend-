import { initializeApp } from "firebase/app";
import {
  getAuth
} from "firebase/auth";
import { getMessaging, getToken, onMessage } from "firebase/messaging";


const firebaseConfig = {
  apiKey: "AIzaSyAm_3EVb0X9YpTD2l3MoDxIBUrI5gx1Dpk",
  authDomain: "zustation.firebaseapp.com",
  projectId: "zustation",
  storageBucket: "zustation.firebasestorage.app",
  messagingSenderId: "493331901494",
  appId: "1:493331901494:web:ab4ec9ae90d5effeb2fc97",
  measurementId: "G-VEMHD1RYHQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// const messaging = getMessaging(app);

// export const requestFirebaseToken = async () => {
//   try {
//     const permission = await Notification.requestPermission();
//     if (permission === "granted") {
//       const token = await getToken(messaging, {
//         vapidKey: import.meta.env.VITE_VAPID_KEY,
//       });
//       console.log("FCM Token:", token);
//       return token;
//     } else {
//       console.log("Notification permission denied.");
//       return null;
//     }
//   } catch (error) {
//     console.error("Error getting FCM token:", error);
//     return null;
//   }
// };

// // Handle foreground messages
// onMessage(messaging, (payload) => {
//   console.log("Message received in foreground: ", payload);
// });

export { auth };
