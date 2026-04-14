import { useAuth } from '@contexts/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = () => {
    const { user } = useAuth();

    // If no user is logged in, redirect to the stealth login page
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Otherwise, render the child routes (the dashboard, analysis tools, etc.)
    return <Outlet />;
};