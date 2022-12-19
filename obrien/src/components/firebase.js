import {initializeApp} from 'firebase/app'
import {getStorage} from 'firebase/storage'
const firebaseConfig = {
    apiKey: "AIzaSyCQnlkfO70fatZTYKf4CG0l8v_HloEMJEk",
    authDomain: "obrien-1482c.firebaseapp.com",
    projectId: "obrien-1482c",
    storageBucket: "obrien-1482c.appspot.com",
    messagingSenderId: "316516728185",
    appId: "1:316516728185:web:e2e9f1cb852ba1ee6303a8"
};
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)

