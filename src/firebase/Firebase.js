
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyCvGukJkfLcbXAp5kSaSNYmz8o-ZQ8BJPg",
    authDomain: "chatting-app-saim.firebaseapp.com",
    databaseURL: "https://chatting-app-saim-default-rtdb.firebaseio.com",
    projectId: "chatting-app-saim",
    storageBucket: "chatting-app-saim.appspot.com",
    messagingSenderId: "152211093125",
    appId: "1:152211093125:web:78c71f80a7835ad46e1bec",
    measurementId: "G-78W952RHXM"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database };
