import { useRouter } from 'next/router'
import { useState } from 'react'
import AuthCheck from '../../components/AuthCheck'
import { auth, firestore } from '../../lib/firebase'
import { useDocumentData } from 'react-firebase-hooks/firestore';
import styles from '../../styles/Admin.module.css'
import { useForm, useFormState } from 'react-hook-form'
import ReactMarkdown from 'react-markdown'
import { serverTimestamp } from 'firebase/firestore'
import toast from 'react-hot-toast'
import Link from 'next/link';
import { ErrorMessage } from '@hookform/error-message'; // install and import error-message
import ImageUploader from '../../components/ImageUploader';

const AdminPostEdit = () => {
    return(
        <main>
            <AuthCheck>
                <PostManager />
            </AuthCheck>
        </main>
    )
}

export default AdminPostEdit


const PostManager = () => {
    const [preview, setPreview] = useState(false)
    const router = useRouter()
    const { slug } = router.query
    
    const postRef = firestore.collection('users').doc(auth.currentUser.uid).collection('posts').doc(slug)
    const [post] = useDocumentData(postRef)
    
    return(
        <main className={styles.container}>
            {post && (
                <>
                <section>
                    <h1>{post.title}</h1>
                    <p>ID: {post.slug}</p>

                    <PostForm postRef={postRef} defaultValues={post} preview={preview}/>
                </section>

                <aside>
                    <h3>Tools</h3>
                    <button onClick={() => setPreview(!preview)}>
                        {preview ? 'Edit' : 'Preview'}
                    </button>
                    <Link href={`/${post.userName}/${post.slug}`}>
                        <button className='btn-blue'>Live view</button>
                    </Link>

                </aside>
                </>
            )}

        </main>
    )
}

const PostForm = ({postRef, defaultValues, preview}) => {
    const { register, handleSubmit, reset, watch, formState: { errors }, control } = useForm({ defaultValues, mode:'onChange' })
    const { isValid, isDirty } = useFormState({control}) 

    const updatePost = async({ content, published }) => {

        await postRef.update({
            content,
            published,
            updatedAt: serverTimestamp(),
        })

        reset({ content, published })
        toast.success('Post updated!')
    }

    return(
        <form onSubmit={handleSubmit(updatePost)}>
            {preview && (
                <div className='card'>
                    <ReactMarkdown>{watch('content')}</ReactMarkdown>
                </div>
            )}

            <div className={preview ? styles.hidden : styles.controls}>

                <ImageUploader />

                <textarea {...register("content", {
                    required: "content is required",
                    maxLength: {value: 2000, message: 'content is too long'},
                    minLength: {value: 10, message: 'content is too short'},
                })}>
                </textarea>

                <ErrorMessage errors={errors} name='content' render={({message}) => <p className='text-danger'>{message}</p>}/>

                <fieldset>
                    <input className={styles.checkbox} type="checkbox" {...register("published")}/>
                    <label>Published</label>
                </fieldset>
                
                <button type="submit" className="btn-green" disabled={!isDirty || !isValid}>
                    Save Changes
                </button>

            </div>

        </form>
    )
}