const { hashPassword, comparePassword } = require('../helpers/authHelper');
const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Register Controller
const registerController = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phone, address } = req.body;

        // Validations
        if (!firstName) {
            return res.send({ message: 'First Name is Required' });
        }
        if (!lastName) {
            return res.send({ message: 'Last Name is Required' });
        }
        if (!email) {
            return res.send({ message: 'Email is Required' });
        }
        if (!password) {
            return res.send({ message: 'Password is Required' });
        }
        if (!phone) {
            return res.send({ message: 'Phone is Required' });
        }
        if (!address) {
            return res.send({ message: 'Address is Required' });
        }

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: 'Already Registered, please login',
            });
        }

        // Register new user
        const hashedPassword = await hashPassword(password);

        // Save user
        const registeredUser = await new userModel({
            firstName, 
            lastName,
            email,
            phone,
            address,
            password: hashedPassword,
        }).save();

        res.status(201).send({
            success: true,
            message: 'User registered successfully',
            registeredUser,
        });

    } catch (error) { 
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Registration',
            error: error.message, 
        });
    }
};

// Login Controller
const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: 'Invalid Email or Password',
            });
        }

        // Check if user exists
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User not found',
            });
        }

        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(200).send({
                success: false,
                message: 'Invalid Password',
            });
        }

        // Generate JWT token
        const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.status(200).send({
            success: true,
            message: 'Login successful',
            user: {
                firstName: user.firstName, 
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                address: user.address,
            },
            token,
        });

    } catch (error) { 
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Login',
            error: error.message,
        });
    }
};

// export both controllers
module.exports = {
    registerController,
    loginController
};
