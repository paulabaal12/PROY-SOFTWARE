import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './Components/Auth/LoginPage';
import RegisterPage from './Components/Auth/RegisterPage';
import HomePage from './HomePage';
import ShoppingCartPage from './Components/Screens/ShoppingCartPage';
import PaymentSummaryPage from './Components/Screens/PaymentSummaryPage';
import PaymentMethodPage from './Components/Screens/PaymentMethodPage';
import visualizador_pagos from './Components/Screens/visualizador_pagos';


export const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showingRegister, setShowingRegister] = useState(false);

  // Esta función se llamará después de un inicio de sesión exitoso
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  // Esta función se llamará para cerrar sesión
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // Toggle the display of the registration page
  const toggleRegister = () => {   
    setShowingRegister(!showingRegister);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={!isLoggedIn ? <LoginPage onLoginSuccess={handleLoginSuccess} setShowRegister={toggleRegister} /> : <Navigate replace to="/homepage" />} />
        <Route path="/register" element={<RegisterPage onRegisterSuccess={handleLoginSuccess} />} />
        <Route path="/homepage" element={isLoggedIn ? <HomePage onLogout={handleLogout} /> : <Navigate replace to="/" />} />
        <Route path="/cart" element={<ShoppingCartPage />} />
        <Route path="/payment-summary" element={<PaymentSummaryPage />} />
        <Route path="/payment-method" element={<PaymentMethodPage />} />
        <Route path="/payment-history" element={<visualizador_pagos />} />
      </Routes>
    </Router>
  );
};

export default App;
