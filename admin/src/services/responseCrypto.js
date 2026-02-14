const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();
const webCrypto = globalThis.crypto;

const base64ToBytes = (base64) => {
  if (typeof atob === 'function') {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  return new Uint8Array(Buffer.from(base64, 'base64'));
};

const deriveKey = async (secret) => {
  const secretBytes = textEncoder.encode(secret);
  const hash = await webCrypto.subtle.digest('SHA-256', secretBytes);
  return webCrypto.subtle.importKey('raw', hash, { name: 'AES-GCM' }, false, ['decrypt']);
};

export const decryptApiPayload = async (responseData) => {
  const encryptionEnabled = process.env.NEXT_PUBLIC_RESPONSE_ENCRYPTION_ENABLED === 'true';
  if (!encryptionEnabled) {
    return responseData;
  }

  if (!responseData?.enc || !responseData?.payload) {
    return responseData;
  }

  const secret = process.env.NEXT_PUBLIC_RESPONSE_ENCRYPTION_KEY;
  if (!secret) {
    throw new Error('Missing NEXT_PUBLIC_RESPONSE_ENCRYPTION_KEY in admin env');
  }
  if (!webCrypto?.subtle) {
    throw new Error('Web Crypto API is not available');
  }

  const [ivBase64, tagBase64, encryptedBase64] = responseData.payload.split('.');
  if (!ivBase64 || !tagBase64 || !encryptedBase64) {
    throw new Error('Invalid encrypted payload format');
  }

  const iv = base64ToBytes(ivBase64);
  const authTag = base64ToBytes(tagBase64);
  const encrypted = base64ToBytes(encryptedBase64);

  const encryptedWithTag = new Uint8Array(encrypted.length + authTag.length);
  encryptedWithTag.set(encrypted);
  encryptedWithTag.set(authTag, encrypted.length);

  const key = await deriveKey(secret);
  const decryptedBuffer = await webCrypto.subtle.decrypt(
    { name: 'AES-GCM', iv, tagLength: 128 },
    key,
    encryptedWithTag
  );

  const plainText = textDecoder.decode(decryptedBuffer);
  return JSON.parse(plainText);
};
