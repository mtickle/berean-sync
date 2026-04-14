// src/components/AuditModal.jsx (or wherever you keep components)

export default function AuditModal({ isOpen, onClose, audit }) {
    if (!isOpen || !audit) return null;

    // Helper for Verdict colors
    const verdictColors = {
        Red: 'bg-red-100 text-red-800 border-red-200',
        Amber: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        Green: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    };

    return (
        // The fixed backdrop overlay
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm"
            onClick={onClose} // Close if they click the dark background
        >
            {/* The Modal Container */}
            <div
                className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl p-6 space-y-8"
                onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
            >

                {/* Close Button (Top Right) */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* --- The Meat of your Detail View --- */}
                <div className="flex items-start justify-between border-b pb-6 pr-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">{audit.entity_name}</h2>
                        <p className="text-gray-500 capitalize mt-1">Type: {audit.entity_type}</p>
                        <p className="text-xs text-gray-400 mt-1">
                            Audited: {new Date(audit.created_at).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider border ${verdictColors[audit.verdict] || 'bg-gray-100 text-gray-800'}`}>
                            {audit.verdict}
                        </span>
                        <span className="text-xs text-gray-400 mt-2 font-mono">
                            Confidence: {audit.confidence_score}%
                        </span>
                    </div>
                </div>

                <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Executive Summary</h3>
                    <p className="text-gray-700 leading-relaxed">{audit.summary}</p>
                </section>

                <div className="grid md:grid-cols-2 gap-6">
                    <section className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">NAR Associations</h3>
                        {audit.association_notes?.details?.length > 0 ? (
                            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                                {audit.association_notes.details.map((note, idx) => (
                                    <li key={idx}>{note}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500 italic">No significant associations found.</p>
                        )}
                    </section>

                    <section className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Doctrinal Markers</h3>
                        {audit.doctrinal_notes?.details?.length > 0 ? (
                            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                                {audit.doctrinal_notes.details.map((note, idx) => (
                                    <li key={idx}>{note}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500 italic">No concerning doctrinal markers identified.</p>
                        )}
                    </section>
                </div>

                <section className="pt-6 border-t">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Reference Sources</h3>
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
        </div>
    );
}