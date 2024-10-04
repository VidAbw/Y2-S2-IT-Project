import React, { useState } from 'react';
import axios from 'axios';

const SearchRecipes = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Reset any previous error message

        try {
            const response = await axios.get(`http://localhost:5000/api/recipes/search?query=${searchQuery}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            });

            setRecipes(response.data);
        } catch (err) {
            console.error('Error fetching recipes:', err);
            setErrorMessage('Error fetching recipes. Please try again.');
            setRecipes([]);
        }
    };

    return (
        <div>
            <h2>Search Recipes</h2>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by recipe name..."
                />
                <button type="submit">Search</button>
            </form>

            <div>
                <h3>Search Results:</h3>
                {errorMessage && <p>{errorMessage}</p>}
                {recipes.length > 0 ? (
                    recipes.map((recipe) => (
                        <div key={recipe._id}>
                            <h4>{recipe.title}</h4>
                            <p>{recipe.description}</p>
                        </div>
                    ))
                ) : (
                    <p>No recipes found</p>
                )}
            </div>
        </div>
    );
};

export default SearchRecipes;
