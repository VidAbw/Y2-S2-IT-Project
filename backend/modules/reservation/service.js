const { ReservationModel } = require('./model');

// Create a new reservation
const createReservation = async (reservationData) => {
  try {
    const newReservation = new ReservationModel(reservationData);
    return await newReservation.save();
  } catch (error) {
    throw new Error("Error creating reservation: " + error.message);
  }
};

// Check availability of tables
const checkAvailability = async ({ reservationDate, startTime, endTime }) => {
  try {
    const reservedTables = await ReservationModel.find({
      reservationDate,
      $or: [
        { startTime: { $lte: startTime }, endTime: { $gte: startTime } },
        { startTime: { $lte: endTime }, endTime: { $gte: endTime } },
        { startTime: { $gte: startTime }, endTime: { $lte: endTime } }
      ]
    });
    return reservedTables.map(reservation => reservation.tableNumber);
  } catch (error) {
    throw new Error("Error checking availability: " + error.message);
  }
};

// Get all reservations by date
const getAllReservationsByDate = async (date) => {
  try {
    return await ReservationModel.find({
      reservationDate: new Date(date)
    });
  } catch (error) {
    throw new Error("Error retrieving reservations: " + error.message);
  }
};

// Get reservations for a specific user
const getUserReservations = async (userId) => {
  try {
    return await ReservationModel.find({ userId });
  } catch (error) {
    throw new Error("Error retrieving reservations for user: " + error.message);
  }
};

// Cancel a reservation
const cancelReservation = async (id) => {
  try {
    const canceledReservation = await ReservationModel.findByIdAndDelete(id);
    if (!canceledReservation) {
      throw new Error(`Reservation with id ${id} not found`);
    }
    return canceledReservation;
  } catch (error) {
    throw new Error("Error canceling reservation: " + error.message);
  }
};

// Get reservation by ID
const getReservationById = async (id) => {
  try {
    const reservation = await ReservationModel.findById(id);
    if (!reservation) {
      throw new Error(`Reservation with id ${id} not found`);
    }
    return reservation;
  } catch (error) {
    throw new Error("Error retrieving reservation: " + error.message);
  }
};

// Update reservation by ID
const updateReservation = async (id, updateData) => {
  try {
    const conflictingReservation = await ReservationModel.findOne({
      _id: { $ne: id },
      tableNumber: updateData.tableNumber,
      reservationDate: new Date(updateData.reservationDate),
      $or: [
        { startTime: { $lte: updateData.endTime }, endTime: { $gte: updateData.startTime } }
      ]
    });

    if (conflictingReservation) {
      throw new Error("Table is unavailable for the selected date and time");
    }

    const updatedReservation = await ReservationModel.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedReservation) {
      throw new Error(`Reservation with id ${id} not found`);
    }

    return updatedReservation;
  } catch (error) {
    throw new Error("Error updating reservation: " + error.message);
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
