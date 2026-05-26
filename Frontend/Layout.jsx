import { Link, useLocation } from 'react-router-dom'
import { Zap, Clock, Plus } from 'lucide-react'

export default function Layout({ children }) {
  const { pathname } = useLocation()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <nav style={{
        borderBottom: '1px solid var(--border)',
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '56px',
        position: 'sticky',
        top: 0,
        background: 'rgba(10,10,10,0.92)',
        backdropFilter: 'blur(12px)',
        zIndex: 100,
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: 28, height: 28,
            background: 'var(--lime)',
            borderRadius: '4px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Zap size={16} color="#0a0a0a" fill="#0a0a0a" />
          </div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 17,
            color: 'var(--text)',
            letterSpacing: '-0.02em',
          }}>
            prep<span style={{ color: 'var(--lime)' }}>AI</span>
          </span>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <NavLink to="/history" active={pathname === '/history'} icon={<Clock size={14} />}>
            History
          </NavLink>
          <Link to="/new" className="btn btn-primary" style={{ padding: '7px 16px', fontSize: 12 }}>
            <Plus size={14} />
            New Session
          </Link>
        </div>
      </nav>

      <main style={{ flex: 1 }}>
        {children}
      </main>
    </div>
  )
}

function NavLink({ to, active, icon, children }) {
  return (
    <Link to={to} style={{
      display: 'flex', alignItems: 'center', gap: '6px',
      padding: '6px 14px',
      borderRadius: 'var(--radius)',
      textDecoration: 'none',
      fontSize: 13,
      fontFamily: 'var(--font-mono)',
      color: active ? 'var(--text)' : 'var(--text-2)',
      background: active ? 'var(--bg-2)' : 'transparent',
      transition: 'all 0.15s',
    }}>
      {icon}
      {children}
    </Link>
  )
}