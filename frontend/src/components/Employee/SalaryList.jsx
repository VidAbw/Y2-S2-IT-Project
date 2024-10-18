import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faClock, faDollarSign } from '@fortawesome/free-solid-svg-icons';

const SalaryList = () => {
    const [salaries, setSalaries] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteId, setDeleteId] = useState(null);
    const [month, setMonth] = useState(new Date().getMonth() + 1); // Default to current month
    const [totalOT, setTotalOT] = useState(0);
    const [totalSalary, setTotalSalary] = useState(0);
    const [message, setMessage] = useState(''); // Message for no data found
    const navigate = useNavigate();

    useEffect(() => {
        fetchSalaries(month);
    }, [month]);

    const fetchSalaries = async (selectedMonth) => {
        try {
            const res = await axios.get(`http://localhost:5000/salaries/month/${selectedMonth}`);
            setSalaries(res.data);

            // Calculate total OT and total salary
            const totalOTSum = res.data.reduce((sum, salary) => sum + salary.ot, 0);
            const totalSalarySum = res.data.reduce((sum, salary) => sum + salary.salary, 0);

            setTotalOT(totalOTSum);
            setTotalSalary(totalSalarySum);
            setMessage(''); // Clear any previous message
        } catch (error) {
            if (error.response && error.response.status === 404) {
                // No salaries found for the selected month
                setSalaries([]);
                setMessage('No salaries found for this month.');
            } else {
                console.error('Error fetching salaries:', error);
                setMessage('An error occurred while fetching salaries.');
            }
        }
    };

    const filteredSalaries = salaries.filter((salary) =>
        salary.emp_id.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        salary.emp_id.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        salary.emp_id.lastname.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const deleteSalary = async () => {
        try {
            await axios.delete(`http://localhost:5000/salaries/delete/${deleteId}`);
            fetchSalaries(month);
            setDeleteId(null);
        } catch (error) {
            console.error('Error deleting salary:', error);
        }
    };

    // Generate PDF report
    // Generate PDF report with filtered details
const generatePDF = () => {
    const doc = new jsPDF();
    doc.text(`Salary List - Month: ${month}`, 20, 10);

    // Table headers
    const headers = [['ID', 'Employee', 'Salary', 'OT', 'Month']];

    // Use the filteredSalaries array instead of salaries to apply the search filter
    const data = filteredSalaries.map(salary => [
        salary.emp_id.employee_id,
        `${salary.emp_id.firstname} ${salary.emp_id.lastname}`,
        salary.salary,
        salary.ot,
        salary.month
    ]);

    // Generate the table in the PDF
    doc.autoTable({
        head: headers,
        body: data,
        startY: 20 // Starting y position for the table
    });

    // Save the generated PDF with month and search term if applicable
    doc.save(`salary_report_month_${month}_search_${searchTerm || 'all'}.pdf`);
};


    const handleMonthChange = (direction) => {
        if (direction === 'previous') {
            setMonth(month === 1 ? 12 : month - 1);
        } else {
            setMonth(month === 12 ? 1 : month + 1);
        }
    };

    return (
        <div className="container mt-5 p-4 shadow-lg rounded bg-white">
            <h1 className="text-center mb-4">Salary List</h1>

            {/* Month Navigation and Insights */}
            <div className="row mb-3 justify-content-between">
                <div className="col-md-4">
                    <button className="btn btn-primary" onClick={() => handleMonthChange('previous')}>
                        Previous Month
                    </button>
                </div>
                <div className="col-md-4 text-center">
                    <h4 className="text-primary mb-3">
                        <FontAwesomeIcon icon={faCalendarAlt} className="me-2" /> Insights for Month: {month}
                    </h4>
                    <div className="mb-3">
                        <p className="fs-5 text-success">
                            <FontAwesomeIcon icon={faClock} className="me-2" /> Total OT Hours: {totalOT.toFixed(2)}
                        </p>
                        <p className="fs-5 text-danger">
                            <FontAwesomeIcon icon={faDollarSign} className="me-2" /> Total Salary: {totalSalary.toFixed(2)}
                        </p>
                    </div>
                </div>
                <div className="col-md-4 text-end">
                    <button className="btn btn-primary" onClick={() => handleMonthChange('next')}>
                        Next Month
                    </button>
                </div>
            </div>

            {/* Search and Report Section */}
            <div className="row mb-3">
                <div className="col-md-8 mb-2">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by ID, Name, or Email"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="col-md-4 text-end">
                    <button className="btn btn-warning" onClick={generatePDF}>
                        Generate Report
                    </button>
                    <button className="btn btn-primary mx-2" onClick={() => navigate('/employee/salary/create')}>
                        Add Salary +
                    </button>
                </div>
            </div>

            {/* Salary Table or No Data Message */}
            {message ? (
                <div className="alert alert-warning text-center" role="alert">
                    {message}
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-bordered table-hover text-center">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Employee</th>
                                <th>Salary</th>
                                <th>OT</th>
                                <th>Month</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSalaries.map((salary) => (
                                <tr key={salary._id} className="align-middle">
                                    <td>{salary.emp_id.employee_id}</td>
                                    <td>{`${salary.emp_id.firstname} ${salary.emp_id.lastname}`}</td>
                                    <td>{salary.salary}</td>
                                    <td>{salary.ot}</td>
                                    <td>{salary.month}</td>
                                    <td>
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => navigate(`/employee/salary/update/${salary._id}`)}
                                        >
                                            Update
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => setDeleteId(salary._id)}
                                            data-bs-toggle="modal"
                                            data-bs-target="#deleteModal"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <div className="modal fade" id="deleteModal" tabIndex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="deleteModalLabel">Confirm Deletion</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Are you sure you want to delete this salary?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => {
                                    deleteSalary(); // Call delete function on confirmation
                                    document.querySelector('#deleteModal .btn-close').click(); // Close modal manually
                                }}
                            >
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalaryList;
