import React from 'react';
import VenderProductoForm from './VenderProductoForm';
import './productos.css';
import Header from '../../Header';
import Footer from '../../Footer';

const VenderProductoPage = () => {
  return (
    <div className='VenderProductoPage'>
      <Header />
      <h1 className='form-title'>Vender Producto</h1>
      <VenderProductoForm />
      <Footer />
    </div>
  );
};

export default VenderProductoPage;