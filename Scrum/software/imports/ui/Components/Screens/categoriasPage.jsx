import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import '../../style.css'; // Importando estilo desde el directorio raíz
import '../../variables.css'; // Importando variables desde el directorio raíz

const categorias = [
  { nombre: 'Electrónicos', imagen: 'https://d1cft8rz0k7w99.cloudfront.net/n/0/0/3/c/003cd2e1138f51f207ac5a4ed6aa67ab443bb861_KitchenSystem_395378_01.jpg' },
  { nombre: 'Ropa', imagen: 'https://png.pngtree.com/png-clipart/20240202/original/pngtree-blue-knitted-sweater-isolated-on-a-white-background-casual-winter-clothing-png-image_14217300.png' },
  { nombre: 'Hogar', imagen: 'https://suenoszzz.com/21670-large_default/sillon-irene.jpg' },
  { nombre: 'Libros', imagen: 'https://http2.mlstatic.com/D_NQ_NP_721067-MCO47873097887_102021-O.webp' }, 
  { nombre: 'Juguetes', imagen: 'https://cpadistributor.com/109316-large_default/bluey-pack-2-figuras-3-surtidos-bly07000-famosa.jpg' },
  { nombre: 'Deportes', imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFRMDYAFIPdFhsg_5Uhi3BpcEKW8SofTJs8c5cs9h3gQ&s' },
  { nombre: 'Belleza', imagen: 'https://www.sephora.com/productimages/sku/s2495497-main-zoom.jpg?imwidth=612' },
  { nombre: 'Alimentos', imagen: 'https://i5.walmartimages.com/seo/OREO-Double-Stuf-Chocolate-Sandwich-Cookies-Family-Size-18-71-oz_12945353-d789-4390-aeff-ccf1ae7c6379.ab14d414c9811bb2961fcb5b49513660.jpeg?odnHeight=640&odnWidth=640&odnBg=FFFFFF' },
  { nombre: 'Automóviles', imagen: 'https://img.freepik.com/fotos-premium/coche-aislado-sobre-fondo-blanco-mercedes-aclass-coche-blanco-blanco-limpio-blanco-bac-blanco-negro_655090-718279.jpg' },
  { nombre: 'Viajes', imagen: 'https://media.istockphoto.com/id/1400155112/es/foto/maleta-amarilla-volando-sobre-fondo-blanco.jpg?s=612x612&w=0&k=20&c=l6MsJznjUHTaPfWItyFCiM9PahJugGesEQCv17s9ClI=' },
  { nombre: 'Mascotas', imagen: 'https://img.freepik.com/fotos-premium/cuencos-acero-inoxidable-juguetes-goma-mascotas-sobre-fondo-blanco-aislado_51665-49.jpg' },
  { nombre: 'Salud', imagen: 'https://i5.walmartimages.com/seo/Wellue-Bluetooth-Pulse-Oximeter-Finger-Oxygen-Monitor-with-Free-App-Lanyard-and-Carry-Pouch-FS20F_76a875f8-edea-47b3-a6a4-7cd5494721aa.0040bfeb5267883fa073516a9b5899c6.jpeg?odnHeight=640&odnWidth=640&odnBg=FFFFFF' },
  { nombre: 'Jardín', imagen: 'https://img.freepik.com/fotos-premium/accesorios-jardin-guantes-regaderas-flores-maceta-sobre-fondo-blanco-concepto-agricultura-verano-plantacion-flores-cultivo-huerto-jardin-flores_330426-388.jpg' },
  { nombre: 'Herramientas', imagen: 'https://dam.thdstatic.com/content/production/6fWRYysgnyCZKnj9fpwYfg/HJIe_KH-o4LaNyiJfVtCKQ/optimizedFile/06517bb4-e611-4298-9263-b67c00fb4e60_DWHT65201_2.jpeg?im=Resize=(703,703)' },
  { nombre: 'Arte', imagen: 'https://st3.depositphotos.com/29384342/33862/i/450/depositphotos_338623306-stock-photo-various-school-accessories-children-creativity.jpg' },
  { nombre: 'Música', imagen: 'https://cdn.shopify.com/s/files/1/2036/5517/files/TaylorSwift-TTPDLP_180x@2x.webp?v=1710748887' },
];


const Categorias = () => {
  const [hoveredCategoria, setHoveredCategoria] = useState(null);

  const handleCategoriaHover = (index) => {
    setHoveredCategoria(index);
  };

  return (
    <div>
      <Header />
      <div className="categorias-container">
        <h2>Explora nuestras categorías</h2>
        <div className="categorias-grid">
          {categorias.map((categoria, index) => (
            <div
              key={index}
              className={`categoria-card ${hoveredCategoria === index ? 'categoria-card-hover' : ''}`}
              onMouseEnter={() => handleCategoriaHover(index)}
              onMouseLeave={() => handleCategoriaHover(null)}
            >
              <Link to={`/categoria/${categoria.nombre}`} className="categoria-link">
                <img
                  src={categoria.imagen}
                  alt={categoria.nombre}
                  className="categoria-imagen"
                />
                <h3 className="categoria-nombre">{categoria.nombre}</h3>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Categorias;