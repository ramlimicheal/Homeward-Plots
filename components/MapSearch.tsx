import React, { useState } from 'react';
import { STATES_LIST, MOCK_PROPERTIES } from '../constants';

interface MapSearchProps {
    onSelectState: (state: string | null) => void;
    selectedState: string | null;
    onFilterChange: (filters: { maxPrice: number | null, minArea: number | null }) => void;
}

const MapSearch: React.FC<MapSearchProps> = ({ onSelectState, selectedState, onFilterChange }) => {
    const [hoveredState, setHoveredState] = useState<string | null>(null);
    const [maxPrice, setMaxPrice] = useState<string>("");
    const [minArea, setMinArea] = useState<string>("");

    const handleFilterChange = (price: string, area: string) => {
        setMaxPrice(price);
        setMinArea(area);
        onFilterChange({
            maxPrice: price ? parseInt(price) : null,
            minArea: area ? parseInt(area) : null
        });
    };

    // Simplified abstract map representation for UI clarity
    
    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-serif font-bold text-brand-900">Explore by Region</h2>
                        <span className="text-sm text-slate-500">Filter verified plots by location and budget</span>
                    </div>
                    <div className="flex gap-4">
                        <select 
                            value={maxPrice}
                            onChange={(e) => handleFilterChange(e.target.value, minArea)}
                            className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block p-2.5"
                        >
                            <option value="">Any Budget</option>
                            <option value="5000000">Under ₹50 Lakhs</option>
                            <option value="10000000">Under ₹1 Cr</option>
                            <option value="20000000">Under ₹2 Cr</option>
                            <option value="50000000">Under ₹5 Cr</option>
                        </select>
                        <select 
                            value={minArea}
                            onChange={(e) => handleFilterChange(maxPrice, e.target.value)}
                            className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block p-2.5"
                        >
                            <option value="">Any Size</option>
                            <option value="1200">1200+ Sq.Ft</option>
                            <option value="2400">2400+ Sq.Ft</option>
                            <option value="5000">5000+ Sq.Ft</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <div className="p-6 bg-brand-50/50">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {STATES_LIST.map((state) => {
                        const count = MOCK_PROPERTIES.filter(p => p.location.state === state).length;
                        const isSelected = selectedState === state;
                        
                        return (
                            <button
                                key={state}
                                onClick={() => onSelectState(isSelected ? null : state)}
                                onMouseEnter={() => setHoveredState(state)}
                                onMouseLeave={() => setHoveredState(null)}
                                className={`
                                    relative p-4 rounded-lg border text-left transition-all duration-200 group
                                    ${isSelected 
                                        ? 'bg-brand-900 border-brand-900 text-white shadow-md' 
                                        : 'bg-white border-slate-200 hover:border-brand-300 hover:shadow-sm text-slate-700'}
                                `}
                            >
                                <div className="flex justify-between items-start">
                                    <span className={`font-medium ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                                        {state}
                                    </span>
                                    {count > 0 && (
                                        <span className={`
                                            text-xs px-2 py-0.5 rounded-full 
                                            ${isSelected ? 'bg-white/20 text-white' : 'bg-brand-50 text-brand-600'}
                                        `}>
                                            {count} Listings
                                        </span>
                                    )}
                                </div>
                                <div className="mt-4 flex items-center text-xs opacity-80">
                                    <span className={`w-2 h-2 rounded-full mr-2 ${count > 0 ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                                    {count > 0 ? 'Verified Plots Available' : 'Coming Soon'}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Simulated Map Visual */}
            <div className="h-64 w-full bg-slate-100 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: 'radial-gradient(#075985 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}></div>
                <div className="text-center">
                    <svg className="w-24 h-24 mx-auto text-brand-200 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-brand-900 font-serif italic text-lg">Homeward Verified Network</p>
                    <p className="text-xs text-slate-500 mt-1">Connecting NRIs to 50+ Cities across India</p>
                </div>
            </div>
        </div>
    );
};

export default MapSearch;