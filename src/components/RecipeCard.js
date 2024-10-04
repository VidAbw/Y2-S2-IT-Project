import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, CardActions } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RecipeCard = ({ recipe, onDelete }) => {
    const navigate = useNavigate();

    const ingredients = Array.isArray(recipe.ingredients)
        ? recipe.ingredients
        : recipe.ingredients.split(',');

    const handleDelete = async () => {
        const confirmed = window.confirm('Are you sure you want to delete this recipe?');
        if (!confirmed) return;

        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:5000/api/recipes/${recipe._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            onDelete(recipe._id); // Notify parent component
        } catch (error) {
            console.error('Error deleting recipe:', error);
        }
    };

    return (
        <Card sx={{ maxWidth: 400, margin: 2, backgroundColor: '#f9f9f9', boxShadow: 3 }}>
            <CardMedia
                component="img"
                height="240" // Increased height for a larger image display
                image={`http://localhost:5000/${recipe.image}`} // Use the correct image path
                alt={recipe.title}
            />
            <CardContent>
                <Typography variant="h5" component="div" sx={{ color: '#4caf50' }}>
                    {recipe.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {recipe.description}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Ingredients:</strong> {ingredients.join(', ')}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Instructions:</strong> {recipe.instructions}
                </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button size="small" variant="contained" sx={{ backgroundColor: '#4caf50', color: '#fff' }} onClick={() => navigate(`/edit-recipe/${recipe._id}`)}>
                    Edit
                </Button>
                <Button size="small" variant="contained" color="error" onClick={handleDelete}>
                    Delete
                </Button>
            </CardActions>
        </Card>
    );
};

export default RecipeCard;
