import { Routes, Route } from 'react-router'
import { Layout } from './components/Layout'
import Home from './pages/Home'
import Rankings from './pages/Rankings'
import Matches from './pages/Matches'
import TeamDetail from './pages/TeamDetail'
import PlayerDetail from './pages/PlayerDetail'
import AdminDashboard from './pages/AdminDashboard'
import Login from './pages/Login'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rankings" element={<Rankings />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/team/:id" element={<TeamDetail />} />
        <Route path="/player/:id" element={<PlayerDetail />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}
