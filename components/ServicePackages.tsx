import React from 'react';

interface ServicePackagesProps {
    onSelectPackage?: (pkgName: string) => void;
}

const ServicePackages: React.FC<ServicePackagesProps> = ({ onSelectPackage }) => {
    const packages = [
        {
            name: "Basic Verification",
            price: 99,
            features: ["Digital Record Pull", "Encumbrance Check (15 Years)", "Govt. Value Estimation"],
            color: "border-slate-200",
            btnColor: "bg-slate-800"
        },
        {
            name: "Legal Opinion",
            price: 350,
            features: ["30-Year Title Search", "Lawyer Verified Report", "Litigation Check", "Physical Document verification"],
            color: "border-brand-500 ring-1 ring-brand-500",
            btnColor: "bg-brand-600",
            recommended: true
        },
        {
            name: "Site Visit & Report",
            price: 200,
            features: ["Physical Boundary Check", "Drone Footage", "Encroachment Check", "Neighborhood Report"],
            color: "border-slate-200",
            btnColor: "bg-slate-800"
        }
    ];

    const handleSelect = (pkgName: string) => {
        if (onSelectPackage) {
            onSelectPackage(pkgName);
        }
    };

    return (
        <div className="py-12 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-serif font-bold text-slate-900">Verification Services</h2>
                    <p className="mt-4 text-lg text-slate-600">Don't rely on word of mouth. Get data-backed truth.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {packages.map((pkg) => (
                        <div key={pkg.name} className={`bg-white rounded-2xl p-8 shadow-sm border ${pkg.color} relative flex flex-col`}>
                            {pkg.recommended && (
                                <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-brand-600 text-white text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full shadow-sm">
                                    Most Popular
                                </span>
                            )}
                            <h3 className="text-xl font-bold text-slate-900">{pkg.name}</h3>
                            <div className="mt-4 flex items-baseline text-slate-900">
                                <span className="text-4xl font-extrabold tracking-tight">${pkg.price}</span>
                                <span className="ml-1 text-xl font-semibold text-slate-500">/property</span>
                            </div>
                            <ul className="mt-6 space-y-4 flex-1">
                                {pkg.features.map((feature) => (
                                    <li key={feature} className="flex">
                                        <svg className="flex-shrink-0 w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        <span className="ml-3 text-slate-500">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <button 
                                onClick={() => handleSelect(pkg.name)}
                                className={`mt-8 w-full py-3 px-6 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${pkg.btnColor} hover:opacity-90 transition-opacity`}
                            >
                                Get Started
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ServicePackages;