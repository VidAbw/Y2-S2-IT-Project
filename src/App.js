import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Register from './pages/Register';
import RecipeForm from './components/RecipeForm';
import EditRecipe from './components/EditRecipeForm';
import Home from './pages/Home';
import SearchRecipes from './components/SearchRecipes';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/add-recipe" element={<RecipeForm />} />
                    <Route path="/edit-recipe/:id" element={<EditRecipe />} />
                    <Route path="/search" element={<SearchRecipes />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
