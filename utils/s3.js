import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

// Configuración de S3 usando IAM Role (no requiere access keys)
// IAM Role: arn:aws:iam::565493866589:role/EC2-RogenBackend-InstanceProfile
// El SDK de AWS detecta automáticamente las credenciales del IAM Role asignado a la instancia EC2
// Nota: El bucket está configurado con "Bucket owner enforced", por lo que NO se permiten ACLs
const s3Client = new S3Client({
  region: 'us-east-1'
  // No se requiere configuración especial para deshabilitar ACLs
  // El SDK respeta la ausencia del parámetro ACL en PutObjectCommand
});

const BUCKET_NAME = 'rogen-autos-data';
const FOLDER_PREFIX = 'autos/';
const CLOUDFRONT_DOMAIN = 'https://media.rogen-autos.com';

/**
 * Sube un archivo a S3
 * @param {Buffer} fileBuffer - Buffer del archivo
 * @param {string} fileName - Nombre del archivo
 * @param {string} contentType - Tipo MIME del archivo
 * @returns {Promise<string>} - Path del archivo en S3 (sin dominio CloudFront)
 */
export async function uploadToS3(fileBuffer, fileName, contentType) {
  const timestamp = Date.now();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const key = `${FOLDER_PREFIX}${timestamp}_${sanitizedFileName}`;

  // IMPORTANTE: No incluir ACL ya que el bucket usa "Bucket owner enforced"
  // El acceso público se controla mediante Bucket Policy, NO mediante ACLs
  // Usamos PutObjectCommand directamente para tener control total sobre los parámetros
  // Solo incluimos los parámetros esenciales - NO incluir ACL
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType
    // EXPLÍCITAMENTE NO incluir 'ACL' o cualquier parámetro relacionado con ACLs
    // El bucket está configurado con "Bucket owner enforced" que deshabilita ACLs
  });

  await s3Client.send(command);
  return key; // Retorna solo el path, no la URL completa
}

/**
 * Elimina un archivo de S3
 * @param {string} s3Key - Key del archivo en S3 (path completo)
 */
export async function deleteFromS3(s3Key) {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: s3Key
  });

  await s3Client.send(command);
}

/**
 * Extrae el path de S3 desde una URL de CloudFront
 * @param {string} cloudFrontUrl - URL de CloudFront
 * @returns {string} - Path de S3 (ej: "autos/1234567890_image.jpg")
 */
export function extractS3PathFromCloudFrontUrl(cloudFrontUrl) {
  if (!cloudFrontUrl) return null;
  
  if (cloudFrontUrl.includes(CLOUDFRONT_DOMAIN)) {
    // Extraer el path después del dominio
    const urlObj = new URL(cloudFrontUrl);
    return urlObj.pathname.startsWith('/') ? urlObj.pathname.slice(1) : urlObj.pathname;
  }
  
  return null;
}

/**
 * Convierte un path de S3 a URL de CloudFront
 * @param {string} s3Path - Path del archivo en S3 (ej: "autos/1234567890_image.jpg") o URL completa
 * @returns {string} - URL completa de CloudFront
 */
export function getCloudFrontUrl(s3Path) {
  if (!s3Path) return null;
  
  // Si ya es una URL completa
  if (s3Path.startsWith('http://') || s3Path.startsWith('https://')) {
    // Si es una URL de imgbb, mantenerla (para compatibilidad durante migración)
    if (s3Path.includes('i.ibb.co') || s3Path.includes('imgbb.com')) {
      return s3Path;
    }
    // Si ya es CloudFront, retornarla
    if (s3Path.includes('media.rogen-autos.com')) {
      return s3Path;
    }
    // Otra URL externa, retornarla
    return s3Path;
  }

  // Si es un path de S3, construir URL de CloudFront
  // Asegurar que no tenga barras al inicio
  const cleanPath = s3Path.startsWith('/') ? s3Path.slice(1) : s3Path;
  return `${CLOUDFRONT_DOMAIN}/${cleanPath}`;
}

/**
 * Convierte un array de paths de S3 a URLs de CloudFront
 * @param {string[]} s3Paths - Array de paths de S3
 * @returns {string[]} - Array de URLs de CloudFront
 */
export function getCloudFrontUrls(s3Paths) {
  if (!Array.isArray(s3Paths)) return [];
  return s3Paths.map(path => getCloudFrontUrl(path)).filter(url => url !== null);
}
