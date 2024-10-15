import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './Components/Auth/LoginPage';
import RegisterPage from './Components/Auth/RegisterPage';
import HomePage from './HomePage';
import ProductoDetalles from './Components/Screens/ProductoDetalles';
import VenderProductoPage from './Components/Screens/VenderProductoPage';
import ShoppingCartPage from './Components/Screens/ShoppingCartPage';
import PaymentMethodPage from './Components/Screens/PaymentMethodPage';
import PaymentSummaryPage from './Components/Screens/PaymentSummaryPage';
import Categorias from './Components/Screens/categoriasPage';
import Favorito from './Components/Screens/favoritos';
import ThanksForShopping from './Components/Screens/ThanksForShopping';
import User from './Components/Screens/User';
import Visualizador_pagos from './Components/Screens/visualizador_pagos';
import PaymentManagement from './Components/Screens/PaymentManagement';
import InventoryManagement from './Components/Screens/InventoryManagement';
import DeliveryManagement from './Components/Screens/DeliveryManagement';
import './style.css';
import './variables.css';
import CRUDProductos from './Components/Screens/CRUDProductos';
import ListaProductos from './Components/Screens/ListaProductos';
import FormularioProducto from './Components/Screens/FormularioProducto';
import CategoriaDetalle from './Components/Screens/CategoriaDetalle';
import ProductDetail from './Components/Screens/ProductDetail'; 
import SearchResults from './Components/Screens/SearchResults';
import Productos from './Components/Screens/productos';
import ProductCatalog from './Components/Screens/ProductCatalog';
import ProductDetails from './Components/Screens/ProductDetails';//ver producto detalle
import ProductosPage from './Components/Screens/ProductosPage';
import PedidosPage from './Components/Screens/PedidosPage';





export const App = () => {

  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showingRegister, setShowingRegister] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const toggleRegister = () => {
    setShowingRegister(!showingRegister);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            !isLoggedIn ? (
              <LoginPage onLoginSuccess={handleLoginSuccess} setShowRegister={toggleRegister} />
            ) : (
              <Navigate replace to="/homepage" />
            )
          }
        />
        <Route
          path="/login"
          element={
            !isLoggedIn ? (
              <LoginPage onLoginSuccess={handleLoginSuccess} setShowRegister={toggleRegister} />
            ) : (
              <Navigate replace to="/homepage" />
            )
          }
        />
        <Route path="/register" element={<RegisterPage onLoginSuccess={handleLoginSuccess} />} />
        <Route
          path="/homepage"
          element={isLoggedIn ? <HomePage onLogout={handleLogout} /> : <Navigate replace to="/login" />}
        />
    
        <Route path="/producto/:id" element={<ProductoDetalles />} />
        <Route path="/vender-producto" element={<VenderProductoPage />} /> 
        <Route path="/cart" element={<ShoppingCartPage />} />
        <Route path="/payment-summary" element={<PaymentSummaryPage />} />
        <Route path="/payment-method" element={<PaymentMethodPage />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/thanks-for-shopping" element={<ThanksForShopping />} />
        <Route path="/user" element={<User onLogout={handleLogout} />} />
        <Route path="/pagos" element={<Visualizador_pagos />} />
        <Route path='/user/paymentmanagement' element={<PaymentManagement/>}/>
        <Route path='/user/deliverymanagement' element={<DeliveryManagement/>}/>
        <Route path='/user/inventorymanagement' element={<InventoryManagement/>}/>
        <Route path="/categoria/:nombre" element={<CategoriaDetalle />} />
        <Route path='/favoritos' element={<Favorito/>}/>
        <Route path="/monitoreo" element={<CRUDProductos />} />
        <Route path="/lista-productos" element={<ListaProductos />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/formulario-producto" element={<FormularioProducto />} />
        <Route path="/productos/:productoId" element={<ProductoDetalles />} />
        <Route path="/productos" element={<ProductCatalog />} />
        <Route path="/producto2/:id" element={<ProductDetails />} />    
        <Route path="/pedidos" element={<PedidosPage />} />
      </Routes>
    </Router>
  );
};

export default App;
