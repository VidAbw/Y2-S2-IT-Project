import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaUtensils, FaToilet } from 'react-icons/fa';
import { faUtensils, faConciergeBell } from '@fortawesome/free-solid-svg-icons';
import { FaCashRegister } from "react-icons/fa";
import { FaDoorOpen } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const CreateReservation = () => {
  const [reservationDate, setReservationDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [unavailableTables, setUnavailableTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isTableSelectionVisible, setIsTableSelectionVisible] = useState(false);
  const navigate = useNavigate();
  const userId = 1;
  const themeColor = '#FF6500';

  const isValidTime = () => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    return startHour < endHour || (startHour === endHour && startMinute < endMinute);
  };

  const checkAvailability = async () => {
    if (!isValidTime()) {
      setErrorMessage('Start time cannot be later than end time.');
      return;
    }
    if (!reservationDate || !startTime || !endTime) {
      setErrorMessage('Please select a date, start time, and end time.');
      return;
    }

    setIsChecking(true);
    setErrorMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/v1/reservations/check-availability', {
        reservationDate,
        startTime,
        endTime,
      });
      setUnavailableTables(response.data); // Store unavailable tables
      setIsTableSelectionVisible(true); // Show table selection after checking availability
    } catch (error) {
      console.error('Error checking availability:', error);
      setErrorMessage('Error checking table availability. Please try again.');
      setIsTableSelectionVisible(false); // Hide table selection if there's an error
    }

    setIsChecking(false);
  };

  const handleTableClick = (table) => {
    if (!unavailableTables.includes(table)) {
      setSelectedTable(table);
    }
  };

  const handleReservationSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/v1/reservations', {
        userId,
        tableNumber: selectedTable,
        reservationDate,
        startTime,
        endTime,
      });
      console.log('Reservation successful:', response.data);
      setShowModal(false);
      setErrorMessage(''); // Clear error message on successful submission
      navigate('/user/reservation');
    } catch (error) {
      console.error('Error submitting reservation:', error);
    }
  };

  return (

    <div className="container mt-4">
    <div
  className="shadow-box" // Add this class for shadow effect
  style={{
    padding: '20px', // Add padding for spacing
    borderRadius: '8px', // Round corners
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)', // Shadow effect
    backgroundColor: '#fff', // Background color
    borderBottom: '2px solid #007bff', // Bottom border (change color as needed)
    marginBottom: '30px',
  }}
>
    
      
      <div className="container">
          <div className="col-12 mt-2">
            <div className="row d-flex justify-content-end">
              <Link to="/user/reservation" className="col-2 btn btn-warning text-light">
                My Reservations
              </Link>
            </div>
          </div>

          <h2 className="my-4">Create Reservation</h2>

                    {/* Restaurant Layout Guide */}
                    <div className="container my-5">
            <h2 className="text-center mb-4" style={{ color: themeColor }}>
              How to Select Your Table for Reservation
            </h2>
            <div className="row justify-content-center">
              <div className="col-8">
                <div className="card p-4" style={{ borderColor: themeColor, borderWidth: '2px' }}>
                  <h4 className="text-center mb-4" style={{ color: themeColor }}>
                    Restaurant Layout Guide
                  </h4>
                  <p>
                    Welcome to our restaurant's online reservation system! Below is a simple guide to help you navigate and choose a table for your reservation.
                  </p>
                  <p>
                    You will see a visual layout of the restaurant, with tables represented by icons. Simply click on an available table (not marked as unavailable) to select it for your reservation.
                  </p>

                  {/* Icons */}
                  <div className="d-flex justify-content-around mt-4">
                    <div className="icon-section d-flex flex-column align-items-center">
                      <FaDoorOpen size={40} color={themeColor} />
                      <p>Entrance</p>
                    </div>
                    <div className="icon-section d-flex flex-column align-items-center">
                      <FaCashRegister size={40} color={themeColor} />
                      <p>Cashier</p>
                    </div>
                    <div className="icon-section d-flex flex-column align-items-center">
                      <FaToilet size={40} color={themeColor} />
                      <p>Washroom</p>
                    </div>
                  </div>

                  <h5 className="mt-5" style={{ color: themeColor }}>
                    Table Icons
                  </h5>
                  <ul>
                    <li>
                      <FontAwesomeIcon icon={faUtensils} color={themeColor} /> – <b>Available Table</b>: Free for reservation.
                    </li>
                    <li>
                      <FontAwesomeIcon icon={faConciergeBell} color="grey" /> – <b>Unavailable Table</b>: Already reserved.
                    </li>
                  </ul>

                  <p className="mt-4">
                    Once you select a table, confirm your reservation by clicking the "Confirm Reservation" button.
                  </p>

                  <div className="text-center mt-5">
                    <button
                      className="btn btn-primary"
                      style={{ backgroundColor: themeColor, borderColor: themeColor }}
                      onClick={() => setIsTableSelectionVisible(!isTableSelectionVisible)} // Toggle table selection visibility
                    >
                      Start Selecting Your Table
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>



          {/* Date and Time Selection */}
          <div>
            <div className="row mb-3">
              <div className="col-md-4 form-group">
                <label>Reservation Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={reservationDate}
                  onChange={(e) => setReservationDate(e.target.value)}
                />
              </div>
              <div className="col-md-4 form-group">
                <label>Start Time</label>
                <input
                  type="time"
                  className="form-control"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className="col-md-4 form-group">
                <label>End Time</label>
                <input
                  type="time"
                  className="form-control"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>

            {errorMessage && <div className="alert alert-danger mb-3">{errorMessage}</div>}

            <div className="text-center">
              <button className="btn btn-primary" onClick={checkAvailability} disabled={isChecking}>
                {isChecking ? 'Checking...' : 'Check Availability'}
              </button>
            </div>

            {/* Table Selection */}
            {isTableSelectionVisible && (
              <div className="restaurant-layout my-4">
                <div className="row">
                  <div className="col-9">
                    <div className="row">
                      {[...Array(20).keys()].map((i) => {
                        const table = i + 1;
                        const marginRight = table % 4 === 0 ? '50px' : '15px'; // Space after every 4th table
                        return (
                          <div key={table} className="col-auto mb-4" style={{ marginRight }}>
                            <div
                              className={`table-item d-flex justify-content-center align-items-center ${
                                unavailableTables.includes(table) ? 'unavailable' : 'available'
                              } ${selectedTable === table ? 'selected' : ''}`}
                              onClick={() => handleTableClick(table)}
                              style={{
                                width: '80px',
                                height: '80px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                backgroundColor: selectedTable === table ? '#ffe6cc' : '#f0f0f0',
                                cursor: unavailableTables.includes(table) ? 'not-allowed' : 'pointer',
                              }}
                            >
                              <FontAwesomeIcon
                                icon={unavailableTables.includes(table) ? faConciergeBell : faUtensils}
                                style={{
                                  color: unavailableTables.includes(table) ? '#d9534f' : '#5bc0de',
                                  fontSize: '24px',
                                }}
                              />
                            </div>
                            <p className="text-center mt-1">{table}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Cashier and Washroom Section */}
                  <div className="col-3 d-flex justify-content-end">
                    <div className="container mt-4">
                      <div className="row">
                        <div className="col-12 d-flex justify-content-center mb-4">
                          <div className="kitchen p-4 text-white text-center rounded" style={{ backgroundColor: '#ff6f61', width: '200px', height: '150px' }}>
                            <FaCashRegister size={35} />
                            <h4 className="mt-3">Cashier</h4>
                          </div>
                        </div>
                        <div className="col-12 d-flex justify-content-center mb-4">
                          <div className="washroom p-4 text-white text-center rounded" style={{ backgroundColor: '#7dcea0', width: '200px', height: '200px' }}>
                            <FaToilet size={35} />
                            <h4 className="mt-3">Washroom</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Selected Table Info */}
          {selectedTable && <div className="alert alert-success">You have selected table number: {selectedTable}</div>}


                {/* Confirm Reservation Button */}
                <div className="text-center mt-4">
                  <button className="btn btn-primary" style={{ backgroundColor: themeColor }} onClick={() => setShowModal(true)}>
                    Confirm Reservation
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className={`modal ${showModal ? 'd-block' : 'd-none'}`} tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Reservation</h5>
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to reserve table number {selectedTable}?</p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="button" className="btn btn-primary" onClick={handleReservationSubmit}>
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
        </div>
   
  );
};

export default CreateReservation;
