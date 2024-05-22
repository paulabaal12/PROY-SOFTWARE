import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './css/PaymentMethodPage.css';
import Header from '../../Header';
import Footer from '../../Footer';

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

  // Renderizar el botón de PayPal al seleccionar ese método
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
            console.log('Pago exitoso:', details);
            navigate('/thanks-for-shopping', { state: { details, cartItems } });
          });
        },
        onError: (err) => {
          console.error('Error en el pago:', err);
        }
      }).render('#paypal-button-container');
    }
  }, [paymentType, total, navigate]);

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
      // Asumiendo que ya has validado los datos de la tarjeta y que el pago ha sido procesado exitosamente
      const pedidoDetails = {
        usuario_id: 1, // Asegúrate de obtener el ID del usuario autenticado adecuadamente
        total: total,
        detalles: JSON.stringify(cartItems.map(item => ({
          producto_id: item.id,
          cantidad: item.quantity,
          precio_unitario: item.price
        })))
      };
  
      // Enviar los detalles del pedido al servidor usando Meteor.call
      Meteor.call('pedidos.insert', pedidoDetails, (error, result) => {
        if (error) {
          console.error('Error al realizar el pedido:', error);
        } else {
          console.log('Pedido realizado con éxito:', result);
          navigate('/thanks-for-shopping', { state: { cardDetails, cartItems } });
        }
      });
    }
  };
  

  return (
    <div className="payment-method-page">
      <Header />
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
  );
};

export default PaymentMethodPage;
