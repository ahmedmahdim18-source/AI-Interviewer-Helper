import axios from 'axios'

// Use environment variable or fallback to relative path for dev
const baseURL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({ baseURL })

// Sessions
export const getSessions = () => api.get('/sessions/').then(r => r.data)
export const createSession = (data) => api.post('/sessions/', data).then(r => r.data)
export const getSession = (id) => api.get(`/sessions/${id}`).then(r => r.data)
export const deleteSession = (id) => api.delete(`/sessions/${id}`).then(r => r.data)

// Answers
export const submitAnswer = (data) => api.post('/answers/', data).then(r => r.data)
export const getAnswersForQuestion = (questionId) =>
  api.get(`/answers/question/${questionId}`).then(r => r.data)
