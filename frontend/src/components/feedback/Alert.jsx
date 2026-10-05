import { AlertIcon } from '../icons/Icons.jsx';
import './Alert.css';

export default function Alert({ title, children }) {
  return (
    <div className="alert" role="alert">
      <AlertIcon className="alert__icon" />
      <div>
        <p className="alert__title">{title}</p>
        {children && <p className="alert__detail">{children}</p>}
      </div>
    </div>
  );
}
