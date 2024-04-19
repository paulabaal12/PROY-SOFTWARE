import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import { Link } from 'react-router-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Header from './Header';
import './style.css';
import Footer from './Footer';

const products = [
  { name: 'Producto 1', price: '$10.00', imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/51bm38JKdKL._SX600_.jpg' },
  { name: 'Producto 2', price: '$15.00', imageUrl: 'https://m.media-amazon.com/images/I/81vaif8cb6L.__AC_SX300_SY300_QL70_FMwebp_.jpg'},
  { name: 'Producto 3', price: '$10.00', imageUrl: 'https://i5.walmartimages.com/seo/Restored-Apple-iPhone-14-Plus-Carrier-Unlocked-128GB-Starlight-MQ3T3LL-A-Refurbished_82bd983b-d7bd-41ce-b6cb-b7d1e550cb85.add6d9bd949bab209f32d5be9ac1d0f9.jpeg?odnHeight=640&odnWidth=640&odnBg=FFFFFF' },
  { name: 'Producto 4', price: '$15.00', imageUrl: 'https://i5.walmartimages.com/seo/Ice-Breakers-Ice-Cubes-Peppermint-Sugar-Free-Chewing-Gum-Bottle-3-24-oz-40-Pieces_5c3a2719-7ab3-478d-8700-52bda92095d9.328047a8e4e11f9761cb3a9fadab7fea.jpeg?odnHeight=640&odnWidth=640&odnBg=FFFFFF'},
  { name: 'Producto 5', price: '$10.00', imageUrl: 'https://www.sephora.com/productimages/sku/s2761971-main-zoom.jpg?imwidth=612'},
  { name: 'Producto 6', price: '$15.00', imageUrl: 'https://i5.walmartimages.com/seo/Spring-Valley-Immune-Health-Non-GMO-Vitamin-C-Vegetarian-Gummies-Orange-250-mg-150-Count_91797f36-d7bc-4b18-969f-a2cd7781437b.b2688b900c7690f0e4eb0264e8324914.jpeg?odnHeight=640&odnWidth=640&odnBg=FFFFFF'},
  { name: 'Producto 7', price: '$10.00', imageUrl: 'https://i5.walmartimages.com/seo/Clorox-Bleach-Free-Disinfecting-and-Cleaning-Wipes-Crisp-Lemon-75-Count_c3d367ef-be17-43dd-8014-3c3d2d7b12cc.5288b6d58c5deca8d4491fc8f1f84189.jpeg?odnHeight=640&odnWidth=640&odnBg=FFFFFF'},
  { name: 'Producto 8', price: '$15.00', imageUrl: 'https://i5.walmartimages.com/seo/Greenworks-60-Volt-2-5-Ah-Battery-1807202_3e5e7082-83a3-4693-8d02-58e441a912e8.47443152e5de2f3fc9d69e65a5bdf80b.jpeg?odnHeight=640&odnWidth=640&odnBg=FFFFFF' },
  { name: 'Producto 9', price: '$10.00', imageUrl: 'https://i5.walmartimages.com/seo/Bluey-Talking-Bluey-Plush-Toddler-Toy_07ac91bd-de83-423d-b478-b6e8d5f83a1c.677093a85ec4621848e2809493c6edde.jpeg?odnHeight=640&odnWidth=640&odnBg=FFFFFF' },
];

const carouselImages = [
  { imageUrl: 'https://i5.walmartimages.com/seo/Mainstays-Alessandra-Matte-Black-12-Piece-Stoneware-Dinnerware-Set_a06eabea-1ba7-4a41-abbc-63151bf7c1b0.9fb529e6c752dbc2ef2efa717418a28f.jpeg?odnHeight=640&odnWidth=640&odnBg=FFFFFF', link: '/categoria1', categoryName: 'Categoría 1' },
  { imageUrl: 'https://i5.walmartimages.com/seo/OREO-Double-Stuf-Chocolate-Sandwich-Cookies-Family-Size-18-71-oz_12945353-d789-4390-aeff-ccf1ae7c6379.ab14d414c9811bb2961fcb5b49513660.jpeg?odnHeight=640&odnWidth=640&odnBg=FFFFFF', link: '/categoria2', categoryName: 'Categoría 2' },
  { imageUrl: 'https://i5.walmartimages.com/seo/Carote-Nonstick-Pots-and-Pans-Set-8-Pcs-Induction-Kitchen-Cookware-Sets-Beige-Granite_e4183757-3e78-4321-a9ad-3123804e77ad.98cb62d1e47bdc84f235cbdcfafac1db.png?odnHeight=640&odnWidth=640&odnBg=FFFFFF', link: '/categoria3', categoryName: 'Categoría 3' },
  { imageUrl: 'https://i5.walmartimages.com/seo/Sunny-Fun-Bounce-House-Nylon-Bouncy-House-for-Kids-Outdoor-with-Toddler-Slide_c653007e-0f42-4b95-813d-73b50f3064af.385c1063fcbdf8a36aff24733aeea5c3.jpeg?odnHeight=640&odnWidth=640&odnBg=FFFFFF', link: '/categoria4', categoryName: 'Categoría 4' },
  { imageUrl: 'https://www.sephora.com/productimages/sku/s2692580-main-zoom.jpg?imwidth=612', link: '/categoria5', categoryName: 'Categoría 5' },
  { imageUrl: 'https://i5.walmartimages.com/seo/Wellue-Bluetooth-Pulse-Oximeter-Finger-Oxygen-Monitor-with-Free-App-Lanyard-and-Carry-Pouch-FS20F_76a875f8-edea-47b3-a6a4-7cd5494721aa.0040bfeb5267883fa073516a9b5899c6.jpeg?odnHeight=640&odnWidth=640&odnBg=FFFFFF', link: '/categoria6', categoryName: 'Categoría 6' },
];
const HomePage = () => {
  return (
    <div className="container">
      {/* Encabezado */}
      <Header/>
      {/* Contenido de la página */}
      <center>
      <h1 class="titulo1">Best Sellers</h1>
      </center>
      <main className="main-content1">
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
      {/* Contenedor 2 */}
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
              <button
                type="button"
                onClick={onClickHandler}
                title={label}
                className="carousel-arrow carousel-arrow-prev"
              >
                ‹
              </button>
            )
          }
          renderArrowNext={(onClickHandler, hasNext, label) =>
            hasNext && (
              <button
                type="button"
                onClick={onClickHandler}
                title={label}
                className="carousel-arrow carousel-arrow-next"
              >
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