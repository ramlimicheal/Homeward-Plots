import React, { useState } from 'react';

interface LoginProps {
    onLogin: (user: { name: string; phone: string }) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSendOtp = (e: React.FormEvent) => {
        e.preventDefault();
        if (phone.length < 5) return;
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setStep('otp');
        }, 1500);
    };

    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length !== 4) return;
        setIsLoading(true);
        // Simulate verification
        setTimeout(() => {
            onLogin({ name: 'Rahul J.', phone });
        }, 1500);
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
                <div className="bg-brand-900 p-8 text-center">
                    <h2 className="text-2xl font-serif font-bold text-white mb-2">Homeward Secure Login</h2>
                    <p className="text-brand-100 text-sm">Access your vault and track transactions.</p>
                </div>
                
                <div className="p-8">
                    {step === 'phone' ? (
                        <form onSubmit={handleSendOtp} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">International Mobile Number</label>
                                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-brand-600">
                                    <span className="flex select-none items-center pl-3 text-slate-500 sm:text-sm border-r border-slate-200 pr-3">+1</span>
                                    <input 
                                        type="tel" 
                                        className="block flex-1 border-0 bg-transparent py-3 pl-3 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6" 
                                        placeholder="(555) 000-0000"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        required
                                    />
                                </div>
                                <p className="mt-2 text-xs text-slate-500">We will send a one-time verification code.</p>
                            </div>
                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full bg-brand-600 text-white py-3 rounded-lg font-semibold hover:bg-brand-700 transition-colors shadow-md flex justify-center items-center"
                            >
                                {isLoading ? (
                                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                ) : "Send Secure OTP"}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerify} className="space-y-6">
                            <div className="text-center mb-6">
                                <p className="text-sm text-slate-600">Enter code sent to <span className="font-semibold text-slate-900">+1 {phone}</span></p>
                                <button type="button" onClick={() => setStep('phone')} className="text-xs text-brand-600 hover:underline mt-1">Change Number</button>
                            </div>
                            
                            <div className="flex justify-center gap-4">
                                <input 
                                    type="text" 
                                    maxLength={4}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="block w-48 text-center text-3xl tracking-[1em] border-b-2 border-brand-200 py-2 focus:border-brand-600 focus:outline-none bg-transparent"
                                    placeholder="0000"
                                    autoFocus
                                />
                            </div>
                            
                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full bg-brand-600 text-white py-3 rounded-lg font-semibold hover:bg-brand-700 transition-colors shadow-md flex justify-center items-center mt-8"
                            >
                                {isLoading ? (
                                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                ) : "Verify & Access"}
                            </button>
                        </form>
                    )}
                </div>
                <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-center space-x-2 text-xs text-slate-500">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    <span>Bank-grade encryption enabled</span>
                </div>
            </div>
        </div>
    );
};

export default Login;