import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from "firebase/messaging";
import { user_logged, authorizationCompleted } from '../objects/user_login';
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
export const messaging = getMessaging(firebaseApp);

export const fetchToken = async (callback) => {
  return getToken(messaging, {vapidKey: process.env.REACT_APP_FIREBASE_FCM_VAPIDKEY}).then((currentToken) => {
    if (currentToken) {
      console.log('[Firebase FCM] Current token for client:', currentToken);
      authorizationCompleted().then(() => {
        socket.emit('allsquads/fcm/token/update', {user_id: user_logged?.user_id, fcm_token: currentToken})
      }).catch(console.error)
      callback(true);
    } else {
      console.log('[Firebase FCM] No registration token available. Request permission to generate one.');
      callback(false);
    }
  }).catch((err) => {
    console.log('[Firebase FCM] An error occurred while retrieving token. ', err);
  });
}