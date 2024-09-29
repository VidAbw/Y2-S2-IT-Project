const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
    },
    emp_id: {
        type: mongoose.Schema.Types.ObjectId,
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

const Salary = mongoose.model('Salary', salarySchema);

module.exports = Salary;
