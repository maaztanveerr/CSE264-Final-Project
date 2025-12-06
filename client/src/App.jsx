// src/App.jsx
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import EventListPage from './pages/EventListPage.jsx'
import EventDetailPage from './pages/EventDetailPage.jsx'
import MyRsvpsPage from './pages/MyRsvpsPage.jsx'
import AdminDashboardPage from './pages/AdminDashboardPage.jsx'
import AdminEventFormPage from './pages/AdminEventFormPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import NavBar from './components/NavBar.jsx';
import Layout from './components/Layout.jsx';

function App() {
  return (
    <Router>
      <div className="app-root">
        {/*Navigation bar*/}
        <NavBar />
        {/*paths for different pages*/}
        {/*applying layout to all pages*/}
        <Layout>
          <Routes>
            <Route path="/" element={<EventListPage />} />
            <Route path="/events" element={<EventListPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            <Route path="/me/rsvps" element={<MyRsvpsPage />} />
            
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/events/new" element={<AdminEventFormPage />} />
            <Route path="/admin/events/:id/edit" element={<AdminEventFormPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  )
}

export default App
