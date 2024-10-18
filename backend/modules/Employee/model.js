const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// Define Salary schema
const SalarySchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true
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
  },
  {
    _id: false // Prevent auto creation of _id for salary subdocument
  }
);

// Define Employee schema
const EmployeeSchema = new mongoose.Schema({
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
  },
  salaries: [SalarySchema] // Embed Salary as an array in the Employee document
});

// Pre-save hook to generate employee_id
EmployeeSchema.pre('save', function (next) {
  if (!this.employee_id || this.isNew) {
    this.employee_id = 'EMP-' + uuidv4().slice(0, 8).toUpperCase();
  }
  next();
});

const Employee = mongoose.model('Employee', EmployeeSchema);

module.exports = Employee;
