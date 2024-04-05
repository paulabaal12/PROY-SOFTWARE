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

/* 
import React, { useState } from 'react';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import HomePage from './HomePage'; // Lo que le toca crear a Brandon
import PaymentMethodPage from './PaymentMethodPage';
import PaymentSummaryPage from './PaymentSummaryPage';
import ShoppingCartPage from './ShoppingCartPage';

export const App = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const [transactionId, setTransactionId] = useState(null);

  const goToRegister = () => setCurrentPage('register');
  const goToLogin = () => setCurrentPage('login');
  const goToHome = () => setCurrentPage('home');
  const goToShoppingCart = () => setCurrentPage('shoppingCart');
  const goToPaymentMethod = () => setCurrentPage('paymentMethod');
  const goToPaymentSummary = (id) => {
    setTransactionId(id); // Aquí se debe cambiar por el verdadero ID de transacción obtenido tras el proceso de pago
    setCurrentPage('paymentSummary');
  };

  const confirmPaymentAndGoHome = () => {
    // Lógica para manejar la confirmación de pago
    console.log('Pago confirmado con ID:', transactionId);
    setCurrentPage('home'); // Después de confirmar el pago, redirige al usuario al inicio
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage setShowRegister={goToRegister} />;
      case 'register':
        return <RegisterPage goBack={goToLogin} />;
      case 'home':
        return <HomePage goToShoppingCart={goToShoppingCart} />;
      case 'shoppingCart':
        return <ShoppingCartPage onCheckout={goToPaymentMethod} />;
      case 'paymentMethod':
        return <PaymentMethodPage onPayment={goToPaymentSummary} />;
      case 'paymentSummary':
        return <PaymentSummaryPage transactionId={transactionId} onConfirmPayment={confirmPaymentAndGoHome} />;
      default:
        return <LoginPage setShowRegister={goToRegister} />;
    }
  };

  return (
    <div>
      {renderCurrentPage()}
    </div>
  );
};

export default App;
*/