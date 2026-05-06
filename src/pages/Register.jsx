import { supabase } from "@lib/supabaseClient";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        // 1. Basic validation
        if (password !== confirmPassword) {
            setError("Passkeys do not match.");
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError("Passkey must be at least 6 characters.");
            setLoading(false);
            return;
        }

        // 2. Call Supabase Auth
        const { data, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            // Automatically redirects them back to the login page after confirming email
            options: {
                emailRedirectTo: `${window.location.origin}/login`,
            }
        });

        if (signUpError) {
            setError(signUpError.message);
        } else {
            // 3. Success State
            setMessage("Registration successful! Please check your email to confirm your identity before logging in.");
            // Optional: Auto-redirect to login after 5 seconds
            setTimeout(() => navigate('/login'), 5000);
        }

        setLoading(false);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl">
                <h2 className="mb-6 text-2xl font-bold text-slate-800">Request Access</h2>

                <blockquote className="mb-6 border-l-4 border-slate-300 bg-slate-50 pl-4 py-3 italic text-slate-600 text-sm rounded-r-lg">
                    "Do your best to present yourself to God as one approved, a worker who does not need to be ashamed and who correctly handles the word of truth."
                    <br />
                    <span className="font-semibold text-slate-500 mt-2 block">— 2 Timothy 2:15</span>
                </blockquote>

                {message ? (
                    <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 font-medium text-center text-sm">
                        {message}
                    </div>
                ) : (
                    <form onSubmit={handleRegister} className="space-y-4">

                        {error && (
                            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                        <input
                            type="email"
                            placeholder="Identity (Email)"
                            value={email}
                            className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <input
                            type="password"
                            placeholder="Passkey"
                            value={password}
                            className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <input
                            type="password"
                            placeholder="Confirm Passkey"
                            value={confirmPassword}
                            className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />

                        <button
                            disabled={loading}
                            className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50 mt-2"
                        >
                            {loading ? "Generating Credentials..." : "Initialize Access"}
                        </button>

                        <div className="text-center mt-4">
                            <Link to="/login" className="text-sm text-slate-500 hover:text-slate-800 transition">
                                Already have an uplink? Return to Login.
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}