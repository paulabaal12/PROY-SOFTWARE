import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import Header from '../Header';
import Footer from '../Footer';
import '../../style.css';
import '../../variables.css';

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 100000000]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const categories = [
    "Hogar", "Electrónicos", "Libros", "Accesorio",
    "Juguetes", "Deportes", "Belleza", "Alimentos",
    "Automóviles", "Viajes", "Mascotas", "Salud",
    "Jardín", "Herramientas", "Arte", "Música", 
    "Videojuegos", "Higiene"
  ];

  useEffect(() => {
    const fetchProducts = () => {
      setLoading(true);
      Meteor.call('productos.getAll', (error, result) => {
        if (error) {
          console.error('Error fetching products:', error);
          setProducts([]);
        } else {
          setProducts(result);
        }
        setLoading(false);
      });
    };

    fetchProducts();
  }, []);

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prevCategories =>
      prevCategories.includes(category)
        ? prevCategories.filter(c => c !== category)
        : [...prevCategories, category]
    );
  };

  const filteredProducts = products.filter(product =>
    product.precio >= priceRange[0] &&
    product.precio <= priceRange[1] &&
    (selectedCategories.length === 0 || selectedCategories.includes(product.categoria)) 
  );

  if (loading) {
    return <p className="product-catalog__loading">Cargando productos...</p>;
  }

  return (
    <div>
      <Header/>
      <main className="product-catalog__main">
        <h1 className="product-catalog__title">Catálogo de Productos</h1>
        <div className="product-catalog__container">
          <aside className="product-catalog__filter">
            <h2 className="product-catalog__filter-title">Filtros</h2>
            <div className="product-catalog__price-filter">
              <h3>Precio</h3>
              <p>${priceRange[0]} - ${priceRange[1]}</p>
              <input
                type="range"
                min={0}
                max={100000000}
                value={priceRange[1]}
                onChange={(e) => handlePriceChange(e, [priceRange[0], Number(e.target.value)])}
                className="product-catalog__price-slider"
              />
            </div>
            <div className="product-catalog__brand-filter">
              <h3>Categorías</h3>
              {categories.map(category => (
                <label key={category} className="product-catalog__brand-option">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryToggle(category)}
                  />
                  {category}
                </label>
              ))}
            </div>
          </aside>
          <div className="product-catalog__grid">
            {filteredProducts.map(product => (
              <div key={product._id} className="product-catalog__card">
                <img src={product.imagen_principal} alt={product.nombre} className="product-catalog__image" />
                <h2 className="product-catalog__name">{product.nombre}</h2>
                <p className="product-catalog__price">${product.precio}</p>
                <Link to={`/productos/${product.id}`} className="product-catalog__button">Ver detalles</Link>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductCatalog;
