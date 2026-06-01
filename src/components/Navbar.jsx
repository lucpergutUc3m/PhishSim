import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { UserPlus, LogIn, BarChart2, LayoutDashboard, LogOut, ShieldCheck } from 'lucide-react'

export default function Navbar() {
  const { pathname } = useLocation()
  const { isAdmin, username, logout } = useAuth()

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        <span className="nav-logo-mark">PS</span>
        <span>PhishSim</span>
      </Link>

      <ul className="nav-links">
        {!isAdmin && (
          <>
            <li>
              <Link to="/registro" className={pathname === '/registro' ? 'active' : ''}>
                <UserPlus size={15} />
                Registro
              </Link>
            </li>
            <li>
              <Link to="/resultados" className={`nav-login-btn${pathname === '/resultados' ? ' active' : ''}`}>
                <LogIn size={15} />
                Iniciar sesión
              </Link>
            </li>
          </>
        )}

        {isAdmin && (
          <>
            <li>
              <Link to="/resultados" className={pathname === '/resultados' ? 'active' : ''}>
                <BarChart2 size={15} />
                Mis resultados
              </Link>
            </li>
            <li>
              <Link to="/admin" className={`nav-panel-link${pathname === '/admin' ? ' active' : ''}`}>
                <LayoutDashboard size={15} />
                Panel
              </Link>
            </li>
            <li className="nav-sep" aria-hidden="true" />
            <li>
              <span className="nav-admin-badge">
                <ShieldCheck size={13} />
                {username ?? 'Administrador'}
              </span>
            </li>
            <li>
              <button className="nav-logout" onClick={logout}>
                <LogOut size={14} />
                Cerrar sesión
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  )
}
