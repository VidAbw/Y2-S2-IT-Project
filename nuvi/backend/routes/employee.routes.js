const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Employee = require('../models/Employee');

router.post('/create', async (req, res) => {
    try {
        const employeeData = req.body;
        
        // Validate required fields before proceeding
        const requiredFields = ['firstname', 'lastname', 'email', 'contact', 'gender', 'address', 'designation', 'basic_salary'];
        for (const field of requiredFields) {
            if (!employeeData[field]) {
                return res.status(400).json({ error: `${field} is required.` });
            }
        }
        
        if (!employeeData.employee_id) {
            employeeData.employee_id = 'EMP-' + uuidv4().slice(0, 8).toUpperCase();
        }

        const existingEmployee = await Employee.findOne({ email: employeeData.email });
        if (existingEmployee) {
            return res.status(400).json({ error: 'Employee with this email already exists.' });
        }

        const newEmployee = new Employee(employeeData);
        await newEmployee.save();

        res.status(201).json({ message: 'Employee created successfully', employee: newEmployee });
    } catch (error) {
        console.error('Error creating employee:', error); 
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all employees
router.get('/getAll', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get employee by ID
router.get('/getById/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update employee by ID
router.put('/updateById/:id', async (req, res) => {
    try {
        const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updatedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json({ message: 'Employee updated successfully', employee: updatedEmployee });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete employee by ID
router.delete('/deleteById/:id', async (req, res) => {
    try {
        const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);

        if (!deletedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
