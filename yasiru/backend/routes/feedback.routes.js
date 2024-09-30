const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// Create a new feedback
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, rating, feedbackText } = req.body;
    const newFeedback = new Feedback({
      firstName,
      lastName,
      email,
      rating,
      feedbackText
    });
    await newFeedback.save();
    res.status(201).json(newFeedback);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all feedbacks
router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get feedback by ID
router.get('/:id', async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update feedback by ID
router.put('/:id', async (req, res) => {
  try {
    const { firstName, lastName, email, rating, feedbackText } = req.body;
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, email, rating, feedbackText },
      { new: true } // Return the updated document
    );

    if (!updatedFeedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    res.status(200).json(updatedFeedback);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete feedback by ID
router.delete('/:id', async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    res.status(200).json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
