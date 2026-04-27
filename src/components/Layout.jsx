import { supabase } from '@lib/supabaseClient';
import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

export default function Layout() {
    const navigate = useNavigate();
    // NEW: State to track if the mobile menu is open
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    // NEW: Helper to close the mobile menu when a link is clicked
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">

            {/* NEW: Mobile Overlay Backdrop */}
            {/* Shows a darkened background when the drawer is open on phones */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
                    onClick={closeMobileMenu}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed md:static inset-y-0 left-0 z-50
                w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800
                transform transition-transform duration-300 ease-in-out
                /* Mobile: slide off-screen by default, slide in when open */
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                /* Desktop: always force it on-screen */
                md:translate-x-0
            `}>
                <div className="p-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold text-white tracking-tight">Berean Sync</h1>
                        <p className="text-xs text-slate-500 uppercase mt-1 tracking-widest">Discernment Portal</p>
                    </div>
                    {/* Mobile Close 'X' Button inside sidebar */}
                    <button
                        className="md:hidden text-slate-400 hover:text-white"
                        onClick={closeMobileMenu}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    <Link to="/" onClick={closeMobileMenu} className="block py-2.5 px-4 rounded transition hover:bg-slate-800 hover:text-white">Dashboard</Link>
                    <Link to="/new-audit" onClick={closeMobileMenu} className="block py-2.5 px-4 rounded transition hover:bg-slate-800 hover:text-white">New Audit</Link>
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
            {/* Added min-w-0 to prevent flexbox from forcing horizontal scroll on mobile */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

                {/* Header */}
                {/* Adjusted padding: px-4 on mobile, px-8 on desktop */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8">

                    <div className="flex items-center gap-3">
                        {/* NEW: Hamburger Menu Button (Hidden on Desktop) */}
                        <button
                            className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-md transition"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>

                        {/* Optional: Show app name in header on mobile only since sidebar is hidden */}
                        <span className="md:hidden font-bold text-slate-800">Berean Sync</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link to="/new-audit" className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700 transition shadow-sm">
                            <span className="hidden sm:inline">+ New Audit</span>
                            <span className="sm:hidden">+ New</span>
                        </Link>
                    </div>
                </header>

                {/* Page Content */}
                {/* Adjusted padding: p-4 on mobile, p-8 on desktop */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-8">
                    <Outlet />
                </main>

                {/* Footer */}
                {/* Adjusted text size for very small screens */}
                <footer className="h-10 bg-white border-t border-slate-200 flex items-center justify-center px-4 text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-widest text-center">
                    Berean Sync © 2026 // Authorized Personnel Only
                </footer>
            </div>
        </div>
    );
}