import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Livro from './add/livro';
import Reserva from './add2/reserva';
import './App.css';

const App = () => {
    return (
        <Router>
            <div>
                <Header />
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<Login />} /> 
                    <Route path="/livro" element={<Livro />} /> 
                    <Route path="/reserva" element={<Reserva />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
