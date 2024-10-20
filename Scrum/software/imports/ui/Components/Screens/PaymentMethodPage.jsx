import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import '../../style.css';
import '../../variables.css';

const PaymentMethodPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { total, cartItems, userId } = location.state || { total: 0, cartItems: [], userId: null };
  const finalUserId = userId || localStorage.getItem('userId');

  useEffect(() => {
    console.log("User ID en PaymentMethodPage:", finalUserId);
    console.log("Cart Items en PaymentMethodPage:", cartItems);
    console.log("Total en PaymentMethodPage:", total);
  }, [finalUserId, cartItems, total]);

  const [paymentType, setPaymentType] = useState('paypal');
  const [bankReceipt, setBankReceipt] = useState(null);

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

  const handlePaymentTypeChange = (event) => setPaymentType(event.target.value);

  const handleFileChange = (event) => setBankReceipt(event.target.files[0]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const pedidoDetails = {
      usuario_id: parseInt(finalUserId, 10),
      total,
      detalles: JSON.stringify(
        cartItems.map(item => ({
          producto_id: item.id,
          cantidad: item.quantity,
          precio_unitario: item.price,
        }))
      ),
      metodo_pago: paymentType,
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
      <Header />
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

          {paymentType === 'paypal' && <div id="paypal-button-container"></div>}

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
            <p>Total a Pagar: Q{total ? total.toFixed(2) : '0.00'}</p>
          </div>

          <button type="submit">Confirmar Pago</button>
        </form>
        <Footer />
      </div>
    </>
  );
};

export default PaymentMethodPage;
