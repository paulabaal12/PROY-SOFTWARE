import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

export const generateTwoFactorSecret = (userId) => {
  const secret = speakeasy.generateSecret({ length: 20 });
  const otpauthUrl = speakeasy.otpauthURL({
    secret: secret.base32,
    label: encodeURIComponent(userId.toString()),
    issuer: 'TuAplicacion'
  });

  return { secret: secret.base32, otpauthUrl };
};

export const generateQRCode = async (otpauthUrl) => {
  return await QRCode.toDataURL(otpauthUrl);
};

export const verifyTwoFactorToken = (secret, token) => {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 2
  });
};