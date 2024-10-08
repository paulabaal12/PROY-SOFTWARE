import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import '../../style.css'; // Importando estilo desde el directorio raíz
import '../../variables.css'; // Importando variables desde el directorio raíz


const PaymentMethodPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { total, cartItems } = location.state || { total: 0, cartItems: [] };

  const [paymentType, setPaymentType] = useState('creditCard');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  });

  useEffect(() => {
    if (paymentType === 'paypal' && window.paypal) {
      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: total.toString()
              }
            }]
          });
        },
        onApprove: (data, actions) => {
          return actions.order.capture().then((details) => {
            const pedidoDetails = {
              usuario_id: 1, 
              total: total,
              detalles: JSON.stringify(cartItems.map(item => ({
                producto_id: item.id,
                cantidad: item.quantity,
                precio_unitario: item.price
              })))
            };
            Meteor.call('pedidos.insert', pedidoDetails, (error, result) => {
              if (error) {
                console.error('Error al realizar el pedido:', error);
              } else {
                navigate('/thanks-for-shopping', { state: { details, cartItems } });
              }
            });
          });
        },
        onError: (err) => {
          console.error('Error en el pago:', err);
        }
      }).render('#paypal-button-container');
    }
  }, [paymentType, total, navigate, cartItems]);

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
    if (paymentType === 'creditCard') {
      const pedidoDetails = {
        usuario_id: 1,
        total: total,
        detalles: JSON.stringify(cartItems.map(item => ({
          producto_id: item.id,
          cantidad: item.quantity,
          precio_unitario: item.price
        })))
      };
      Meteor.call('pedidos.insert', pedidoDetails, (error, result) => {
        if (error) {
          console.error('Error al realizar el pedido:', error);
        } else {
          navigate('/thanks-for-shopping', { state: { cardDetails, cartItems } });
        }
      });
    }
  };

  return (
      <>
        <div className="containerr">
          <Header />
        </div>
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
        </div>
        {paymentType === 'creditCard' && (
          <div>
          </div>
        )}
          {paymentType === 'paypal' && (
            <div id="paypal-button-container"></div>
          )}
          <div className="total-payment">
            <p>Total a Pagar: ${total.toFixed(2)}</p>
          </div>
          <button type="submit">Confirmar Pago</button>
        </form>
        <Footer />
      </div>
    </>
  );
};


export default PaymentMethodPage;
