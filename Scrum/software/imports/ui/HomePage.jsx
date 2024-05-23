import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import { Link } from 'react-router-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Header from './Components/Header';
import Footer from './Components/Footer';
import './style.css';

const carouselImages = [
  { imageUrl: 'https://i5.walmartimages.com/seo/Mainstays-Alessandra-Matte-Black-12-Piece-Stoneware-Dinnerware-Set_a06eabea-1ba7-4a41-abbc-63151bf7c1b0.9fb529e6c752dbc2ef2efa717418a28f.jpeg?odnHeight=640&odnWidth=640&odnBg=FFFFFF', link: '/categoria1', categoryName: 'Categoría 1' },
  { imageUrl: 'https://i5.walmartimages.com/seo/OREO-Double-Stuf-Chocolate-Sandwich-Cookies-Family-Size-18-71-oz_12945353-d789-4390-aeff-ccf1ae7c6379.ab14d414c9811bb2961fcb5b49513660.jpeg?odnHeight=640&odnWidth=640&odnBg=FFFFFF', link: '/categoria2', categoryName: 'Categoría 2' },
  { imageUrl: 'https://i5.walmartimages.com/seo/Carote-Nonstick-Pots-and-Pans-Set-8-Pcs-Induction-Kitchen-Cookware-Sets-Beige-Granite_e4183757-3e78-4321-a9ad-3123804e77ad.98cb62d1e47bdc84f235cbdcfafac1db.png?odnHeight=640&odnWidth=640&odnBg=FFFFFF', link: '/categoria3', categoryName: 'Categoría 3' },
  { imageUrl: 'https://i5.walmartimages.com/seo/Sunny-Fun-Bounce-House-Nylon-Bouncy-House-for-Kids-Outdoor-with-Toddler-Slide_c653007e-0f42-4b95-813d-73b50f3064af.385c1063fcbdf8a36aff24733aeea5c3.jpeg?odnHeight=640&odnWidth=640&odnBg=FFFFFF', link: '/categoria4', categoryName: 'Categoría 4' },
  { imageUrl: 'https://www.sephora.com/productimages/sku/s2692580-main-zoom.jpg?imwidth=612', link: '/categoria5', categoryName: 'Categoría 5' },
  { imageUrl: 'https://i5.walmartimages.com/seo/Wellue-Bluetooth-Pulse-Oximeter-Finger-Oxygen-Monitor-with-Free-App-Lanyard-and-Carry-Pouch-FS20F_76a875f8-edea-47b3-a6a4-7cd5494721aa.0040bfeb5267883fa073516a9b5899c6.jpeg?odnHeight=640&odnWidth=640&odnBg=FFFFFF', link: '/categoria6', categoryName: 'Categoría 6' },
];

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '' });

  const handleFavoriteToggle = (product) => {
    const isFavorite = favoriteProducts.some((p) => p.id === product.id);

    if (isFavorite) {
      setFavoriteProducts(favoriteProducts.filter((p) => p.id !== product.id));
    } else {
      setFavoriteProducts([...favoriteProducts, product]);
    }
  };


  useEffect(() => {
    const fetchProducts = () => {
      Meteor.call('productos.getAll', (error, productosData) => {
        if (error) {
          console.error('Error al obtener los productos:', error);
        } else {
          const productosOrdenados = productosData.sort((a, b) => b.id - a.id);
          setProducts(productosOrdenados.slice(0, 19));
        }
      });
    };

    fetchProducts();
  }, []);


  const handleAddToCart = (product) => {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existingProduct = cartItems.find(item => item.id === product.id);
  
    if (existingProduct) {
      // Si el producto ya existe en el carrito, solo incrementa la cantidad
      cartItems = cartItems.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      // Asegúrate de incluir todos los campos necesarios del producto aquí
      cartItems.push({
        id: product.id, // ID del producto
        name: product.nombre, // Nombre del producto
        price: product.precio, // Precio del producto
        quantity: 1, // Cantidad inicial
        image: product.imagen_principal // Imagen del producto (opcional)
      });
    }
  
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    setNotification({ show: true, message: 'Producto añadido al carrito' });
    setTimeout(() => {
      setNotification({ show: false, message: '' });
    }, 3000);
  };
  


  return (
    <div className="container1">
      <Header />
      {notification.show && <div className="notification">{notification.message}</div>}
      <center><h1 className="titulo1">Nuevos Productos</h1></center>
      <main className="main-content1">
        <div className="product-scroll-container">
          {products.map((product, index) => (
            <div className="product-container" key={index}>
              <img src={product.imagen_principal} alt={product.nombre} className="product-image" />
              <h3 className='titulo-producto'>{product.nombre}</h3>
              <p className='titulo-precio'>Precio: {product.precio}</p>
              <div className="product-actions">
                <button className="button-agregar" onClick={() => handleAddToCart(product)}>Agregar al carrito</button>
                <span className={`favorite-icon ${favoriteProducts.some(p => p.id === product.id) ? 'favorite' : ''}`}
                  onClick={() => handleFavoriteToggle(product)}>
                  &#10084;
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
      <main className="main-content2">
        <center>
          <h1>Categorias</h1>
        </center>
        <Carousel
          showThumbs={false}
          autoPlay
          interval={10000}
          infiniteLoop
          useKeyboardArrows
          dynamicHeight
          emulateTouch
          showStatus={false}
          renderArrowPrev={(onClickHandler, hasPrev, label) =>
            hasPrev && (
              <button type="button" onClick={onClickHandler} title={label} className="carousel-arrow carousel-arrow-prev">
                ‹
              </button>
            )
          }
          renderArrowNext={(onClickHandler, hasNext, label) =>
            hasNext && (
              <button type="button" onClick={onClickHandler} title={label} className="carousel-arrow carousel-arrow-next">
                ›
              </button>
            )
          }
          centerMode={true}
          centerSlidePercentage={33.33}
        >
          {carouselImages.map((image, index) => (
            <div key={index} className="carousel-image-container">
              <Link to={image.link}>
                <img src={image.imageUrl} alt={`Imagen ${index + 1}`} className="carousel-image" />
              </Link>
              <div className="carousel-category-name">{image.categoryName}</div>
            </div>
          ))}
        </Carousel>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
