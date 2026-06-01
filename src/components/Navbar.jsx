import { useRef, useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { UserPlus, LogIn, BarChart2, LayoutDashboard, LogOut, ShieldCheck, User, Settings } from 'lucide-react'

function UserMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    function handleOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  const initial = (user.first_name?.[0] ?? user.email?.[0] ?? '?').toUpperCase()
  const name = [user.first_name, user.last_name].filter(Boolean).join(' ') || user.email

  return (
    <li className="user-menu-wrap" ref={ref}>
      <button className="user-avatar-btn" onClick={() => setOpen((o) => !o)} title="Mi cuenta">
        {initial}
      </button>
      {open && (
        <div className="user-dropdown">
          <div className="user-dropdown-header">
            <span className="user-dropdown-name">{name}</span>
            <span className="user-dropdown-email">{user.email}</span>
          </div>
          <button
            className="user-dropdown-item"
            onClick={() => { setOpen(false); navigate('/perfil') }}
          >
            <Settings size={14} /> Actualizar perfil
          </button>
          <button
            className="user-dropdown-item user-dropdown-logout"
            onClick={() => { setOpen(false); onLogout() }}
          >
            <LogOut size={14} /> Cerrar sesión
          </button>
        </div>
      )}
    </li>
  )
}

export default function Navbar() {
  const { pathname } = useLocation()
  const { isAdmin, username, logout, user, participantLogout } = useAuth()

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        <span className="nav-logo-mark">PS</span>
        <span>PhishSim</span>
      </Link>

      <ul className="nav-links">
        {/* Sin sesión */}
        {!isAdmin && !user && (
          <>
            <li>
              <Link to="/registro" className={pathname === '/registro' ? 'active' : ''}>
                <UserPlus size={15} /> Registro
              </Link>
            </li>
            <li>
              <Link to="/resultados" className={`nav-login-btn${pathname === '/resultados' ? ' active' : ''}`}>
                <LogIn size={15} /> Iniciar sesión
              </Link>
            </li>
          </>
        )}

        {/* Participante logueado */}
        {user && !isAdmin && (
          <>
            <li>
              <Link to="/resultados" className={pathname === '/resultados' ? 'active' : ''}>
                <BarChart2 size={15} /> Mis resultados
              </Link>
            </li>
            <UserMenu user={user} onLogout={participantLogout} />
          </>
        )}

        {/* Admin logueado */}
        {isAdmin && (
          <>
            <li>
              <Link to="/resultados" className={pathname === '/resultados' ? 'active' : ''}>
                <BarChart2 size={15} /> Mis resultados
              </Link>
            </li>
            <li>
              <Link to="/admin" className={`nav-panel-link${pathname === '/admin' ? ' active' : ''}`}>
                <LayoutDashboard size={15} /> Panel
              </Link>
            </li>
            <li className="nav-sep" aria-hidden="true" />
            <li>
              <span className="nav-admin-badge">
                <ShieldCheck size={13} /> {username ?? 'Administrador'}
              </span>
            </li>
            <li>
              <button className="nav-logout" onClick={logout}>
                <LogOut size={14} /> Cerrar sesión
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  )
}
