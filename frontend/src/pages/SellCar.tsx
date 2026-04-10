import React, { useState } from 'react';
import { Camera, DollarSign, Clock, ShieldCheck, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const SellCar: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setStep(3); // Move to success step
      toast.success('Valuation Request Submitted!');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
      {/* Hero Header */}
      <section className="relative py-24 bg-white dark:bg-[#0A0C10] overflow-hidden border-b border-slate-100 dark:border-white/5">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-accent/5 blur-3xl rounded-full" />
        <div className="max-w-7xl mx-auto section-padding relative z-10 text-center">
          <span className="text-accent font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs mb-3 block">Consignment & Acquisitions</span>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-slate-900 dark:text-white mb-6">
            Sell Your <span className="text-gradient font-light italic">Masterpiece</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
            Unlock the true value of your premium vehicle. We offer immediate acquisitions and exclusive consignment services for the world's finest cars.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto section-padding mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Selling Process Info */}
          <div className="lg:col-span-5 space-y-12 pr-0 lg:pr-8">
            <div>
              <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-8">The SSX Advantage</h2>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Premium Valuation</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">We leverage real-time global market data to offer you the absolute highest payout possible for your elite vehicle.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Instant Acquisition</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Skip the hassle of private buyers. Receive an immediate electronic transfer within 24 hours of final inspection.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">White-Glove Service</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">We take care of all transport logistics, DMV paperwork, and loan payoffs directly on your behalf.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-900 dark:bg-slate-800 rounded-3xl p-8 relative overflow-hidden shadow-premium">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-[50px] pointer-events-none" />
              <h3 className="text-xl font-display font-bold text-white mb-4">Direct Purchase Parameters</h3>
              <ul className="space-y-3 text-slate-300 text-sm">
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-accent" /> 2018 Model Year or Newer</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-accent" /> Under 40,000 Verified Miles</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-accent" /> Clean Carfax / Clean Title</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-accent" /> Prestige & Luxury Badging Only</li>
              </ul>
            </div>
          </div>

          {/* Sell Form */}
          <div className="lg:col-span-7">
            <div className="card !bg-white/80 dark:!bg-slate-800/80 p-8 md:p-12 rounded-[2.5rem] shadow-premium border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl">
              {step === 1 && (
                <form onSubmit={() => setStep(2)} className="space-y-6 animate-fade-in">
                  <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-6">Step 1: Vehicle Details</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Make / Brand</label>
                      <input type="text" required className="input-field" placeholder="e.g. Porsche" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Model</label>
                      <input type="text" required className="input-field" placeholder="e.g. 911 GT3 RS" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Year</label>
                      <input type="number" min="2010" max="2026" required className="input-field" placeholder="2023" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Mileage</label>
                      <input type="number" required className="input-field" placeholder="12,500" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">VIN (Vehicle Identification Number)</label>
                    <input type="text" required className="input-field uppercase" placeholder="Enter 17-digit VIN" minLength={17} maxLength={17} />
                  </div>

                  <div className="pt-6">
                    <button type="submit" className="btn-primary w-full py-4 text-lg font-bold flex items-center justify-center gap-2">
                      Continue to Contact Info <Camera className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              )}

              {step === 2 && (
                <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
                  <div className="flex items-center gap-4 mb-6">
                    <button type="button" onClick={() => setStep(1)} className="text-slate-400 hover:text-accent font-bold text-sm tracking-widest uppercase truncate min-w-[60px]">← Back</button>
                    <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white w-full">Step 2: Owner Contact</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">First Name</label>
                      <input type="text" required className="input-field" placeholder="James" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Last Name</label>
                      <input type="text" required className="input-field" placeholder="Bond" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                    <input type="email" required className="input-field" placeholder="secure@mi6.gov" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Phone Number</label>
                    <input type="tel" required className="input-field" placeholder="+1 (555) 000-0000" />
                  </div>

                  <div className="pt-6">
                    <button type="submit" disabled={submitting} className="btn-primary w-full py-4 text-lg font-bold flex items-center justify-center gap-2 relative">
                      {submitting ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                      ) : (
                        'Request Market Valuation'
                      )}
                    </button>
                  </div>
                </form>
              )}

              {step === 3 && (
                <div className="text-center py-12 animate-slide-up">
                  <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-4">Request Received</h2>
                  <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed mb-8">
                    Our acquisitions team will review your vehicle's profile and run a market analysis. Expect a call from your dedicated agent within 24 hours.
                  </p>
                  <button onClick={() => setStep(1)} className="text-accent font-bold uppercase tracking-widest text-sm hover:text-white transition-colors">
                    Submit Another Vehicle
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SellCar;
