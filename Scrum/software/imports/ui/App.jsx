import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './Components/Auth/LoginPage';
import RegisterPage from './Components/Auth/RegisterPage';
import HomePage from './HomePage';
import ProductoDetalles from './Components/Screens/ProductoDetalles';
import VenderProductoPage from './Components/Screens/VenderProductoPage';

export const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showingRegister, setShowingRegister] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const toggleRegister = () => {
    setShowingRegister(!showingRegister);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            !isLoggedIn ? (
              <LoginPage onLoginSuccess={handleLoginSuccess} setShowRegister={toggleRegister} />
            ) : (
              <Navigate replace to="/homepage" />
            )
          }
        />
        <Route path="/register" element={<RegisterPage onRegisterSuccess={handleLoginSuccess} />} />
        <Route
          path="/homepage"
          element={isLoggedIn ? <HomePage onLogout={handleLogout} /> : <Navigate replace to="/" />}
        />
        <Route path="/producto/:id" element={<ProductoDetalles />} />
        <Route path="/vender-producto" element={<VenderProductoPage />} /> 
      </Routes>
    </Router>
  );
};

export default App;