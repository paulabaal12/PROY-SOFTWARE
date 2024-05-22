import React from 'react';
import '../../style.css'; // Importando estilo desde el directorio raíz
import '../../variables.css'; // Importando variables desde el directorio raíz

const ProductoAgregadoMensaje = () => {
  return (
    <div className="producto-agregado-mensaje">
      <p>Tu producto se agregó correctamente.</p>
      <p>Serás redirigido a la página principal en unos segundos...</p>
    </div>
  );
};

export default ProductoAgregadoMensaje;
