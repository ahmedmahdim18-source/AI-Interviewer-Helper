import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getSession } from '../api'
import QuestionCard from '../components/QuestionCard'
import { ArrowLeft, Building2, Briefcase, Calendar, BarChart2 } from 'lucide-react'

export default function Session() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeQuestion, setActiveQuestion] = useState(null)
  const [filter, setFilter] = useState('all') // 'all' | 'behavioral' | 'technical'

  useEffect(() => {
    getSession(id)
      .then(data => {
        setSession(data)
        // Auto-activate first unanswered question
        const firstUnanswered = data.questions?.find(q => !q.answers?.length)
        if (firstUnanswered) setActiveQuestion(firstUnanswered.id)
      })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 12, color: 'var(--text-2)' }}>
      <span className="spinner" />
      Loading session...
    </div>
  )

  if (!session) return null

  const questions = session.questions || []
  const filtered = filter === 'all' ? questions : questions.filter(q => q.type === filter)

  const answered = questions.filter(q => q.answers?.length > 0)
  const avgScore = answered.length > 0
    ? (answered.reduce((sum, q) => sum + (q.answers[0]?.feedback?.score || 0), 0) / answered.length).toFixed(1)
    : null

  const behavioralCount = questions.filter(q => q.type === 'behavioral').length
  const technicalCount = questions.filter(q => q.type === 'technical').length

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 32px' }}>

      {/* Back */}
      <Link to="/history" style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        color: 'var(--text-3)', textDecoration: 'none', fontSize: 13,
        fontFamily: 'var(--font-mono)', marginBottom: 32,
        transition: 'color 0.15s',
      }}
        onMouseEnter={e => e.target.style.color = 'var(--text-2)'}
        onMouseLeave={e => e.target.style.color = 'var(--text-3)'}
      >
        <ArrowLeft size={14} /> Back to history
      </Link>

      {/* Session header */}
      <div style={{
        marginBottom: 32,
        paddingBottom: 28,
        borderBottom: '1px solid var(--border)',
        animation: 'fadeUp 0.4s ease forwards',
      }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 30,
          fontWeight: 800,
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          marginBottom: 14,
        }}>
          {session.title}
        </h1>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
          {session.company && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--text-2)' }}>
              <Building2 size={13} />
              {session.company}
            </span>
          )}
          {session.role && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--text-2)' }}>
              <Briefcase size={13} />
              {session.role}
            </span>
          )}
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--text-3)' }}>
            <Calendar size={13} />
            {new Date(session.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <StatChip label="Questions" value={questions.length} />
          <StatChip label="Answered" value={`${answered.length}/${questions.length}`} />
          {avgScore && <StatChip label="Avg Score" value={`${avgScore}/10`} highlight />}
          <StatChip label="Behavioral" value={behavioralCount} color="var(--blue)" />
          <StatChip label="Technical" value={technicalCount} color="var(--lime)" />
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: 16 }}>
          <div style={{
            height: 3,
            background: 'var(--bg-3)',
            borderRadius: 2,
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${questions.length > 0 ? (answered.length / questions.length) * 100 : 0}%`,
              background: 'var(--lime)',
              transition: 'width 0.5s ease',
              boxShadow: '0 0 8px rgba(200,255,0,0.5)',
            }} />
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 6, fontFamily: 'var(--font-mono)' }}>
            {answered.length === questions.length ? '✓ All questions answered' : `${questions.length - answered.length} remaining`}
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
        {['all', 'behavioral', 'technical'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '6px 16px',
              borderRadius: 'var(--radius)',
              border: `1px solid ${filter === f ? 'var(--border-bright)' : 'var(--border)'}`,
              background: filter === f ? 'var(--bg-2)' : 'transparent',
              color: filter === f ? 'var(--text)' : 'var(--text-3)',
              fontSize: 12, fontFamily: 'var(--font-mono)',
              cursor: 'pointer', transition: 'all 0.15s',
              textTransform: 'capitalize',
            }}
          >
            {f === 'all' ? `All (${questions.length})` : f === 'behavioral' ? `Behavioral (${behavioralCount})` : `Technical (${technicalCount})`}
          </button>
        ))}
      </div>

      {/* Questions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map((q, i) => (
          <QuestionCard
            key={q.id}
            question={q}
            index={questions.indexOf(q)}
            isActive={activeQuestion === q.id}
            onActivate={setActiveQuestion}
          />
        ))}
      </div>

    </div>
  )
}

function StatChip({ label, value, highlight, color }) {
  return (
    <div style={{
      padding: '6px 14px',
      borderRadius: 'var(--radius)',
      background: highlight ? 'var(--lime-dim)' : 'var(--bg-2)',
      border: `1px solid ${highlight ? 'rgba(200,255,0,0.2)' : 'var(--border)'}`,
      display: 'flex', alignItems: 'center', gap: 8,
    }}>
      <span style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
        {label}
      </span>
      <span style={{
        fontSize: 13, fontFamily: 'var(--font-display)', fontWeight: 700,
        color: highlight ? 'var(--lime)' : color || 'var(--text)',
      }}>
        {value}
      </span>
    </div>
  )
}