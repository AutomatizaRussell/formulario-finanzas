import ReportForm from './components/ReportForm.jsx';
import BrandFooter from './components/layout/BrandFooter.jsx';
import BrandHeader from './components/layout/BrandHeader.jsx';
import './App.css';

export default function App() {
  return (
    <div className="page">
      <main className="card">
        <BrandHeader />

        <div className="card__body">
          <div className="intro">
            <p className="intro__eyebrow">Periodo fiscal 2026</p>
            <h1 className="intro__title">
              <strong>Base de datos</strong> Russell
            </h1>
            <p className="intro__text">
              Diligencie la información de la entidad informante y sus operaciones con vinculados.
              Tenga a mano el acumulado por tercero a agosto 2026 en formato Excel.
            </p>
          </div>

          <ReportForm />
        </div>

        <BrandFooter />
      </main>
    </div>
  );
}
