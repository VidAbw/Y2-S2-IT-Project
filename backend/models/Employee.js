const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // Import uuidv4

const employeeSchema = new mongoose.Schema({
    employee_id: {
        type: String,
        unique: true,
        required: true,
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
employeeSchema.pre('save', function (next) {
    console.log('Running pre-save hook for employee_id generation...');
    
    if (!this.employee_id || this.isNew) {
        this.employee_id = 'EMP-' + uuidv4().slice(0, 8).toUpperCase(); // Correct uuidv4 usage
        console.log(`Generated employee_id: ${this.employee_id}`);
    }
    
    next();
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
