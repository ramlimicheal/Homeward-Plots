import React from 'react';

interface DocumentViewerProps {
    documentName: string;
    isOpen: boolean;
    onClose: () => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ documentName, isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            
            <div className="relative bg-white rounded-lg shadow-2xl max-w-4xl w-full h-[80vh] flex flex-col overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">{documentName}</h3>
                        <p className="text-xs text-slate-500 flex items-center">
                            <svg className="w-3 h-3 mr-1 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Verified Original
                        </p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="flex-1 bg-slate-100 relative overflow-hidden flex items-center justify-center p-8">
                    {/* Simulated Document Paper */}
                    <div className="bg-white w-full h-full shadow-lg border border-slate-300 p-8 sm:p-12 overflow-y-auto relative">
                        <div className="space-y-6 opacity-40 select-none pointer-events-none">
                            <div className="h-8 bg-slate-200 w-1/3 mb-8"></div>
                            <div className="space-y-3">
                                <div className="h-4 bg-slate-200 w-full"></div>
                                <div className="h-4 bg-slate-200 w-full"></div>
                                <div className="h-4 bg-slate-200 w-5/6"></div>
                                <div className="h-4 bg-slate-200 w-full"></div>
                            </div>
                            <div className="space-y-3 pt-8">
                                <div className="h-4 bg-slate-200 w-11/12"></div>
                                <div className="h-4 bg-slate-200 w-full"></div>
                                <div className="h-4 bg-slate-200 w-3/4"></div>
                            </div>
                            <div className="grid grid-cols-2 gap-8 pt-12">
                                <div className="h-24 border-2 border-dashed border-slate-300 rounded flex items-center justify-center text-xs uppercase tracking-widest text-slate-400">Stamp</div>
                                <div className="h-24 border-2 border-dashed border-slate-300 rounded flex items-center justify-center text-xs uppercase tracking-widest text-slate-400">Signature</div>
                            </div>
                        </div>

                        {/* Security Watermark Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                             <div className="transform -rotate-45 border-4 border-red-500/20 text-red-500/20 text-4xl sm:text-6xl font-bold uppercase tracking-widest p-4 rounded-xl border-dashed">
                                Homeward Verified
                             </div>
                        </div>
                        
                        {/* Pattern Overlay */}
                        <div className="absolute inset-0 opacity-5 pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                    </div>
                </div>

                <div className="p-4 bg-slate-800 text-white flex justify-between items-center text-xs">
                    <div>
                        <span className="font-bold text-amber-500 mr-2">CONFIDENTIAL:</span>
                        Do not distribute or reproduce.
                    </div>
                    <div className="hidden sm:block font-mono text-slate-400">
                        DOC-ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentViewer;