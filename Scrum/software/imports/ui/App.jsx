import React, { useState } from 'react';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';

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