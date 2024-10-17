const express = require('express');
const router = express.Router();
const Salary = require('../models/Salary');
const Employee = require('../models/Employee');

// Create a salary entry
router.post('/create', async (req, res) => {
    const { emp_id, salary, month, ot } = req.body;

    try {
        const employee = await Employee.findById(emp_id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Ignore if employee has a negative basic salary
        if (employee.basic_salary < 0) {
            return res.status(400).json({ message: 'Cannot create salary for employee with negative basic salary' });
        }

        const newSalary = new Salary({ emp_id, salary, month, ot });
        await newSalary.save();
        res.status(201).json({ message: 'Salary created successfully', salary: newSalary });
    } catch (error) {
        res.status(500).json({ message: 'Error creating salary', error });
    }
});

// Get salaries by month (ignore employees with negative basic salary)
router.get('/month/:month', async (req, res) => {
    let { month } = req.params;

    if (!month || isNaN(month) || month < 1 || month > 12) {
        return res.status(400).json({ message: 'Invalid month format. Should be between 1 and 12.' });
    }

    month = month.length === 1 ? `0${month}` : month;

    try {
        const regex = new RegExp(`^\\d{4}-${month}$`);

        // Find salaries and populate employee details
        const salaries = await Salary.find({ month: { $regex: regex } })
            .populate({
                path: 'emp_id',
                select: 'employee_id firstname lastname email designation basic_salary',
                match: { basic_salary: { $gte: 0 } }  // Ignore employees with negative basic salary
            });

        const filteredSalaries = salaries.filter(salary => salary.emp_id);  // Remove records with unmatched employees

        if (!filteredSalaries.length) {
            return res.status(404).json({ message: 'No valid salaries found for this month' });
        }

        res.status(200).json(filteredSalaries);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching salaries', error });
    }
});

// Get salary by ID (ignore if employee has negative basic salary)
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const salary = await Salary.findById(id).populate({
            path: 'emp_id',
            select: 'employee_id firstname lastname email designation basic_salary',
            match: { basic_salary: { $gte: 0 } }  // Ignore employees with negative basic salary
        });

        if (!salary || !salary.emp_id) {
            return res.status(404).json({ message: 'Salary not found or invalid basic salary' });
        }

        res.status(200).json(salary);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching salary', error });
    }
});

// Update salary by ID
router.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { salary, month, ot } = req.body;

    try {
        const updatedSalary = await Salary.findByIdAndUpdate(id, { salary, month, ot }, { new: true });
        if (!updatedSalary) {
            return res.status(404).json({ message: 'Salary not found' });
        }

        res.status(200).json({ message: 'Salary updated successfully', salary: updatedSalary });
    } catch (error) {
        res.status(500).json({ message: 'Error updating salary', error });
    }
});

// Delete salary by ID
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedSalary = await Salary.findByIdAndDelete(id);
        if (!deletedSalary) {
            return res.status(404).json({ message: 'Salary not found' });
        }

        res.status(200).json({ message: 'Salary deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting salary', error });
    }
});

module.exports = router;
