import { Mocha } from 'meteor/practicalmeteor:mocha-core';

Mocha.reporter('spec'); // Configura 'spec' como el reporter

describe('Pedidos API', function () {
  before(function () {
    resetDatabase();
  });

  it('debería retornar todos los pedidos', async function () {
    const pedidos = await Meteor.callPromise('pedidos.getAll');
    chai.expect(pedidos).to.be.an('array');
  });
});
