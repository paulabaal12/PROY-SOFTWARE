import React from 'react';
import VenderProductoForm from './VenderProductoForm';
import Header from './Header';
import Footer from './Footer';
import '../../../ui/style.css';

const VenderProductoPage = () => {
  return (
    <div className="container">
      <Header />
      <h1 className="titulo1">Vender Producto</h1>
      <VenderProductoForm />
      <Footer />
    </div>
  );
};

export default VenderProductoPage;
