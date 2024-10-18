import React, { useState } from 'react';
import axios from 'axios';
import { FaPlus, FaPen, FaFileAlt, FaTrash } from 'react-icons/fa'; // Import React Icons
import 'bootstrap/dist/css/bootstrap.min.css';

const CreateBlog = () => {
    const [title, setTitle] = useState('');
    const [contentList, setContentList] = useState(['']); // Multiple content sections
    const [author, setAuthor] = useState('');
    const [tagsList, setTagsList] = useState(['']); // Multiple tags

    const [errors, setErrors] = useState({
        title: '',
        contentList: [],
        author: '',
        tagsList: []
    });

    // Validate all fields
    const validateInputs = () => {
        let isValid = true;
        const newErrors = { title: '', contentList: [], author: '', tagsList: [] };

        if (!title) {
            newErrors.title = 'Title is required';
            isValid = false;
        }

        contentList.forEach((content, index) => {
            if (!content) {
                newErrors.contentList[index] = `Content section ${index + 1} is required`;
                isValid = false;
            }
        });

        if (!author) {
            newErrors.author = 'Author name is required';
            isValid = false;
        }

        tagsList.forEach((tag, index) => {
            if (!tag) {
                newErrors.tagsList[index] = `Tag ${index + 1} is required`;
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate inputs
        if (!validateInputs()) {
            return;
        }

        const blogData = {
            title,
            content: contentList,
            author,
            tags: tagsList.filter(tag => tag !== '') // Remove empty tags
        };

        try {
            const response = await axios.post('http://localhost:5000/blogs/create', blogData);
            alert('Blog created successfully!');
            setTitle('');
            setContentList(['']);
            setAuthor('');
            setTagsList(['']);
            setErrors({ title: '', contentList: [], author: '', tagsList: [] });
        } catch (err) {
            console.error(err);
            alert('Failed to create blog.');
        }
    };

    // Handle adding a new content section
    const addContentField = () => {
        setContentList([...contentList, '']);
        setErrors({ ...errors, contentList: [...errors.contentList, ''] });
    };

    // Handle removing a content section
    const removeContentField = (index) => {
        const updatedContentList = contentList.filter((_, i) => i !== index);
        setContentList(updatedContentList);

        const updatedErrors = errors.contentList.filter((_, i) => i !== index);
        setErrors({ ...errors, contentList: updatedErrors });
    };

    // Handle changing content
    const handleContentChange = (value, index) => {
        const updatedContentList = [...contentList];
        updatedContentList[index] = value;
        setContentList(updatedContentList);
        
        const updatedErrors = [...errors.contentList];
        updatedErrors[index] = value ? '' : `Content section ${index + 1} is required`;
        setErrors({ ...errors, contentList: updatedErrors });
    };

    // Handle adding a new tag
    const addTagField = () => {
        setTagsList([...tagsList, '']);
        setErrors({ ...errors, tagsList: [...errors.tagsList, ''] });
    };

    // Handle removing a tag
    const removeTagField = (index) => {
        const updatedTagsList = tagsList.filter((_, i) => i !== index);
        setTagsList(updatedTagsList);

        const updatedErrors = errors.tagsList.filter((_, i) => i !== index);
        setErrors({ ...errors, tagsList: updatedErrors });
    };

    // Handle changing tag
    const handleTagChange = (value, index) => {
        const updatedTagsList = [...tagsList];
        updatedTagsList[index] = value;
        setTagsList(updatedTagsList);

        const updatedErrors = [...errors.tagsList];
        updatedErrors[index] = value ? '' : `Tag ${index + 1} is required`;
        setErrors({ ...errors, tagsList: updatedErrors });
    };

    return (
        <div className="container mt-5 col-6" style={{ backgroundColor: '#ffcc66', padding: '30px', borderRadius: '10px' }}>
            <h2 className="text-center mb-4" style={{ color: '#ff6600' }}>
                <FaPen /> Create a New Blog
            </h2>
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
                            {errors.contentList[index] && <div className="text-danger">{errors.contentList[index]}</div>}
                        </div>
                    ))}
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
                            {errors.tagsList[index] && <div className="text-danger">{errors.tagsList[index]}</div>}
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
                        <FaPlus /> Create Blog
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateBlog;
