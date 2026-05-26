import { Link } from 'react-router-dom'
import { ArrowRight, Zap, Mic, Brain, History } from 'lucide-react'

export default function Home() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '80px 32px' }}>

      {/* Hero */}
      <div style={{ marginBottom: 80, animation: 'fadeUp 0.5s ease forwards' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '4px 12px', borderRadius: 2,
          border: '1px solid rgba(200,255,0,0.2)',
          background: 'rgba(200,255,0,0.05)',
          marginBottom: 32,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--lime)', animation: 'pulse-lime 2s infinite' }} />
          <span style={{ fontSize: 11, color: 'var(--lime)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            AI-Powered Interview Coach
          </span>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(48px, 8vw, 80px)',
          fontWeight: 800,
          lineHeight: 0.95,
          letterSpacing: '-0.03em',
          marginBottom: 28,
        }}>
          Stop winging<br />
          <span style={{
            color: 'transparent',
            WebkitTextStroke: '1.5px var(--text-3)',
          }}>your interviews.</span>
        </h1>

        <p style={{
          color: 'var(--text-2)',
          fontSize: 16,
          maxWidth: 480,
          lineHeight: 1.7,
          marginBottom: 40,
          fontFamily: 'var(--font-mono)',
        }}>
          Paste a job description. Get tailored questions. Practice with voice or text.
          Receive brutal, honest AI feedback. Ship to production.
        </p>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link to="/new" className="btn btn-primary" style={{ fontSize: 14, padding: '12px 28px' }}>
            Start Practicing
            <ArrowRight size={16} />
          </Link>
          <Link to="/history" className="btn btn-ghost" style={{ fontSize: 14, padding: '12px 24px' }}>
            View History
          </Link>
        </div>
      </div>

      {/* Feature grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 1,
        background: 'var(--border)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
      }}>
        {[
          { icon: <Brain size={20} />, title: 'Smart Questions', desc: '5 behavioral + 5 technical questions tailored to the exact role and stack.' },
          { icon: <Mic size={20} />, title: 'Voice Mode', desc: 'Answer out loud. Browser transcription converts your speech to text instantly.' },
          { icon: <Zap size={20} />, title: 'Instant Feedback', desc: 'Score out of 10 with strengths, gaps, and a concrete improvement suggestion.' },
          { icon: <History size={20} />, title: 'Session History', desc: 'Every session saved. Review past answers and track your improvement over time.' },
        ].map((f, i) => (
          <div key={i} style={{
            background: 'var(--bg-1)',
            padding: '28px 24px',
            animation: `fadeUp 0.4s ease ${i * 0.08}s both`,
          }}>
            <div style={{ color: 'var(--lime)', marginBottom: 14 }}>{f.icon}</div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 15,
              marginBottom: 8,
              color: 'var(--text)',
            }}>{f.title}</div>
            <div style={{ color: 'var(--text-2)', fontSize: 13, lineHeight: 1.6 }}>{f.desc}</div>
          </div>
        ))}
      </div>

      {/* Bottom decoration */}
      <div style={{
        marginTop: 80,
        paddingTop: 40,
        borderTop: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: 'var(--text-3)',
        fontSize: 12,
      }}>
        <span>Built with Claude API</span>
        <span>v1.0.0</span>
      </div>
    </div>
  )
}
