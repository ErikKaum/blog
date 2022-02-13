import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '../lib/firebase'


const useUserData = () => {
  const [user] = useAuthState(auth)
  const [userName, setUserName] = useState(null)

  useEffect(() =>{

    let unsubsribe;

    if (user) {
      const ref = firestore.collection('users').doc(user.uid);
      unsubsribe = ref.onSnapshot((doc) => {
        setUserName(doc.data()?.userName)
      })
    }
    else {
      setUserName(null)
    }
    return unsubsribe
  }, [user])

  return { user, userName }
}

export default useUserData