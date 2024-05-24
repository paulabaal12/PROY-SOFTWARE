import React from 'react';
import VenderProductoForm from './VenderProductoForm';
import Header from '../Header';
import Footer from '../Footer';
import '../../style.css'; // Importando estilo desde el directorio raíz
import '../../variables.css'; // Importando variables desde el directorio raíz

const VenderProductoPage = () => {
  return (
    <div className="containerr">
      <Header />
      <VenderProductoForm />
      <Footer />
    </div>
  );
};

export default VenderProductoPage;
