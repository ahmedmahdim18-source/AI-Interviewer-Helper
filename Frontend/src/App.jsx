import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './components/Home'
import NewSession from './components/NewSession'
import History from './components/History'
import Session from './pages/Session'

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/new" element={<NewSession />} />
          <Route path="/history" element={<History />} />
          <Route path="/session/:id" element={<Session />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
