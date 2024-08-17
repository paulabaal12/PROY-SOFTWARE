import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DropdownCart from './Screens/DropdownCart';
import '../style.css'; // Asegúrate de que la ruta sea correcta
import '../variables.css'; // Asegúrate de que la ruta sea correcta
const Header = ({ cartCount }) => {
  const userName = localStorage.getItem('userName') || 'Usuario';
  const [showDropdown, setShowDropdown] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(storedCartItems);
  }, [cartCount]);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const closeDropdown = () => {
    setShowDropdown(false);
  };

  return (
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
      <div className="search-bar">
        <input type="text" placeholder="Buscar..." />
        <button type="submit">
          <img src="https://icones.pro/wp-content/uploads/2021/06/icone-loupe-gris.png" alt="Lupa" width="30" height="30" />
        </button>
      </div>
      <div className="user-cart">
        <Link to="/user" className="user-name">{userName}</Link>
        <div className="cart-icon" onClick={toggleDropdown}>
          <img src="https://cdn-icons-png.flaticon.com/512/3144/3144456.png" alt="Carrito de compras" width="45" height="45" />
          {cartCount > 0 && (
            <span className="cart-count">{cartCount}</span>
          )}
          {showDropdown && <DropdownCart cartItems={cartItems} onClose={closeDropdown} />}
        </div>
        <Link to="/vender-producto" className="button2">Vender</Link>
      </div>
    </header>
  );
};

export default Header;
