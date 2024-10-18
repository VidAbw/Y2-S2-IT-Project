import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEye, FaPen } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [tagSearchTerm, setTagSearchTerm] = useState('');
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const navigate = useNavigate();

    // Fetch all blogs when component mounts
    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get('http://localhost:5000/blogs/getAll');
                setBlogs(response.data);
                setFilteredBlogs(response.data);
            } catch (error) {
                console.error('Failed to fetch blogs', error);
            }
        };

        fetchBlogs();
    }, []);

    // Handle search filtering based on title and tags
    useEffect(() => {
        const filterBlogs = () => {
            const lowerTitleSearch = searchTerm.toLowerCase();
            const lowerTagSearch = tagSearchTerm.toLowerCase();

            const filtered = blogs.filter(blog => {
                const titleMatches = blog.title.toLowerCase().includes(lowerTitleSearch);
                const tagsMatches = blog.tags.some(tag => tag.toLowerCase().includes(lowerTagSearch));
                return titleMatches && (!lowerTagSearch || tagsMatches);
            });

            setFilteredBlogs(filtered);
        };

        filterBlogs();
    }, [searchTerm, tagSearchTerm, blogs]);

    // Update viewCount and navigate to the blog details page
    const handleCardClick = async (blogId) => {
        try {
            // Update viewCount by calling the backend
            await axios.put(`http://localhost:5000/blogs/updateViewCount/${blogId}`);
            
            // Navigate to the blog details page
            navigate(`/blog/${blogId}`);
        } catch (error) {
            console.error('Failed to update view count', error);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4" style={{ color: '#ff6600' }}>
                <FaPen /> All Blogs
            </h2>

            {/* Search Bar */}
            <div className="row mb-4">
                <div className="col-md-6 mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by Title"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="col-md-6 mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by Tags"
                        value={tagSearchTerm}
                        onChange={(e) => setTagSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Blog Cards */}
            <div className="row">
                {filteredBlogs.length > 0 ? (
                    filteredBlogs.map((blog) => (
                        <div key={blog._id} className="col-md-4 mb-4">
                            <div
                                className="card shadow-sm"
                                style={{ borderRadius: '10px', cursor: 'pointer' }}
                                onClick={() => handleCardClick(blog._id)}
                            >
                                <div className="card-body" style={{ borderRadius: '10px' }}>
                                    <h5 className="card-title" style={{ color: '#ff6600' }}>{blog.title}</h5>
                                    <p className="card-text"><strong>Author:</strong> {blog.author}</p>

                                    {/* Tags */}
                                    <div className="mb-2">
                                        {blog.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="badge bg-warning text-dark me-1"
                                                style={{ backgroundColor: '#ff9900' }}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* View Count */}
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span style={{ color: '#ff6600' }}>
                                            <FaEye /> {blog.viewCount} views
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12 text-center">
                        <p>No blogs found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Blogs;
