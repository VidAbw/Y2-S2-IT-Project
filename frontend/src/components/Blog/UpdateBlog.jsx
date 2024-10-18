import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaPen, FaFileAlt, FaTrash } from 'react-icons/fa'; // Import React Icons
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from 'react-router-dom'; // Import useParams to get the blog ID from the URL

const UpdateBlog = () => {
    const { id } = useParams(); // Get the blog ID from the URL
    const [title, setTitle] = useState('');
    const [contentList, setContentList] = useState(['']); // Multiple content sections
    const [author, setAuthor] = useState('');
    const [tagsList, setTagsList] = useState(['']); // Multiple tags
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true); // For loading state

    // Fetch the blog data on component mount
    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/blogs/getById/${id}`);
                const blog = response.data;
                
                setTitle(blog.title);
                setContentList(blog.content);
                setAuthor(blog.author);
                setTagsList(blog.tags);
                setLoading(false); // Set loading to false after fetching
            } catch (err) {
                console.error('Failed to fetch blog', err);
                setErrors((prev) => ({ ...prev, fetchError: 'Failed to fetch blog data.' }));
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id]);

    // Validate the form inputs
    const validateForm = () => {
        const newErrors = {};

        if (!title) newErrors.title = 'Title is required.';
        if (!author) newErrors.author = 'Author is required.';
        if (contentList.some(content => content === '')) newErrors.content = 'All content sections must be filled.';
        
        return newErrors;
    };

    // Handle form submission for updating blog
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }
        setErrors({});

        const blogData = {
            title,
            content: contentList,
            author,
            tags: tagsList.filter(tag => tag !== '') // Remove empty tags
        };

        try {
            await axios.put(`http://localhost:5000/blogs/updateById/${id}`, blogData);
            alert('Blog updated successfully!');
        } catch (err) {
            console.error(err);
            setErrors((prev) => ({ ...prev, submitError: 'Failed to update blog.' }));
        }
    };

    // Handle adding a new content section
    const addContentField = () => {
        setContentList([...contentList, '']);
    };

    // Handle removing a content section
    const removeContentField = (index) => {
        const updatedContentList = contentList.filter((_, i) => i !== index);
        setContentList(updatedContentList);
    };

    // Handle changing content
    const handleContentChange = (value, index) => {
        const updatedContentList = [...contentList];
        updatedContentList[index] = value;
        setContentList(updatedContentList);
    };

    // Handle adding a new tag
    const addTagField = () => {
        setTagsList([...tagsList, '']);
    };

    // Handle removing a tag
    const removeTagField = (index) => {
        const updatedTagsList = tagsList.filter((_, i) => i !== index);
        setTagsList(updatedTagsList);
    };

    // Handle changing tag
    const handleTagChange = (value, index) => {
        const updatedTagsList = [...tagsList];
        updatedTagsList[index] = value;
        setTagsList(updatedTagsList);
    };

    if (loading) return <div>Loading...</div>; // Display loading state

    return (
        <div className="container mt-5 col-6" style={{ backgroundColor: '#ffcc66', padding: '30px', borderRadius: '10px' }}>
            <h2 className="text-center mb-4" style={{ color: '#ff6600' }}>
                <FaPen /> Update Blog
            </h2>
            {errors.fetchError && <div className="alert alert-danger">{errors.fetchError}</div>}
            {errors.submitError && <div className="alert alert-danger">{errors.submitError}</div>}
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className='col-6'>
                        {/* Title Input */}
                        <div className="mb-3">
                            <label className="form-label" style={{ color: '#ff6600' }}>
                                <FaFileAlt /> Blog Title
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter blog title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            {errors.title && <div className="text-danger">{errors.title}</div>}
                        </div>
                    </div>

                    <div className='col-6'>
                        {/* Author Input */}
                        <div className="mb-3">
                            <label className="form-label" style={{ color: '#ff6600' }}>
                                <FaPen /> Author Name
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Author name"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                            />
                            {errors.author && <div className="text-danger">{errors.author}</div>}
                        </div>
                    </div>
                </div>

                {/* Multiple Content Sections */}
                <div className="mb-3">
                    <label className="form-label" style={{ color: '#ff6600' }}>
                        <FaPen /> Blog Content
                    </label>
                    {contentList.map((content, index) => (
                        <div key={index} className="d-flex mb-2">
                            <textarea
                                className="form-control me-2"
                                rows="3"
                                placeholder={`Content section ${index + 1}`}
                                value={content}
                                onChange={(e) => handleContentChange(e.target.value, index)}
                            />
                            {contentList.length > 1 && (
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => removeContentField(index)}
                                >
                                    <FaTrash />
                                </button>
                            )}
                        </div>
                    ))}
                    {errors.content && <div className="text-danger">{errors.content}</div>}
                    <button
                        type="button"
                        className="btn btn-warning"
                        style={{ backgroundColor: '#ff9900', color: 'white' }}
                        onClick={addContentField}
                    >
                        <FaPlus /> Add Content Section
                    </button>
                </div>

                {/* Multiple Tags */}
                <div className="mb-3">
                    <label className="form-label" style={{ color: '#ff6600' }}>
                        <FaPlus /> Tags
                    </label>
                    {tagsList.map((tag, index) => (
                        <div key={index} className="d-flex mb-2">
                            <input
                                type="text"
                                className="form-control me-2"
                                placeholder={`Tag ${index + 1}`}
                                value={tag}
                                onChange={(e) => handleTagChange(e.target.value, index)}
                            />
                            {tagsList.length > 1 && (
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => removeTagField(index)}
                                >
                                    <FaTrash />
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        className="btn btn-warning"
                        style={{ backgroundColor: '#ff9900', color: 'white' }}
                        onClick={addTagField}
                    >
                        <FaPlus /> Add Tag
                    </button>
                </div>

                {/* Submit Button */}
                <div className="text-center">
                    <button type="submit" className="btn btn-lg" style={{ backgroundColor: '#ff9900', color: 'white' }}>
                        <FaPen /> Update Blog
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateBlog;
