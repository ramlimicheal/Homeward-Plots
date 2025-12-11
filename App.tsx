import React, { useState } from 'react';
import { MOCK_PROPERTIES } from './constants';
import { Property, AppView, User } from './types';
import MapSearch from './components/MapSearch';
import ListingDetail from './components/ListingDetail';
import Dashboard from './components/Dashboard';
import ServicePackages from './components/ServicePackages';
import Login from './components/Login';
import ContactModal from './components/ContactModal';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [filters, setFilters] = useState<{ maxPrice: number | null, minArea: number | null }>({ maxPrice: null, minArea: null });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Authentication State
  const [user, setUser] = useState<User | null>(null);

  // Feature State
  const [savedPropertyIds, setSavedPropertyIds] = useState<Set<string>>(new Set());
  const [contactModal, setContactModal] = useState<{isOpen: boolean, title: string, subtitle?: string}>({
      isOpen: false,
      title: '',
  });

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
    setCurrentView(AppView.LISTING_DETAIL);
    window.scrollTo(0, 0);
  };

  const handleLogin = (userData: { name: string; phone: string }) => {
      setUser({ ...userData, isLoggedIn: true });
      setCurrentView(AppView.DASHBOARD);
  };

  const toggleSaveProperty = (id: string) => {
      const newSaved = new Set(savedPropertyIds);
      if (newSaved.has(id)) {
          newSaved.delete(id);
      } else {
          newSaved.add(id);
      }
      setSavedPropertyIds(newSaved);
  };

  const openContactModal = (title: string, subtitle?: string) => {
      setContactModal({ isOpen: true, title, subtitle });
  };

  const filteredProperties = MOCK_PROPERTIES.filter(p => {
      if (selectedState && p.location.state !== selectedState) return false;
      if (filters.maxPrice && p.price.inr > filters.maxPrice) return false;
      if (filters.minArea && p.specs.area < filters.minArea) return false;
      return true;
  });

  const savedPropertiesList = MOCK_PROPERTIES.filter(p => savedPropertyIds.has(p.id));

  const renderContent = () => {
    switch (currentView) {
      case AppView.LISTING_DETAIL:
        return selectedProperty ? (
          <ListingDetail 
            property={selectedProperty} 
            onBack={() => setCurrentView(AppView.HOME)} 
            isSaved={savedPropertyIds.has(selectedProperty.id)}
            onToggleSave={() => toggleSaveProperty(selectedProperty.id)}
            onContact={(type) => openContactModal(type, `Inquiry regarding ${selectedProperty.title}`)}
          />
        ) : null;
      
      case AppView.DASHBOARD:
        return user?.isLoggedIn ? (
            <Dashboard 
                savedProperties={savedPropertiesList} 
                onViewProperty={handlePropertySelect}
            />
        ) : <Login onLogin={handleLogin} />;

      case AppView.SERVICES:
        return <ServicePackages onSelectPackage={(name) => openContactModal(name, "Requesting service consultation")} />;

      case AppView.HOME:
      default:
        return (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
            {/* Hero Section */}
            <div className="text-center py-10 lg:py-16">
              <h1 className="text-4xl lg:text-5xl font-serif font-bold text-brand-900 tracking-tight mb-4">
                Secure Your Piece of the <span className="text-brand-600">Motherland</span>
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
                The first end-to-end verified land marketplace for NRIs. 
                Transparent titles. Legal backing. Zero fraud.
              </p>
              <div className="flex justify-center gap-4">
                 <button className="bg-brand-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:bg-brand-700 transition-all">
                    Browse Plots
                 </button>
                 <button 
                    onClick={() => setCurrentView(AppView.SERVICES)}
                    className="bg-white text-brand-600 border border-brand-200 px-8 py-3 rounded-lg font-semibold hover:bg-brand-50 transition-all"
                 >
                    Verify a Property
                 </button>
              </div>
            </div>

            {/* Map Filter */}
            <MapSearch 
                selectedState={selectedState} 
                onSelectState={setSelectedState}
                onFilterChange={setFilters}
            />

            {/* Property Grid */}
            <div>
                <div className="flex justify-between items-end mb-6">
                    <h2 className="text-2xl font-serif font-bold text-slate-900">
                        {selectedState ? `Verified Plots in ${selectedState}` : 'Featured Verified Plots'}
                    </h2>
                    <span className="text-sm text-slate-500">{filteredProperties.length} Properties Found</span>
                </div>
                
                {filteredProperties.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProperties.map((prop) => (
                            <div 
                                key={prop.id} 
                                onClick={() => handlePropertySelect(prop)}
                                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                            >
                                <div className="h-48 overflow-hidden relative">
                                    <img src={prop.images[0]} alt={prop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    
                                    {/* Status Badge */}
                                    <div className={`absolute top-3 left-3 px-2 py-1 rounded text-xs font-bold text-white shadow-sm z-10 ${
                                        prop.status === 'Available' ? 'bg-green-600' :
                                        prop.status === 'Under Offer' ? 'bg-amber-500' : 'bg-red-500'
                                    }`}>
                                        {prop.status}
                                    </div>
                                    
                                    {/* Heart/Save Button */}
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); toggleSaveProperty(prop.id); }}
                                        className={`absolute top-3 right-28 p-1.5 rounded-full z-10 bg-white/90 shadow-sm backdrop-blur-sm transition-colors ${
                                            savedPropertyIds.has(prop.id) ? 'text-red-500' : 'text-slate-400 hover:text-red-400'
                                        }`}
                                    >
                                        <svg className="w-5 h-5" fill={savedPropertyIds.has(prop.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </button>

                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-brand-900 shadow-sm border border-slate-200">
                                        {prop.verificationLevel} Verified
                                    </div>
                                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs text-white">
                                        ₹{prop.price.pricePerSqFt}/sq.ft
                                    </div>
                                </div>
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-slate-900 text-lg leading-tight group-hover:text-brand-600 transition-colors">{prop.title}</h3>
                                    </div>
                                    <p className="text-sm text-slate-500 mb-4 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        {prop.location.city}, {prop.location.state}
                                    </p>
                                    <div className="grid grid-cols-2 gap-2 text-sm text-slate-700 mb-4 bg-slate-50 p-3 rounded-lg">
                                        <div><span className="text-slate-400 text-xs block">Area</span>{prop.specs.area} sq ft</div>
                                        <div><span className="text-slate-400 text-xs block">Total Price</span>₹{(prop.price.inr / 100000).toFixed(1)} L</div>
                                    </div>
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                        <div className="flex items-center text-xs text-green-600 font-medium">
                                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                            Legal Check Passed
                                        </div>
                                        <button className="text-brand-600 font-semibold text-sm hover:underline">View Details</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                        <p className="text-slate-500">No verified properties available in this region yet.</p>
                        <button onClick={() => { setSelectedState(null); setFilters({maxPrice: null, minArea: null}); }} className="mt-2 text-brand-600 font-medium">Clear Filter</button>
                    </div>
                )}
            </div>
            
            <ServicePackages onSelectPackage={(name) => openContactModal(name, "Requesting service consultation")} />
            
            <ContactModal 
                isOpen={contactModal.isOpen}
                onClose={() => setContactModal({...contactModal, isOpen: false})}
                title={contactModal.title}
                subtitle={contactModal.subtitle}
            />
          </main>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => setCurrentView(AppView.HOME)}>
              <div className="bg-brand-900 text-white p-1.5 rounded mr-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              </div>
              <span className="font-serif font-bold text-xl text-brand-900">Homeward<span className="text-brand-600">Plots</span></span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => setCurrentView(AppView.HOME)} 
                className={`${currentView === AppView.HOME ? 'text-brand-600' : 'text-slate-500'} hover:text-brand-900 font-medium transition-colors`}
              >
                Browse
              </button>
              <button 
                onClick={() => setCurrentView(AppView.SERVICES)} 
                className={`${currentView === AppView.SERVICES ? 'text-brand-600' : 'text-slate-500'} hover:text-brand-900 font-medium transition-colors`}
              >
                Services
              </button>
              <button 
                onClick={() => setCurrentView(AppView.DASHBOARD)} 
                className={`${currentView === AppView.DASHBOARD ? 'text-brand-600' : 'text-slate-500'} hover:text-brand-900 font-medium transition-colors`}
              >
                Dashboard
              </button>
              <div className="border-l border-slate-200 pl-8 ml-4">
                {user?.isLoggedIn ? (
                    <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setCurrentView(AppView.DASHBOARD)}>
                        <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-xs">
                            {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-sm font-medium text-slate-700">{user.name}</span>
                    </div>
                ) : (
                    <button 
                        onClick={() => setCurrentView(AppView.DASHBOARD)}
                        className="text-sm font-medium text-brand-600 hover:text-brand-700"
                    >
                        Sign In
                    </button>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
            <div className="md:hidden bg-white border-t border-slate-100 py-2">
                <button onClick={() => { setCurrentView(AppView.HOME); setIsMobileMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50">Browse</button>
                <button onClick={() => { setCurrentView(AppView.SERVICES); setIsMobileMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50">Services</button>
                <button onClick={() => { setCurrentView(AppView.DASHBOARD); setIsMobileMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50">Dashboard</button>
            </div>
        )}
      </nav>

      {renderContent()}

      <footer className="bg-brand-900 text-slate-300 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="col-span-1 md:col-span-2">
                    <span className="font-serif font-bold text-xl text-white">Homeward<span className="text-brand-400">Plots</span></span>
                    <p className="mt-4 text-sm max-w-xs leading-relaxed opacity-80">
                        Bridging the gap between NRIs and their motherland. We provide trust, transparency, and technology to make land buying safe again.
                    </p>
                </div>
                <div>
                    <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">Platform</h3>
                    <ul className="space-y-2 text-sm">
                        <li>Verified Listings</li>
                        <li>Legal Services</li>
                        <li>Partner Network</li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">Legal</h3>
                    <ul className="space-y-2 text-sm">
                        <li>Terms of Service</li>
                        <li>Privacy Policy</li>
                        <li>RERA Compliance</li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-brand-800 mt-12 pt-8 text-center text-xs opacity-60">
                &copy; 2024 Homeward Plots. All rights reserved.
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;