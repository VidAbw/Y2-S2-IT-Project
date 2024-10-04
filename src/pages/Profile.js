import React, { useContext, useEffect, useState } from 'react';
import { Button, Grid, Typography, Container, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import RecipeCard from '../components/RecipeCard';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [recipes, setRecipes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/recipes', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setRecipes(response.data);
            } catch (error) {
                console.error('Error fetching recipes:', error);
            }
        };

        if (user) {
            fetchRecipes();
        }
    }, [user]);

    const handleDelete = (id) => {
        setRecipes(recipes.filter(recipe => recipe._id !== id)); // Update local state
    };

    return (
        <Container component={Paper} elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
            <Typography variant="h4" align="center" gutterBottom>
                Welcome {user?.username}!
            </Typography>


            <Grid container justifyContent="flex-end" style={{ marginBottom: '20px' , marginRight:'50px'}}>
                <Grid item>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={() => navigate('/add-recipe')}
                        style={{ fontSize: '1rem', padding: '15px 15px' }} // Increase button size
                    >
                        Add New Recipe
                    </Button>
                </Grid>
            </Grid>

            <Typography variant="h6" align="left" gutterBottom>
                Here are all your contributed recipes.
            </Typography>
            <hr></hr>
            <Grid container spacing={2}>
                {recipes.map((recipe) => (
                    <Grid item key={recipe._id} xs={12} sm={6} md={4}>
                        <RecipeCard recipe={recipe} onDelete={handleDelete} />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Profile;
