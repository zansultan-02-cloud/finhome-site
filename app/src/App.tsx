import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/public/Home'
import { Support } from './pages/public/Support'
import { Privacy } from './pages/public/Privacy'
import { Login } from './pages/admin/Login'
import { Dashboard } from './pages/admin/Dashboard'
import { StoriesList } from './pages/admin/Stories/StoriesList'
import { StoryEditor } from './pages/admin/Stories/StoryEditor'
import { Media } from './pages/admin/Media'
import { Settings } from './pages/admin/Settings'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/support" element={<Support />} />
      <Route path="/privacy" element={<Privacy />} />

      <Route path="/admin/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/stories"
        element={
          <ProtectedRoute>
            <StoriesList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/stories/:id"
        element={
          <ProtectedRoute>
            <StoryEditor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/media"
        element={
          <ProtectedRoute>
            <Media />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
