import React from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Policy from "./pages/Policy";
import PageNotFound from "./pages/PageNotfound";
import Register from "./Auth/Register";
import Login from "./Auth/Login";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/policy" element={<Policy />} />
      <Route path="/*" element={<PageNotFound />} />
    </Routes>
  );
}

export default App;
