import { supabase } from '@lib/supabaseClient';
import { useEffect, useState } from 'react';
import AuditModal from './AuditModal'; // Make sure this path matches your structure

export default function AuditArchive({ limit = null }) {
    const [audits, setAudits] = useState([]);
    const [loading, setLoading] = useState(true);

    // NEW: State to track which audit is currently open in the modal
    const [selectedAudit, setSelectedAudit] = useState(null);

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

    if (loading) return <div className="p-8 text-slate-400 animate-pulse text-sm font-mono">Syncing Archive...</div>;

    return (
        <>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-slate-800">Audit History</h2>
                    <span className="text-xs font-mono text-slate-400">Total Records: {audits.length}</span>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Entity</th>
                                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Type</th>
                                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Verdict</th>
                                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Date</th>
                                <th className="p-4 text-xs font-semibold text-slate-500 uppercase"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {audits.map((audit) => (
                                // NEW: Attached the onClick handler to the entire row
                                <tr
                                    key={audit.id}
                                    onClick={() => setSelectedAudit(audit)}
                                    className="hover:bg-slate-50 transition cursor-pointer group"
                                >
                                    <td className="p-4 font-medium text-slate-700">{audit.entity_name}</td>
                                    <td className="p-4 text-sm text-slate-500 capitalize">{audit.entity_type}</td>
                                    <td className="p-4 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${audit.verdict === 'Red' ? 'bg-red-100 text-red-700' :
                                                audit.verdict === 'Amber' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-green-100 text-green-700'
                                            }`}>
                                            {audit.verdict || 'Pending'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-slate-400">
                                        {new Date(audit.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-right">
                                        {/* Added group-hover to make the link pop when they hover the row */}
                                        <span className="text-sm text-blue-500 group-hover:text-blue-700 transition-colors">
                                            View full record &rarr;
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* NEW: The Modal Component */}
            <AuditModal
                isOpen={!!selectedAudit}
                audit={selectedAudit}
                onClose={() => setSelectedAudit(null)}
            />
        </>
    );
}