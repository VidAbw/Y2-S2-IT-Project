const express = require('express');
const Blog = require('../models/Blog');
const router = express.Router();

// Create a new blog
router.post('/create', async (req, res) => {
  try {
    const newBlog = new Blog(req.body);
    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(400).json({ message: 'Error creating blog', error });
  }
});

// Get all blogs
router.get('/getAll', async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blogs', error });
  }
});

// Get a blog by ID
router.get('/getById/:id', async (req, res) => {
    try {
      const blog = await Blog.findById(req.params.id);
  
      if (blog) {
        res.status(200).json(blog);
      } else {
        res.status(404).json({ message: 'Blog not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching blog', error });
    }
  });
  

// Update a blog by ID
router.put('/updateById/:id', async (req, res) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (updatedBlog) {
      res.status(200).json(updatedBlog);
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating blog', error });
  }
});

router.put('/updateById/:id', async (req, res) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (updatedBlog) {
      res.status(200).json(updatedBlog);
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating blog', error });
  }
});


router.put('/updateViewCount/:id', async (req, res) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { viewCount: 1 } },
      { new: true } 
    );

    if (updatedBlog) {
      res.status(200).json(updatedBlog);
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating view count', error });
  }
});



// Delete a blog by ID
router.delete('/deleteById/:id', async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (deletedBlog) {
      res.status(200).json({ message: 'Blog deleted successfully' });
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting blog', error });
  }
});

module.exports = router;
