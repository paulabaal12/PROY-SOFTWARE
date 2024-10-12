import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  { name: 'Hogar', image: '/images/1.png', link: '/categoria/Hogar' },
  { name: 'Videojuegos', image: '/images/2.png', link: '/categoria/Videojuegos' },
  { name: 'Belleza', image: '/images/3.png', link: '/categoria/Belleza' },
  { name: 'Juguetes', image: '/images/4.png', link: '/categoria/Juguetes' },
  { name: 'Deportes', image: '/images/5.png', link: '/categoria/Deportes' },
  { name: 'Alimentos', image: '/images/6.png', link: '/categoria/Alimentos' },
  { name: 'Mascotas', image: '/images/7.png', link: '/categoria/Mascotas' },
  { name: 'Arte', image: '/images/8.png', link: '/categoria/Arte' },
  { name: 'Electrónicos', image: '/images/9.png', link: '/categoria/Electrónicos' },
  { name: 'Tendencias', image: '/images/10.png', link: '/categoria/Tendencias' },
];

const CategoryGrid = () => (
  <div className="categories-grid">
    {categories.map((category, index) => (
      <Link to={category.link} className="category-item" key={index}>
        <img src={category.image} alt={category.name} className="category-image" />
        <p className="category-name">{category.name}</p>
      </Link>
    ))}
  </div>
);

export default CategoryGrid;