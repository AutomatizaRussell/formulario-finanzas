import logoAzul from '../../assets/logo-rb-azul.png';
import ColorBar from './ColorBar.jsx';
import './BrandFooter.css';

export default function BrandFooter() {
  return (
    <footer className="brand-footer">
      <div className="brand-footer__content">
        <img
          className="brand-footer__logo"
          src={logoAzul}
          alt="Russell Bedford — taking you further"
          width="900"
          height="195"
        />
        <p className="brand-footer__text">
          Medellín · Bogotá · Cali · Cartagena · Barranquilla
          <br />
          <a href="https://www.russellbedford.com.co" target="_blank" rel="noreferrer">
            www.russellbedford.com.co
          </a>
        </p>
      </div>
      <ColorBar />
    </footer>
  );
}
