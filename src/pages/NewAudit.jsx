import { supabase } from "@lib/supabaseClient";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NewAudit() {
    // 1. MUST BE EXPLICITLY NAMED songTitle AND artistName
    const [songTitle, setSongTitle] = useState('');
    const [artistName, setArtistName] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsAnalyzing(true);

        try {
            const displayName = `${songTitle} by ${artistName}`;

            // 2. THE BODY KEYS MUST EXACTLY BE songTitle AND artistName
            const { data, error } = await supabase.functions.invoke('naras-audit', {
                body: {
                    songTitle: songTitle.trim(),
                    artistName: artistName.trim()
                }
            });

            if (error) throw error;

            // 3. DATABASE SCHEMA CHECK: Inserting into Postgres
            const { error: dbError } = await supabase
                .from('audit_log')
                .insert([{
                    entity_name: displayName,
                    entity_type: 'song',
                    verdict: data.verdict,
                    confidence_score: data.confidence_score,
                    association_notes: data.association_notes,
                    doctrinal_notes: data.doctrinal_notes,
                    sources: data.sources,
                    summary: data.summary
                }]);

            if (dbError) throw dbError;

            navigate('/');
        } catch (err) {
            console.error("Audit Failure:", err);
            alert("Failed to run audit. Check console for details.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-slate-200 mt-10">
            <h2 className="text-xl font-bold text-slate-800 mb-6">New Berean Sync Audit</h2>

            {isAnalyzing && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <h3 className="text-lg font-bold text-slate-800">Initiating Berean Sync Audit</h3>
                        <p className="text-sm text-slate-500 animate-pulse mt-2">Consulting theological markers...</p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    {/* 4. VALUE AND SETTER MATCH FOR TITLE */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Song Title</label>
                        <input
                            type="text"
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. Reckless Love"
                            value={songTitle}
                            onChange={(e) => setSongTitle(e.target.value)}
                            required
                        />
                    </div>

                    {/* 5. VALUE AND SETTER MATCH FOR ARTIST */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Artist / Group Name</label>
                        <input
                            type="text"
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. Cory Asbury"
                            value={artistName}
                            onChange={(e) => setArtistName(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-100">
                    <button
                        disabled={isAnalyzing}
                        className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        Run New Audit
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="bg-slate-100 text-slate-700 py-3 px-6 rounded-lg font-bold hover:bg-slate-200 transition"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}