import { firestore, auth } from '../lib/firebase'
import { useCollection } from 'react-firebase-hooks/firestore'
import PostFeed from './PostFeed'


const PostList = () => {
    const ref = firestore.collection('users').doc(auth.currentUser.uid).collection('posts')
    const query = ref.orderBy('createdAt')
    const [querySnapShot] = useCollection(query)

    const posts = querySnapShot?.docs.map((doc) => doc.data())
  

    return(
        <>
        <h1>Your posts</h1>
        <PostFeed posts={posts} admin/>
        </>
    )
}

export default PostList