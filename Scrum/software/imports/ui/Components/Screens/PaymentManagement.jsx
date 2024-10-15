import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import '../../style.css'; // Asegúrate de que los estilos estén actualizados

const PaymentManagement = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId'); // Recupera el ID del usuario

  // Estado para los métodos de pago, historial y detalles seleccionados
  const [metodosPago, setMetodosPago] = useState([
    { tipo_metodo: 'Transferencia', detalles: {} },
    { tipo_metodo: 'PayPal', detalles: {} },
    { tipo_metodo: 'Pago contra entrega', detalles: {} }
  ]);
  const [historialPagos, setHistorialPagos] = useState([]);
  const [detalles, setDetalles] = useState({});
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Redirigir al login si no hay usuario
  useEffect(() => {
    if (!userId) {
      console.warn('No se encontró un ID de usuario. Redirigiendo al login.');
      navigate('/login');
    } else {
      console.log(`ID del usuario recuperado: ${userId}`);
      loadPaymentHistory(userId); // Cargar historial
    }
  }, [userId, navigate]);

  // Cargar historial de pagos
  const loadPaymentHistory = (id) => {
    Meteor.call('paymentHistory.get', id, (err, res) => {
      if (!err) {
        console.log('Historial de pagos obtenido:', res);
        setHistorialPagos(res);
      } else {
        console.error('Error al obtener el historial de pagos:', err);
      }
    });
  };

  // Actualizar o añadir un método de pago
  const handleUpdate = () => {
    if (!selectedMethod) {
      console.error("No hay método seleccionado.");
      return;
    }
  
    const payload = {
      usuario_id: userId, // Asegúrate de que el ID del usuario sea correcto.
      tipo_metodo: selectedMethod.tipo_metodo, // Verifica que el tipo se envíe correctamente.
      detalles: {
        banco: detalles.banco || '',
        cuenta: detalles.cuenta || '',
        paypal_id: detalles.paypal_id || '',
        paypal_secret: detalles.paypal_secret || '',
      },
    };
  
    console.log("Datos enviados para procesar:", payload);
  
    Meteor.call('paymentMethods.insertOrUpdate', payload, (err) => {
      if (!err) {
        alert('Método de pago procesado correctamente.');
        closeModal();
      } else {
        console.error('Error al procesar el método de pago:', err);
      }
    });
  };
  
  
  

  const handleChange = (e) => {
    e.persist(); // Previene que React libere el evento
  
    setDetalles((prevDetalles) => ({
      ...prevDetalles,
      [e.target.name]: e.target.value,
    }));
  };
  

  const openModal = (method) => {
    if (method) {
      console.log('Abriendo modal con:', method); // Depuración
  
      setSelectedMethod(method); // Guarda el método seleccionado en el estado.
  
      setDetalles({
        banco: method.detalles?.banco || '',
        cuenta: method.detalles?.cuenta || '',
        paypal_id: method.detalles?.paypal_id || '',
        paypal_secret: method.detalles?.paypal_secret || '',
      });
  
      setShowModal(true);
    }
  };
  
  
  
  

  const closeModal = () => {
    setShowModal(false);
    setSelectedMethod(null);
    setDetalles({});
  };
  

  return (
    <div className="containerr">
      <Header cartCount={0} />
      <h1 className="payment-title">Gestión de Métodos de Pago</h1>

      <ul className="payment-method-list">
        {metodosPago.map((metodo, index) => (
          <li key={index} className="payment-method-item">
            <span><strong>Tipo de Método:</strong> {metodo.tipo_metodo}</span>
            <button
              onClick={() => openModal(metodo)}
              className="modify-button"
            >
              {metodo.detalles ? 'Modificar' : 'Añadir'}
            </button>
          </li>
        ))}
      </ul>

      {showModal && selectedMethod && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedMethod.detalles ? 'Modificar' : 'Añadir'} {selectedMethod.tipo_metodo}</h2>
            <form>
              {selectedMethod.tipo_metodo === 'Transferencia' && (
                <>
                  <label>Banco:</label>
                  <input
                    type="text"
                    name="banco"
                    value={detalles.banco}
                    onChange={handleChange}
                  />
                  <label>Cuenta de Banco:</label>
                  <input
                    type="text"
                    name="cuenta"
                    value={detalles.cuenta}
                    onChange={handleChange}
                  />
                </>
              )}

              {selectedMethod.tipo_metodo === 'PayPal' && (
                <>
                  <label>PayPal ID:</label>
                  <input
                    type="text"
                    name="paypal_id"
                    value={detalles.paypal_id}
                    onChange={handleChange}
                  />
                  <label>PayPal Secret:</label>
                  <input
                    type="text"
                    name="paypal_secret"
                    value={detalles.paypal_secret}
                    onChange={handleChange}
                  />
                </>
              )}

              <button
                type="button"
                onClick={() => handleUpdate(selectedMethod.tipo_metodo)}
                className="modify-button"
              >
                Guardar Cambios
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="cancel-button"
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}

      <center><h2>Historial de Pagos</h2></center>
      <ul className="payment-history-list">
        {historialPagos.length > 0 ? (
          historialPagos.map((pago) => (
            <li key={pago.id_venta} className="payment-history-item">
              <p><strong>Fecha:</strong> {new Date(pago.fecha_inicio).toLocaleDateString()}</p>
              <p><strong>Monto:</strong> Q{pago.monto.toFixed(2)}</p>
              <p><strong>Método:</strong> {pago.medio_pago}</p>
            </li>
          ))
        ) : (
          <p>No hay pagos registrados en el historial.</p>
        )}
      </ul>

      <Footer />
    </div>
  );
};

export default PaymentManagement;
