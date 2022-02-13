import { auth, googleAuthProvider } from '../lib/firebase';
import UserContext from '../lib/context';
import { useCallback, useContext, useEffect, useState } from 'react';
import { firestore } from '../lib/firebase';
import debounce from 'lodash.debounce';
import SignOutButton from '../components/SignOutButton';
import MetaTags from '../components/MetaTags';
import Image from 'next/image';

const EnterPage = () => {

    const { user, userName } = useContext(UserContext)

    
    // 1. user signed out <SignInButton />
    // 2. user signed in, but missing username <UsernameForm />
    // 3. user signed in, has username <SignOutButton />

    return(
        <main>

            <MetaTags title='Welcome to SnapThoughts'/>
            
            {user ?
            !userName ? <UsernameForm/> : <SignOutButton/>
            :
            <SignInButton/>
            }

        </main>
    )
}

export default EnterPage


const SignInButton = () => {

    const signInWithGoogle = async() => {
        await auth.signInWithPopup(googleAuthProvider);
    } 

    return(
        <button className='btn-google' onClick={signInWithGoogle}>
            <Image src={'/google.png'} alt='google' width={20} height={20}/>
            Sign in with Google
        </button>
    )
}

// const SignOutButton = () => {
//     return(
//         <button className='' onClick={() => auth.signOut()}>
//             Sign out
//         </button>
//     )
// }

const UsernameForm = () => {
    const [formValue, setFormValue] = useState('')
    const [isValid, setIsValid] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const { user, userName } = useContext(UserContext)

    useEffect(() => {
        checkUserName(formValue)
    }, [formValue, checkUserName])

    const onChange = (event) => {
        const value = event.target.value.toLowerCase();
        const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;


        if (value.length < 3) {
            setFormValue(value)
            setIsLoading(false)
            setIsValid(false)
        }

        if (re.test(value)) {
            setFormValue(value)
            setIsLoading(true)
            setIsValid(false)

        }
    }

    const checkUserName = useCallback(

        debounce(async(userName) => {
            if (userName.length >= 3) {
                const ref = firestore.doc(`userNames/${userName}`) 
                const { exists } = ref.get()
                console.log('firestore read')
                setIsValid(!exists)
            }

    }, 500),
    [])


    const onSubmit = async(event) => {
        event.preventDefault();

        const userDoc = firestore.doc(`users/${user.uid}`);
        const userNameDoc = firestore.doc(`userName/${formValue}`)

        const batch = firestore.batch();
        batch.set(userDoc, {userName: formValue, photoURL: user.photoURL, displayName: user.displayName});
        batch.set(userNameDoc, {uid: user.uid})

        await batch.commit();    
    }


    return(
        !userName && (
            <section>
                <h3>Choose username:</h3>
                <form onSubmit={onSubmit}>
                    <input name='userName' placeholder='name' value={formValue} onChange={onChange}></input>
                    <UserNameMessage userName={formValue} isValid={isValid} isLoading={isLoading}/>
                    <button type='submit' className='btn-green' disabled={!isValid}>Submit</button>

                <h3>Debugging borad</h3>
                <div>
                    User name: {formValue}
                    <br />
                    Loading: {isLoading.toString()}
                    <br />
                    User name is valid: {isValid.toString()}
                </div>

                </form>
            </section>
        )
    )
}

const UserNameMessage = ({userName, isValid, loading, }) => {
    if (loading) {
        return <p>Checking...</p>
    } else if (isValid) {
        return <p className='text-succes'>User name is available</p>
    } else if (userName && !isValid) {
        return <p className='text-danger'>User name is taken</p>
    } else {
        return <p></p>
    }
}