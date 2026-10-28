import QRCode from 'qrcode';

export const PIX_KEY = '908311208372';

function crc16CCITT(str: string): string {
  let crc = 0xFFFF;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xFFFF;
      } else {
        crc = (crc << 1) & 0xFFFF;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Generates an official, scanable Pix EMV BR Code payload
 */
export function generatePixBRCode(
  key: string = PIX_KEY,
  amount: number = 19.90,
  merchantName: string = 'ROTEIROFACIL',
  merchantCity: string = 'SAO PAULO',
  txid: string = 'VIP1990'
): string {
  const pfi = '000201';
  
  const gui = '0014br.gov.bcb.pix';
  const cleanKey = key.trim();
  const keyLen = String(cleanKey.length).padStart(2, '0');
  const maiData = `${gui}01${keyLen}${cleanKey}`;
  const mai = `26${String(maiData.length).padStart(2, '0')}${maiData}`;
  
  const mcc = '52040000';
  const currency = '5303986';
  
  const amountStr = amount.toFixed(2);
  const amountTag = `54${String(amountStr.length).padStart(2, '0')}${amountStr}`;
  
  const country = '5802BR';
  
  const cleanName = merchantName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').slice(0, 25).toUpperCase();
  const nameTag = `59${String(cleanName.length).padStart(2, '0')}${cleanName}`;
  
  const cleanCity = merchantCity.normalize('NFD').replace(/[\u0300-\u036f]/g, '').slice(0, 15).toUpperCase();
  const cityTag = `60${String(cleanCity.length).padStart(2, '0')}${cleanCity}`;
  
  const cleanTxid = (txid || '***').slice(0, 25);
  const txidData = `05${String(cleanTxid.length).padStart(2, '0')}${cleanTxid}`;
  const adft = `62${String(txidData.length).padStart(2, '0')}${txidData}`;
  
  const raw = `${pfi}${mai}${mcc}${currency}${amountTag}${country}${nameTag}${cityTag}${adft}6304`;
  const checksum = crc16CCITT(raw);
  
  return `${raw}${checksum}`;
}

/**
 * Generates a real, high-resolution QR code image as Data URL
 */
export async function generatePixQRCodeDataURL(payload: string): Promise<string> {
  return await QRCode.toDataURL(payload, {
    width: 320,
    margin: 1,
    color: {
      dark: '#0f172a',
      light: '#ffffff'
    },
    errorCorrectionLevel: 'M'
  });
}
