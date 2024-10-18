const EmployeeService = require('../services/employeeService');
const SalaryService = require('../services/salaryService');

// Employee Controller
const EmployeeController = {
    // Create a new employee
    createEmployee: async (req, res) => {
        try {
            const employeeData = req.body;
            const newEmployee = await EmployeeService.createEmployee(employeeData);
            res.status(201).json({ message: 'Employee created successfully', employee: newEmployee });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get all employees
    getAllEmployees: async (req, res) => {
        try {
            const employees = await EmployeeService.getAllEmployees();
            res.status(200).json(employees);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get employee by ID
    getEmployeeById: async (req, res) => {
        try {
            const employee = await EmployeeService.getEmployeeById(req.params.id);
            if (!employee) {
                return res.status(404).json({ message: 'Employee not found' });
            }
            res.status(200).json(employee);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Update employee by ID
    updateEmployeeById: async (req, res) => {
        try {
            const updatedEmployee = await EmployeeService.updateEmployeeById(req.params.id, req.body);
            if (!updatedEmployee) {
                return res.status(404).json({ message: 'Employee not found' });
            }
            res.status(200).json({ message: 'Employee updated successfully', employee: updatedEmployee });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Delete employee by ID
    deleteEmployeeById: async (req, res) => {
        try {
            const deletedEmployee = await EmployeeService.deleteEmployeeById(req.params.id);
            if (!deletedEmployee) {
                return res.status(404).json({ message: 'Employee not found' });
            }
            res.status(200).json({ message: 'Employee deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

// Salary Controller
const SalaryController = {
    // Create a salary entry
    createSalary: async (req, res) => {
        try {
            const salaryData = req.body;
            const newSalary = await SalaryService.createSalary(salaryData);
            res.status(201).json({ message: 'Salary created successfully', salary: newSalary });
        } catch (error) {
            res.status(500).json({ message: 'Error creating salary', error });
        }
    },

    // Get salaries by month
    getSalariesByMonth: async (req, res) => {
        try {
            const salaries = await SalaryService.getSalariesByMonth(req.params.month);
            res.status(200).json(salaries);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching salaries', error });
        }
    },

    // Get salary by ID
    getSalaryById: async (req, res) => {
        try {
            const salary = await SalaryService.getSalaryById(req.params.id);
            if (!salary) {
                return res.status(404).json({ message: 'Salary not found' });
            }
            res.status(200).json(salary);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching salary', error });
        }
    },

    // Update salary by ID
    updateSalaryById: async (req, res) => {
        try {
            const updatedSalary = await SalaryService.updateSalaryById(req.params.id, req.body);
            if (!updatedSalary) {
                return res.status(404).json({ message: 'Salary not found' });
            }
            res.status(200).json({ message: 'Salary updated successfully', salary: updatedSalary });
        } catch (error) {
            res.status(500).json({ message: 'Error updating salary', error });
        }
    },

    // Delete salary by ID
    deleteSalaryById: async (req, res) => {
        try {
            const deletedSalary = await SalaryService.deleteSalaryById(req.params.id);
            if (!deletedSalary) {
                return res.status(404).json({ message: 'Salary not found' });
            }
            res.status(200).json({ message: 'Salary deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting salary', error });
        }
    }
};

module.exports = { EmployeeController, SalaryController };
