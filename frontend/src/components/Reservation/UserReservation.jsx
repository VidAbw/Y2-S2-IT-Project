import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faClock, faTable, faUtensils,faUsers  } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

const UserReservation = () => {
  const [reservations, setReservations] = useState([]);
  const userId = 1; // Hardcoded userId for now
  const [errorMessage, setErrorMessage] = useState('');
  

  useEffect(() => {
    // Fetch the user's reservations from the backend
    const fetchReservations = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/v1/reservations/user/${userId}`);
        setReservations(response.data);
      } catch (error) {
        setErrorMessage('Failed to fetch reservations. Please try again.');
      }
    };

    fetchReservations();
  }, []);

  return (

    <div className="container my-4">
      <div className='col-12 mt-2'>
        <div className="row d-flex justify-content-end">
          <Link to="/reservations/create" className="col-3 btn btn-warning text-light">
            Create Another Reservation +
          </Link>
        </div>
      </div>
      <h2 className="mb-4" >
        <FontAwesomeIcon icon={faUtensils} style={{ color: '#FFA500' }} /> My Reservations
      </h2>

      {/* Display Error Message */}
      {errorMessage && (
        <div className="alert alert-danger">
          {errorMessage}
        </div>
      )}

      {/* Reservations List */}
      <div className="row">
        {reservations.length > 0 ? (
          reservations.map((reservation, index) => (
            <div className="col-md-6 mb-4" key={index}>
              <div className="card shadow-sm">
                <div className="card-body" style={{ backgroundColor: '#fdfdfd', border: '1px solid #FFA500' }}>
                  <h5 className="card-title" style={{ color: '#FFA500' }}>
                    <FontAwesomeIcon icon={faTable} /> Table {reservation.tableNumber}
                  </h5>
                  <p className="card-text text-secondary">
                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" style={{ color: '#FF8C00' }} />{' '}
                    {new Date(reservation.reservationDate).toLocaleDateString()}
                  </p>
                  <p className="card-text text-secondary">
                    <FontAwesomeIcon icon={faClock} className="mr-2" style={{ color: '#FF8C00' }} />{' '}
                    {reservation.startTime} - {reservation.endTime}
                  </p>
                  <p className="card-text text-secondary">
                    <FontAwesomeIcon icon={faUsers } className="mr-2" style={{ color: '#FF8C00' }} />{' '}
                    {reservation.numberOfGuests}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <p className="text-center text-muted">
              No reservations found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserReservation;
