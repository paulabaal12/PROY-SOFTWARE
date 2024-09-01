describe('Register Page', () => {
  it('debería permitir registrar un nuevo usuario', () => {
    // Visitar la página de registro
    cy.visit('http://localhost:3000/register');

    // Verificar que el título de la página de registro es correcto
    cy.contains('Registro').should('be.visible');

    // Llenar el formulario de registro
    cy.get('input#name').type('Carlos');
    cy.get('input#email').type('carlos@example.com');
    cy.get('input#dpi').type('1234567890101');
    cy.get('input#location').type('Guatemala');

    // Llenar la contraseña
    cy.get('input#password').type('password123');

    // Aceptar la política de privacidad
    cy.get('input#hasAgreedToPrivacyPolicy').check();

    // (Opcional) Habilitar Autenticación de Dos Factores
   cy.get('input#enable_2fa').check();

    // Enviar el formulario
    cy.get('button[type="submit"]').click();

    // Verificar que se redirige a la página de inicio o que se muestra un mensaje de éxito
    cy.url().should('not.include', '/register');  // Lo que debería pasar al registrarse
  });
});
