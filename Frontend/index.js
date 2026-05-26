import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

// Sessions
export const getSessions = () => api.get('/sessions/').then(r => r.data)
export const createSession = (data) => api.post('/sessions/', data).then(r => r.data)
export const getSession = (id) => api.get(`/sessions/${id}`).then(r => r.data)
export const deleteSession = (id) => api.delete(`/sessions/${id}`).then(r => r.data)

// Answers
export const submitAnswer = (data) => api.post('/answers/', data).then(r => r.data)
export const getAnswersForQuestion = (questionId) =>
  api.get(`/answers/question/${questionId}`).then(r => r.data)