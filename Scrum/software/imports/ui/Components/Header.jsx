// Header.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DropdownCart from './Screens/DropdownCart';
import '../style.css';
import '../variables.css';

const Header = ({ cartCount, onCurrencyChange }) => {
  const userName = localStorage.getItem('userName') || 'Usuario';
  const [showDropdown, setShowDropdown] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [currency, setCurrency] = useState(localStorage.getItem('currency') || 'GTQ'); // Inicializamos con la moneda guardada

  const navigate = useNavigate();

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(storedCartItems);
  }, [cartCount]);

  useEffect(() => {
    localStorage.setItem('currency', currency);
    if (onCurrencyChange) {
      onCurrencyChange(currency);
    }
  }, [currency, onCurrencyChange]);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const closeDropdown = () => {
    setShowDropdown(false);
  };

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="menu-toggle" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <nav className={`navbar ${showMenu ? 'show' : ''}`}>
          <button className="close-menu" onClick={toggleMenu}>×</button>
          <ul>
            <li><Link to="/" onClick={() => setShowMenu(false)}>Inicio</Link></li>
            <li><Link to="/categorias" onClick={() => setShowMenu(false)}>Categorías</Link></li>
            <li><Link to="/productos" onClick={() => setShowMenu(false)}>Productos</Link></li>
            <li><Link to="/favoritos" onClick={() => setShowMenu(false)}>Favoritos</Link></li>
            <li><Link to="/pedidos" onClick={() => setShowMenu(false)}>Pedidos</Link></li>
          </ul>
        </nav>
        <form onSubmit={handleSearchSubmit} className="sb-example-1">
          <div className="search">
            <input
              type="text"
              className="searchTerm"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button type="submit" className="searchButton">
              <img src='/images/lupa.png' alt="Lupa" width="25" height="25" />
            </button>
          </div>
        </form>
        <div className="user-cart">
          <Link to="/user" className="user-name button2">{userName}</Link>
          <div className="cart-icon" onClick={toggleDropdown}>
            <img src="https://cdn-icons-png.flaticon.com/512/3144/3144456.png" alt="Carrito de compras" width="45" height="45" />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            {showDropdown && <DropdownCart cartItems={cartItems} onClose={closeDropdown} currency={currency} />}
          </div>
          <select value={currency} onChange={handleCurrencyChange} className="currency-select">
            <option value="USD">$</option>
            <option value="GTQ">Q</option>
            <option value="EUR">€</option>
            <option value="GBP">£</option>
          </select>
        </div>
      </div>
      {showMenu && <div className="menu-overlay" onClick={toggleMenu}></div>}
    </header>
  );
};

export default Header;
