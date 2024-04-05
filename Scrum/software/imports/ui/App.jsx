import React, { useState } from 'react';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import PaymentMethodPage from './PaymentMethodPage';
import PaymentSummaryPage from './PaymentSummaryPage';
import ShoppingCartPage from './ShoppingCartPage';

export const App = () => {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div>
      {showRegister ? (
        <RegisterPage />
      ) : (
        <LoginPage setShowRegister={setShowRegister} />
      )}
    </div>
  );
};