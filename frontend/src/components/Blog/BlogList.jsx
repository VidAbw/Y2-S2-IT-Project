import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaSearch, FaFilePdf } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlog, setSelectedBlog] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/blogs/getAll');
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/blogs/deleteById/${id}`);
      fetchBlogs(); // Refresh the blog list after deletion
    } catch (error) {
      console.error('Error deleting blog', error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Blog Report', 14, 16);
    doc.autoTable({
      startY: 20,
      head: [['ID', 'Title', 'Author', 'Created Date', 'View Count']],
      body: filteredBlogs.map((blog) => [
        blog._id,
        blog.title,
        blog.author,
        new Date(blog.createdDate).toLocaleDateString(),
        blog.viewCount,
      ]),
    });
    doc.save('blogs_report.pdf');
  };

  return (
    <div className="container mt-5" style={{ backgroundColor: '#ffcc66', padding: '20px', borderRadius: '10px' }}>
      <h2 className="text-center mb-4" style={{ color: '#ff6600' }}>
        Blog List
      </h2>

      {/* Search Bar */}
      <div className="input-group mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search blogs by title..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <span className="input-group-text" style={{ backgroundColor: '#ff9900', color: 'white' }}>
          <FaSearch />
        </span>
      </div>

      {/* PDF Report Generation */}
      <div className="mb-4 text-end">
        <button className="btn btn-danger" onClick={generatePDF}>
          <FaFilePdf /> Generate Report
        </button>
        <button className="btn btn-primary mx-2" onClick={() => navigate(`/create-blog`)}>
          <FaFilePdf /> Add Blog +
        </button>
      </div>

      {/* Blog Table */}
      <table className="table table-striped">
        <thead style={{ backgroundColor: '#ff9900', color: 'white' }}>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Author</th>
            <th>Created Date</th>
            <th>View Count</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBlogs.map((blog) => (
            <tr key={blog._id}>
              <td>{blog._id}</td>
              <td>{blog.title}</td>
              <td>{blog.author}</td>
              <td>{new Date(blog.createdDate).toLocaleDateString()}</td>
              <td>{blog.viewCount}</td>
              <td>
                <button
                  className="btn btn-primary me-2"
                  onClick={() => navigate(`/blog/update/${blog._id}`)}
                >
                  <FaEdit /> Update
                </button>
                <button
                  className="btn btn-danger"
                  data-bs-toggle="modal"
                  data-bs-target="#deleteModal"
                  onClick={() => setSelectedBlog(blog._id)}
                >
                  <FaTrash /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Confirmation Modal */}
      <div
        className="modal fade"
        id="deleteModal"
        tabIndex="-1"
        aria-labelledby="deleteModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="deleteModalLabel">Confirm Deletion</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              Are you sure you want to delete this blog?
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
                onClick={() => handleDelete(selectedBlog)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogList;
