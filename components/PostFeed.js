import Link from "next/link";

const PostFeed = ({posts, admin}) => {
    return posts ? posts.map((post) => <PostItem post={post} key={post.slug} admin={admin}/>) : null
}

const PostItem = ({post, key, admin=false}) => {

    const wordCount = post?.content.trim().split(/\s+/g).length;
    const minToRead = (wordCount / 100 + 1).toFixed();

    console.log(post)

    return(
        <div className="card">

            <Link href={`/${post.userName}`} passHref>
                <a>
                    <strong>By @{post.userName}</strong>
                </a>
            </Link>

            <Link href={`/${post.userName}/${post.slug}`} passHref>
                <h2>
                    <a>{post.title}</a>
                </h2>
            </Link>

            <footer>
                <span>
                    {wordCount} words. {minToRead} min to read.
                </span>
                <span className="push-left">
                    {post.heartCount} 💗 
                </span>
            </footer>


        </div>
    )
}



export default PostFeed
