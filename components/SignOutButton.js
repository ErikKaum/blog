import { auth } from "../lib/firebase"

const SignOutButton = () => {
    return(
        <button className='' onClick={() => auth.signOut()}>
            Sign out
        </button>
    )
}

export default SignOutButton