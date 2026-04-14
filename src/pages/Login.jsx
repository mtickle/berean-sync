import { supabase } from "@lib/supabaseClient";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            alert(error.message);
        } else {
            navigate("/"); // Send them to the dashboard
        }
        setLoading(false);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4">
            <form onSubmit={handleLogin} className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl">
                <h2 className="mb-6 text-2xl font-bold text-slate-800">The Berean Sync</h2>
                <p className="mb-6 text-sm text-slate-500">
                    "Now the Berean Jews were of more noble character than those in Thessalonica, for they received the message with great eagerness and examined the Scriptures every day to see if what Paul said was true.
                    - Acts 17:11
                </p>
                <div className="space-y-4">
                    <input
                        type="email"
                        placeholder="Identity (Email)"
                        className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Passkey"
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
                </div>
            </form>
        </div >
    );
}