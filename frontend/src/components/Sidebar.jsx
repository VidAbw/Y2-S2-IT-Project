import React from 'react';
import { FaUsers, FaClipboardList, FaUtensils, FaFileAlt, FaMoneyBillWave, FaUserTie } from 'react-icons/fa'; // React Icons
import './Sidebar.css';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ component: Component }) => {
    const navigate = useNavigate();

    return (
        <>
            <div className="d-flex">
                {/* Sidebar */}
                <nav className="sidebar bg-dark text-white p-3">
                    <h4>Admin Panel</h4>
                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <a
                                className="nav-link text-white"
                                href="#"
                                onClick={() => navigate('/feedbacks')}
                            >
                                <FaUsers className="me-2" /> Feedback Management
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className="nav-link text-white"
                                href="#"
                                onClick={() => navigate('/manage-complaints')}
                            >
                                <FaClipboardList className="me-2" /> Manage Complaints
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className="nav-link text-white"
                                href="#"
                                onClick={() => navigate('/reservation-list')}
                            >
                                <FaUtensils className="me-2" /> Manage Reservations
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className="nav-link text-white"
                                href="#"
                                onClick={() => navigate('/blogs-manager')}
                            >
                                <FaFileAlt className="me-2" /> Blogs Manager
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className="nav-link text-white"
                                href="#"
                                onClick={() => navigate('/employee-salary')}
                            >
                                <FaMoneyBillWave className="me-2" /> Salary Management
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className="nav-link text-white"
                                href="#"
                                onClick={() => navigate('/employees')}
                            >
                                <FaUserTie className="me-2" /> Employee Management
                            </a>
                        </li>
                    </ul>
                </nav>

                {/* Main Content */}
                <div className="flex-grow-1 p-3">
                    <Component /> {/* Directly render the passed component */}
                </div>
            </div>
        </>
    );
};

export default Sidebar;
