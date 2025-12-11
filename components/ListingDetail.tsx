import React, { useState, useEffect, useRef } from 'react';
import { Property, ChatMessage } from '../types';
import { generatePropertyInsight, generateInvestmentReport } from '../services/geminiService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DocumentViewer from './DocumentViewer';

interface ListingDetailProps {
    property: Property;
    onBack: () => void;
    isSaved: boolean;
    onToggleSave: () => void;
    onContact: (type: string) => void;
}

const ListingDetail: React.FC<ListingDetailProps> = ({ property, onBack, isSaved, onToggleSave, onContact }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'legal'>('overview');
    const [chatInput, setChatInput] = useState('');
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [isThinking, setIsThinking] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    
    // New States
    const [report, setReport] = useState<string | null>(null);
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);
    const [viewingDocument, setViewingDocument] = useState<string | null>(null);

    // Initial Greeting from AI
    useEffect(() => {
        setChatHistory([
            {
                id: 'welcome',
                role: 'model',
                text: `Namaste! I am the Homeward Guide. I have analyzed the documents for ${property.title}. Feel free to ask me about the zoning, title clarity, or nearby developments.`,
                timestamp: new Date()
            }
        ]);
    }, [property]);

    useEffect(() => {
        if(scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chatHistory]);

    const handleSendMessage = async () => {
        if (!chatInput.trim()) return;

        const newUserMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            text: chatInput,
            timestamp: new Date()
        };

        setChatHistory(prev => [...prev, newUserMsg]);
        setChatInput('');
        setIsThinking(true);

        const historyForAI = chatHistory.map(m => ({ role: m.role, text: m.text }));
        const responseText = await generatePropertyInsight(property, newUserMsg.text, historyForAI);

        const newAiMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'model',
            text: responseText,
            timestamp: new Date()
        };

        setChatHistory(prev => [...prev, newAiMsg]);
        setIsThinking(false);
    };

    const handleGenerateReport = async () => {
        setIsGeneratingReport(true);
        const reportText = await generateInvestmentReport(property);
        setReport(reportText);
        setIsGeneratingReport(false);
    };

    return (
        <div className="bg-slate-50 min-h-screen pb-12">
            <DocumentViewer 
                isOpen={!!viewingDocument}
                documentName={viewingDocument || ''}
                onClose={() => setViewingDocument(null)}
            />

            {/* Header/Nav for detail page */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <button onClick={onBack} className="flex items-center text-slate-600 hover:text-brand-600 transition-colors">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Back to Search
                    </button>
                    <div className="flex items-center space-x-4">
                        <button 
                            onClick={onToggleSave}
                            className={`p-2 rounded-full transition-colors ${isSaved ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-400 hover:text-red-400'}`}
                            title={isSaved ? "Remove from Saved" : "Save Property"}
                        >
                            <svg className="w-6 h-6" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full border border-green-200 flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                            {property.verificationLevel} Verified
                        </span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Main Content (Left 2/3) */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Hero Image */}
                        <div className="relative rounded-2xl overflow-hidden shadow-lg h-96 group">
                            <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                             
                             {/* Status Badge */}
                            <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-lg text-sm font-bold text-white shadow-md z-10 ${
                                property.status === 'Available' ? 'bg-green-600' :
                                property.status === 'Under Offer' ? 'bg-amber-500' : 'bg-red-500'
                            }`}>
                                {property.status}
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                                <h1 className="text-3xl font-serif text-white font-bold">{property.title}</h1>
                                <p className="text-white/90 mt-1 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    {property.location.district}, {property.location.city}, {property.location.state}
                                </p>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="flex border-b border-slate-200">
                                {['overview', 'documents', 'legal'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab as any)}
                                        className={`flex-1 py-4 text-sm font-medium text-center uppercase tracking-wider transition-colors
                                            ${activeTab === tab 
                                                ? 'bg-brand-50 text-brand-700 border-b-2 border-brand-500' 
                                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            <div className="p-6">
                                {activeTab === 'overview' && (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="p-4 bg-slate-50 rounded-lg">
                                                <div className="text-xs text-slate-500 uppercase">Plot Area</div>
                                                <div className="text-lg font-bold text-slate-900">{property.specs.area} <span className="text-sm font-normal">Sq.Ft</span></div>
                                            </div>
                                            <div className="p-4 bg-slate-50 rounded-lg">
                                                <div className="text-xs text-slate-500 uppercase">Dimensions</div>
                                                <div className="text-lg font-bold text-slate-900">{property.specs.dimensions}</div>
                                            </div>
                                            <div className="p-4 bg-slate-50 rounded-lg">
                                                <div className="text-xs text-slate-500 uppercase">Facing</div>
                                                <div className="text-lg font-bold text-slate-900">{property.specs.facing}</div>
                                            </div>
                                            <div className="p-4 bg-slate-50 rounded-lg">
                                                <div className="text-xs text-slate-500 uppercase">Zoning</div>
                                                <div className="text-lg font-bold text-slate-900">{property.specs.zoning}</div>
                                            </div>
                                        </div>

                                        <div className="mt-8">
                                            <h3 className="text-lg font-bold text-slate-900 mb-4">Price Appreciation Trends (₹ / Sq.Ft)</h3>
                                            <div className="h-64 w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <LineChart data={property.priceHistory}>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                                        <XAxis dataKey="year" stroke="#94a3b8" />
                                                        <YAxis stroke="#94a3b8" />
                                                        <Tooltip 
                                                            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                            formatter={(value: number) => [`₹${value}`, 'Price/SqFt']}
                                                        />
                                                        <Line type="monotone" dataKey="price" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4, fill: '#0ea5e9', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                        
                                        {/* AI Investment Report Section */}
                                        <div className="mt-8 border-t border-slate-200 pt-8">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-xl font-serif font-bold text-brand-900">AI Investment Analysis</h3>
                                                {!report && (
                                                    <button 
                                                        onClick={handleGenerateReport}
                                                        disabled={isGeneratingReport}
                                                        className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors flex items-center shadow-sm disabled:opacity-50"
                                                    >
                                                        {isGeneratingReport ? (
                                                            <>
                                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                                Analyzing Market Data...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                                                                Generate Premium Report
                                                            </>
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                            
                                            {report && (
                                                <div className="bg-white border border-brand-200 rounded-xl p-6 shadow-sm">
                                                    <div className="prose prose-sm prose-slate max-w-none whitespace-pre-wrap font-sans">
                                                        {report}
                                                    </div>
                                                    <div className="mt-4 text-xs text-slate-400 italic">
                                                        *Generated by Homeward AI based on available market data. Not financial advice.
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="prose text-slate-600 max-w-none pt-4">
                                            <h3 className="text-lg font-bold text-slate-900">About this Property</h3>
                                            <p>{property.description}</p>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'documents' && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold text-slate-900 mb-2">Digital Document Vault</h3>
                                        <p className="text-sm text-slate-500 mb-6">Homeward has physically verified the existence of originals for all checked items.</p>
                                        
                                        <div className="grid gap-3">
                                            {property.documents.map((doc, idx) => (
                                                <div key={idx} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group">
                                                    <div className="flex items-center">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${doc.verified ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                                                            {doc.verified ? (
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                            ) : (
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-slate-900 group-hover:text-brand-600">{doc.name}</div>
                                                            <div className="text-xs text-slate-500">
                                                                {doc.verified ? `Verified on ${doc.dateVerified}` : 'Pending Verification'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {doc.verified ? (
                                                        <button 
                                                            onClick={() => setViewingDocument(doc.name)}
                                                            className="text-xs font-semibold text-brand-600 border border-brand-200 px-3 py-1 rounded hover:bg-brand-50"
                                                        >
                                                            View Copy
                                                        </button>
                                                    ) : (
                                                        <span className="text-xs text-amber-600 font-medium">Request</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                {activeTab === 'legal' && (
                                    <div className="text-center py-12">
                                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-50 text-brand-600 mb-4">
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900">Partner Legal Opinion</h3>
                                        <p className="text-slate-500 max-w-md mx-auto mt-2">
                                            This property is represented by <strong>{property.partner.name}</strong>. 
                                            Unlock the full 30-year title search opinion to proceed with confidence.
                                        </p>
                                        <button 
                                            onClick={() => onContact('Legal Report')}
                                            className="mt-6 bg-brand-900 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-brand-800 transition-colors font-medium"
                                        >
                                            Unlock Legal Report ($350)
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar (Right 1/3) */}
                    <div className="space-y-6">
                        
                        {/* Price Card */}
                        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 sticky top-24">
                            <div className="mb-6">
                                <p className="text-sm text-slate-500 font-medium">Total Price</p>
                                <div className="flex items-baseline space-x-2">
                                    <h2 className="text-3xl font-bold text-brand-900">₹{(property.price.inr / 100000).toFixed(1)} Lakhs</h2>
                                    <span className="text-slate-400">|</span>
                                    <span className="text-xl text-slate-600">${property.price.usd.toLocaleString()}</span>
                                </div>
                                <p className="text-xs text-slate-400 mt-1">Excluding registration & stamp duty</p>
                            </div>

                            <button 
                                onClick={() => onContact('Site Visit Request')}
                                className="w-full bg-brand-600 text-white py-3 rounded-lg font-semibold hover:bg-brand-700 transition-colors shadow-md mb-3 flex justify-center items-center"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                Schedule Site Visit ($50)
                            </button>
                            <button 
                                onClick={() => onContact('Verified Partner Inquiry')}
                                className="w-full bg-white text-brand-600 border border-brand-200 py-3 rounded-lg font-semibold hover:bg-brand-50 transition-colors"
                            >
                                Contact Verified Partner
                            </button>
                        </div>

                        {/* AI Assistant Chat */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[500px]">
                            <div className="p-4 border-b border-slate-100 bg-brand-900 text-white rounded-t-xl flex items-center">
                                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center mr-3">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">Homeward Guide AI</h3>
                                    <p className="text-xs text-brand-200">Ask about documents or zoning</p>
                                </div>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50" ref={scrollRef}>
                                {chatHistory.map((msg) => (
                                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[85%] rounded-lg p-3 text-sm ${
                                            msg.role === 'user' 
                                                ? 'bg-brand-600 text-white rounded-tr-none' 
                                                : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none shadow-sm'
                                        }`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                                {isThinking && (
                                    <div className="flex justify-start">
                                        <div className="bg-white text-slate-500 border border-slate-200 rounded-lg p-3 text-xs rounded-tl-none shadow-sm flex items-center">
                                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce mr-1"></span>
                                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce mr-1 delay-75"></span>
                                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-3 border-t border-slate-200 bg-white rounded-b-xl">
                                <div className="flex">
                                    <input 
                                        type="text" 
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                        placeholder="Type your question..."
                                        className="flex-1 border border-slate-300 rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500"
                                    />
                                    <button 
                                        onClick={handleSendMessage}
                                        className="bg-brand-600 text-white px-4 py-2 rounded-r-lg hover:bg-brand-700 disabled:opacity-50"
                                        disabled={isThinking}
                                    >
                                        Send
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListingDetail;