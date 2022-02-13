import Link from "next/link"

const Custom404 = () => {
    return(
        <main>
            <h1>404 - This page doesn't seem to exist...</h1>

                <iframe
                    src='https://giphy.com/embed/l2JehQ2GitHGdVG9y'
                    width='480'
                    height='362'
                    frameBorder='0'
                    allowFullScreen
                    >

                </iframe>
                <Link href='/'>
                <button className="btn-blue"> Back Home </button>
                </Link>
        </main>
    )
}

export default Custom404
