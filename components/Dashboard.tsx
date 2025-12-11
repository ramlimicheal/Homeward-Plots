import React from 'react';
import { Property } from '../types';

interface DashboardProps {
    savedProperties: Property[];
    onViewProperty: (property: Property) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ savedProperties, onViewProperty }) => {
    // Mock active transaction (would come from backend in real app)
    const activeTransaction = {
        title: 'Plot #102, Gachibowli',
        id: 'HW-HYD-8821',
        steps: [
            { name: 'Plot Selection', status: 'complete', date: 'Oct 24' },
            { name: 'Token Payment', status: 'complete', date: 'Oct 26' },
            { name: 'Legal Verification', status: 'current', date: 'In Progress' },
            { name: 'Sale Agreement', status: 'upcoming', date: 'Est. Nov 5' },
            { name: 'Registration', status: 'upcoming', date: 'Est. Nov 20' },
        ]
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-serif font-bold text-slate-900 mb-8">My Homeward Journey</h1>
            
            <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden mb-8">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-brand-50">
                    <div>
                        <h2 className="text-lg font-bold text-brand-900">Active Transaction: {activeTransaction.title}</h2>
                        <p className="text-sm text-slate-600">Reference ID: {activeTransaction.id}</p>
                    </div>
                    <span className="bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full font-semibold border border-amber-200">
                        Action Required
                    </span>
                </div>

                <div className="p-8">
                    <nav aria-label="Progress">
                        <ol role="list" className="overflow-hidden">
                            <li className="relative pb-10">
                                <div className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-brand-600" aria-hidden="true"></div>
                                <div className="relative flex items-start group">
                                    <span className="h-9 flex items-center">
                                        <span className="relative z-10 w-8 h-8 flex items-center justify-center bg-brand-600 rounded-full group-hover:bg-brand-800">
                                            <svg className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </span>
                                    </span>
                                    <span className="ml-4 min-w-0 flex flex-col">
                                        <span className="text-sm font-semibold text-brand-600 tracking-wide">Selection & Token</span>
                                        <span className="text-sm text-slate-500">Paid ₹1,00,000 via Escrow on Oct 26, 2024.</span>
                                    </span>
                                </div>
                            </li>

                            <li className="relative pb-10">
                                <div className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200" aria-hidden="true"></div>
                                <div className="relative flex items-start group">
                                    <span className="h-9 flex items-center">
                                        <span className="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-brand-600 rounded-full">
                                            <span className="h-2.5 w-2.5 bg-brand-600 rounded-full animate-pulse"></span>
                                        </span>
                                    </span>
                                    <span className="ml-4 min-w-0 flex flex-col">
                                        <span className="text-sm font-semibold text-brand-600 tracking-wide">Legal Verification (Current Step)</span>
                                        <span className="text-sm text-slate-500">Partner lawyer is verifying the 1982 link document. Report expected in 2 days.</span>
                                        <div className="mt-2">
                                            <button className="text-xs bg-brand-600 text-white px-3 py-1 rounded hover:bg-brand-700">View Draft Report</button>
                                        </div>
                                    </span>
                                </div>
                            </li>

                            <li className="relative">
                                <div className="relative flex items-start group">
                                    <span className="h-9 flex items-center">
                                        <span className="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-slate-300 rounded-full">
                                            <span className="h-2.5 w-2.5 bg-transparent rounded-full group-hover:bg-slate-300"></span>
                                        </span>
                                    </span>
                                    <span className="ml-4 min-w-0 flex flex-col">
                                        <span className="text-sm font-medium text-slate-500">Registration</span>
                                        <span className="text-sm text-slate-400">Scheduled for late November upon verification success.</span>
                                    </span>
                                </div>
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>
            
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-900 mb-4">Saved Properties</h3>
                    {savedProperties.length > 0 ? (
                        <div className="space-y-3">
                            {savedProperties.map(prop => (
                                <div 
                                    key={prop.id} 
                                    onClick={() => onViewProperty(prop)}
                                    className="flex items-center space-x-3 p-3 hover:bg-slate-50 rounded-lg cursor-pointer border border-transparent hover:border-slate-100 transition-colors"
                                >
                                    <img src={prop.images[0]} alt={prop.title} className="w-12 h-12 object-cover rounded-md" />
                                    <div>
                                        <div className="font-medium text-sm text-slate-900">{prop.title}</div>
                                        <div className="text-xs text-slate-500">{prop.location.city} • ₹{(prop.price.inr / 100000).toFixed(1)} L</div>
                                    </div>
                                    <div className="ml-auto text-brand-600">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-slate-400 text-sm">
                            <p>You haven't saved any properties yet.</p>
                            <p className="text-xs mt-1">Click the heart icon on listings to shortlist them.</p>
                        </div>
                    )}
                </div>
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-900 mb-4">Messages</h3>
                    <p className="text-sm text-slate-500 italic">No new messages from your Relationship Manager.</p>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;