import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getSessions, deleteSession } from '../api'
import { Plus, Trash2, Building2, Calendar, ChevronRight, BarChart2 } from 'lucide-react'

export default function History() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    getSessions()
      .then(setSessions)
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (e, id) => {
    e.preventDefault()
    e.stopPropagation()
    if (!confirm('Delete this session?')) return
    setDeleting(id)
    try {
      await deleteSession(id)
      setSessions(s => s.filter(x => x.id !== id))
    } finally {
      setDeleting(null)
    }
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 12, color: 'var(--text-2)' }}>
      <span className="spinner" /> Loading...
    </div>
  )

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '60px 32px' }}>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        marginBottom: 40, animation: 'fadeUp 0.4s ease forwards',
      }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8, fontFamily: 'var(--font-mono)' }}>
            Session History
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 32,
            fontWeight: 800, letterSpacing: '-0.03em',
          }}>
            Past Sessions
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: 'var(--text-3)', fontWeight: 400, marginLeft: 12 }}>
              ({sessions.length})
            </span>
          </h1>
        </div>
        <Link to="/new" className="btn btn-primary" style={{ fontSize: 13 }}>
          <Plus size={15} /> New Session
        </Link>
      </div>

      {/* Empty state */}
      {sessions.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '80px 32px',
          border: '1px dashed var(--border)', borderRadius: 'var(--radius-lg)',
          animation: 'fadeUp 0.4s ease forwards',
        }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>📋</div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
            No sessions yet
          </h3>
          <p style={{ color: 'var(--text-2)', fontSize: 14, marginBottom: 24 }}>
            Start your first practice session to see it here.
          </p>
          <Link to="/new" className="btn btn-primary">
            <Plus size={15} /> Start Practicing
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {sessions.map((s, i) => (
            <SessionRow
              key={s.id}
              session={s}
              index={i}
              deleting={deleting === s.id}
              onDelete={(e) => handleDelete(e, s.id)}
              onClick={() => navigate(`/session/${s.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function SessionRow({ session, index, deleting, onDelete, onClick }) {
  const date = new Date(session.updated_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  })

  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center',
        padding: '16px 20px',
        background: 'var(--bg-1)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        cursor: 'pointer',
        transition: 'all 0.15s',
        gap: 16,
        animation: `fadeUp 0.4s ease ${index * 0.05}s both`,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--border-bright)'
        e.currentTarget.style.background = 'var(--bg-2)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.background = 'var(--bg-1)'
      }}
    >
      {/* Index */}
      <div style={{
        minWidth: 36, height: 36,
        background: 'var(--bg-3)',
        borderRadius: 'var(--radius)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-3)',
      }}>
        {String(index + 1).padStart(2, '0')}
      </div>

      {/* Title + meta */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15,
          color: 'var(--text)', marginBottom: 4,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {session.title}
        </div>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          {session.company && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-3)' }}>
              <Building2 size={11} />{session.company}
            </span>
          )}
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-3)' }}>
            <Calendar size={11} />{date}
          </span>
        </div>
      </div>

      {/* Delete */}
      <button
        onClick={onDelete}
        disabled={deleting}
        className="btn btn-danger"
        style={{ padding: '6px 10px', fontSize: 12 }}
      >
        {deleting ? <span className="spinner" style={{ width: 13, height: 13 }} /> : <Trash2 size={13} />}
      </button>

      <ChevronRight size={16} style={{ color: 'var(--text-3)' }} />
    </div>
  )
}