import Link from "next/link";
import UserContext from "../lib/context";
import { useContext } from "react";
import SignOutButton from "./SignOutButton";
import Image from "next/image";


const Navbar = () => {

    const { user, userName } = useContext(UserContext)  
    
    return(
    <nav className="navbar">

        <ul>
            <li>
                <Link href='/' passHref>
                    <button>FEED</button>
                </Link>
            </li>

            {/* If user is signed in */}
            {userName && (
                <>
                <li className="push-left">
                    <Link href='/admin' passHref>
                        <button className="btn-blue">Write posts</button>
                    </Link>
                </li>

                <li>
                    <SignOutButton></SignOutButton>
                </li>

                <li>
                    <Link href={`/${userName}`} passHref>
                        <Image src={user?.photoURL} alt='user' width={40} height={40}/>
                    </Link>

                </li>
                </>
            )}

            {/* User has not signed in OR has not created account */}
            {!userName && (
                <li>
                    <Link href='/enter' passHref>
                        <button className="btn-blue">Log in</button>
                    </Link>
                </li>
            )}

        </ul>

    </nav>        
    )
}

export default Navbar