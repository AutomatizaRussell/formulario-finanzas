import './ColorBar.css';

/** Franja de cuatro colores de la papelería corporativa (membrete, presentaciones). */
export default function ColorBar() {
  return (
    <div className="color-bar" aria-hidden="true">
      <span className="color-bar__segment color-bar__segment--blue" />
      <span className="color-bar__segment color-bar__segment--magenta" />
      <span className="color-bar__segment color-bar__segment--green" />
      <span className="color-bar__segment color-bar__segment--orange" />
    </div>
  );
}
