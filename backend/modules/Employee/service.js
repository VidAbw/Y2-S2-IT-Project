const EmployeeModel = require('../models/Employee');
const { v4: uuidv4 } = require('uuid');
const SalaryModel = require('../models/Salary');

// Employee Service
const EmployeeService = {
    createEmployee: async (employeeData) => {
        const requiredFields = ['firstname', 'lastname', 'email', 'contact', 'gender', 'address', 'designation', 'basic_salary', 'experience'];
        for (const field of requiredFields) {
            if (!employeeData[field]) {
                throw new Error(`${field} is required.`);
            }
        }

        const existingEmployee = await EmployeeModel.findOne({ email: employeeData.email });
        if (existingEmployee) {
            throw new Error('Employee with this email already exists.');
        }

        if (!employeeData.employee_id) {
            employeeData.employee_id = 'EMP-' + uuidv4().slice(0, 8).toUpperCase();
        }

        const newEmployee = new EmployeeModel(employeeData);
        return await newEmployee.save();
    },

    getAllEmployees: async () => {
        return await EmployeeModel.find();
    },

    getEmployeeById: async (id) => {
        return await EmployeeModel.findById(id);
    },

    updateEmployeeById: async (id, employeeData) => {
        return await EmployeeModel.findByIdAndUpdate(id, employeeData, { new: true });
    },

    deleteEmployeeById: async (id) => {
        return await EmployeeModel.findByIdAndDelete(id);
    }
};

// Salary Service
const SalaryService = {
    createSalary: async (salaryData) => {
        const { emp_id, salary, month, ot } = salaryData;

        const employee = await EmployeeModel.findById(emp_id);
        if (!employee) {
            throw new Error('Employee not found');
        }

        const newSalary = new SalaryModel({ emp_id, salary, month, ot });
        return await newSalary.save();
    },

    getSalariesByMonth: async (month) => {
        if (!month || isNaN(month) || month < 1 || month > 12) {
            throw new Error('Invalid month format');
        }

        month = month.length === 1 ? `0${month}` : month;
        const regex = new RegExp(`^\\d{4}-${month}$`);

        return await SalaryModel.find({ month: { $regex: regex } })
            .populate('emp_id', 'employee_id firstname lastname email designation basic_salary');
    },

    getSalaryById: async (id) => {
        const salary = await SalaryModel.findById(id).populate('emp_id', 'employee_id firstname lastname email designation basic_salary');
        if (!salary) {
            throw new Error('Salary not found');
        }
        return salary;
    },

    updateSalaryById: async (id, salaryData) => {
        const updatedSalary = await SalaryModel.findByIdAndUpdate(id, salaryData, { new: true });
        if (!updatedSalary) {
            throw new Error('Salary not found');
        }
        return updatedSalary;
    },

    deleteSalaryById: async (id) => {
        const deletedSalary = await SalaryModel.findByIdAndDelete(id);
        if (!deletedSalary) {
            throw new Error('Salary not found');
        }
        return deletedSalary;
    }
};

module.exports = { EmployeeService, SalaryService };