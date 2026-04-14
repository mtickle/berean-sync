import { supabase } from "@lib/supabaseClient";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NewAudit() {
    // FIX 1: Set the default type to 'artist' instead of 'song'
    const [type, setType] = useState('artist');
    const [name, setName] = useState('');
    const [lyrics, setLyrics] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsAnalyzing(true);

        try {
            // Determine the target entity string based on the active tab
            let targetEntity = "";
            if (type === 'lyrics') {
                targetEntity = name ? `Lyrics by ${name}: "${lyrics}"` : `Lyrics: "${lyrics}"`;
            } else if (type === 'song' && lyrics) {
                targetEntity = `Song Title: ${name}. Lyrics: "${lyrics}"`;
            } else {
                targetEntity = name;
            }

            // 1. Invoke the "Brain"
            const { data, error } = await supabase.functions.invoke('naras-audit', {
                // Pass the intelligently constructed targetEntity instead of just 'name'
                body: { entityName: targetEntity, entityType: type }
            });

            if (error) throw error;

            // 2. Persist the results to your Audit History
            const { error: dbError } = await supabase
                .from('audit_log')
                .insert([{
                    // If they just submitted lyrics, use a snippet as the name for the table view
                    entity_name: type === 'lyrics' && !name ? `Lyrics Snippet: ${lyrics.substring(0, 30)}...` : name,
                    entity_type: type,
                    verdict: data.verdict,
                    confidence_score: data.confidence_score,
                    association_notes: data.association_notes,
                    doctrinal_notes: data.doctrinal_notes,
                    sources: data.sources,
                    summary: data.summary
                }]);

            if (dbError) throw dbError;

            // 3. Return to the Archive to see the new card
            navigate('/');
        } catch (err) {
            console.error("Audit Failure:", err);
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
                        <p className="text-sm text-slate-500 animate-pulse">Consulting theological markers...</p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Entity Type</label>
                    <div className="flex gap-2">
                        {['artist', 'label', 'song', 'lyrics'].map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => setType(t)}
                                className={`px-4 py-2 rounded-md text-sm capitalize transition ${type === t ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    {/* Dynamic Label Based on Type */}
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        {type === 'lyrics' ? 'Artist Name (Optional)' : 'Entity Name (Artist or Song Title)'}
                    </label>
                    <input
                        type="text"
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder={type === 'lyrics' ? "e.g. Bethel Music (Leave blank if unknown)" : "e.g. Pat Barrett or Build My Life"}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        // FIX 2: Only required if the type is NOT 'lyrics'
                        required={type !== 'lyrics'}
                    />
                </div>

                {(type === 'song' || type === 'lyrics') && (
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            {type === 'lyrics' ? 'Lyrics (Required)' : 'Lyrics (Optional for Deep Audit)'}
                        </label>
                        <textarea
                            rows="5"
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Paste song lyrics here..."
                            value={lyrics}
                            onChange={(e) => setLyrics(e.target.value)}
                            // Make lyrics required if the user specifically chose the lyrics tab
                            required={type === 'lyrics'}
                        />
                    </div>
                )}

                <button
                    disabled={isAnalyzing}
                    className="w-50 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50"
                >
                    {isAnalyzing ? "Processing NARAS Profile..." : "Run New Audit"}
                </button>
                <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="w-50 bg-red-600 text-white ml-2 py-3 px-4 rounded-lg font-bold hover:bg-red-700 transition disabled:opacity-50"
                >
                    Cancel
                </button>
            </form>
        </div>
    );
}