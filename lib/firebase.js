import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
    apiKey: "AIzaSyD5H8rFRs53m4jOKtx1bp-lxDsSsfsVepg",
    authDomain: "blog-ea110.firebaseapp.com",
    projectId: "blog-ea110",
    storageBucket: "blog-ea110.appspot.com",
    messagingSenderId: "298964040840",
    appId: "1:298964040840:web:098ca294a0dd9708ed733d",
    measurementId: "G-E8GENMN1K5"
};


if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export const getUserWithUserName = async(userName) => {
    const userRef = firestore.collection('users')
    const query = userRef.where('userName', '==', userName).limit(1)
    const userDoc = (await query.get()).docs[0]

    return userDoc
}

export const postToJson = (doc) => {
    const data = doc.data()
    return{
        ...data,
        createdAt: data?.createdAt.toMillis() || 0,
        updatedAt: data?.updatedAt.toMillis() || 0,
    }
}
 
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
export const fromMillis = firebase.firestore.Timestamp.fromMillis
export const serverTimeStamp = firebase.firestore.FieldValue.serverTimestamp
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED
export const increment = firebase.firestore.FieldValue.increment