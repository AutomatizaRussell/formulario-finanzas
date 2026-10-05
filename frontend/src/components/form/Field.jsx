import { isNumericField } from '../../utils/formatters.js';
import { AlertIcon, ChevronIcon } from '../icons/Icons.jsx';
import './Field.css';

export default function Field({ field, value, error, onChange, onBlur }) {
  const id = `field-${field.name}`;
  const hintId = field.hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  const controlProps = {
    id,
    name: field.name,
    value,
    onChange: (event) => onChange(field, event.target.value),
    onBlur: () => onBlur(field),
    required: true,
    'aria-invalid': Boolean(error),
    'aria-describedby': [hintId, errorId].filter(Boolean).join(' ') || undefined,
  };

  return (
    <div
      className={['field', field.fullWidth && 'field--full', error && 'field--invalid']
        .filter(Boolean)
        .join(' ')}
    >
      <label className="field__label" htmlFor={id}>
        {field.label}
        <span className="field__required" aria-hidden="true">
          *
        </span>
      </label>

      {field.type === 'select' ? (
        <div className="field__control field__control--select">
          <select {...controlProps} className={value ? '' : 'is-placeholder'}>
            <option value="" disabled>
              Seleccione una opción
            </option>
            {field.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronIcon className="field__chevron" />
        </div>
      ) : (
        <div className="field__control">
          <input
            {...controlProps}
            type="text"
            inputMode={isNumericField(field) ? 'numeric' : undefined}
            autoComplete="off"
            placeholder={field.placeholder}
          />
        </div>
      )}

      {error ? (
        <p id={errorId} className="field__error">
          <AlertIcon width={14} height={14} />
          {error}
        </p>
      ) : (
        field.hint && (
          <p id={hintId} className="field__hint">
            {field.hint}
          </p>
        )
      )}
    </div>
  );
}
