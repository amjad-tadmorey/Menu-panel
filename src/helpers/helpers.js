import QRCode from "qrcode";

/**
 * @param {string} text 
 * @param {object} [opts]
 * @returns {Promise<string>}
 */
export async function generateQR(text, opts = { width: 300 }) {
  try {
    const dataUrl = await QRCode.toDataURL(text, opts);
    return dataUrl; // يمكنك وضعه كـ <img src={dataUrl} />
  } catch (err) {
    console.error("QR generation error:", err);
    throw err;
  }
}
