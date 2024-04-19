import React, { useState } from 'react';
import './css/PaymentMethodPage.css'

const PaymentMethodPage = () => {
  const [paymentType, setPaymentType] = useState('creditCard'); // Puede ser 'creditCard', 'paypal', etc.
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  });

  const handlePaymentTypeChange = (event) => {
    setPaymentType(event.target.value);
  };

  const handleInputChange = (event) => {
    setCardDetails({
      ...cardDetails,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Aquí se implementaría la lógica para procesar el pago
    console.log('Procesando pago con:', paymentType, cardDetails);
  };

  return (
    <div className="payment-method-page">
      <h1>Seleccione su Método de Pago</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <input
              type="radio"
              name="paymentType"
              value="creditCard"
              checked={paymentType === 'creditCard'}
              onChange={handlePaymentTypeChange}
            />
            Tarjeta de Crédito
          </label>
          <label>
            <input
              type="radio"
              name="paymentType"
              value="paypal"
              checked={paymentType === 'paypal'}
              onChange={handlePaymentTypeChange}
            />
            PayPal
          </label>
        </div>
        
        {paymentType === 'creditCard' && (
          <div>
            <label>
              Número de Tarjeta:
              <input
                type="text"
                name="cardNumber"
                value={cardDetails.cardNumber}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Nombre del Titular:
              <input
                type="text"
                name="cardHolder"
                value={cardDetails.cardHolder}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Mes de Expiración:
              <input
                type="text"
                name="expiryMonth"
                value={cardDetails.expiryMonth}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Año de Expiración:
              <input
                type="text"
                name="expiryYear"
                value={cardDetails.expiryYear}
                onChange={handleInputChange}
              />
            </label>
            <label>
              CVV:
              <input
                type="text"
                name="cvv"
                value={cardDetails.cvv}
                onChange={handleInputChange}
              />
            </label>
          </div>
        )}
        
        <button type="submit">Confirmar Pago</button>
      </form>
    </div>
  );
};

export default PaymentMethodPage;
