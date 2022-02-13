import AuthCheck from "../../components/AuthCheck"
import PostList from "../../components/PostList"
import CreateNewPost from "../../components/CreateNewPost"

const AdminPage = () => {
    return(
        <main>
            <AuthCheck>
                <PostList />
                <CreateNewPost />
            </AuthCheck>
        </main>
    )
}

export default AdminPage


