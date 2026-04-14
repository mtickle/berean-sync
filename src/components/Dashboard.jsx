
import { supabase } from "@lib/supabaseClient";

const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error("Logout failed:", error.message);
    } else {
        // Instead of window.location.reload(), use the router to navigate
        // Because you set <BrowserRouter basename="/berean-sync">, 
        // navigating to "/login" will automatically go to "/berean-sync/login"
        navigate("/login");
    }
};

const Dashboard = () => (
    <div className="p-8">
        <h1 className="text-3xl font-bold">Berean Sync: Dashboard</h1>
        <p>Welcome to the secure environment. Ready for data ingestion.</p>
        <button onClick={handleLogout} className="mt-4 rounded-lg bg-red-500 p-2 text-white">
            Logout
        </button>
    </div>
);

export default Dashboard;
