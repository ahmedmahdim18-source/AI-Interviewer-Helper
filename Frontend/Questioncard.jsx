import { useState, useCallback } from 'react'
import { Mic, MicOff, Send, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react'
import { submitAnswer } from '../api'
import { useVoiceRecorder } from '../hooks/useVoiceRecorder'
import FeedbackCard from './FeedbackCard'

export default function QuestionCard({ question, index, isActive, onActivate }) {
  const [answer, setAnswer] = useState('')
  const [mode, setMode] = useState('text') // 'text' | 'voice'
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState(
    question.answers?.[0]?.feedback || null
  )
  const [prevAnswer, setPrevAnswer] = useState(
    question.answers?.[0]?.text || null
  )
  const [expanded, setExpanded] = useState(false)

  const handleTranscript = useCallback((text) => {
    setAnswer(text)
  }, [])

  const { isRecording, start, stop, error: micError } = useVoiceRecorder(handleTranscript)

  const handleSubmit = async () => {
    if (!answer.trim()) return
    setLoading(true)
    try {
      const result = await submitAnswer({
        question_id: question.id,
        text: answer.trim(),
        input_mode: mode,
      })
      setFeedback(result.feedback)
      setPrevAnswer(result.text)
      setAnswer('')
      setExpanded(true)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFeedback(null)
    setPrevAnswer(null)
    setAnswer('')
    setExpanded(false)
  }

  const toggleVoice = () => {
    if (isRecording) {
      stop()
    } else {
      setMode('voice')
      start()
    }
  }

  const hasAnswer = !!feedback

  return (
    <div style={{
      border: `1px solid ${isActive ? 'var(--border-bright)' : 'var(--border)'}`,
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      transition: 'border-color 0.2s',
      animation: `fadeUp 0.4s ease ${index * 0.05}s both`,
    }}>
      {/* Question header */}
      <div
        onClick={() => isActive ? null : onActivate(question.id)}
        style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 14,
          cursor: isActive ? 'default' : 'pointer',
          background: isActive ? 'var(--bg-2)' : 'var(--bg-1)',
          transition: 'background 0.2s',
        }}
      >
        {/* Index */}
        <div style={{
          minWidth: 28, height: 28,
          borderRadius: 'var(--radius)',
          background: hasAnswer ? 'rgba(200,255,0,0.12)' : 'var(--bg-3)',
          border: `1px solid ${hasAnswer ? 'rgba(200,255,0,0.25)' : 'var(--border)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12,
          fontFamily: 'var(--font-mono)',
          color: hasAnswer ? 'var(--lime)' : 'var(--text-3)',
          fontWeight: 600,
          marginTop: 1,
        }}>
          {hasAnswer ? '✓' : String(index + 1).padStart(2, '0')}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
            <span className={`tag tag-${question.type}`}>
              {question.type}
            </span>
            {hasAnswer && feedback && (
              <span style={{
                fontSize: 11, fontFamily: 'var(--font-mono)',
                color: feedback.score >= 8 ? 'var(--lime)' : feedback.score >= 5 ? 'var(--orange)' : 'var(--red)',
              }}>
                {feedback.score}/10
              </span>
            )}
          </div>
          <p style={{
            fontSize: 14,
            color: 'var(--text)',
            lineHeight: 1.6,
            fontFamily: 'var(--font-mono)',
          }}>
            {question.text}
          </p>
        </div>

        {/* Expand toggle for answered */}
        {hasAnswer && (
          <button
            onClick={(e) => { e.stopPropagation(); setExpanded(x => !x) }}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-3)', padding: 4, marginTop: 2,
            }}
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        )}
      </div>

      {/* Answer area — active + unanswered */}
      {isActive && !hasAnswer && (
        <div style={{ padding: '20px', borderTop: '1px solid var(--border)', background: 'var(--bg-1)' }}>
          {/* Mode switcher */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            {['text', 'voice'].map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); if (isRecording) stop() }}
                style={{
                  padding: '5px 14px',
                  borderRadius: 'var(--radius)',
                  border: `1px solid ${mode === m ? 'rgba(200,255,0,0.3)' : 'var(--border)'}`,
                  background: mode === m ? 'var(--lime-dim)' : 'transparent',
                  color: mode === m ? 'var(--lime)' : 'var(--text-3)',
                  fontSize: 12,
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                {m === 'voice' && <Mic size={12} />}
                {m}
              </button>
            ))}
          </div>

          {/* Text input */}
          {mode === 'text' && (
            <textarea
              className="textarea"
              rows={5}
              placeholder="Type your answer here... Use the STAR method for behavioral questions."
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              style={{ marginBottom: 14 }}
            />
          )}

          {/* Voice input */}
          {mode === 'voice' && (
            <div style={{ marginBottom: 14 }}>
              <div style={{
                minHeight: 120,
                padding: '14px',
                background: 'var(--bg-2)',
                border: `1px solid ${isRecording ? 'rgba(200,255,0,0.3)' : 'var(--border)'}`,
                borderRadius: 'var(--radius)',
                marginBottom: 12,
                fontSize: 13,
                color: answer ? 'var(--text)' : 'var(--text-3)',
                lineHeight: 1.7,
                fontFamily: 'var(--font-mono)',
                transition: 'border-color 0.2s',
                position: 'relative',
              }}>
                {answer || 'Your transcribed answer will appear here...'}
                {isRecording && (
                  <span style={{
                    display: 'inline-block',
                    width: 8, height: 8,
                    borderRadius: '50%',
                    background: 'var(--red)',
                    marginLeft: 6,
                    animation: 'blink 1s infinite',
                    verticalAlign: 'middle',
                  }} />
                )}
              </div>

              <button
                onClick={toggleVoice}
                style={{
                  padding: '10px 20px',
                  borderRadius: 'var(--radius)',
                  border: `1px solid ${isRecording ? 'rgba(255,60,60,0.4)' : 'rgba(200,255,0,0.3)'}`,
                  background: isRecording ? 'rgba(255,60,60,0.08)' : 'var(--lime-dim)',
                  color: isRecording ? 'var(--red)' : 'var(--lime)',
                  fontSize: 13, fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8,
                  animation: isRecording ? 'pulse-lime 2s infinite' : 'none',
                }}
              >
                {isRecording ? <MicOff size={14} /> : <Mic size={14} />}
                {isRecording ? 'Stop Recording' : 'Start Recording'}
                {isRecording && <span style={{ color: 'var(--red)', fontSize: 11 }}>● REC</span>}
              </button>

              {micError && (
                <p style={{ marginTop: 8, fontSize: 12, color: 'var(--red)' }}>{micError}</p>
              )}
            </div>
          )}

          {/* Submit */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={loading || !answer.trim()}
              style={{ fontSize: 13 }}
            >
              {loading ? (
                <><span className="spinner" style={{ width: 14, height: 14 }} /> Getting feedback...</>
              ) : (
                <><Send size={14} /> Submit Answer</>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Feedback (expanded) */}
      {hasAnswer && expanded && (
        <div style={{ padding: '0 20px 20px', borderTop: '1px solid var(--border)', background: 'var(--bg-1)' }}>
          {prevAnswer && (
            <div style={{
              marginTop: 16, padding: '12px 14px',
              background: 'var(--bg-2)', borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7,
              fontFamily: 'var(--font-mono)',
            }}>
              <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Your Answer</div>
              {prevAnswer}
            </div>
          )}
          <FeedbackCard feedback={feedback} />
          <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={handleReset}>
              <RotateCcw size={13} /> Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  )
}