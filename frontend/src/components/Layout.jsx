import { Link, NavLink, useNavigate } from 'react-router-dom';

export default function Layout({ children }) {
  const user = JSON.parse(localStorage.getItem('gricel_user') || 'null');
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('gricel_token');
    localStorage.removeItem('gricel_user');
    navigate('/');
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand">
          <img
            className="brand-logo"
            src="/logo-bordados-gricel.png"
            alt="Bordados Gricel"
          />
          <span className="brand-copy">
            Bordados Gricel
            <small>Bordado · Sublimado · Confección</small>
          </span>
        </Link>

        <nav>
          <NavLink to="/">Inicio</NavLink>
          {user?.role === 'CLIENT' && <NavLink to="/portal">Mis pedidos</NavLink>}
          {user?.role === 'CLIENT' && <NavLink to="/nuevo-pedido">Nuevo pedido</NavLink>}
          {user && user.role !== 'CLIENT' && <NavLink to="/admin">CRM</NavLink>}
          {!user ? (
            <>
              <NavLink to="/login">Ingresar</NavLink>
              <Link className="button small" to="/registro">Registrarme</Link>
            </>
          ) : (
            <button className="ghost" onClick={logout}>Salir</button>
          )}
        </nav>
      </header>

      <main>{children}</main>

      <footer>
        <strong>Bordados Gricel</strong>
        <span>Pedidos personalizados, bordados, sublimación y confección.</span>
      </footer>
    </div>
  );
}
