import { supabase } from "@lib/supabaseClient";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NewAudit() {
    const [type, setType] = useState('artist');

    // Main entity name (used for Artist Name, Label Name, or Song Title depending on tab)
    const [name, setName] = useState('');

    // NEW: Optional secondary input for when they select "Song" or "Lyrics"
    const [secondaryArtist, setSecondaryArtist] = useState('');

    const [lyrics, setLyrics] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsAnalyzing(true);

        try {
            // 1. Intelligently construct the target string based on the active tab and inputs
            let targetEntity = "";
            let displayName = name; // Used for saving to the database

            if (type === 'lyrics') {
                targetEntity = secondaryArtist ? `Lyrics by ${secondaryArtist}: "${lyrics}"` : `Lyrics: "${lyrics}"`;
                displayName = secondaryArtist ? `Lyrics snippet (${secondaryArtist})` : `Lyrics Snippet...`;

            } else if (type === 'song') {
                // NEW: If it's a song, bundle the title, optional artist, and optional lyrics
                targetEntity = `Song Title: ${name}.`;
                if (secondaryArtist) {
                    targetEntity += ` Artist: ${secondaryArtist}.`;
                    displayName = `${name} by ${secondaryArtist}`; // Makes the archive table look cleaner!
                }
                if (lyrics) {
                    targetEntity += ` Lyrics: "${lyrics}"`;
                }
            } else {
                // For Artist or Label
                targetEntity = name;
            }

            // 2. Invoke the Brain
            const { data, error } = await supabase.functions.invoke('naras-audit', {
                body: { entityName: targetEntity, entityType: type }
            });

            if (error) throw error;

            // 3. Persist the results
            const { error: dbError } = await supabase
                .from('audit_log')
                .insert([{
                    entity_name: displayName,
                    entity_type: type,
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
        <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-white sm:rounded-xl shadow-sm sm:border border-slate-200 sm:mt-10">
            <h2 className="text-xl font-bold text-slate-800 mb-6">New Berean Sync Audit</h2>

            {isAnalyzing && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <h3 className="text-lg font-bold text-slate-800">Initiating Audit</h3>
                        <p className="text-sm text-slate-500 animate-pulse mt-2">Please wait...</p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Entity Type</label>
                    <div className="flex flex-wrap gap-2">
                        {['artist', 'label', 'song', 'lyrics'].map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => {
                                    setType(t);
                                    // Optional: clear out inputs when switching tabs to prevent confusion
                                    setName('');
                                    setSecondaryArtist('');
                                    setLyrics('');
                                }}
                                className={`flex-grow sm:flex-grow-0 px-4 py-2 rounded-md text-sm capitalize transition ${type === t
                                    ? 'bg-slate-800 text-white shadow-sm'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    {/* PRIMARY INPUT: Label changes based on type */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            {type === 'song' ? 'Song Title' :
                                type === 'lyrics' ? 'Target Name (Optional)' :
                                    'Entity Name'}
                        </label>
                        <input
                            type="text"
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder={
                                type === 'song' ? "e.g. Even in Exile" :
                                    type === 'lyrics' ? "A name for this text block..." :
                                        "e.g. Pat Barrett"
                            }
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required={type !== 'lyrics'}
                        />
                    </div>

                    {/* SECONDARY INPUT: Only shows for Songs or Lyrics */}
                    {(type === 'song' || type === 'lyrics') && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                {type === 'song' ? 'Artist Name (Optional)' : 'Artist Name (Optional)'}
                            </label>
                            <input
                                type="text"
                                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50"
                                placeholder="e.g. David Crowder"
                                value={secondaryArtist}
                                onChange={(e) => setSecondaryArtist(e.target.value)}
                            />
                        </div>
                    )}
                </div>

                {/* LYRICS TEXTAREA: Shows for Songs or Lyrics */}
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
                            required={type === 'lyrics'}
                        />
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
                    <button
                        disabled={isAnalyzing}
                        className="w-full sm:w-auto flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {isAnalyzing ? "Processing NARAS Profile..." : "Run New Audit"}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="w-full sm:w-auto bg-slate-100 text-slate-700 py-3 px-6 rounded-lg font-bold hover:bg-slate-200 transition disabled:opacity-50"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}