import { initializeApp } from "firebase/app";
import {
  getAuth
} from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyDFKzvvSBolXisPzsBwwovqKiNiztpl9l4",
  authDomain: "callingapp-9f749.firebaseapp.com",
  projectId: "callingapp-9f749",
  storageBucket: "callingapp-9f749.firebasestorage.app",
  messagingSenderId: "624036941694",
  appId: "1:624036941694:web:ebe985dcc98b1660082d2f",
  measurementId: "G-ZY43NGD58R"
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
