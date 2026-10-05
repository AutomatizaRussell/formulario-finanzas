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
      {children}
    </section>
  );
}

export function FieldGrid({ columns = 1, children }) {
  return <div className={`field-grid field-grid--cols-${columns}`}>{children}</div>;
}
