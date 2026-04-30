import { Link } from 'react-router-dom';

export default function About() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">

            {/* Header Area */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">About Berean Sync</h1>
                <p className="text-slate-500 mt-2">Theological discernment powered by modern data pipelines.</p>
            </div>

            {/* Main Content Cards */}
            <div className="space-y-6">

                {/* The Name */}
                <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                        Ancient Discernment, Modern Tech
                    </h2>
                    <div className="space-y-4 text-slate-600 leading-relaxed text-sm sm:text-base">
                        <p>
                            The name <strong>"Berean"</strong> is drawn directly from Acts 17:11. The believers in Berea were commended for their noble character because they received the message with great eagerness and examined the Scriptures every day to see if what was being taught was actually true. They did not accept claims blindly.
                        </p>
                        <p>
                            <strong>"Sync"</strong> represents the technological bridge. The modern worship music industry generates an overwhelming amount of content, making manual theological vetting nearly impossible for the average church or listener. Berean Sync synchronizes that ancient, rigorous standard of biblical discernment with high-speed data pipelines, giving you the tools to examine modern worship movements at scale.
                        </p>
                    </div>
                </section>

                {/* Under the Hood */}
                <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        Under the Hood: The Engine
                    </h2>
                    <div className="text-slate-600 leading-relaxed text-sm sm:text-base space-y-4">
                        <p>
                            Berean Sync is not a static database. It is an active theological research assistant built on a modern React frontend and a secure cloud infrastructure.
                        </p>
                        <p>
                            When you submit a target for auditing, the application bypasses standard web limitations and routes your request securely through a dedicated Edge Function. This function hands the raw target data to a highly-tuned AI model running on the Gemini 2.5 architecture.
                        </p>
                        <p>
                            The AI operates under a strict <strong>"Theological Scalpel"</strong> prompt, forcing it to analyze the entity specifically for:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 mt-2">
                            <li><strong>Doctrinal Markers:</strong> It scans for deviations from orthodox theology, including Kenosis, Dominionism, declarative prayer models, and "Presence" theology.</li>
                            <li><strong>Network Associations:</strong> It maps out ties to the New Apostolic Reformation (NAR) and heavily affiliated organizations like Bethel, Hillsong, and Elevation.</li>
                            <li><strong>Source Verification:</strong> It cross-references its findings against established discernment researchers and apologists.</li>
                        </ul>

                        <p>
                            Here is a sample of the prompt being passed into the AI model. entityType and entityName are placeholders
                            for the actual values.
                        </p>
                        <blockquote className="border-l-4 border-slate-300 bg-slate-50 pl-4 py-3 italic text-slate-600 rounded-r-lg">
                            You are a theological research assistant for Berean Sync.<br />
                            Perform a high-precision audit on the musical "entityType": "entityName".<br />
                            Analyze for NAR Associations, Doctrinal Markers, and Sources.<br />
                        </blockquote>
                    </div>
                </section>

                {/* Field Manual */}
                <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                        Field Manual: Operations
                    </h2>
                    <ol className="list-decimal pl-5 space-y-3 text-slate-600 text-sm sm:text-base">
                        <li>
                            <strong>Initiate a New Audit:</strong> Click the <Link to="/new-audit" className="text-blue-600 hover:underline font-medium">+ New Audit</Link> button in the top navigation bar to open the targeting form.
                        </li>
                        <li>
                            <strong>Select the Entity Type:</strong> Tell the engine what it is looking at (Artist, Label, Song, or Lyrics).
                        </li>
                        <li>
                            <strong>Set the Target:</strong> Enter the name of the entity. If you want a hyper-specific doctrinal review, select the "Lyrics" tab and paste the exact song lyrics into the text area.
                        </li>
                        <li>
                            <strong>Execute the Scan:</strong> Hit "Run New Audit." The system will display an analyzing screen while the Edge Function processes the request.
                        </li>
                        <li>
                            <strong>Review the Archive:</strong> Once complete, the table displays your entire history, filterable by Verdict or searchable by Entity Name.
                        </li>
                        <li>
                            <strong>Access the Deep Dive:</strong> Click anywhere on a specific row in the Archive to open the Audit Modal for an itemized breakdown and source list.
                        </li>
                    </ol>
                </section>

            </div>
        </div>
    );
}