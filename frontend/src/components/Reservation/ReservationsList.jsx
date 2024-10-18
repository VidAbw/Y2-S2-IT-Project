import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faSearch, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ReservationsList.css';

const ReservationsList = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [reservationToDelete, setReservationToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchReservations = async (date) => {
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await axios.get(`http://localhost:5000/api/v1/reservations/getAll`, { params: { date } });

      if (response.data && response.data.length > 0) {
        setReservations(response.data);
        setFilteredReservations(response.data);
      } else {
        setReservations([]);
        setFilteredReservations([]);
      }
    } catch (error) {
      setErrorMessage('Failed to fetch reservations. Please try again.');
    }
    setLoading(false);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      setFilteredReservations(reservations);
    } else {
      const filtered = reservations.filter((res) =>
        res.tableNumber.toString().includes(term) ||
        res.startTime.includes(term) ||
        res.endTime.includes(term)
      );
      setFilteredReservations(filtered);
    }
  };

  const generateReport = () => {
    if (filteredReservations.length === 0) {
      setErrorMessage('No reservations available to generate a report.');
      return;
    }
  
    const doc = new jsPDF();
    const marginTop = 30;
  
    // Format the selectedDate for the report
    const formattedDate = new Date(selectedDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  
    // Add report title and generation date
    doc.text(`Reservations Report for ${formattedDate}`, 14, 16);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 24);
  
    // Generate the table
    doc.autoTable({
      margin: { top: marginTop },
      head: [['Table Number', 'Reservation Date', 'Start Time', 'End Time', 'User ID']],
      body: filteredReservations.map(res => [
        res.tableNumber,
        // Format reservationDate as a readable date
        new Date(res.reservationDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        // Use startTime and endTime directly (assuming they are valid time strings)
        res.startTime,  // No need to convert to Date
        res.endTime,    // No need to convert to Date
        res.userId,
      ]),
    });
  
    // Save the generated PDF
    doc.save('reservations_report.pdf');
  };
  
  

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/reservations/deleteById/${id}`);
      setSuccessMessage('Reservation deleted successfully!'); // Set success message
      fetchReservations(selectedDate); // Refresh the reservations list after deletion
      
      // Optional: Clear the success message after 2 seconds
      setTimeout(() => {
          setSuccessMessage('');
      }, 2000);
    } catch (error) {
      setErrorMessage('Failed to delete the reservation.');
    }
    setReservationToDelete(null);
  };

  useEffect(() => {
    if (selectedDate) {
      fetchReservations(selectedDate);
    }
  }, [selectedDate]);

  return (

    
      <div className="container reservations-container my-4 p-4">
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


        <h2 className="mb-4 text-center" style={{ color: '#FFA500' }}>
          <FontAwesomeIcon icon={faCalendarAlt} /> Reservations List
        </h2>

        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

        <div className="form-group mb-3">
          <label style={{ color: '#FFA500' }}>Select Date:</label>
          <input
            type="date"
            className="form-control"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <div className="input-group mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by table number, start time, or end time"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <div className="input-group-append">
            <button className="btn btn-warning" style={{ backgroundColor: '#FFA500' }}>
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
        </div>

        <button className="btn btn-warning mb-3" style={{ backgroundColor: '#ffdab9' }} onClick={generateReport}>
          Generate Report
        </button>

        {loading ? (
          <p>Loading reservations...</p>
        ) : filteredReservations.length > 0 ? (
          <table className="table table-bordered">
            <thead className="thead-light">
              <tr>
                <th scope="col">Table Number</th>
                <th scope="col">User</th>
                <th scope="col">Reservation Date</th>
                <th scope="col">Start Time</th>
                <th scope="col">End Time</th>
                {/* numberOfGuests */}
                {/* <th scope="col">Number of Guests</th>  */}
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.map((reservation) => (
                <tr key={reservation._id}>
                  <td>{reservation.tableNumber}</td>
                  <td>{reservation.userId}</td>
                  <td>{new Date(reservation.reservationDate).toLocaleDateString()}</td>
                  <td>{reservation.startTime}</td>
                  <td>{reservation.endTime}</td>
                  
                  {/* <td>{reservation.numberOfGuests}</td> */}
                  <td>
                    <button
                      className="btn btn-sm btn-info mr-2"
                      onClick={() => navigate(`/reservations/update/${reservation._id}`)}
                    >
                      <FontAwesomeIcon icon={faEdit} /> Update
                    </button>
                    <button
                      className="btn btn-sm btn-danger mx-2"
                      onClick={() => setReservationToDelete(reservation._id)}
                    >
                      <FontAwesomeIcon icon={faTrashAlt} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No reservations found for this date.</p>
        )}

        {reservationToDelete && (
          <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Deletion</h5>
                </div>
                <div className="modal-body">Are you sure you want to delete this reservation?</div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setReservationToDelete(null)}>
                    Cancel
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(reservationToDelete)}>
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
          
        )}
      </div>
    
    </div>
  );
};

export default ReservationsList;
