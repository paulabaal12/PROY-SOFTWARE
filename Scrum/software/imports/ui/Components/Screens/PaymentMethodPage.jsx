import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import '../../style.css';
import '../../variables.css';

const PaymentMethodPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Desestructuramos el estado recibido desde ShoppingCartPage.
  const { total, cartItems, userId, cartCount } = location.state || { 
    total: 0, 
    cartItems: [], 
    userId: null, 
    cartCount: 0 
  };

  const finalUserId = userId || localStorage.getItem('userId');
  
  // Estados para tipo de pago y moneda.
  const [paymentType, setPaymentType] = useState('paypal');
  const [currency, setCurrency] = useState(localStorage.getItem('currency') || 'GTQ');
  const [convertedTotal, setConvertedTotal] = useState('');

  // Se ejecuta al inicializar o al cambiar la moneda/total.
  useEffect(() => {
    setConvertedTotal(convertPrice(total));
  }, [currency, total]);

  useEffect(() => {
    console.log("User ID en PaymentMethodPage:", finalUserId);
    console.log("Cart Items en PaymentMethodPage:", cartItems);
    console.log("Total en PaymentMethodPage:", total);
  }, [finalUserId, cartItems, total]);

  // Lógica de PayPal para la integración del botón.
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
              usuario_id: finalUserId,
              total,
              detalles: JSON.stringify(
                cartItems.map(item => ({
                  producto_id: item.id,
                  cantidad: item.quantity,
                  precio_unitario: item.price,
                }))
              ),
            };
            console.log("Pedido Details:", pedidoDetails);
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

  // Maneja el cambio del tipo de pago.
  const handlePaymentTypeChange = (event) => setPaymentType(event.target.value);

  // Maneja el cambio del archivo para transferencia bancaria.
  const handleFileChange = (event) => setBankReceipt(event.target.files[0]);

  // Cambia la moneda seleccionada y la guarda en localStorage.
  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
    localStorage.setItem('currency', newCurrency);
  };

  // Convierte el precio basado en la moneda actual.
  const convertPrice = (precio) => {
    const numericPrice = parseFloat(precio); // Aseguramos que sea un número
  
    if (isNaN(numericPrice)) {
      console.warn(`Precio inválido: ${precio}`);
      return 'Q 0.00'; // Devolvemos un valor por defecto
    }
  
    let convertedPrice, symbol;
    const currency = localStorage.getItem('currency') || 'GTQ';
  
    switch (currency) {
      case 'USD':
        convertedPrice = (numericPrice / 8).toFixed(2);
        symbol = '$';
        break;
      case 'EUR':
        convertedPrice = (numericPrice / 9).toFixed(2);
        symbol = '€';
        break;
      case 'GBP':
        convertedPrice = (numericPrice / 11).toFixed(2);
        symbol = '£';
        break;
      default:
        convertedPrice = numericPrice.toFixed(2); // Por defecto en Quetzales
        symbol = 'Q';
    }
  
    return `${symbol} ${convertedPrice}`;
  };
  

  // Envía los detalles del pedido al servidor.
  const handleSubmit = (event) => {
    event.preventDefault();

    const parsedTotal = parseFloat(total) || 0;
    const parsedUserId = parseInt(finalUserId, 10);

    const detalles = JSON.stringify(
      cartItems.map(item => ({
        producto_id: item.id,
        cantidad: item.quantity,
        precio_unitario: parseFloat(item.price) || 0,
      }))
    );

    const pedidoDetails = {
      usuario_id: parsedUserId,
      total: parsedTotal,
      detalles,
    };

    console.log("Enviando pedido:", pedidoDetails);

    Meteor.call('pedidos.insert', pedidoDetails, (error) => {
      if (error) {
        console.error('Error al insertar el pedido:', error);
      } else {
        console.log('Pedido insertado correctamente');
        navigate('/thanks-for-shopping', { state: { cartItems } });
      }
    });
  };

  return (
    <>
      <Header cartCount={cartCount} onCurrencyChange={handleCurrencyChange} />
      <div className="container payment-method-page">
        <h1>Seleccione su Método de Pago</h1>
        <form onSubmit={handleSubmit}>
          <div className="payment-options">
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
                value="bankTransfer"
                checked={paymentType === 'bankTransfer'}
                onChange={handlePaymentTypeChange}
              />
              Transferencia Bancaria
            </label>

            <label>
              <input
                type="radio"
                name="paymentType"
                value="cashOnDelivery"
                checked={paymentType === 'cashOnDelivery'}
                onChange={handlePaymentTypeChange}
              />
              Pago Contra Entrega
            </label>
          </div>

          {paymentType === 'paypal' && (
            <div id="paypal-button-container">
              <p>Opción de "Tarjeta de débito o crédito" manejada por PayPal.</p>
            </div>
          )}

          {paymentType === 'bankTransfer' && (
            <div className="bank-transfer-details">
              <h3>Información Bancaria</h3>
              <p>Banco: Banco Industrial</p>
              <p>Cuenta: 123-4567890</p>
              <p>Nombre: Tienda XYZ</p>
              <label>
                Subir Comprobante:
                <input type="file" onChange={handleFileChange} />
              </label>
            </div>
          )}

          {paymentType === 'cashOnDelivery' && (
            <div className="cash-on-delivery-details">
              <h3>Pago Contra Entrega</h3>
              <p>Su pedido será cobrado en efectivo al momento de la entrega.</p>
            </div>
          )}

          <div className="total-payment">
            <p>Total a Pagar: {convertedTotal}</p>
          </div>

          <button type="submit">Confirmar Pago</button>
        </form>
        <Footer />
      </div>
    </>
  );
};

export default PaymentMethodPage;
