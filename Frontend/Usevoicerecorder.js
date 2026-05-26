import { useState, useRef, useCallback } from 'react'

export function useVoiceRecorder(onTranscript) {
  const [isRecording, setIsRecording] = useState(false)
  const [error, setError] = useState(null)
  const recognitionRef = useRef(null)

  const start = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setError('Speech recognition not supported in this browser. Try Chrome.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    let finalTranscript = ''

    recognition.onresult = (event) => {
      let interimTranscript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' '
        } else {
          interimTranscript += transcript
        }
      }
      onTranscript(finalTranscript + interimTranscript, false)
    }

    recognition.onfinalresult = () => {
      onTranscript(finalTranscript.trim(), true)
    }

    recognition.onerror = (event) => {
      setError(`Mic error: ${event.error}`)
      setIsRecording(false)
    }

    recognition.onend = () => {
      setIsRecording(false)
      onTranscript(finalTranscript.trim(), true)
    }

    recognition.start()
    recognitionRef.current = recognition
    setIsRecording(true)
    setError(null)
  }, [onTranscript])

  const stop = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    setIsRecording(false)
  }, [])

  return { isRecording, start, stop, error }
}