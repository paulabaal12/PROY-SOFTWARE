import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import Speakeasy from 'speakeasy';
import QRCode from 'qrcode.react';

const Setup2FA = () => {
  const [secret, setSecret] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    const secret = Speakeasy.generateSecret({ length: 20 });
    setSecret(secret.base32);

    setQrCodeUrl(`otpauth://totp/YourAppName:${Meteor.user().email}?secret=${secret.base32}&issuer=YourAppName`);
  }, []);

  const handleEnable2FA = () => {
    Meteor.call('user.enableTotp', { secret: secret }, (error, result) => {
      if (error) {
        console.error('Error enabling 2FA:', error);
      } else {
      }
    });
  };

  return (
    <div>
      <h2>Configurar Autenticación de Dos Factores</h2>
      {qrCodeUrl && <QRCode value={qrCodeUrl} />}
      <button onClick={handleEnable2FA}>Habilitar 2FA</button>
    </div>
  );
};

export default Setup2FA;
