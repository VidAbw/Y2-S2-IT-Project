const reservationService = require('./service');

// Create a new reservation
const createReservation = async (req, res) => {
  try {
    const newReservation = await reservationService.createReservation(req.body);
    res.status(201).json(newReservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Check availability of tables
const checkAvailability = async (req, res) => {
  try {
    const availableTables = await reservationService.checkAvailability(req.body);
    res.status(200).json(availableTables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all reservations by date
const getAllReservationsByDate = async (req, res) => {
  try {
    const reservations = await reservationService.getAllReservationsByDate(req.query.date);
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all reservations for a specific user
const getUserReservations = async (req, res) => {
  try {
    const reservations = await reservationService.getUserReservations(req.params.userId);
    res.status(200).json(reservations);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Cancel a reservation by ID
const cancelReservation = async (req, res) => {
  try {
    await reservationService.cancelReservation(req.params.id);
    res.status(200).json({ message: `Reservation with id ${req.params.id} canceled` });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Get a reservation by ID
const getReservationById = async (req, res) => {
  try {
    const reservation = await reservationService.getReservationById(req.params.id);
    res.status(200).json(reservation);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Update a reservation by ID
const updateReservation = async (req, res) => {
  try {
    const updatedReservation = await reservationService.updateReservation(req.params.id, req.body);
    res.status(200).json(updatedReservation);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  createReservation,
  checkAvailability,
  getAllReservationsByDate,
  getUserReservations,
  cancelReservation,
  getReservationById,
  updateReservation
};
