import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/ShoppingCartPage.css';
import Header from '../../Header';
import Footer from '../../Footer';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem } from '@material-ui/core';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

// Datos de transacciones generados aleatoriamente
const transactionsData = [
  // ... datos de transacciones generados anteriormente
  { id: 1, monto: 4050.07, fechaInicio: '12/12/2021', fechaFin: '17/07/2021', medioPago: 'Visa', estado: 'Pendiente' },
  { id: 2, monto: 1261.49, fechaInicio: '10/04/2021', fechaFin: '23/01/2023', medioPago: 'Transferencia bancaria', estado: 'Pendiente' },
  { id: 3, monto: 1768.91, fechaInicio: '08/05/2023', fechaFin: '19/06/2021', medioPago: 'Dinero', estado: 'Pendiente' },
  { id: 4, monto: 572.98, fechaInicio: '18/02/2021', fechaFin: '09/10/2021', medioPago: 'PayPal', estado: 'Cancelado' },
  { id: 5, monto: 4416.41, fechaInicio: '25/12/2022', fechaFin: '06/01/2021', medioPago: 'Dinero', estado: 'Completado' },
  { id: 6, monto: 741.05, fechaInicio: '31/12/2021', fechaFin: '05/09/2021', medioPago: 'PayPal', estado: 'Pendiente' },
  { id: 7, monto: 3187.92, fechaInicio: '07/11/2021', fechaFin: '16/03/2023', medioPago: 'Mastercard', estado: 'Completado' },
  { id: 8, monto: 3482.01, fechaInicio: '01/11/2022', fechaFin: '26/07/2021', medioPago: 'Mastercard', estado: 'Cancelado' },
  { id: 9, monto: 399.6, fechaInicio: '18/02/2022', fechaFin: '16/10/2021', medioPago: 'Dinero', estado: 'Completado' },
  { id: 10, monto: 4898.28, fechaInicio: '05/10/2023', fechaFin: '26/12/2023', medioPago: 'Mastercard', estado: 'Completado' }
 ];
 
 
 // Colores para estados de las transacciones
 const paymentStatusColors = {
  Completado: "#0088FE",
  Pendiente: "#00C49F",
  Cancelado: "#FFBB28"
 };
 
 
 // Función para agrupar los datos por estado y por método de pago
 const groupBy = (key, data) => data.reduce((acc, item) => {
  acc[item[key]] = acc[item[key]] || { name: item[key], value: 0 };
  acc[item[key]].value += 1;
  return acc;
 }, {});
 
const ShoppingCartPage = () => {
  const navigate = useNavigate();
  
  const [selectedState, setSelectedState] = useState('');

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
  };

  const filteredTransactions = transactionsData.filter((transaction) => {
    if (selectedState === '') return true;
    return transaction.estado === selectedState;
  });

  // Datos agrupados para las gráficas
  const dataGroupedByState = Object.values(groupBy('estado', transactionsData));
  const dataGroupedByPaymentMethod = Object.values(groupBy('medioPago', transactionsData));

return (
  /*
  

  <div className="shopping-cart">
    <Header />
    <h1>Carrito de Compras</h1>
    <table>
      <thead>
        <tr>
          <th>Producto</th>
          <th>Cantidad</th>
          <th>Precio Unitario</th>
          <th>Total</th>
          <th>Acciones</th>
        </tr>
      </thead>

    </table>
  </div>
);
  */



<div>
<Header />

<h1>Carrito de Compras</h1>

<Paper style={{ margin: 16, padding: 16 }}>
  {/* Filtros y Tabla de Transacciones */}
  <Select
    value={selectedState}
    onChange={handleStateChange}
  >
    <MenuItem value="">Todos</MenuItem>
    <MenuItem value="Pendiente">Pendiente</MenuItem>
    <MenuItem value="Cancelado">Cancelado</MenuItem>
    <MenuItem value="Completado">Completado</MenuItem>
  </Select>


  {/* Tabla de Transacciones */}
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>ID Venta</TableCell>
          <TableCell>Monto</TableCell>
          <TableCell>Fecha Inicio</TableCell>
          <TableCell>Fecha Fin</TableCell>
          <TableCell>Medio Pago</TableCell>
          <TableCell>Estado</TableCell>
        </TableRow>
      </TableHead>
      {/* ... aquí iría la tabla de transacciones y filtros  ... */}


      <TableBody>
        {filteredTransactions.map((row) => (
          <TableRow key={row.id}>
            <TableCell>{row.id}</TableCell>
            <TableCell>{row.monto}</TableCell>
            <TableCell>{row.fechaInicio}</TableCell>
            <TableCell>{row.fechaFin}</TableCell>
            <TableCell>{row.medioPago}</TableCell>
            <TableCell>{row.estado}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>




  {/* Gráficas de Pie */}
  <div style={{ display: 'flex', justifyContent: 'space-around' }}>
    {/* Gráfica de Pie por Estados */}
    <PieChart width={400} height={400}>
      <Pie
        data={dataGroupedByState}
        cx={200}
        cy={200}
        labelLine={false}
        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
      >
        {dataGroupedByState.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={paymentStatusColors[entry.name]} />
        ))}
      </Pie>
      <Legend />
      <Tooltip />
    </PieChart>


    {/* Gráfica de Pie por Métodos de Pago */}
    <PieChart width={400} height={400}>
      <Pie
        data={dataGroupedByPaymentMethod}
        cx={200}
        cy={200}
        labelLine={false}
        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
      >
        {dataGroupedByPaymentMethod.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={paymentStatusColors[entry.name] || "#8884d8"} />
        ))}
      </Pie>
      <Legend />
      <Tooltip />
    </PieChart>
  </div>
</Paper>
</div>
);


};  

export default ShoppingCartPage;
