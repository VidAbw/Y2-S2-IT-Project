const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: [{
    type: String,
    required: true,
  }],
  author: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  viewCount: {
    type: Number,
    default: 0, 
  },
  tags: [{
    type: String,
  }]
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
