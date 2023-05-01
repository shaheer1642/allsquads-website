document.addEventListener('DOMContentLoaded', init, false)

function init() {
  if ('serviceWorker' in navigator && navigator.onLine) {
    navigator.serviceWorker.ready.then(registration => {
      registration.unregister();
    });
  }
}