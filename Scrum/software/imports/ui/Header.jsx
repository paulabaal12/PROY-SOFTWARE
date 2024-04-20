import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const userData = JSON.parse(localStorage.getItem('user')) || {};
  const { name, profilePicture } = userData;

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
        {/* Perfil de usuario y carrito de compras */}
        <div className="user-cart">
          <div className="user-profile">
            {profilePicture && (
              <img
                src={URL.createObjectURL(profilePicture)}
                alt="Foto de perfil"
                width="60"
                height="40"
              />
            )}
          </div>
          <span className="user-name">{name || 'Usuario'}</span>
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
    </div>
  );
};

export default Header;