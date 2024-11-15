import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import '../../style.css'; // Importando estilo desde el directorio raíz
import '../../variables.css'; // Importando variables desde el directorio raíz

const TermsAndConditions = () => {

    const navigate = useNavigate();
    const handleAccept = () => {
        // Guardar que el usuario aceptó los términos
        localStorage.setItem('hasAgreedToTerms', 'true');
        // Redirigir a la página de registro u otra
        navigate('/register');
      };

  return (
    <>
      <div className="containerr">
        <Header />
      </div>
      <div className="container terms-and-conditions-page">
        <center>
        <img src='/images/Imagen2.png' alt="Lupa" width="275" height="275" />
        </center>
        <h1>Términos y Condiciones de eShopGT</h1>
        <p>
          Bienvenido a eShopGT. Al acceder a nuestro sitio web y utilizar nuestros servicios, usted acepta quedar
          vinculado por los presentes Términos y Condiciones. Le recomendamos leerlos detenidamente antes de continuar.
          Si no está de acuerdo con estos Términos y Condiciones, le solicitamos que se abstenga de utilizar nuestro sitio web.
        </p>

        <h2>1. Introducción</h2>
        <p>
          Estos Términos y Condiciones se aplican a todos los usuarios de eShopGT, incluyendo navegantes, clientes,
          comerciantes y contribuyentes de contenido.
        </p>

        <h2>2. Términos y Condiciones</h2>
        <p>
          Estos Términos y Condiciones regulan el acceso y uso del sitio web de eShopGT, dedicado a la venta de
          productos de diversas categorías. Al acceder a nuestro sitio, el usuario acepta regirse por estos Términos
          y Condiciones aquí establecidos, así como por las políticas adicionales aplicables.
        </p>

        <h2>3. Modificación de los Términos y Condiciones</h2>
        <p>
          eShopGT se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento y sin previo aviso.
          Las actualizaciones entrarán en vigor inmediatamente después de su publicación en el sitio. Recomendamos revisar
          periódicamente esta sección para mantenerse informado.
        </p>

        <h2>4. Uso del Sitio</h2>
        <p>
          El acceso y uso del sitio es bajo su propia responsabilidad. Usted acepta no utilizar el sitio con fines ilegales
          ni realizar acciones que puedan dañar, sobrecargar o interferir en el uso del sitio por otros usuarios.
        </p>

        <h2>5. Propiedad Intelectual</h2>
        <p>
          Todo el contenido de eShopGT, incluyendo textos, imágenes, gráficos, logotipos, íconos, archivos y otros materiales,
          es propiedad de eShopGT o de terceros, y está protegido por las leyes de propiedad intelectual aplicables.
        </p>

        <h2>6. Exclusión de Garantías y Limitación de Responsabilidad</h2>
        <p>
          El sitio se proporciona "tal como está" y "según disponibilidad". eShopGT no garantiza que el sitio funcione de
          manera ininterrumpida, segura o libre de errores.
        </p>

        <h2>7. Problemas y Disputas</h2>
        <p>
          Para usuarios en Guatemala, cualquier disputa relacionada con estos Términos será resuelta conforme a las leyes locales,
          ante los tribunales competentes de Guatemala.
        </p>

        <h2>8. Soporte al Cliente y Consultas</h2>
        <p>
          Si tiene preguntas, necesita soporte o desea presentar una queja, puede contactarnos a través de nuestro correo
          electrónico: <a href="mailto:soporte@eshopgt.com">soporte@eshopgt.com</a>. Estaremos encantados de ayudarle.
        </p>

        <h2>9. Acerca de estos Términos</h2>
        <p>
          Estos Términos constituyen el acuerdo completo entre usted y eShopGT con relación al uso del sitio.
          La información en este sitio está sujeta a cambios sin previo aviso.
        </p>

        <div className="terms-actions">
        <button onClick={handleAccept} className="button2">Aceptar</button><br />
          <Link to="/" className="button2">Volver a la Página Principal</Link>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default TermsAndConditions;
