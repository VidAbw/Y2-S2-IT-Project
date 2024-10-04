import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Container, Typography, Paper } from '@mui/material';
import { Save, Clear, Cancel } from '@mui/icons-material'; // Import icons

const EditRecipeForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState({ title: '', description: '', ingredients: [] });
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/recipes/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const fetchedRecipe = res.data;

                if (typeof fetchedRecipe.ingredients === 'string') {
                    fetchedRecipe.ingredients = fetchedRecipe.ingredients.split(',');
                }

                if (!Array.isArray(fetchedRecipe.ingredients)) {
                    fetchedRecipe.ingredients = [];
                }

                setRecipe(fetchedRecipe);
            } catch (error) {
                console.error('Error fetching recipe:', error);
            }
        };

        fetchRecipe();
    }, [id, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'ingredients') {
            setRecipe({ ...recipe, ingredients: value.split(',').map(ingredient => ingredient.trim()) });
        } else {
            setRecipe({ ...recipe, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/recipes/${id}`, recipe, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            navigate('/profile');
        } catch (error) {
            console.error('Error updating recipe:', error);
        }
    };

    const handleClear = () => {
        setRecipe({ title: '', description: '', ingredients: [] });
    };

    const handleCancel = () => {
        navigate('/profile'); // Go back to profile without making changes
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} style={{ padding: '16px', marginTop: '20px' }}>
                <Typography variant="h5" gutterBottom align="center" style={{ color: '#4caf50' }}>
                    Edit Recipe
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Title"
                        name="title"
                        value={recipe.title}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Description"
                        name="description"
                        value={recipe.description}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Ingredients (comma separated)"
                        name="ingredients"
                        value={recipe.ingredients.join(', ')}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
                        <Button
                            type="submit"
                            variant="contained"
                            style={{ backgroundColor: '#4caf50', color: 'white', flex: 1, marginRight: '8px' }}
                            startIcon={<Save />} // Add icon
                        >
                            Update Recipe
                        </Button>
                        <Button
                            type="button"
                            variant="contained"
                            onClick={handleClear}
                            style={{ backgroundColor: '#4caf50', color: 'white', flex: 1, marginRight: '8px' }}
                            startIcon={<Clear />} // Add icon
                        >
                            Clear
                        </Button>
                        <Button
                            type="button"
                            variant="contained"
                            onClick={handleCancel}
                            style={{ backgroundColor: '#f44336', color: 'white', flex: 1 }}
                            startIcon={<Cancel />} // Add icon
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </Paper>
        </Container>
    );
};

export default EditRecipeForm;
