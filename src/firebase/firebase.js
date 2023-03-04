import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { user_logged } from '../objects/user_login';
import { socket } from '../websocket/socket';

const firebaseConfig = {
    apiKey: "AIzaSyAxDsMVypgqkrY31cJici7P-KsISDkb5-Y",
    authDomain: "gaussprime-2e46e.firebaseapp.com",
    projectId: "gaussprime-2e46e",
    storageBucket: "gaussprime-2e46e.appspot.com",
    messagingSenderId: "527087624830",
    appId: "1:527087624830:web:117b4bb3f5de6de5ad6e2f",
    measurementId: "G-WFL1P9NTJX"
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export const fetchToken = async (setTokenFound) => {
  return getToken(messaging, {vapidKey: process.env.REACT_APP_FIREBASE_FCM_VAPIDKEY}).then((currentToken) => {
    if (currentToken) {
      console.log('current token for client: ', currentToken);
      setTokenFound(true);
      socket.emit('allsquads/fcm/token/update', {discord_id: user_logged?.discord_id, fcm_token: currentToken})
      // Track the token -> client mapping, by sending to backend server
      // show on the UI that permission is secured
    } else {
      console.log('No registration token available. Request permission to generate one.');
      setTokenFound(false);
      // shows on the UI that permission is required 
    }
  }).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
    // catch error while creating client token
  });
}

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
});