import React from 'react';

import { Info } from '../ui/Info.jsx';
import main from '/client/main.css';


export const HomePage = () => (
  <div>
    {/*---MENU------*/}
    <div className='text-menu'>
    < div className="uul">
    <ul style={{ listStyleType: 'none', margin: 0, padding: 0, overflow: 'hidden', backgroundColor: '#333' }}>
        <li style={{ float: 'left' }}>
          <a className="active" href="#home" style={{ display: 'block', color: 'white', textAlign: 'center', padding: '14px 16px', textDecoration: 'none' }}>
            <img src="imgs/billetera.png"   
            alt="billetera" style={{ width: '50px', height: 'auto' }} />
          </a>
          billetera
        </li>
        <li style={{ float: 'left' }}>
          <a href="#news" style={{ display: 'block', color: 'white', textAlign: 'center', padding: '14px 16px', textDecoration: 'none' }}>
            <img src="/imgs/cateogrias.png" 
            alt="Categorias" style={{ width: '50px', height: 'auto' }} />
          </a>
          Categorias
        </li>
        <li style={{ float: 'left' }}>
          <a href="#contact" style={{ display: 'block', color: 'white', textAlign: 'center', padding: '14px 16px', textDecoration: 'none' }}>
            <img src="/imgs/ordenes.png" alt="Pedidos" style={{ width: '50px', height: 'auto' }} />
          </a>
          Ordenes
        </li>
        <li style={{ float: 'left' }}>
          <a href="#about" style={{ display: 'block', color: 'white', textAlign: 'center', padding: '14px 16px', textDecoration: 'none' }}>
            <img src="" alt="Carrito de compras" style={{ width: '50px', height: 'auto' }} />
          </a>
          Pedidos
        </li>
      </ul>
  </div>
  </div>
    {/*---------*/}
    {/* Sección de foto de perfil */}
    <div style={{ float: 'left', marginRight: '20px' }}>
      <img src="/imgs/perfil.jpg" alt="Foto de perfil" width="100" height="100" />
    </div>
    <br/>
    <br/>
    {/* Sección de barra de búsqueda */}
    <div>
      <input type="text" placeholder="Buscar..." />
      <button type="submit">Buscar</button>
    </div>
    <br/><br/><br/>
    < div>Nuevo ingreso</div><br/>
    {/*imagenes*/}
    <table>
    <div className="gallery">
      <a target="_blank" href="img_5terre.jpg">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMa78OTINoVIBOTtH6TCWAWNLZD6njFcrwmz9PMxCeog&s" alt="Cinque Terre" width="600" height="400" />
      </a>
      <div className="desc">Gorra brillos</div>
    </div>

    <div className="gallery">
      <a target="_blank" href="img_forest.jpg">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8Ic45loKTN-RitrdL1xpNVYEIL7Ky2Otv7moYLOA6tA&sjpg" alt="Forest" width="600" height="400" />
      </a>
      <div className="desc">Pantalon para hombre negro</div>
    </div>

    <div className="gallery">
      <a target="_blank" href="img_lights.jpg">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrtmVmbH1SQkHn07QHyiX8cYAbRPYb49kMyjs6BYWkOA&s" alt="Northern Lights" width="600" height="400" />
      </a>
      <div className="desc">Pantalon para hombre verde</div>
    </div>

    <div className="gallery">
      <a target="_blank" href="img_mountains.jpg">
        <img src="https://ae01.alicdn.com/kf/Sd51383ed625d4ec38e1c51e8ceab8e854.jpg_640x640Q90.jpg_.webp" alt="Mountains" width="600" height="400" />
      </a>
      <div className="desc">Gorra futurista</div>
    </div>
    </table>
    {/*Fin imagenes*/}
    <br/><br/><br/>
    <div>Trending</div>
    {/*imagenes*/}
    <table>
    <div className="gallery">
      <a target="_blank" href="img_5terre.jpg">
        <img src="https://cdn.pacifiko.com/image/cache/catalog/p/ZDRkMDQ4MT-484x484.jpg" alt="Cinque Terre" width="600" height="400" />
      </a>
      <div className="desc">Camisa formal celeste para hombre</div>
    </div>

    <div className="gallery">
      <a target="_blank" href="img_forest.jpg">
        <img src="https://caterpillargt.com/cdn/shop/products/2610628_12815_Standard-Stone.jpg?v=1658848948" alt="Forest" width="600" height="400" />
      </a>
      <div className="desc">Camisa casual azul para hombre</div>
    </div>

    <div className="gallery">
      <a target="_blank" href="img_lights.jpg">
        <img src="https://www.progresivajeans.com/cdn/shop/files/11.4.23_CAM120_ML_CC_BLANCO_A.jpg?v=1697497995&width=1080" alt="Northern Lights" width="600" height="400" />
      </a>
      <div className="desc">Camisa formal blanca para hombre</div>
    </div>

    <div className="gallery">
      <a target="_blank" href="img_mountains.jpg">
        <img src="https://www.progresivajeans.com/cdn/shop/files/11.3.29_CAM120_ML_CN_CORINTO_A.jpg?v=1697479966" alt="Mountains" width="600" height="400" />
      </a>
      <div className="desc">Camisa formal roja para hombre</div>
    </div>
    </table>
    {/*Fin imagenes*/}




  </div>


);
