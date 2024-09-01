describe('Login Page', () => {
  it('debería permitir iniciar sesión con credenciales válidas', () => {
      // Visitar la página de inicio de sesión
      cy.visit('http://localhost:3000/');

      // Llenar el formulario de inicio de sesión
      cy.get('input#email').type('usuario@ejemplo.com');
      cy.get('input#password').type('password123');

      // Enviar el formulario
      cy.get('button[type="submit"]').click();

      // Verificar si se requiere el código 2FA
      cy.get('body').then((body) => {
          if (body.find('.overlay').length > 0) {
              // Si se muestra el modal 2FA, ingresa el código de verificación
              cy.get('input[placeholder="Código de Verificación"]').type('123456'); // Cambia esto por el código correcto
              cy.get('button').contains('Verificar Código').click();
          }
      });

      // Verificar que la URL cambió a la página de inicio
      cy.url().should('include', '/homepage');

      // Verificar que el usuario esté autenticado
      cy.contains('¡Bienvenido!').should('be.visible');
  });

  it('debería mostrar un error con credenciales incorrectas', () => {
      // Visitar la página de inicio de sesión
      cy.visit('http://localhost:3000/login');

      // Llenar el formulario con credenciales incorrectas
      cy.get('input#email').type('usuario@ejemplo.com');
      cy.get('input#password').type('incorrectpassword');

      // Enviar el formulario
      cy.get('button[type="submit"]').click();

      // Verificar que se muestre un mensaje de error
      cy.contains('Fallo en la autenticación, verifica tus credenciales.').should('be.visible');
  });
});
