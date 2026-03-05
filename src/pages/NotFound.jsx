import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
    return (
        <div style={{ textAlign: "center", marginTop: "100px" }}>
            <h1>404</h1>
            <h2>Page Not Found</h2>
            <p className='pb-8'>The page you are looking for does not exist.</p>
            <Link to='/' className='bg-blue-500 text-white p-2 rounded-2xl mt-10'>Go Home</Link>
        </div>
    )
}

export default NotFound;