import { supabase } from '@lib/supabaseClient';
import { useEffect, useMemo, useState } from 'react';
import AuditModal from './AuditModal';

export default function AuditArchive({ limit = null }) {
    const [audits, setAudits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAudit, setSelectedAudit] = useState(null);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [verdictFilter, setVerdictFilter] = useState('All');

    // NEW: Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        async function fetchAudits() {
            let query = supabase
                .from('audit_log')
                .select('*')
                .order('created_at', { ascending: false });

            if (limit) query = query.limit(limit);

            const { data, error } = await query;
            if (!error) setAudits(data);
            setLoading(false);
        }
        fetchAudits();
    }, [limit]);

    // NEW: Reset to page 1 anytime the user types a search or clicks a filter
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, verdictFilter]);

    // 1. Filter the data first
    const filteredAudits = useMemo(() => {
        return audits.filter((audit) => {
            const matchesVerdict = verdictFilter === 'All' || audit.verdict === verdictFilter;
            const matchesSearch = audit.entity_name.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesVerdict && matchesSearch;
        });
    }, [audits, searchTerm, verdictFilter]);

    // 2. NEW: Slice the filtered data into pages
    const totalPages = Math.ceil(filteredAudits.length / itemsPerPage);
    const paginatedAudits = filteredAudits.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    if (loading) return <div className="p-8 text-slate-400 animate-pulse text-sm font-mono">Syncing Archive...</div>;

    return (
        <>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Audit History</h2>
                        <span className="text-xs font-mono text-slate-400">Total Records: {filteredAudits.length}</span>
                    </div>

                    {/* Filter Controls */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                        <div className="relative w-full sm:w-64">
                            <input
                                type="text"
                                placeholder="Search entity..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            />
                            <svg className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 w-full sm:w-auto">
                            {['All', 'Red', 'Amber', 'Green'].map((v) => (
                                <button
                                    key={v}
                                    onClick={() => setVerdictFilter(v)}
                                    className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${verdictFilter === v
                                            ? 'bg-white text-slate-800 shadow-sm'
                                            : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                >
                                    {v}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[300px] md:min-w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Entity</th>
                                    <th className="hidden sm:table-cell p-4 text-xs font-semibold text-slate-500 uppercase">Type</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Verdict</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Score</th>
                                    <th className="hidden md:table-cell p-4 text-xs font-semibold text-slate-500 uppercase">Date</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {/* IMPORTANT: Iterate over paginatedAudits instead of filteredAudits */}
                                {paginatedAudits.length > 0 ? (
                                    paginatedAudits.map((audit) => (
                                        <tr
                                            key={audit.id}
                                            onClick={() => setSelectedAudit(audit)}
                                            className="hover:bg-slate-50 transition cursor-pointer group"
                                        >
                                            <td className="p-4 font-medium text-slate-700 max-w-[120px] sm:max-w-none truncate">
                                                {audit.entity_name}
                                            </td>
                                            <td className="hidden sm:table-cell p-4 text-sm text-slate-500 capitalize">
                                                {audit.entity_type}
                                            </td>
                                            <td className="p-4 text-sm">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${audit.verdict === 'Red' ? 'bg-red-100 text-red-700' :
                                                        audit.verdict === 'Amber' ? 'bg-amber-100 text-amber-700' :
                                                            'bg-green-100 text-green-700'
                                                    }`}>
                                                    {audit.verdict || 'Pending'}
                                                </span>
                                            </td>
                                            <td className="hidden md:table-cell p-4 text-sm text-slate-500 font-mono">
                                                {audit.confidence_score ? `${audit.confidence_score}%` : '--'}
                                            </td>
                                            <td className="hidden md:table-cell p-4 text-sm text-slate-400">
                                                {new Date(audit.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 text-right">
                                                <span className="text-sm text-blue-500 group-hover:text-blue-700 transition-colors">
                                                    <span className="hidden sm:inline">View full record</span> &rarr;
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-slate-500 text-sm italic">
                                            No audits match your current filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* NEW: Pagination Footer */}
                    {totalPages > 1 && (
                        <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 flex items-center justify-between sm:px-6">
                            <div className="flex flex-1 justify-between sm:hidden">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Showing <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredAudits.length)}</span> of <span className="font-medium">{filteredAudits.length}</span> results
                                    </p>
                                </div>
                                <div>
                                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                                        >
                                            <span className="sr-only">Previous</span>
                                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                                            </svg>
                                        </button>

                                        {/* Page Numbers */}
                                        {[...Array(totalPages)].map((_, i) => (
                                            <button
                                                key={i + 1}
                                                onClick={() => setCurrentPage(i + 1)}
                                                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus:outline-offset-0 ${currentPage === i + 1
                                                        ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                                                        : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}

                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                                        >
                                            <span className="sr-only">Next</span>
                                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <AuditModal
                isOpen={!!selectedAudit}
                audit={selectedAudit}
                onClose={() => setSelectedAudit(null)}
                onAuditDeleted={(deletedId) => {
                    setAudits((currentAudits) => currentAudits.filter(a => a.id !== deletedId));
                    // Optional: If you delete the last item on page 2, shift them back to page 1
                    if (paginatedAudits.length === 1 && currentPage > 1) {
                        setCurrentPage(prev => prev - 1);
                    }
                }}
            />
        </>
    );
}