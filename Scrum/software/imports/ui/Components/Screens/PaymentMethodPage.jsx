import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import '../../style.css';
import '../../variables.css';

const PaymentMethodPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Comprobamos que `total` y `cartItems` existan y tengan valores adecuados
  const { total, cartItems } = location.state || { total: 0, cartItems: [] };

  const [paymentType, setPaymentType] = useState('creditCard');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });

  useEffect(() => {
    if (paymentType === 'paypal' && window.paypal) {
      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{ amount: { value: total.toFixed(2) } }],
          });
        },
        onApprove: (data, actions) => {
          return actions.order.capture().then((details) => {
            const pedidoDetails = {
              usuario_id: 1,
              total: total,
              detalles: JSON.stringify(
                cartItems.map(item => ({
                  producto_id: item.id,
                  cantidad: item.quantity,
                  precio_unitario: item.price,
                }))
              ),
            };
            Meteor.call('pedidos.insert', pedidoDetails, (error) => {
              if (!error) {
                navigate('/thanks-for-shopping', { state: { details, cartItems } });
              }
            });
          });
        },
        onError: (err) => {
          console.error('Error en el pago:', err);
        },
      }).render('#paypal-button-container');
    }
  }, [paymentType, total, cartItems, navigate]);

  const handlePaymentTypeChange = (event) => {
    setPaymentType(event.target.value);
  };

  const handleInputChange = (event) => {
    setCardDetails({
      ...cardDetails,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (paymentType === 'creditCard') {
      const pedidoDetails = {
        usuario_id: 1,
        total: total,
        detalles: JSON.stringify(
          cartItems.map(item => ({
            producto_id: item.id,
            cantidad: item.quantity,
            precio_unitario: item.price,
          }))
        ),
      };
      Meteor.call('pedidos.insert', pedidoDetails, (error) => {
        if (!error) {
          navigate('/thanks-for-shopping', { state: { cardDetails, cartItems } });
        }
      });
    }
  };

  return (
    <>
      <Header />
      <div className="container payment-method-page">
        <h1>Seleccione su Método de Pago</h1>
        <form onSubmit={handleSubmit}>
          <div>
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
          </div>

          {paymentType === 'paypal' && <div id="paypal-button-container"></div>}

          {paymentType === 'creditCard' && (
            <div className="credit-card-details">
              <input
                type="text"
                name="cardNumber"
                placeholder="Número de Tarjeta"
                value={cardDetails.cardNumber}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="cardHolder"
                placeholder="Titular de la Tarjeta"
                value={cardDetails.cardHolder}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="expiryMonth"
                placeholder="MM"
                value={cardDetails.expiryMonth}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="expiryYear"
                placeholder="YY"
                value={cardDetails.expiryYear}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="cvv"
                placeholder="CVV"
                value={cardDetails.cvv}
                onChange={handleInputChange}
              />
            </div>
          )}

          <div className="total-payment">
            <p>Total a Pagar: ${total ? total.toFixed(2) : '0.00'}</p>
          </div>
          <button type="submit">Confirmar Pago</button>
        </form>
        <Footer />
      </div>
    </>
  );
};

export default PaymentMethodPage;
