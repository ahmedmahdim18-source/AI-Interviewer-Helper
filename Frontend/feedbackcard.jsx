import { CheckCircle2, XCircle, Lightbulb } from 'lucide-react'

export default function FeedbackCard({ feedback }) {
  if (!feedback) return null

  const { score, strengths = [], gaps = [], suggestion } = feedback

  const scoreColor = score >= 8 ? 'var(--lime)' : score >= 5 ? 'var(--orange)' : 'var(--red)'
  const scoreLabel = score >= 8 ? 'Strong' : score >= 5 ? 'Decent' : 'Needs Work'

  return (
    <div style={{
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      animation: 'fadeUp 0.4s ease forwards',
      marginTop: 16,
    }}>
      {/* Score header */}
      <div style={{
        padding: '16px 20px',
        background: 'var(--bg-2)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--text-3)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}>
          AI Feedback
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-2)' }}>
            {scoreLabel}
          </span>
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 2,
          }}>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: 28,
              fontWeight: 800,
              color: scoreColor,
              lineHeight: 1,
              textShadow: `0 0 20px ${scoreColor}66`,
            }}>
              {score}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-3)' }}>/10</span>
          </div>
        </div>
      </div>

      {/* Score bar */}
      <div style={{ height: 3, background: 'var(--bg-3)' }}>
        <div style={{
          height: '100%',
          width: `${score * 10}%`,
          background: scoreColor,
          transition: 'width 0.8s ease',
          boxShadow: `0 0 8px ${scoreColor}`,
        }} />
      </div>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Strengths + Gaps */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {strengths.length > 0 && (
            <div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                marginBottom: 10, fontSize: 11, color: 'var(--lime)',
                fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em',
              }}>
                <CheckCircle2 size={12} />
                Strengths
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {strengths.map((s, i) => (
                  <li key={i} style={{
                    fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5,
                    paddingLeft: 12, position: 'relative',
                  }}>
                    <span style={{ position: 'absolute', left: 0, color: 'var(--lime)' }}>›</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {gaps.length > 0 && (
            <div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                marginBottom: 10, fontSize: 11, color: 'var(--red)',
                fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em',
              }}>
                <XCircle size={12} />
                Gaps
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {gaps.map((g, i) => (
                  <li key={i} style={{
                    fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5,
                    paddingLeft: 12, position: 'relative',
                  }}>
                    <span style={{ position: 'absolute', left: 0, color: 'var(--red)' }}>›</span>
                    {g}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Suggestion */}
        {suggestion && (
          <div style={{
            padding: '14px 16px',
            background: 'var(--bg-2)',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border)',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              marginBottom: 8, fontSize: 11, color: 'var(--orange)',
              fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em',
            }}>
              <Lightbulb size={12} />
              How to improve
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7 }}>
              {suggestion}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}