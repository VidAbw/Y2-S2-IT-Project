import React from 'react';
import { Button, Typography, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import { Login, AppRegistration } from '@mui/icons-material';

const Home = () => {
    return (
        <Container maxWidth="sm" style={{ marginTop: '100px' }}>
            <Typography variant="h3" align="center" gutterBottom>
                Welcome to <br></br> Online Wellness Kitchen
            </Typography>
            <br></br>
            <br></br>
            <Typography variant="h6" align="center" gutterBottom>
                Please choose an option:
            </Typography>
            <br></br>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                <Button 
                    variant="contained" 
                    color="success" 
                    component={Link} 
                    to="/login" 
                    startIcon={<Login />} 
                    style={{ textTransform: 'none' }}
                >
                    Login
                </Button>
                <Button 
                    variant="outlined" 
                    color="success" 
                    component={Link} 
                    to="/register" 
                    startIcon={<AppRegistration />} 
                    style={{ textTransform: 'none' }}
                >
                    Register
                </Button>
            </div>
        </Container>
    );
};

export default Home;
