import {useState} from 'react';
import { fetchToken, onMessageListener } from './firebase';
import {Snackbar} from '@mui/material';
import React from 'react';
function FirebaseNotifications() {

  const [show, setShow] = useState(false);
  const [notification, setNotification] = useState({title: '', body: ''});
  const [isTokenFound, setTokenFound] = useState(false);
  fetchToken(setTokenFound);

  onMessageListener().then(payload => {
    setNotification({title: payload.notification.title, body: payload.notification.body})
    setShow(true);
    console.log('[firebase notification] payload:', payload);
  }).catch(err => console.log('failed: ', err));

//   const onShowNotificationClicked = () => {
//     setNotification({title: "Notification", body: "This is a test notification"})
//     setShow(true);
//   }

  return (
    <Snackbar
        open={show}
        autoHideDuration={6000}
        onClose={() => setShow(false)}
        message={JSON.stringify(notification)}
    />
  );
}

export default FirebaseNotifications;