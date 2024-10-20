import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import '../../style.css';
import '../../variables.css';

const PaymentMethodPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Obtenemos los datos del estado de navegación o establecemos valores predeterminados
  const { total, cartItems, userId } = location.state || { total: 0, cartItems: [], userId: null };

  // Si el userId no viene en la navegación, lo recuperamos del localStorage
  const finalUserId = userId || localStorage.getItem('userId');

  useEffect(() => {
    console.log("User ID en PaymentMethodPage:", finalUserId); // Verificación en consola
    console.log("Cart Items en PaymentMethodPage:", cartItems);
    console.log("Total en PaymentMethodPage:", total);
  }, [finalUserId, cartItems, total]);

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
              usuario_id: finalUserId, // Usamos el User ID dinámico
              total: total,
              detalles: JSON.stringify(
                cartItems.map(item => ({
                  producto_id: item.id,
                  cantidad: item.quantity,
                  precio_unitario: item.price,
                }))
              ),
            };
            console.log("Pedido Details:", pedidoDetails); // Verificación en consola
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
  }, [paymentType, total, cartItems, finalUserId, navigate]);

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
    
    const userId = parseInt(localStorage.getItem('userId'), 10); // Verifica el ID
  
    const pedidoDetails = {
      usuario_id: userId,
      total: total,
      detalles: JSON.stringify(
        cartItems.map(item => ({
          producto_id: item.id,
          cantidad: item.quantity,
          precio_unitario: item.price,
        }))
      ),
    };
  
    console.log("Enviando pedido:", pedidoDetails);
  
    Meteor.call('pedidos.insert', pedidoDetails, (error) => {
      if (error) {
        console.error('Error al insertar el pedido:', error);
      } else {
        console.log('Pedido insertado correctamente');
        navigate('/thanks-for-shopping', { state: { cardDetails, cartItems } });
      }
    });
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
