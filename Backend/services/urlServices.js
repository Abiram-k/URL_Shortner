const shortid = require("shortid");
const QRCode = require("qrcode");

const generateShortCode = () => shortid.generate().substring(0, 6);

const generateQRCode = async (url) => {
    return QRCode.toDataURL(url);
  };

  module.exports = { generateShortCode, generateQRCode };
