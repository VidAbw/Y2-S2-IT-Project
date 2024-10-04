import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Grid, Paper } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RecipeForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');
    const [image, setImage] = useState(null);
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('ingredients', ingredients.split(','));
        formData.append('instructions', instructions);
        if (image) {
            formData.append('image', image);
        }

        try {
            await axios.post('http://localhost:5000/api/recipes', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            navigate('/profile');
        } catch (error) {
            console.error('Error adding recipe:', error);
        }
    };

    const handleCancel = () => {
        navigate('/profile'); // Navigate back to profile without saving
    };

    return (
        <Container maxWidth="sm" style={{ marginTop: '20px' }}>
            <Paper elevation={3} style={{ padding: '16px' }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Add New Recipe
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Ingredients (comma separated)"
                                value={ingredients}
                                onChange={(e) => setIngredients(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Instructions"
                                value={instructions}
                                onChange={(e) => setInstructions(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <input
                                type="file"
                                onChange={handleImageChange}
                                accept="image/*"
                                required
                                style={{ marginTop: '16px' }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="success"
                                fullWidth
                                style={{ marginBottom: '8px' }}
                            >
                                Add Recipe
                            </Button>
                            <Button
                                type="button"
                                onClick={handleCancel}
                                variant="contained"
                                color="error"
                                fullWidth
                            >
                                Cancel
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
};

export default RecipeForm;
