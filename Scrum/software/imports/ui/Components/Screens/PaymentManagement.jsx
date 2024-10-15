import React, { useState, useEffect } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import '../../style.css'; // Asegúrate de que los estilos estén actualizados

const PaymentManagement = () => {
  const [metodosPago, setMetodosPago] = useState([]);
  const [historialPagos, setHistorialPagos] = useState([]);
  const [detalles, setDetalles] = useState({});
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const usuarioId = 1; // Cambia según la lógica de autenticación

  // Cargar los métodos de pago y el historial al inicio
  useEffect(() => {
    Meteor.call('paymentMethods.get', usuarioId, (err, res) => {
      if (!err) {
        console.log('Métodos de pago obtenidos:', res); // Depuración
        setMetodosPago(res);
      } else {
        console.error('Error al obtener los métodos de pago:', err);
      }
    });

    Meteor.call('paymentHistory.get', usuarioId, (err, res) => {
      if (!err) {
        console.log('Historial de pagos obtenido:', res); // Depuración
        setHistorialPagos(res);
      } else {
        console.error('Error al obtener el historial de pagos:', err);
      }
    });
  }, []);

  const handleUpdate = (id) => {
    Meteor.call('paymentMethods.update', id, detalles, (err) => {
      if (!err) {
        alert('Método de pago actualizado correctamente.');
        closeModal();
      } else {
        console.error('Error al actualizar el método de pago:', err);
      }
    });
  };

  const handleChange = (e) => {
    e.persist(); // Persistimos el evento para evitar que se libere
    setDetalles((prevDetalles) => ({
      ...prevDetalles,
      [e.target.name]: e.target.value,
    }));
  };

  const openModal = (method) => {
    if (method) {
      const { detalles = {} } = method; // Desestructurar los detalles
      console.log('Abriendo modal con:', method); // Depuración

      setSelectedMethod(method);
      setDetalles({
        banco: detalles.banco || '',
        cuenta: detalles.cuenta || '',
        paypal_id: detalles.paypal_id || '',
        paypal_secret: detalles.paypal_secret || '',
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
        {metodosPago.map((metodo) => (
          <li key={metodo.id} className="payment-method-item">
            <span><strong>Tipo de Método:</strong> {metodo.tipo_metodo}</span>
            <button
              onClick={() => openModal(metodo)}
              className="modify-button"
            >
              Modificar
            </button>
          </li>
        ))}
      </ul>

      {showModal && selectedMethod && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Modificar {selectedMethod?.tipo_metodo}</h2>
            <form>
              {selectedMethod?.tipo_metodo === 'Transferencia' && (
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

              {selectedMethod?.tipo_metodo === 'PayPal' && (
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
                onClick={() => handleUpdate(selectedMethod.id)}
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
