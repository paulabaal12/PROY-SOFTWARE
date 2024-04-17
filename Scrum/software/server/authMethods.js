import bcrypt from 'bcrypt';

Meteor.methods({
    'usuarios.insert'(data) {
      const hashedPassword = bcrypt.hashSync(data.password, 10);
      pool.query(
        'INSERT INTO usuarios (nombre, email, contraseña, dpi, ubicacion) VALUES ($1, $2, $3, $4, $5)',
        [data.name, data.email, hashedPassword, data.dpi, data.location],
        (err) => {
          if (err) {
            console.error('Error al insertar usuario en PostgreSQL:', err);
            throw new Meteor.Error('database-error', 'Error al insertar usuario en la base de datos');
          } else {
            console.log('Usuario insertado correctamente en PostgreSQL');
          }
        }
      );
    },
    'usuarios.authenticate'(email, password) {
      return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM usuarios WHERE email = $1', [email], (err, result) => {
          if (err) {
            console.error('Error al autenticar:', err);
            reject(new Meteor.Error('database-error', 'Error al autenticar en la base de datos'));
          } else if (result.rows.length > 0) {
            const user = result.rows[0];
            const authenticated = bcrypt.compareSync(password, user.contraseña);
            if (authenticated) {
              console.log('Usuario autenticado exitosamente');
              resolve({ authenticated });
            } else {
              console.log('Contraseña incorrecta');
              resolve({ authenticated: false });
            }
          } else {
            console.log('Usuario no encontrado');
            resolve({ authenticated: false });
          }
        });
      });
    }
  });

