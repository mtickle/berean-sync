import narwhalMascot from "@assets/narwhal-detective.png";
import { supabase } from "@lib/supabaseClient";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    // 1. Brought the password state back
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        // 2. Swapped back to signInWithPassword
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            alert(error.message);
        } else {
            // 3. Navigate directly to the dashboard on success
            navigate("/");
        }
        setLoading(false);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl">
                <img
                    src={narwhalMascot}
                    alt="NARWHAL AUDIT IN PROGRESS"
                    // 1. Swapped object-contain for object-cover & set width to full
                    className="w-full max-w-lg h-auto object-cover relative z-10"
                />
                <h2 className="mb-1 text-2xl font-bold text-slate-800">Welcome to the NARWall</h2>
                <h2 className="mb-6 text-1xl font-bold text-slate-800">aka "The Berean Sync"</h2>

                {/* Kept the polished blockquote styling */}

                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Identity (Email)"
                        value={email}
                        className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    {/* 4. Brought the password input back */}
                    <input
                        type="password"
                        placeholder="Passkey"
                        value={password}
                        className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button
                        disabled={loading}
                        className="w-full rounded-lg bg-slate-800 p-3 font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50"
                    >
                        {loading ? "Authenticating..." : "Enter Environment"}
                    </button>

                    <div className="text-center mt-4 pt-4 border-t border-slate-100">
                        <Link to="/register" className="text-sm text-slate-500 hover:text-slate-800 transition">
                            No active credentials? Request access here.
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}