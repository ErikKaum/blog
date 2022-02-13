import Image from "next/image"

const UserProfile = ({user}) => {

    return(
    <div className="box-center">
        <div>
            <Image src={user.photoURL} className='card-img-center' alt="User" width={60} height={60}/>
        </div>
        <p>
            <i>@{user.userName}</i>
        </p>
        <h1>{user.displayName}</h1>
    </div>
    )
}

export default UserProfile