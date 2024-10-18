const express = require('express');
const reservationController = require('./controller.js'); 

const router = express.Router();

// @route   POST /api/v1/reservations
// @desc    Create a new reservation
router.post('/', reservationController.createReservation);

// @route   POST /api/v1/reservations/check-availability
// @desc    Check table availability
router.post('/check-availability', reservationController.checkAvailability);

// @route   GET /api/v1/reservations/date
// @desc    Get all reservations for a specific date
router.get('/getAll', reservationController.getAllReservationsByDate);

// @route   GET /api/v1/reservations/user/:userId
// @desc    Get all reservations for a specific user
router.get('/user/:userId', reservationController.getUserReservations);

// @route   DELETE /api/v1/reservations/:id
// @desc    Cancel a reservation
router.delete('/deleteById/:id', reservationController.cancelReservation);

// @route   GET /api/v1/reservations/:id
// @desc    Get a reservation by ID
router.get('/:id', reservationController.getReservationById);

// @route   PUT /api/v1/reservations/:id
// @desc    Update a reservation
router.put('/:id', reservationController.updateReservation);

module.exports = router;
