import { firestore, getUserWithUserName, postToJson } from '../../lib/firebase'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import PostContent from '../../components/PostContent'
import styles from '../../styles/Post.module.css'
import MetaTags from '../../components/MetaTags'
import AuthCheck from '../../components/AuthCheck'
import HeartButton from '../../components/HeartButton'
import Link from 'next/link'

const Post = (props) => {


    const postRef = firestore.doc(props.path)
    const [realTimePost] = useDocumentData(postRef)

    const post = realTimePost || props.post


    return(
        <main className={styles.container}>
            <MetaTags title={post.title}/>

            <section>
                <PostContent post={post}/>
            </section>

            <aside className='card'>
                <p>
                    <strong>{post.heartCount || 0} 💗 </strong>
                </p>

                <AuthCheck fallback={
                    <Link href='/enter'>
                        <button>💗 Create Account</button>
                    </Link>
                }>
                    <HeartButton postRef={postRef}/>
                </AuthCheck>
            </aside>

        </main>
    )
}

export default Post


export const getStaticProps = async({ params }) => {
    const { slug, userName } = params
    const userDoc =  await getUserWithUserName(userName)

    let post;
    let path;

    if (userDoc) {
        const postRef = userDoc.ref.collection('posts').doc(slug)
        post = postToJson(await postRef.get())
        path = postRef.path
    }

    return {
        props: { post, path },
        revalidate: 50,
    }
}


export const getStaticPaths = async() => {

    const snapShot = await firestore.collectionGroup('posts').get()
    const paths = snapShot.docs.map((doc) => {
        const { slug, userName } = doc.data()
        return {
            params: { userName, slug },
        }
    })

    return{
        paths,
        fallback: 'blocking',
    }
}

