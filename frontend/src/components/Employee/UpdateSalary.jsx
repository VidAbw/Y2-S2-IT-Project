import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateSalary = () => {
    const [salaryData, setSalaryData] = useState({
        emp_id: '',
        month: '',
        otHours: 0,
        salary: 0,
        ot: 0,
    });
    const [basicSalary, setBasicSalary] = useState(0);
    const [employeeName, setEmployeeName] = useState('');
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [otSalary, setOtSalary] = useState(0);
    const navigate = useNavigate();
    const { salaryId } = useParams(); 

    useEffect(() => {
        if (salaryId) {
            fetchSalaryData(salaryId);
        }
    }, [salaryId]);

    const fetchSalaryData = async (id) => {
        try {
            const res = await axios.get(`http://localhost:5000/salaries/${id}`);
            const data = res.data;

            setSalaryData({
                emp_id: data.emp_id._id,
                month: data.month,
                otHours: data.otHours || 0,
                salary: data.salary,
                ot: data.ot
            });

            setBasicSalary(data.emp_id.basic_salary || 0);
            setEmployeeName(`${data.emp_id.firstname} ${data.emp_id.lastname}`);
        } catch (error) {
            console.error('Error fetching salary:', error);
        }
    };

    // Handle input change
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

        if (!salaryData.month) {
            tempErrors.month = 'Month is required';
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
    };

    // Handle form submission for update
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            try {
                await axios.put(`http://localhost:5000/salaries/update/${salaryId}`, salaryData);
                setMessage('Salary updated successfully');
                navigate('/employee/salary');
            } catch (error) {
                setMessage('Error updating salary');
                console.error('Error updating salary:', error);
            }
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-6 col-md-8 col-sm-10">
                    <h2 className="text-center mb-4" style={{ color: '#FFA500', fontWeight: 'bold' }}>Update Salary</h2>
                    {message && <div className="alert alert-info">{message}</div>}
                    <form onSubmit={handleSubmit} className="p-4 shadow-lg rounded bg-white">
                        <div className="mb-3">
                            <label className="form-label">Employee</label>
                            <input
                                type="text"
                                className="form-control"
                                value={employeeName}
                                disabled
                            />
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
                                value={salaryData.ot}
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
                                Update
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateSalary;
