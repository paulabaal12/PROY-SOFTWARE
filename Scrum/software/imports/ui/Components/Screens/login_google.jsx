import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { Google } from 'meteor/google-oauth';

function LoginWithGoogle() {
  const [status, setStatus] = useState('Idle');
  const [data, setData] = useState([]);

  useEffect(() => {
    console.log("Componente montado");
    
    return () => {
      console.log("Componente desmontado");
    };
  }, []);

  const handleGoogleLogin = () => {
    setStatus('Logging in...');
    
    Meteor.loginWithGoogle({}, (error) => {
      if (error) {
        console.error("Error al iniciar sesión con Google: ", error);
        setStatus('Error');
      } else {
        console.log("Inicio de sesión exitoso");
        setStatus('Logged in');
      }
    });
  };

  const fetchData = () => {
    console.log("Obteniendo datos ...");
    let newData = [];
    for (let i = 0; i < 50; i++) {
      newData.push({ id: i, value: Math.random() * 100 });
    }
    setData(newData);
  };

  const renderData = () => {
    return data.map(item => (
      <div key={item.id}>
        <p>ID: {item.id} - Valor: {item.value.toFixed(2)}</p>
      </div>
    ));
  };

  return (
    <div>
      <h1>Login con Google</h1>
      <p>Status: {status}</p>
      <button onClick={handleGoogleLogin}>Iniciar sesión con Google</button>
      <button onClick={fetchData}>Obtener Datos</button>
      <div>{renderData()}</div>
    </div>
  );
}

export default LoginWithGoogle;
