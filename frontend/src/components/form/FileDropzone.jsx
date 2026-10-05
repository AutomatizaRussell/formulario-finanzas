import { useState } from 'react';
import { formatFileSize } from '../../utils/formatters.js';
import { AlertIcon, CloseIcon, FileIcon, UploadIcon } from '../icons/Icons.jsx';
import './FileDropzone.css';

export default function FileDropzone({ field, files, error, onAdd, onRemove }) {
  const [isDragging, setIsDragging] = useState(false);
  const id = `field-${field.name}`;
  const errorId = error ? `${id}-error` : undefined;

  const handleFiles = (fileList) => {
    if (fileList?.length) onAdd(Array.from(fileList));
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    handleFiles(event.dataTransfer.files);
  };

  const handleInputChange = (event) => {
    handleFiles(event.target.files);
    // Permite volver a elegir el mismo archivo después de quitarlo
    event.target.value = '';
  };

  const className = [
    'dropzone',
    isDragging && 'dropzone--dragging',
    error && 'dropzone--invalid',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="file-field">
      <p className="field__label" id={`${id}-label`}>
        {field.label}
        <span className="field__required" aria-hidden="true">
          *
        </span>
      </p>

      <label
        htmlFor={id}
        className={className}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <span className="dropzone__icon">
          <UploadIcon width={26} height={26} />
        </span>
        <span className="dropzone__title">
          Arrastre sus archivos aquí o <span className="dropzone__link">selecciónelos</span>
        </span>
        <span className="dropzone__meta">
          Formato {field.accept.join(', ')} · Máximo {field.maxSizeMb} MB por archivo · Puede adjuntar varios
        </span>
        <input
          id={id}
          type="file"
          name={field.name}
          className="visually-hidden"
          accept={field.accept.join(',')}
          multiple
          onChange={handleInputChange}
          aria-labelledby={`${id}-label`}
          aria-describedby={errorId}
          aria-invalid={Boolean(error)}
        />
      </label>

      {error && (
        <p id={errorId} className="field__error" role="alert">
          <AlertIcon width={14} height={14} />
          {error}
        </p>
      )}

      {files.length > 0 && (
        <ul className="file-list" aria-label="Archivos adjuntos">
          {files.map((file) => (
            <li key={`${file.name}-${file.lastModified}`} className="file-list__item">
              <FileIcon className="file-list__icon" />
              <span className="file-list__name">{file.name}</span>
              <span className="file-list__size">{formatFileSize(file.size)}</span>
              <button
                type="button"
                className="file-list__remove"
                onClick={() => onRemove(file)}
                aria-label={`Quitar ${file.name}`}
              >
                <CloseIcon width={16} height={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
