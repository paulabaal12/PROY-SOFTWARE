import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem } from '@material-ui/core';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import '../../style.css'; // Importando estilo desde el directorio raíz
import '../../variables.css'; // Importando variables desde el directorio raíz


const paymentStatusColors = {
  Completado: "#0088FE",
  Pendiente: "#00C49F",
  Cancelado: "#FFBB28"
};

const groupBy = (key, data) => data.reduce((acc, item) => {
  acc[item[key]] = acc[item[key]] || { name: item[key], value: 0 };
  acc[item[key]].value += 1;
  return acc;
}, {});

const VisualizadorPagos = () => {
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState('');
  const [transactionsData, setTransactionsData] = useState([]);

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const response = await fetch('/api/ventas/getAll');
        const data = await response.json();
        setTransactionsData(data);
      } catch (error) {
        console.error('Error al obtener los datos de ventas:', error);
      }
    };

    fetchVentas();
  }, []);

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
  };

  const filteredTransactions = transactionsData.filter((transaction) => {
    if (selectedState === '') return true;
    return transaction.estado === selectedState;
  });

  const dataGroupedByState = Object.values(groupBy('estado', transactionsData));
  const dataGroupedByPaymentMethod = Object.values(groupBy('medioPago', transactionsData));

  return (
    <div className="container">
      <Header />
      <h1>Visualizador de Pagos</h1>
      <Paper style={{ margin: 16, padding: 16 }}>
        <Select value={selectedState} onChange={handleStateChange}>
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="Pendiente">Pendiente</MenuItem>
          <MenuItem value="Cancelado">Cancelado</MenuItem>
          <MenuItem value="Completado">Completado</MenuItem>
        </Select>
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
            <TableBody>
              {filteredTransactions.map((row) => (
                <TableRow key={row.id_venta}>
                  <TableCell>{row.id_venta}</TableCell>
                  <TableCell>{row.monto}</TableCell>
                  <TableCell>{row.fecha_inicio}</TableCell>
                  <TableCell>{row.fecha_fin}</TableCell>
                  <TableCell>{row.medio_pago}</TableCell>
                  <TableCell>{row.estado}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <PieChart width={400} height={400}>
            <Pie data={dataGroupedByState} cx={200} cy={200} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
              {dataGroupedByState.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={paymentStatusColors[entry.name]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
          <PieChart width={400} height={400}>
            <Pie data={dataGroupedByPaymentMethod} cx={200} cy={200} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
              {dataGroupedByPaymentMethod.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={paymentStatusColors[entry.name] || "#8884d8"} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </div>
      </Paper>
      <Footer />
    </div>
  );
};

export default VisualizadorPagos;
