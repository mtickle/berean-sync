import { supabase } from '@lib/supabaseClient';
import { Link, Outlet, useNavigate } from 'react-router-dom';

export default function Layout() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800">
                <div className="p-6">
                    <h1 className="text-xl font-bold text-white tracking-tight">Berean Sync</h1>
                    <p className="text-xs text-slate-500 uppercase mt-1 tracking-widest">Discernment Portal</p>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    <Link to="/" className="block py-2.5 px-4 rounded transition hover:bg-slate-800 hover:text-white">Dashboard</Link>
                    <Link to="/new-audit" className="block py-2.5 px-4 rounded transition hover:bg-slate-800 hover:text-white">New Audit</Link>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="w-full text-left py-2 px-4 text-sm text-slate-400 hover:text-red-400 transition"
                    >
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
                    <div className="text-sm text-slate-500">
                        System Status: <span className="text-green-500 font-medium">Encrypted</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/new-audit" className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700 transition">
                            + Quick Audit
                        </Link>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-8">
                    <Outlet />
                </main>

                {/* Footer */}
                <footer className="h-10 bg-white border-t border-slate-200 flex items-center justify-center px-8 text-[10px] text-slate-400 uppercase tracking-widest">
                    Berean Sync © 2026 // Authorized Personnel Only
                </footer>
            </div>
        </div>
    );
}