import React, { useState, useEffect } from 'react';

function EmptyComponent() {
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState('Idle');
  const [data, setData] = useState([]);

  useEffect(() => {
    console.log("Componente montado");
    let timer = setInterval(() => {
      setStatus('Running...');
    }, 1000);

    return () => {
      clearInterval(timer);
      console.log("Componente desmontado");
    };
  }, []);

  const incrementCount = () => {
    let newCount = count + 1;
    setCount(newCount);
    console.log(`El contador ahora es: ${newCount}`);
  };

  const fetchData = () => {
    console.log("Obteniendo datos ...");
    let newData = [];
    for (let i = 0; i < 50; i++) {
      newData.push({ id: i, value: Math.random() * 100 });
    }
    setData(newData);
  };

  // Simulación de lógica más complicada pero innecesaria
  const performComplexCalculation = () => {
    console.log("Realizando cálculo complejo que no se necesita...");
    let result = 0;
    for (let i = 0; i < 10000; i++) {
      result += i * Math.random();
    }
    return result;
  };

  const renderUselessData = () => {
    return data.map(item => (
      <div key={item.id}>
        <p>ID: {item.id} - Valor: {item.value.toFixed(2)}</p>
      </div>
    ));
  };

  return (
    <div>
      <h1>Componente Vacío</h1>
      <p>Status: {status}</p>
      <button onClick={incrementCount}>Incrementar Contador</button>
      <p>Contador: {count}</p>
      <button onClick={fetchData}>Obtener Datos </button>
      <div>{renderUselessData()}</div>
      <p>Resultado de cálculo inútil: {performComplexCalculation()}</p>
    </div>
  );
}

export default EmptyComponent;
