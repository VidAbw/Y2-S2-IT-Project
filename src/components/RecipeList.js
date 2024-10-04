import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { List, ListItem, ListItemText, Typography, Container, Paper } from '@mui/material';
import SearchRecipes from './SearchRecipes';

const RecipeList = () => {
    const [recipes, setRecipes] = useState([]);
    const { user } = useContext(AuthContext);

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

    return (
        <Container>
            <Typography variant="h4" gutterBottom align="center" style={{ color: '#4caf50' }}>
                Your Recipes
            </Typography>
            <Paper elevation={3} style={{ padding: '16px' }}>
                <List>
                    {recipes.length > 0 ? (
                        recipes.map((recipe) => (
                            <ListItem key={recipe._id}>
                                <ListItemText
                                    primary={recipe.title}
                                    secondary={`Ingredients: ${recipe.ingredients.join(', ')}`}
                                />
                            </ListItem>
                        ))
                    ) : (
                        <Typography variant="body1" align="center">No recipes found.</Typography>
                    )}
                </List>
            </Paper>
        </Container>
    );
};

export default RecipeList;
