import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateSalary = () => {
    const [employees, setEmployees] = useState([]);
    const [salaryData, setSalaryData] = useState({
        emp_id: '',
        month: '',
        otHours: 0,
        salary: 0,
        ot: 0,
    });
    const [basicSalary, setBasicSalary] = useState(0);
    const [otSalary, setOtSalary] = useState(0);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    // Fetch employees on component mount
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

    // Handle input change and error clearing
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let inputValue = value;

        // Prevent negative OT hours
        if (name === 'otHours' && value < 0) {
            inputValue = 0;
            setMessage('OT hours cannot be negative');
        } else {
            setMessage(''); // Clear message if valid
        }

        setSalaryData({
            ...salaryData,
            [name]: inputValue
        });

        // Clear errors for the field if valid
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }

        // If employee is selected, fetch the basic salary
        if (name === 'emp_id') {
            const selectedEmployee = employees.find(emp => emp._id === inputValue);
            if (selectedEmployee) {
                setBasicSalary(selectedEmployee.basic_salary);
            }
        }

        // Recalculate OT and total salary when OT hours or employee is changed
        if (name === 'otHours') {
            const otValue = (inputValue * basicSalary * 0.05).toFixed(2); // Calculate OT
            const totalSalary = (parseFloat(basicSalary) + parseFloat(otValue)).toFixed(2);
            setOtSalary(otValue);
            setSalaryData(prevData => ({
                ...prevData,
                ot: inputValue,
                salary: totalSalary
            }));
        }
    };

    // Validate form inputs
    const validate = () => {
        let tempErrors = {};
        let isValid = true;

        if (!salaryData.emp_id) {
            tempErrors.emp_id = 'Employee is required';
            isValid = false;
        }
        if (!salaryData.month) {
            tempErrors.month = 'Month is required';
            isValid = false;
        }
        if (salaryData.otHours < 0) {
            tempErrors.otHours = 'OT hours cannot be negative';
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (validate()) {
            // Check if OT hours were entered
            const updatedSalaryData = { ...salaryData };
    
            if (!salaryData.otHours || salaryData.otHours === 0) {
                // Set total salary to basic salary if no OT hours are provided
                updatedSalaryData.salary = basicSalary;
            }
    
            try {
                const res = await axios.post('http://localhost:5000/salaries/create', updatedSalaryData);
                setMessage('Salary created successfully');
                navigate('/employee/salary');
            } catch (error) {
                if (error.response && error.response.status === 409) {
                    setMessage('Salary already exists for the selected employee and month.');
                } else {
                    setMessage('Error creating salary');
                }
            }
        }
    };
    

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-6 col-md-8 col-sm-10">
                    <h2 className="text-center mb-4" style={{ color: '#FFA500', fontWeight: 'bold' }}>Create Salary</h2>
                    {message && <div className="alert alert-info">{message}</div>}
                    <form onSubmit={handleSubmit} className="p-4 shadow-lg rounded bg-white">
                        <div className="mb-3">
                            <label className="form-label">Select Employee</label>
                            <select
                                name="emp_id"
                                className={`form-control ${errors.emp_id ? 'is-invalid' : ''}`}
                                value={salaryData.emp_id}
                                onChange={handleInputChange}
                            >
                                <option value="">Select Employee</option>
                                {employees.map((employee) => (
                                    <option key={employee._id} value={employee._id}>
                                        {employee.firstname} {employee.lastname}
                                    </option>
                                ))}
                            </select>
                            {errors.emp_id && <div className="invalid-feedback">{errors.emp_id}</div>}
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Basic Salary</label>
                            <input
                                type="text"
                                className="form-control"
                                value={basicSalary}
                                disabled
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Month</label>
                            <input
                                type="month"
                                name="month"
                                className={`form-control ${errors.month ? 'is-invalid' : ''}`}
                                value={salaryData.month}
                                onChange={handleInputChange}
                            />
                            {errors.month && <div className="invalid-feedback">{errors.month}</div>}
                        </div>

                        <div className="mb-3">
                            <label className="form-label">OT Hours</label>
                            <input
                                type="number"
                                name="otHours"
                                className="form-control"
                                value={salaryData.otHours}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">OT Amount (OT Hours * Basic Salary * 5%)</label>
                            <input
                                type="text"
                                className="form-control"
                                value={otSalary}
                                disabled
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Total Salary (Basic Salary + OT)</label>
                            <input
                                type="text"
                                className="form-control"
                                value={salaryData.salary}
                                disabled
                            />
                        </div>

                        <div className="d-grid">
                            <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#FFA500', borderColor: '#FFA500' }}>
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateSalary;
