import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DropdownCart from './Screens/DropdownCart';
import '../style.css';
import '../variables.css'; 

const Header = ({ cartCount }) => {
  const userName = localStorage.getItem('userName') || 'Usuario';
  const [showDropdown, setShowDropdown] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

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
      <div className="navbar">
        <ul>
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/categorias">Categorías</Link></li>
          <li><Link to="/productos">Productos</Link></li>
          <li><Link to="/favoritos">Favoritos</Link></li>
          <li><Link to="/pedidos">Pedidos</Link></li>
        </ul>
      </div>
      <form onSubmit={handleSearchSubmit} className="sb-example-1">
      <div class="search">
        <input 
          type="text" 
          class= "searchTerm"
          placeholder="Buscar..." 
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button type="submit" class= "searchButton">
          <img src='/images/lupa.png' alt="Lupa" width="30" height="30" />
        </button>
        </div>
      </form>
      <div className="user-cart">
        <Link to="/user" className="user-name">{userName}</Link>
        <div className="cart-icon" onClick={toggleDropdown}>
          <img src="https://cdn-icons-png.flaticon.com/512/3144/3144456.png" alt="Carrito de compras" width="45" height="45" />
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          {showDropdown && <DropdownCart cartItems={cartItems} onClose={closeDropdown} />}
        </div>
        <Link to="/vender-producto" className="button2">Vender</Link>
      </div>
    </header>
  );
};

export default Header;
