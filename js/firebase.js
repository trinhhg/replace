export const firebaseConfig = {
  apiKey: "AIzaSyB2VklwyVqGX7BgIsZeYannPijYk9_bB1Q",
  authDomain: "trinhhg-1f8f3.firebaseapp.com",
  projectId: "trinhhg-1f8f3",
  storageBucket: "trinhhg-1f8f3.firebasestorage.app",
  messagingSenderId: "63432174844",
  appId: "1:63432174844:web:57f18e049b4cf5860e7b79",
  measurementId: "G-LNZQTM2JTD"
};

export function initFirebase() {
  try {
    if (!window.firebase) {
      console.error("Firebase library not loaded. Check script tags.");
      return null;
    }
    const app = firebase.initializeApp(firebaseConfig);
    return {
      auth: app.auth(),
      db: app.firestore()
    };
  } catch (error) {
    console.error("Firebase initialization failed:", error);
    return null;
  }
}
