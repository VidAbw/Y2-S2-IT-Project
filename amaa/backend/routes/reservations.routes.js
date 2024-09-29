const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation'); 

// Route to make a reservation
router.post('/', async (req, res) => {
  try {
    const { userId, tableNumber, reservationDate, startTime, endTime, } = req.body;

    const reservation = new Reservation({
      userId,
      tableNumber,
      reservationDate,
      startTime,
      endTime
    });

    await reservation.save();
    res.status(201).json(reservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.post('/check-availability', async (req, res) => {
    const { reservationDate, startTime, endTime } = req.body;
  
    if (!reservationDate || !startTime || !endTime) {
      return res.status(400).json({ message: 'Please provide reservation date, start time, and end time.' });
    }
  
    try {
      const reservedTables = await Reservation.find({
        reservationDate: reservationDate,
        $or: [
          { startTime: { $lte: startTime }, endTime: { $gte: startTime } },
          { startTime: { $lte: endTime }, endTime: { $gte: endTime } },
          { startTime: { $gte: startTime }, endTime: { $lte: endTime } }
        ]
      });
  
      const reservedTableNumbers = reservedTables.map(reservation => reservation.tableNumber);
  
      res.status(200).json(reservedTableNumbers);
    } catch (error) {
      console.error('Error checking availability:', error);
      res.status(500).json({ message: 'Server error. Please try again later.' });
    }
  });

  router.get('/getAll', async (req, res) => {
    try {
      const { date } = req.query; // Get the date from the query parameters
  
      if (!date) {
        return res.status(400).json({ message: 'Date is required' });
      }
  
      const reservations = await Reservation.find({
        reservationDate: {
          $eq: new Date(date) 
        }
      });
  
      res.status(200).json(reservations.length ? reservations : []);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  

// Route to get all reservations for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const reservations = await Reservation.find({ userId });
    res.status(200).json(reservations);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route to cancel a reservation
router.delete('/deleteById/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findByIdAndDelete(id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    res.status(200).json({ message: 'Reservation canceled' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route to get all reservations
router.get('/', async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.status(200).json(reservations);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route to get a reservation by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findById(id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    res.status(200).json(reservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route to update a reservation
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { tableNumber, reservationDate, startTime, endTime } = req.body;

    const conflictingReservation = await Reservation.findOne({
      _id: { $ne: id }, 
      tableNumber,
      reservationDate: new Date(reservationDate), 
      $or: [
        {
          // Check if the new start time is within an existing reservation
          startTime: { $lte: endTime },
          endTime: { $gte: startTime }
        }
      ]
    });

    // If conflicting reservation exists, send a special response
    if (conflictingReservation) {
      return res.status(409).json({ message: 'Table is unavailable for the selected date and time' });
    }

    // Proceed with the update if no conflict is found
    const updatedReservation = await Reservation.findByIdAndUpdate(id, {
      tableNumber,
      reservationDate,
      startTime,
      endTime
    }, { new: true });

    if (!updatedReservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    res.status(200).json(updatedReservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
