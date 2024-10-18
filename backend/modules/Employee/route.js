const express = require('express');
const { model, Schema } = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// Employee Schema
const EmployeeSchema = new Schema({
    employee_id: {
        type: String,
        unique: true,
        required: true
    },
    firstname: {
        type: String,
        required: true,
        trim: true
    },
    lastname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    contact: {
        type: String,
        required: true,
        trim: true
    },
    gender: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    designation: {
        type: String,
        required: true,
        trim: true
    },
    basic_salary: {
        type: Number,
        required: true,
        trim: true
    },
    experience: {
        type: String,
        required: true,
        trim: true
    }
});

// Pre-save hook to generate employee_id
EmployeeSchema.pre('save', function (next) {
    if (!this.employee_id || this.isNew) {
        this.employee_id = 'EMP-' + uuidv4().slice(0, 8).toUpperCase();
    }
    next();
});

// Salary Schema
const SalarySchema = new Schema({
    emp_id: {
        type: Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    month: {
        type: String,
        required: true
    },
    ot: {
        type: Number,
        default: 0
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});

// Employee and Salary Models
const EmployeeModel = model('Employee', EmployeeSchema);
const SalaryModel = model('Salary', SalarySchema);

// Employee Routes

// Create an Employee
router.post('/employees/create', async (req, res) => {
    try {
        const employeeData = req.body;
        const requiredFields = ['firstname', 'lastname', 'email', 'contact', 'gender', 'address', 'designation', 'basic_salary', 'experience'];
        
        for (const field of requiredFields) {
            if (!employeeData[field]) {
                return res.status(400).json({ error: `${field} is required.` });
            }
        }
        if (!employeeData.employee_id) {
            employeeData.employee_id = 'EMP-' + uuidv4().slice(0, 8).toUpperCase();
        }
        const existingEmployee = await EmployeeModel.findOne({ email: employeeData.email });
        if (existingEmployee) {
            return res.status(400).json({ error: 'Employee with this email already exists.' });
        }

        const newEmployee = new EmployeeModel(employeeData);
        await newEmployee.save();
        res.status(201).json({ message: 'Employee created successfully', employee: newEmployee });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all Employees
router.get('/employees/getAll', async (req, res) => {
    try {
        const employees = await EmployeeModel.find();
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Salary Routes

// Create Salary Entry
router.post('/salaries/create', async (req, res) => {
    const { emp_id, salary, month, ot } = req.body;

    try {
        const employee = await EmployeeModel.findById(emp_id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        const newSalary = new SalaryModel({ emp_id, salary, month, ot });
        await newSalary.save();
        res.status(201).json({ message: 'Salary created successfully', salary: newSalary });
    } catch (error) {
        res.status(500).json({ error: 'Error creating salary' });
    }
});

// Get Salaries by Month
router.get('/salaries/month/:month', async (req, res) => {
    let { month } = req.params;
    if (!month || isNaN(month) || month < 1 || month > 12) {
        return res.status(400).json({ message: 'Invalid month format' });
    }
    month = month.length === 1 ? `0${month}` : month;
    const regex = new RegExp(`^\\d{4}-${month}$`);

    try {
        const salaries = await SalaryModel.find({ month: { $regex: regex } })
            .populate({
                path: 'emp_id',
                select: 'employee_id firstname lastname email designation basic_salary'
            });

        res.status(200).json(salaries);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching salaries' });
    }
});

// Export combined routes
module.exports = router;
