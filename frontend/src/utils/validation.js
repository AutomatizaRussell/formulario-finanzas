import { ALL_FIELDS, FILE_FIELD } from '../config/formSchema.js';

export const FILE_REQUIRED_MESSAGE = 'Adjunte al menos un archivo.';

export function validateField(field, value) {
  if (!value?.trim()) {
    return field.type === 'select' ? 'Seleccione una opción.' : 'Este campo es obligatorio.';
  }
  if (field.minLength && value.length < field.minLength) {
    return field.minLengthMessage ?? `Ingrese al menos ${field.minLength} caracteres.`;
  }
  return null;
}

export function validateFile(file) {
  const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
  if (!FILE_FIELD.accept.includes(extension)) {
    return `"${file.name}" no es un archivo ${FILE_FIELD.accept.join(', ')}.`;
  }
  if (file.size > FILE_FIELD.maxSizeMb * 1024 * 1024) {
    return `"${file.name}" supera el máximo de ${FILE_FIELD.maxSizeMb} MB.`;
  }
  return null;
}

export function validateForm(values, files) {
  const errors = {};
  for (const field of ALL_FIELDS) {
    const error = validateField(field, values[field.name]);
    if (error) errors[field.name] = error;
  }
  if (files.length === 0) {
    errors[FILE_FIELD.name] = FILE_REQUIRED_MESSAGE;
  }
  return errors;
}
