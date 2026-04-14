import AuditHistory from '@components/AuditHistory';
import Layout from '@components/Layout';
import { ProtectedRoute } from '@components/ProtectedRoute';
import { AuthProvider } from '@contexts/AuthContext';
import Login from '@pages/Login';
import NewAudit from '@pages/NewAudit';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename="/berean-sync">
        <Routes>
          {/* 1. Public Route: Authentication Gate */}
          <Route path="/login" element={<Login />} />

          {/* 2. Protected Routes: Security Wrapper */}
          <Route element={<ProtectedRoute />}>

            {/* 3. Layout Wrapper: Sidebar/Header/Footer Persistence */}
            <Route element={<Layout />}>

              {/* THE ROOT: This renders AuditHistory at "/berean-sync/" */}
              <Route index element={<AuditHistory />} />

              {/* THE ACTIONS: Other pages accessible within the layout */}
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