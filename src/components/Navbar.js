import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/'); // Redirect to home page after logout
    };

    return (
        <AppBar position="static" style={{ backgroundColor: '#4CAF50' }}>
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    Wellness Kitchen
                </Typography>
                {user ? (
                    <>
                        <Button color="inherit" component={Link} to="/profile">Profile</Button>
                        <Button color="inherit" onClick={handleLogout}>Logout</Button>
                    </>
                ) : (
                    <>
                        <Button color="inherit" component={Link} to="/register">Register</Button>
                        <Button color="inherit" component={Link} to="/login">Login</Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
