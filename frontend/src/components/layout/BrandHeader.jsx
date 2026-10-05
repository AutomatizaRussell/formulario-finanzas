import logoBlanco from '../../assets/logo-rb-blanco.png';
import ColorBar from './ColorBar.jsx';
import './BrandHeader.css';

export default function BrandHeader() {
  return (
    <header className="brand-header">
      <div className="brand-header__band">
        {/* Logotipo en versión negativa sobre fondo sólido, según manual 1.2 y 3.3 */}
        <img
          className="brand-header__logo"
          src={logoBlanco}
          alt="Russell Bedford — taking you further"
          width="900"
          height="195"
        />
        <div className="brand-header__circles" aria-hidden="true">
          <span className="circle circle--green" />
          <span className="circle circle--sky" />
          <span className="circle circle--orange" />
          <span className="circle circle--magenta" />
        </div>
      </div>
      <ColorBar />
    </header>
  );
}
