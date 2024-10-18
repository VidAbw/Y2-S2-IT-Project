import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteId, setDeleteId] = useState(null);
    const navigate = useNavigate();

    // Fetch all employees
    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const res = await axios.get('http://localhost:5000/employees/getAll');
            setEmployees(res.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const filteredEmployees = employees.filter((employee) =>
        employee.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const deleteEmployee = async () => {
        try {
            await axios.delete(`http://localhost:5000/employees/deleteById/${deleteId}`);
            fetchEmployees();
            setDeleteId(null);
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    };

    // Generate PDF report
    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text('Employee List', 20, 10);
        const headers = [['ID', 'First Name', 'Last Name', 'Email', 'Designation']];
        const data = filteredEmployees.map(emp => [emp.employee_id, emp.firstname, emp.lastname, emp.email, emp.designation]);
        doc.autoTable({
            head: headers,
            body: data
        });
        doc.save('employee_report.pdf');
    };

    return (
        <div className="container mt-5 p-4 shadow-lg rounded bg-white">
             <div className="row mb-3">
                <div className="col-12 text-end">
                    <button className="btn btn-primary mx-2" onClick={() => navigate('/employee/salary')}>
                        Employee Salary
                    </button>
                </div>
            </div>
            
            <h1 className="text-center mb-4">Employee List</h1>

            {/* Search and Report Section */}
            <div className="row mb-3">
                <div className="col-md-6 mb-2">
                    <input
                        type="text"
                        className="form-control form-control"
                        placeholder="Search by ID, Name, or Email"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="col-md-5 text-end">
                    <button className="btn btn-warning" onClick={generatePDF}>
                        Generate Report
                    </button>
                    <button className="btn btn-primary mx-1" onClick={() => navigate('/create-employee')}>
                        Create Employee
                    </button>
                </div>
            </div>
            <div className="table-responsive">
                <table className="table table-bordered table-hover text-center">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Designation</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmployees.map((employee) => (
                            <tr key={employee.employee_id} className="align-middle">
                                <td>{employee.employee_id}</td>
                                <td>{employee.firstname}</td>
                                <td>{employee.lastname}</td>
                                <td>{employee.email}</td>
                                <td>{employee.designation}</td>
                                <td>
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => navigate(`/employee/${employee._id}/update`)}
                                    >
                                        Update
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => setDeleteId(employee._id)}
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

            {/* Delete Confirmation Modal */}
            <div className="modal fade" id="deleteModal" tabIndex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="deleteModalLabel">Confirm Deletion</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Are you sure you want to delete this employee?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => {
                                    deleteEmployee(); // Call delete function on confirmation
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

export default EmployeeList;
