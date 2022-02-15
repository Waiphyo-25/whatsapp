import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyARV31UUN-LBa-7UieU5lwszK0NyQT1DcQ",
  authDomain: "whatsapp-11fe8.firebaseapp.com",
  projectId: "whatsapp-11fe8",
  storageBucket: "whatsapp-11fe8.appspot.com",
  messagingSenderId: "908728652949",
  appId: "1:908728652949:web:7480d3ae07d654fff8f79c",
  measurementId: "G-X57VNCJCTS",
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db;
