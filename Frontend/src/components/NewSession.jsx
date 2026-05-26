import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createSession } from '../services/api'
import { Zap, ArrowRight, Building2, Briefcase } from 'lucide-react'

const EXAMPLE_JD = `We are looking for a Software Engineer II to join our platform team.

You will work on building scalable REST APIs, designing data pipelines, and contributing to our React frontend.

Requirements:
- 2+ years of experience with Python or Node.js backend development
- Experience with React or Vue.js
- Familiarity with AWS services (Lambda, S3, DynamoDB)
- Understanding of CI/CD pipelines and DevOps practices
- Strong communication skills and ability to work in an agile environment

Nice to have:
- Experience with TypeScript
- Knowledge of infrastructure as code (CDK, Terraform)
- Prior experience at a fintech or SaaS company`

export default function NewSession() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ 
    job_description: '', 
    company: '', 
    role: '', 
    title: '',
    total_questions: 10,
    behavioral_count: 5,
    technical_count: 5
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [charCount, setCharCount] = useState(0)

  const handleJDChange = (e) => {
    setForm(f => ({ ...f, job_description: e.target.value }))
    setCharCount(e.target.value.length)
  }

  const handleSubmit = async () => {
    if (!form.job_description.trim()) {
      setError('Job description is required.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const session = await createSession(form)
      navigate(`/session/${session.id}`)
    } catch (e) {
      setError(e.response?.data?.error || 'Something went wrong. Is the backend running?')
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '60px 32px' }}>

      {/* Header */}
      <div style={{ marginBottom: 48, animation: 'fadeUp 0.4s ease forwards' }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--text-3)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: 12,
        }}>
          Step 01 / New Session
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 36,
          fontWeight: 800,
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          marginBottom: 12,
        }}>
          Paste the job description.
        </h1>
        <p style={{ color: 'var(--text-2)', fontSize: 14, lineHeight: 1.6 }}>
          We'll generate {form.behavioral_count} behavioral + {form.technical_count} technical questions tailored to this exact role.
        </p>
      </div>

      {/* Form */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeUp 0.4s ease 0.1s both' }}>

        {/* Company + Role row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, fontSize: 12, color: 'var(--text-2)', fontFamily: 'var(--font-mono)' }}>
              <Building2 size={12} /> Company <span style={{ color: 'var(--text-3)' }}>(optional)</span>
            </label>
            <input
              className="input"
              placeholder="e.g. Ameritas"
              value={form.company}
              onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
            />
          </div>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, fontSize: 12, color: 'var(--text-2)', fontFamily: 'var(--font-mono)' }}>
              <Briefcase size={12} /> Role <span style={{ color: 'var(--text-3)' }}>(optional)</span>
            </label>
            <input
              className="input"
              placeholder="e.g. Software Developer"
              value={form.role}
              onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
            />
          </div>
        </div>

        {/* Question Count Settings */}
        <div style={{ 
          padding: 16, 
          borderRadius: 'var(--radius)', 
          background: 'rgba(120,200,80,0.05)', 
          border: '1px solid rgba(120,200,80,0.2)'
        }}>
          <div style={{ marginBottom: 12, fontSize: 12, color: 'var(--text-2)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
            Question Settings
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 12, color: 'var(--text-2)' }}>
                Behavioral Questions
              </label>
              <input
                type="number"
                className="input"
                min="1"
                max="20"
                value={form.behavioral_count}
                onChange={e => {
                  const val = Math.max(1, Math.min(20, parseInt(e.target.value) || 1))
                  setForm(f => ({ 
                    ...f, 
                    behavioral_count: val,
                    total_questions: val + (f.total_questions - f.behavioral_count)
                  }))
                }}
                style={{ fontSize: 14 }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 12, color: 'var(--text-2)' }}>
                Technical Questions
              </label>
              <input
                type="number"
                className="input"
                min="1"
                max="20"
                value={form.technical_count}
                onChange={e => {
                  const val = Math.max(1, Math.min(20, parseInt(e.target.value) || 1))
                  setForm(f => ({ 
                    ...f, 
                    technical_count: val,
                    total_questions: (f.total_questions - f.technical_count) + val
                  }))
                }}
                style={{ fontSize: 14 }}
              />
            </div>
          </div>
          <div style={{ marginTop: 12, fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>
            Total: {form.behavioral_count} + {form.technical_count} = {form.total_questions} questions
          </div>
        </div>

        {/* JD textarea */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <label style={{ fontSize: 12, color: 'var(--text-2)', fontFamily: 'var(--font-mono)' }}>
              Job Description <span style={{ color: 'var(--red)' }}>*</span>
            </label>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{charCount} chars</span>
              <button
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)',
                  textDecoration: 'underline', padding: 0,
                }}
                onClick={() => { setForm(f => ({ ...f, job_description: EXAMPLE_JD })); setCharCount(EXAMPLE_JD.length) }}
              >
                Load example
              </button>
            </div>
          </div>
          <textarea
            className="textarea"
            rows={14}
            placeholder="Paste the full job description here..."
            value={form.job_description}
            onChange={handleJDChange}
            style={{ fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 1.7 }}
          />
        </div>

        {/* Error */}
        {error && (
          <div style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius)',
            background: 'rgba(255,60,60,0.08)',
            border: '1px solid rgba(255,60,60,0.25)',
            color: 'var(--red)',
            fontSize: 13,
          }}>
            {error}
          </div>
        )}

        {/* Submit */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            className="btn btn-primary"
            style={{ fontSize: 14, padding: '12px 28px', gap: 10 }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner" style={{ width: 16, height: 16 }} />
                Generating questions...
              </>
            ) : (
              <>
                <Zap size={16} />
                Generate Questions
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </div>

        {loading && (
          <div style={{
            padding: '16px 20px',
            borderRadius: 'var(--radius)',
            background: 'var(--lime-dim)',
            border: '1px solid rgba(200,255,0,0.2)',
            fontSize: 13,
            color: 'var(--lime)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}>
            <span className="spinner" style={{ borderTopColor: 'var(--lime)', borderColor: 'rgba(200,255,0,0.2)' }} />
            Claude is analyzing the job description and crafting your questions...
          </div>
        )}
      </div>
    </div>
  )
}
