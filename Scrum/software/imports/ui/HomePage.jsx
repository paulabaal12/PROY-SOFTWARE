import React from 'react';
import './style.css';
import { Link } from 'react-router-dom';

const HomePage = () => {
  
  const { name, profilePicture } = JSON.parse(localStorage.getItem('user')) || {};

  return (
    <div className="container">
      {/* Encabezado */}
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
              <Link to="/cuenta">Cuenta</Link>
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
        {/* Perfil de usuario y carrito de compras */}
        <div className="user-cart">
          <div className="user-profile">
            <img
              src={profilePicture || 'https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png'}
              alt="Foto de perfil"
              width="60"
              height="40"
            />
            <span>{name || ''}</span>
          </div>
          <div className="cart-icon">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3144/3144456.png"
              alt="Carrito de compras"
              width="45"
              height="45"
            />
          </div>
        </div>
      </header>
      {/* Contenido de la página */}
      <main></main>
    </div>
  );
};

export default HomePage;