// DeliveryManagement.jsx
import React, { useState, useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Mongo } from 'meteor/mongo';

const Envios = new Mongo.Collection('envios');

const DeliveryManagement = () => {
  const [envios, setEnvios] = useState([]);

  const enviosData = useTracker(() => {
    Meteor.subscribe('envios');
    return Envios.find().fetch();
  }, []);

  useEffect(() => {
    setEnvios(enviosData);
  }, [enviosData]);

  return (
    <div>
      <h1>Gestión de Envíos</h1>
      <ul>
        {envios.map((envio) => (
          <li key={envio.id_envio}>
            <p>Proveedor: {envio.proveedor_envio}</p>
            <p>Número de Rastreo: {envio.numero_rastreo}</p>
            <p>Estado: {envio.estado_envio}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DeliveryManagement;
