import React from 'react';
import { shallow } from 'enzyme';
import { assert } from 'chai';
import ListaProductos from '../../imports/ui/Components/Screens/ListaProductos'; // Asegúrate de que la ruta sea correcta

describe('ListaProductos Component', () => {
  it('debería renderizarse correctamente', () => {
    const wrapper = shallow(<ListaProductos />);
    assert.isTrue(wrapper.exists());
  });

  // Aquí puedes agregar más pruebas
  it('debería contener un elemento con la clase .product-list', () => {
    const wrapper = shallow(<ListaProductos />);
    assert.isTrue(wrapper.find('.product-list').exists());
  });
});
