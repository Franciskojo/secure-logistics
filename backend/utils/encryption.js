import CryptoJS from 'crypto-js';

const SECRET = process.env.ASSET_SECRET || 'default_secret';

export const encrypt = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET).toString();
};

export const decrypt = (cipher) => {
  const bytes = CryptoJS.AES.decrypt(cipher, SECRET);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};