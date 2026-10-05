import './ProgressBar.css';

export default function ProgressBar({ completed, total }) {
  const percent = Math.round((completed / total) * 100);
  return (
    <div className="progress">
      <div className="progress__label">
        <span>Progreso del formulario</span>
        <strong>
          {completed} de {total} campos
        </strong>
      </div>
      <div
        className="progress__track"
        role="progressbar"
        aria-label="Progreso del formulario"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={completed}
      >
        <div className="progress__fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
