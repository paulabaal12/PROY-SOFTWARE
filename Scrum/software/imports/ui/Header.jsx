import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './style.css'

const Header = ({ children }) => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const handleMostrarFormulario = () => {
    setMostrarFormulario(!mostrarFormulario);
  };

  const userName = localStorage.getItem('userName') || 'Usuario';

  return (
    <div className="header-container">
      <header className="header">
        <div className="navbar">
          <ul>
            <li>
              <Link to="/">Inicio</Link>
            </li>
            <li>
              <Link to="/categorias">Categorías</Link>
            </li>
            <li>
              <Link to="/productos">Productos</Link>
            </li>
            <li>
              <Link to="/favoritos">Favoritos</Link>
            </li>
            <li>
              <Link to="/pedidos">Pedidos</Link>
            </li>
          </ul>
        </div>
        {/* Barra de búsqueda */}
        <div className="search-bar">
          <input type="text" placeholder="Buscar..." />
          <button type="submit">
            <img
              src="https://icones.pro/wp-content/uploads/2021/06/icone-loupe-gris.png"
              alt="Lupa"
              width="30"
              height="30"
            />
          </button>
        </div>
        {/* Nombre de usuario, carrito de compras y botón para vender producto */}
        <div className="user-cart">
          <span className="user-name">{userName}</span>
          <div className="cart-icon">
          <Link to="/cart" className="cart-icon">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3144/3144456.png"
              alt="Carrito de compras"
              width="45"
              height="45"
            />
          </Link>
          </div>
          <Link to="/vender-producto" className="button2">
            Vender
          </Link>
        </div>
      </header>
    </div>
  );
};

export default Header;