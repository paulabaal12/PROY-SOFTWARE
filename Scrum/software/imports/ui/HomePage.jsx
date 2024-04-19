import React from 'react';
import './style.css';
import { Link } from 'react-router-dom';
import Header from './Header';

// Datos de los productos
const products = [
  { name: 'Producto 1', price: '$10.00', imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/51bm38JKdKL._SX600_.jpg' },
  { name: 'Producto 2', price: '$15.00', imageUrl: 'https://m.media-amazon.com/images/I/81vaif8cb6L.__AC_SX300_SY300_QL70_FMwebp_.jpg'},
  { name: 'Producto 3', price: '$10.00', imageUrl: 'https://i5.walmartimages.com/seo/Restored-Apple-iPhone-14-Plus-Carrier-Unlocked-128GB-Starlight-MQ3T3LL-A-Refurbished_82bd983b-d7bd-41ce-b6cb-b7d1e550cb85.add6d9bd949bab209f32d5be9ac1d0f9.jpeg?odnHeight=640&odnWidth=640&odnBg=FFFFFF' },
  { name: 'Producto 4', price: '$15.00', imageUrl: 'https://i5.walmartimages.com/seo/Ice-Breakers-Ice-Cubes-Peppermint-Sugar-Free-Chewing-Gum-Bottle-3-24-oz-40-Pieces_5c3a2719-7ab3-478d-8700-52bda92095d9.328047a8e4e11f9761cb3a9fadab7fea.jpeg?odnHeight=640&odnWidth=640&odnBg=FFFFFF' },
  { name: 'Producto 5', price: '$10.00', imageUrl: 'https://www.sephora.com/productimages/sku/s2761971-main-zoom.jpg?imwidth=612' },
  { name: 'Producto 6', price: '$15.00', imageUrl: 'https://i5.walmartimages.com/seo/Spring-Valley-Immune-Health-Non-GMO-Vitamin-C-Vegetarian-Gummies-Orange-250-mg-150-Count_91797f36-d7bc-4b18-969f-a2cd7781437b.b2688b900c7690f0e4eb0264e8324914.jpeg?odnHeight=640&odnWidth=640&odnBg=FFFFFF' },
  { name: 'Producto 7', price: '$10.00', imageUrl: 'https://i5.walmartimages.com/seo/Clorox-Bleach-Free-Disinfecting-and-Cleaning-Wipes-Crisp-Lemon-75-Count_c3d367ef-be17-43dd-8014-3c3d2d7b12cc.5288b6d58c5deca8d4491fc8f1f84189.jpeg?odnHeight=640&odnWidth=640&odnBg=FFFFFF' },
  { name: 'Producto 8', price: '$15.00', imageUrl: 'https://i5.walmartimages.com/seo/Greenworks-60-Volt-2-5-Ah-Battery-1807202_3e5e7082-83a3-4693-8d02-58e441a912e8.47443152e5de2f3fc9d69e65a5bdf80b.jpeg?odnHeight=640&odnWidth=640&odnBg=FFFFFF' },
  { name: 'Producto 9', price: '$10.00', imageUrl: 'https://i5.walmartimages.com/seo/Bluey-Talking-Bluey-Plush-Toddler-Toy_07ac91bd-de83-423d-b478-b6e8d5f83a1c.677093a85ec4621848e2809493c6edde.jpeg?odnHeight=640&odnWidth=640&odnBg=FFFFFF' },
];

const HomePage = () => {
  return (
    <div className="container">
      {/* Encabezado */}
      <Header/>
      {/* Contenido de la página */}
      <main className="main-content1">
        <h2 className="titulo1">Lo más vendido</h2>
        <div className="product-scroll-container">
          {products.map((product, index) => (
            <div key={index} className="product-container">
              <img src={product.imageUrl} alt={product.name} style={{ width: '100px', height: '100px' }} />
              <h2>{product.name}</h2>
              <p>Precio: {product.price}</p>
              <button className="button-agregar">Agregar al carrito</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
