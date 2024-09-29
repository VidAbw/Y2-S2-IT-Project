const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  tableNumber: {
    type: Number,
    required: true
  },
  reservationDate: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  }, 
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Reservation = mongoose.model('Reservation', reservationSchema);
module.exports = Reservation;
