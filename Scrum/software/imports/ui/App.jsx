import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Modal from 'react-modal';
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

  // This sets up the app element for modals at the start of the application
  Modal.setAppElement('#root');

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={!isLoggedIn ? <LoginPage onLoginSuccess={handleLoginSuccess} /> : <Navigate replace to="/homepage" />} />
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

