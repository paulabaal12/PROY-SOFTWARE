// imports/ui/Components/Screens/SearchResults.jsx

import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import Header from '../Header';
import Footer from '../Footer';
import '../../style.css';
import '../../variables.css';

// Diccionario de sinónimos
const sinonimos = {
  // Articulos de papeleria
  lapicero: ["boligrafo", "pluma", "esfero", "pen"],
  marcador: ["resaltador", "rotulador", "marcador permanente"],
  
  // Dispositivos electronicos
  celular: ["telefono", "movil", "smartphone"],
  computadora: ["ordenador", "pc", "laptop", "computador"],
  audifonos: ["auriculares", "cascos", "headphones"],
  
  // Discos y almacenamiento
  cd: ["disco", "compact disc", "album", "musica"],
  usb: ["memoria usb", "pendrive", "flash drive"],
  
  // Ropa
  camiseta: ["playera", "remera", "polera", "t-shirt"],
  jeans: ["pantalones", "pantalon", "pantalones de mezclilla"],
  
  // Zapatos
  zapatillas: ["tenis", "deportivas", "sneakers"],
  botas: ["botines", "zapatos altos"],
  
  // Tecnologia
  tablet: ["tableta", "ipad", "dispositivo portatil"],
  impresora: ["printer", "fotocopiadora", "impresora multifuncion"],
  
  // Muebles
  sofa: ["sillon", "mueble", "couch"],

  sillón: ["sillon", "mueble", "couch"],
  cama: ["lecho", "cama matrimonial", "cama individual"],
  
  // Cocina y Hogar
  nevera: ["refrigerador", "frigorifico", "heladera"],
  microondas: ["horno de microondas", "micro"],
  
  // Otros
  carro: ["coche", "auto", "vehiculo"],
  bicicleta: ["bici", "cicla", "mountain bike"],
  drone: ["dron", "vehiculo aereo no tripulado"],
};

// Función para eliminar tildes de una palabra
const removerTildes = (texto) => {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const SearchResults = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('q');

  useEffect(() => {
    const expandirConsulta = (query) => {
      const normalizedQuery = removerTildes(query.toLowerCase());
      const terms = [normalizedQuery];

      if (sinonimos[normalizedQuery]) {
        terms.push(...sinonimos[normalizedQuery].map(removerTildes));
      }
      return terms;
    };

    const fetchSearchResults = () => {
      setLoading(true);
      const expandedQueries = expandirConsulta(searchQuery);

      Meteor.call('productos.search', expandedQueries, (error, results) => {
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
