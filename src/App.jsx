import { ProtectedRoute } from '@components/ProtectedRoute';
import { AuthProvider } from '@contexts/AuthContext';
import Login from '@pages/Login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <AuthProvider>
      {/* Add the basename prop here */}
      <BrowserRouter basename="/berean-sync">
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;