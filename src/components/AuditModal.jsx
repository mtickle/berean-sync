import { supabase } from '@lib/supabaseClient';
import { useState } from 'react';

export default function AuditModal({ isOpen, onClose, audit, onAuditDeleted }) {
    const [isDeleting, setIsDeleting] = useState(false);

    if (!isOpen || !audit) return null;

    const verdictColors = {
        Red: 'bg-red-100 text-red-800 border-red-200',
        Amber: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        Green: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    };

    const handleDelete = async () => {
        // Optional: Add a simple confirmation dialog
        if (!window.confirm("Are you sure you want to delete this audit record?")) return;

        setIsDeleting(true);
        try {
            const { error } = await supabase
                .from('audit_log')
                .delete()
                .eq('id', audit.id);

            if (error) throw error;

            // Tell the parent component to remove it from the list and close the modal
            onAuditDeleted(audit.id);
            onClose();
        } catch (err) {
            console.error("Error deleting audit:", err);
            alert("Failed to delete record.");
        } finally {
            setIsDeleting(false);
        }
    };

    // Helper to safely render notes whether the AI returned a string or an object
    const renderNote = (note) => {
        if (typeof note === 'string') return note;

        // If the AI got creative and returned the {point, explanation} object
        if (typeof note === 'object' && note !== null) {
            if (note.point && note.explanation) {
                return (
                    <span>
                        <strong className="text-gray-900">{note.point}:</strong> {note.explanation}
                    </span>
                );
            }
            // Fallback for any other weird object structure it might hallucinate
            return JSON.stringify(note);
        }
        return "Invalid note format";
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-white rounded-xl shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* --- HEADER --- */}
                {/* Fixed at the top, contains the Close Button and Verdict Pill */}
                <div className="flex items-start justify-between p-4 sm:p-6 border-b border-gray-200 bg-gray-50 shrink-0">
                    <div className="pr-4">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                            {audit.entity_name}
                        </h2>
                        <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                            <span className="capitalize font-medium text-gray-700">{audit.entity_type}</span>
                            <span>&bull;</span>
                            <span>{new Date(audit.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>

                    {/* Top Right Controls: Pill + Close Button */}
                    <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${verdictColors[audit.verdict] || 'bg-gray-100 text-gray-800'}`}>
                                {audit.verdict}
                            </span>
                            <button
                                onClick={onClose}
                                className="p-1.5 text-gray-400 hover:text-gray-700 bg-white hover:bg-gray-200 rounded-full border border-gray-200 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <span className="text-xs text-gray-400 font-mono pr-2">
                            Conf: {audit.confidence_score}%
                        </span>
                    </div>
                </div>

                {/* --- BODY --- */}
                {/* Scrolls independently of the header/footer */}
                <div className="p-4 sm:p-6 overflow-y-auto space-y-8">
                    <section className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Executive Summary</h3>
                        <p className="text-gray-800 leading-relaxed">{audit.summary}</p>
                    </section>

                    <div className="grid md:grid-cols-2 gap-6">
                        <section className="space-y-3">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b pb-2">NAR Associations</h3>
                            {audit.association_notes?.details?.length > 0 ? (
                                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                                    {audit.association_notes.details.map((note, idx) => (
                                        <li key={idx}>{renderNote(note)}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-500 italic">No significant associations found.</p>
                            )}
                        </section>

                        <section className="space-y-3">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b pb-2">Doctrinal Markers</h3>
                            {audit.doctrinal_notes?.details?.length > 0 ? (
                                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                                    {audit.doctrinal_notes.details.map((note, idx) => (
                                        <li key={idx}>{renderNote(note)}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-500 italic">No concerning doctrinal markers identified.</p>
                            )}
                        </section>
                    </div>

                    <section className="pt-6 border-t">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Reference Sources</h3>
                        {audit.sources?.length > 0 ? (
                            <ul className="space-y-2">
                                {audit.sources.map((source, idx) => (
                                    <li key={idx} className="text-sm break-all">
                                        {source.startsWith('http') ? (
                                            <a href={source} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                {source}
                                            </a>
                                        ) : (
                                            <span className="text-gray-600">{source}</span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500 italic">No external sources cited.</p>
                        )}
                    </section>
                </div>

                {/* --- FOOTER --- */}
                {/* Fixed at the bottom for the delete button */}
                <div className="p-4 bg-gray-50 border-t border-gray-200 shrink-0 flex justify-end">
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-white bg-red-50 hover:bg-red-600 rounded-md transition-colors disabled:opacity-50"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        {isDeleting ? "Deleting..." : "Delete Record"}
                    </button>
                </div>

            </div>
        </div>
    );
}