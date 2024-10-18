import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaEye, FaPen } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const BlogDetail = () => {
    const { id } = useParams(); // Get the blog ID from the URL
    const [blog, setBlog] = useState(null);
    const [error, setError] = useState('');

    // Fetch blog data by ID when component mounts
    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/blogs/getById/${id}`);
                setBlog(response.data);
            } catch (err) {
                setError('Failed to fetch blog data.');
                console.error(err);
            }
        };

        fetchBlog();
    }, [id]);

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    if (!blog) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-5">

            <div className='container col-6 shadow-md'>
                <div>
                    <h2 style={{ color: '#ff6600' }}>
                        {blog.title}
                    </h2>
                    <p className="text-muted"><strong>Author:</strong> {blog.author}</p>
                </div>
                <div className='row'>
                    <div className='col-8'>
                        <div className="mb-2">
                            {blog.tags.map((tag, index) => (
                                <span key={index} className="badge bg-warning text-dark me-1" style={{ backgroundColor: '#ff9900' }}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className='col-4'>
                        <p className="text-muted"><FaEye /> {blog.viewCount} views</p>
                    </div>
                </div>
                <hr />

                <div className="mt-4">
                    {blog.content.map((content, index) => (
                        <p key={index} style={{ textAlign: 'justify' }}>
                            {content}
                        </p>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogDetail;
