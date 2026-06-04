import AuditHistory from '@components/AuditHistory';
import Layout from '@components/Layout';
import { ProtectedRoute } from '@components/ProtectedRoute';
import { AuthProvider } from '@contexts/AuthContext';
import Login from '@pages/Login';
import NewAudit from '@pages/NewAudit';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import About from './pages/About';
import Register from './pages/Register';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename="/narwall">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route index element={<AuditHistory />} />
              <Route path="/about" element={<About />} />
              <Route path="new-audit" element={<NewAudit />} />
              {/* Optional: Keep the explicit path if you want links
              to "/audit-history" to work too
              */}
            </Route>
          </Route>

          {/* 4. Fallback: Catch-all redirect (Optional) */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;