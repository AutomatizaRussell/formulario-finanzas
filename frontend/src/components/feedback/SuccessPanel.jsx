import { useEffect, useRef } from 'react';
import { CheckIcon } from '../icons/Icons.jsx';
import './SuccessPanel.css';

export default function SuccessPanel({ onReset }) {
  const headingRef = useRef(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div className="success" role="status">
      <span className="success__icon">
        <CheckIcon width={34} height={34} />
      </span>
      <h2 ref={headingRef} tabIndex={-1} className="success__title">
        Reporte recibido
      </h2>
      <p className="success__text">
        La información y el acumulado por tercero se enviaron correctamente al equipo de Precios
        de Transferencia.
      </p>
      <button type="button" className="button button--secondary" onClick={onReset}>
        Enviar otro reporte
      </button>
    </div>
  );
}
