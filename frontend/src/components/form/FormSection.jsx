import './FormSection.css';

export default function FormSection({ number, title, description, children }) {
  const headingId = `section-${number}-title`;
  return (
    <section className="form-section" aria-labelledby={headingId}>
      <header className="form-section__header">
        <span className="form-section__number" aria-hidden="true">
          {number}
        </span>
        <div>
          <h2 id={headingId} className="form-section__title">
            {title}
          </h2>
          {description && <p className="form-section__description">{description}</p>}
        </div>
      </header>
      <div className="form-section__body">{children}</div>
    </section>
  );
}

export function FieldGroup({ title, description, columns = 1, children }) {
  return (
    <div className="field-group">
      {title && (
        <div className="field-group__header">
          <h3 className="field-group__title">{title}</h3>
          {description && <p className="field-group__description">{description}</p>}
        </div>
      )}
      <div className={`field-group__grid field-group__grid--cols-${columns}`}>{children}</div>
    </div>
  );
}
