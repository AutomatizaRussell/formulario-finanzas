export const isNumericField = (field) => field.type === 'digits';

const onlyDigits = (value) => value.replace(/\D/g, '');

/** Convierte lo que escribe el usuario en el valor que se guarda y se envía. */
export function normalizeInput(field, rawValue) {
  if (isNumericField(field)) return onlyDigits(rawValue);
  if (field.uppercase) return rawValue.toUpperCase();
  return rawValue;
}

/** Identificador estable de un archivo elegido por el usuario (para keys y para evitar duplicados). */
export const fileKey = (file) => `${file.name}|${file.size}|${file.lastModified}`;

export function formatFileSize(bytes) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
