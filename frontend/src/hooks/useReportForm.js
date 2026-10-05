import { useMemo, useState } from 'react';
import { ALL_FIELDS, FILE_FIELD } from '../config/formSchema.js';
import { submitReport } from '../services/formService.js';
import { normalizeInput } from '../utils/formatters.js';
import { validateField, validateFile, validateForm } from '../utils/validation.js';

const EMPTY_VALUES = Object.fromEntries(ALL_FIELDS.map((field) => [field.name, '']));

export const STATUS = {
  IDLE: 'idle',
  SENDING: 'sending',
  SUCCESS: 'success',
  ERROR: 'error',
};

const sameFile = (a, b) => a.name === b.name && a.size === b.size && a.lastModified === b.lastModified;

export function useReportForm() {
  const [values, setValues] = useState(EMPTY_VALUES);
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(STATUS.IDLE);
  const [submitError, setSubmitError] = useState('');

  const setFieldError = (name, error) =>
    setErrors((current) => {
      if (!error) {
        const { [name]: _removed, ...rest } = current;
        return rest;
      }
      return { ...current, [name]: error };
    });

  const handleChange = (field, rawValue) => {
    const value = normalizeInput(field, rawValue);
    setValues((current) => ({ ...current, [field.name]: value }));
    // Solo revalida en vivo si el campo ya mostraba error, para no regañar mientras se escribe.
    if (errors[field.name]) setFieldError(field.name, validateField(field, value));
  };

  const handleBlur = (field) => {
    setFieldError(field.name, validateField(field, values[field.name]));
  };

  const addFiles = (incoming) => {
    const rejected = [];
    const accepted = [];
    for (const file of incoming) {
      const error = validateFile(file);
      if (error) rejected.push(error);
      else if (!files.some((existing) => sameFile(existing, file))) accepted.push(file);
    }
    const nextFiles = [...files, ...accepted];
    setFiles(nextFiles);
    setFieldError(
      FILE_FIELD.name,
      rejected.join(' ') || (nextFiles.length ? null : 'Adjunte al menos un archivo.'),
    );
  };

  const removeFile = (fileToRemove) => {
    setFiles((current) => current.filter((file) => file !== fileToRemove));
  };

  const completedCount = useMemo(
    () => ALL_FIELDS.filter((field) => !validateField(field, values[field.name])).length +
      (files.length > 0 ? 1 : 0),
    [values, files],
  );

  const submit = async () => {
    const formErrors = validateForm(values, files);
    setErrors(formErrors);
    if (Object.keys(formErrors).length > 0) return formErrors;

    setStatus(STATUS.SENDING);
    setSubmitError('');
    try {
      await submitReport(values, files);
      setStatus(STATUS.SUCCESS);
    } catch (error) {
      console.error('Error al enviar el reporte:', error);
      setSubmitError(error.message);
      setStatus(STATUS.ERROR);
    }
    return {};
  };

  const reset = () => {
    setValues(EMPTY_VALUES);
    setFiles([]);
    setErrors({});
    setSubmitError('');
    setStatus(STATUS.IDLE);
  };

  return {
    values,
    files,
    errors,
    status,
    submitError,
    progress: { completed: completedCount, total: ALL_FIELDS.length + 1 },
    handleChange,
    handleBlur,
    addFiles,
    removeFile,
    submit,
    reset,
  };
}
