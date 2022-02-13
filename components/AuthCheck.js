import Link from "next/link"
import { useContext } from "react"
import UserContext from '../lib/context'

const AuthCheck = (props) => {

    const { userName } = useContext(UserContext)

    return userName ?
        props.children :
        <Link href='/enter'> You must be signed in </Link>

} 

export default AuthCheck