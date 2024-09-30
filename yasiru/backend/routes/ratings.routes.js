const express = require('express');
const router = express.Router();
const Rating = require('../models/Rating'); // Import the Rating model

router.post('/', async (req, res) => {
  try {
    const { productID, userID, rating, review } = req.body;
    const newRating = new Rating({ productID, userID, rating, review });
    await newRating.save();
    res.status(201).json({ message: 'Rating created successfully!', rating: newRating });
  } catch (err) {
    res.status(500).json({ message: 'Error creating rating', error: err.message });
  }
});

router.get('/product/:productID', async (req, res) => {
  try {
    const productID = req.params.productID;
    const ratings = await Rating.find({ productID });
    res.status(200).json(ratings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching ratings', error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const ratingID = req.params.id;
    const rating = await Rating.findById(ratingID);
    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }
    res.status(200).json(rating);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching rating', error: err.message });
  }
});

// Update a rating by ID (PUT /api/ratings/:id)
router.put('/:id', async (req, res) => {
  try {
    const ratingID = req.params.id;
    const updatedData = req.body; 
    const updatedRating = await Rating.findByIdAndUpdate(ratingID, updatedData, { new: true });
    if (!updatedRating) {
      return res.status(404).json({ message: 'Rating not found' });
    }
    res.status(200).json({ message: 'Rating updated successfully', rating: updatedRating });
  } catch (err) {
    res.status(500).json({ message: 'Error updating rating', error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const ratingID = req.params.id;
    const deletedRating = await Rating.findByIdAndDelete(ratingID);
    if (!deletedRating) {
      return res.status(404).json({ message: 'Rating not found' });
    }
    res.status(200).json({ message: 'Rating deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting rating', error: err.message });
  }
});

module.exports = router;
