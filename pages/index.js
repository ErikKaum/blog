import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useState } from 'react'

import { postToJson, firestore, fromMillis } from '../lib/firebase'
import PostFeed from '../components/PostFeed'
import Loader from '../components/Loader'

const LIMIT = 1

export default function Home({posts}) {
  const [feedPosts, setFeedPosts] = useState(posts)
  const [isLoading, setIsLoading] = useState(false)
  const [postsEnd, setPostsEnd] = useState(false)

  const getMorePosts = async() => {
    setIsLoading(true)

    const lastPost = feedPosts[feedPosts.length -1]
    const cursor = typeof lastPost.createdAt === 'number' ? fromMillis(lastPost.createdAt) : lastPost.createdAt 
  
    const query = firestore
      .collectionGroup('posts')
      .where('published', '==', true)
      .orderBy('createdAt', 'desc')
      .startAfter(cursor)
      .limit(LIMIT)
    
      const newPosts = (await query.get()).docs.map((doc) => doc.data())

      setFeedPosts(feedPosts.concat(newPosts))
      setIsLoading(false)

      if (newPosts.length < LIMIT) {
        setPostsEnd(true)
      }
  }

  return (
      <main>
        <PostFeed posts={feedPosts}/>

        {!isLoading && !postsEnd && <button onClick={getMorePosts}>Read more!</button>}

        <Loader show={isLoading}/>

        {postsEnd && 'You have reached the end!'}

      </main>
    )
}


export const getServerSideProps = async(context) => {
  const postQuery = firestore
    .collectionGroup('posts')
    .where('published', '==', true)
    .orderBy('createdAt', 'desc')
    .limit(LIMIT)

  const posts = (await postQuery.get()).docs.map(postToJson)

  return{
    props: { posts }
  }
}
