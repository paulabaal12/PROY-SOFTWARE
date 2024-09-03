import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import Header from '../Header';
import Footer from '../Footer';
import '../../style.css'; 
import '../../variables.css'; 

const SearchResults = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('q');

  useEffect(() => {
    const fetchSearchResults = () => {
      setLoading(true);
      Meteor.call('productos.search', searchQuery, (error, results) => {
        if (error) {
          console.error('Error searching products:', error);
          setSearchResults([]);
        } else {
          setSearchResults(results);
        }
        setLoading(false);
      });
    };

    if (searchQuery) {
      fetchSearchResults();
    }
  }, [searchQuery]);

  return (
    <div className="containerr">
      <Header />
      <main className="main-content2">
        <h1 className="search-title1">Búsqueda de producto: {searchQuery}</h1>
        {loading ? (
          <p className="loading-message1">Cargando resultados...</p>
        ) : searchResults.length > 0 ? (
          <div className="search-results-grid1">
            {searchResults.map((product) => (
              <div key={product.id} className="product-card1">
                <img src={product.imagen_principal} alt={product.nombre} className="product-image1" />
                <h3 className="product-name1">{product.nombre}</h3>
                <p className="product-price1">Precio: ${product.precio}</p>
                <Link to={`/producto/${product.id}`} className="product-link1">Ver detalles</Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-results-message1">No se encontraron resultados para "{searchQuery}"</p>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SearchResults;