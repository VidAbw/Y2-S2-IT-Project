import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const UpdateEmployee = () => {
    const [employee, setEmployee] = useState({
        firstname: '',
        lastname: '',
        email: '',
        contact: '',
        gender: '',
        address: '',
        designation: '',
        basic_salary: ''
    });

    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();  // Get employee ID from route params

    // Fetch employee details by ID
    useEffect(() => {
        const fetchEmployeeById = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/employees/getById/${id}`);
                setEmployee(res.data);
            } catch (error) {
                console.error('Error fetching employee details:', error);
            }
        };

        fetchEmployeeById();
    }, [id]);

    // Validate form inputs
    const validate = () => {
        let tempErrors = {};
        let isValid = true;

        if (!employee.firstname) {
            tempErrors.firstname = 'First name is required';
            isValid = false;
        }
        if (!employee.lastname) {
            tempErrors.lastname = 'Last name is required';
            isValid = false;
        }
        if (!employee.email || !/\S+@\S+\.\S+/.test(employee.email)) {
            tempErrors.email = 'A valid email is required';
            isValid = false;
        }
        if (!employee.contact || employee.contact.length !== 10) {
            tempErrors.contact = 'A valid 10-digit contact number is required';
            isValid = false;
        }
        if (!employee.gender) {
            tempErrors.gender = 'Gender is required';
            isValid = false;
        }
        if (!employee.address) {
            tempErrors.address = 'Address is required';
            isValid = false;
        }
        if (!employee.designation) {
            tempErrors.designation = 'Designation is required';
            isValid = false;
        }
        if (!employee.basic_salary || isNaN(employee.basic_salary)) {
            tempErrors.basic_salary = 'A valid salary is required';
            isValid = false;
        }else if (employee.basic_salary < 0) {
            tempErrors.basic_salary = 'Salary cannot be negative';
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
    };

    // Handle form submission for updating employee details
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            try {
                await axios.put(`http://localhost:5000/employees/updateById/${id}`, employee);
                setMessage('Employee updated successfully');
                setErrors({});
                navigate('/employee-list'); // Navigate to employee list after successful update
            } catch (error) {
                setMessage('Error updating employee');
            }
        }
    };

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployee({
            ...employee,
            [name]: value
        });
        let tempErrors = { ...errors };
        switch (name) {
            case 'firstname':
                if (value) delete tempErrors.firstname;
                break;
            case 'lastname':
                if (value) delete tempErrors.lastname;
                break;
            case 'email':
                if (/\S+@\S+\.\S+/.test(value)) delete tempErrors.email;
                break;
            case 'contact':
                if (value.length === 10) delete tempErrors.contact;
                break;
            case 'gender':
                if (value) delete tempErrors.gender;
                break;
            case 'address':
                if (value) delete tempErrors.address;
                break;
            case 'designation':
                if (value) delete tempErrors.designation;
                break;
            case 'basic_salary':
                if (!isNaN(value) && value >= 0) delete tempErrors.basic_salary;
                break;
            default:
                break;
        }

        setErrors(tempErrors);
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-6 col-md-8 col-sm-10">
                    <h2 className="text-center mb-4" style={{ color: '#FFA500', fontWeight: 'bold' }}>Update Employee</h2>
                    {message && <div className="alert alert-info">{message}</div>}
                    <form onSubmit={handleSubmit} className="p-4 shadow-lg rounded bg-white">
                        <div className="row">
                            <div className='col-6'>
                                <div className="mb-3">
                                    <label className="form-label">First Name</label>
                                    <input
                                        type="text"
                                        name="firstname"
                                        className={`form-control ${errors.firstname ? 'is-invalid' : ''}`}
                                        value={employee.firstname}
                                        onChange={handleChange}
                                    />
                                    {errors.firstname && <div className="invalid-feedback">{errors.firstname}</div>}
                                </div>
                            </div>
                            <div className='col-6'>
                                <div className="mb-3">
                                    <label className="form-label">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastname"
                                        className={`form-control ${errors.lastname ? 'is-invalid' : ''}`}
                                        value={employee.lastname}
                                        onChange={handleChange}
                                    />
                                    {errors.lastname && <div className="invalid-feedback">{errors.lastname}</div>}
                                </div>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                name="email"
                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                value={employee.email}
                                onChange={handleChange}
                            />
                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                        </div>

                        <div className="row">
                            <div className='col-6'>
                                <div className="mb-3">
                                    <label className="form-label">Contact Number</label>
                                    <input
                                        type="text"
                                        name="contact"
                                        className={`form-control ${errors.contact ? 'is-invalid' : ''}`}
                                        value={employee.contact}
                                        onChange={handleChange}
                                    />
                                    {errors.contact && <div className="invalid-feedback">{errors.contact}</div>}
                                </div>
                            </div>
                            <div className='col-6'>
                                <div className="mb-3">
                                    <label className="form-label">Gender</label>
                                    <select
                                        name="gender"
                                        className={`form-control ${errors.gender ? 'is-invalid' : ''}`}
                                        value={employee.gender}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                    {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
                                </div>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Address</label>
                            <input
                                type="text"
                                name="address"
                                className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                value={employee.address}
                                onChange={handleChange}
                            />
                            {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                        </div>

                        <div className="row">
                            <div className='col-6'>
                                <div className="mb-3">
                                    <label className="form-label">Designation</label>
                                    <input
                                        type="text"
                                        name="designation"
                                        className={`form-control ${errors.designation ? 'is-invalid' : ''}`}
                                        value={employee.designation}
                                        onChange={handleChange}
                                    />
                                    {errors.designation && <div className="invalid-feedback">{errors.designation}</div>}
                                </div>
                            </div>
                            <div className='col-6'>
                                <div className="mb-3">
                                    <label className="form-label">Basic Salary</label>
                                    <input
                                        type="number"
                                        name="basic_salary"
                                        className={`form-control ${errors.basic_salary ? 'is-invalid' : ''}`}
                                        value={employee.basic_salary}
                                        onChange={handleChange}
                                    />
                                    {errors.basic_salary && <div className="invalid-feedback">{errors.basic_salary}</div>}
                                </div>
                            </div>
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

export default UpdateEmployee;
