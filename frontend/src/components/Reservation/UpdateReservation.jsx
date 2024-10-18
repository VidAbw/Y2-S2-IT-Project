import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ReservationsList.css';

const UpdateReservation = () => {
    const { id } = useParams(); // Get reservation ID from the URL params
    const navigate = useNavigate();

    const [reservationData, setReservationData] = useState({
        tableNumber: '',
        reservationDate: '',
        startTime: '',
        endTime: '',
        userId: '' // userId is fetched but not editable
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [unavailableMessage, setUnavailableMessage] = useState(''); // For availability check
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState(''); // For showing modal

    // Fetch reservation details on component mount
    useEffect(() => {
        const fetchReservation = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:5000/api/v1/reservations/${id}`);
                const fetchedData = response.data;

                const formattedDate = new Date(fetchedData.reservationDate).toISOString().split('T')[0];

                setReservationData({
                    ...fetchedData,
                    reservationDate: formattedDate,
                });
            } catch (error) {
                setErrorMessage('Failed to load reservation details.');
            }
            setLoading(false);
        };

        fetchReservation();
    }, [id]);


    // Handle form input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setReservationData({ ...reservationData, [name]: value });
    };

    // Function to validate start and end time
    const isValidTime = () => {
        const { startTime, endTime } = reservationData;
        if (startTime && endTime) {
            const start = new Date(`2023-01-01T${startTime}`);
            const end = new Date(`2023-01-01T${endTime}`);
            return start < end;
        }
        return true;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isValidTime()) {
            setErrorMessage('Start time cannot be later than or equal to end time.');
            return;
        }

        setLoading(true);
        try {
            // Send updated reservation data to the backend (excluding userId)
            const response = await axios.put(`http://localhost:5000/api/v1/reservations/${id}`, {
                tableNumber: reservationData.tableNumber,
                reservationDate: reservationData.reservationDate,
                startTime: reservationData.startTime,
                endTime: reservationData.endTime
            });

            // Check for availability in the response
            if (response.data.message === 'Table is unavailable for the selected date and time') {
                setUnavailableMessage(response.data.message);
                setShowModal(true); // Show modal for unavailable message
            } else {
                 
                setSuccessMessage('Reservation updated successfully!');
                setTimeout(() => {
                    navigate('/reservation-list'); // Redirect after a short delay
                    }, 1500); // Wait 2 seconds before navigating
                
            }
        } catch (error) {
            
            setErrorMessage('Failed to update the reservation. Please try again.');
        }
        setLoading(false);
    };

    return (
        
            <div className="container reservations-container my-4 p-4">


                <div
                className="shadow-box" // Add this class for shadow effect
                style={{
                    padding: '30px', // Add padding for spacing
                    borderRadius: '8px', // Round corners
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)', // Shadow effect
                    backgroundColor: '#fff', // Background color
                    borderBottom: '2px solid #007bff', // Bottom border (change color as needed)
                    marginBottom: '30px',
                }}
                >


                {/* Display error messages */}
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                {successMessage && <div className="alert alert-success">{successMessage}</div>}
               
                {loading ? (
                    <p>Loading reservation details...</p>
                ) : (
                    <form onSubmit={handleSubmit} className="p-4 shadow-sm ">
                        <h2 className="text-center mb-4">Update Reservation</h2>

                        {/* Table Number and Reservation Date */}
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Table Number</label>
                                    <select
                                        name="tableNumber"
                                        className="form-control"
                                        value={reservationData.tableNumber}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Table</option>
                                        {[...Array(20).keys()].map((table) => (
                                            <option key={table + 1} value={table + 1}>
                                                {table + 1}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Reservation Date</label>
                                    <input
                                        type="date"
                                        name="reservationDate"
                                        className="form-control"
                                        value={reservationData.reservationDate}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Start Time and End Time */}
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Start Time</label>
                                    <input
                                        type="time"
                                        name="startTime"
                                        className="form-control"
                                        value={reservationData.startTime}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>End Time</label>
                                    <input
                                        type="time"
                                        name="endTime"
                                        className="form-control"
                                        value={reservationData.endTime}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* User ID (read-only) */}
                        <div className="form-group mb-3">
                            <label>User ID</label>
                            <input
                                type="text"
                                name="userId"
                                className="form-control"
                                value={reservationData.userId}
                                readOnly
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="text-center">
                            <button type="submit" className="btn btn-warning text-light px-5" disabled={loading}>
                                {loading ? 'Updating...' : 'Update Reservation'}
                            </button>
                        </div>
                    </form>

                )}

                {/* Unavailable Modal */}
                {showModal && (
                    <div className="modal show" tabIndex="-1" role="dialog">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Table Unavailable</h5>
                                    <button type="button" className="close" onClick={() => setShowModal(false)}>
                                        <span>&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <p>{unavailableMessage}</p>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                        Close
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

export default UpdateReservation;
