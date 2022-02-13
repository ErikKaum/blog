import { serverTimestamp } from "firebase/firestore"
import kebabCase from "lodash.kebabcase"
import { useRouter } from "next/router"
import { useContext, useState } from "react"
import toast from "react-hot-toast"
import UserContext from "../lib/context"
import { firestore, auth } from "../lib/firebase"
import styles from '../styles/Admin.module.css';


const CreateNewPost = () => {
    const router = useRouter()
    const { userName } = useContext(UserContext)
    const [title, setTitle] = useState('')
    const slug = encodeURI(kebabCase(title))
    const isValid = title.length > 3 && title.length < 100

    const createPost = async(e) => {
        e.preventDefault()
        const uid = auth.currentUser.uid
        const ref = firestore.collection('users').doc(uid).collection('posts').doc(slug)

        const data = {
            title,
            slug,
            uid,
            userName,
            published: false,
            heartCount: 0,
            content: '# Your post!',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        }

        await ref.set(data)
        toast.success('Post Created!')

        router.push(`/admin/${slug}`)
    }

    return(
        <form onSubmit={createPost}>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Name of article' className={styles.input} />
            <p>
                <strong>Slug: </strong> {slug}
            </p>
        
            <button type="submit" disabled={!isValid} className='btn-green'> 
                Create Post
            </button>

        </form>
    )
}

export default CreateNewPost