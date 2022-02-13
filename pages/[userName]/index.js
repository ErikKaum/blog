import UserProfile from "../../components/UserProfile"
import PostFeed from "../../components/PostFeed"
import { getUserWithUserName, postToJson } from "../../lib/firebase"
import MetaTags from "../../components/MetaTags";

export const getServerSideProps = async({ query }) => {

    const { userName } = query; 
    const userDoc = await getUserWithUserName(userName);
    
    let user = null;
    let posts = null;

    if (!userDoc) {
      return{
        notFound: true
      }
    }
 
    if (userDoc) {
      user = userDoc.data();
      const postsQuery = userDoc.ref
        .collection('posts')
        .where('published', '==', true)
        .orderBy('createdAt', 'desc')
        .limit(5);
      posts = (await postsQuery.get()).docs.map(postToJson);
    }

    return {
      props: { user, posts }, // will be passed to the page component as props
    };
}

const UserProfilePage = ({user, posts}) => {

    return(
        <main>
            <MetaTags title={user.userName} image={user.photoURL}/>
            <UserProfile user={user} />
            <PostFeed posts={posts}/>
        </main>
    )
}

export default UserProfilePage
