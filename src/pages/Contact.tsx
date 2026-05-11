import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const Contact: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success('Message sent! Our concierge team will contact you shortly.');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto section-padding py-12 md:py-20">
        <div className="text-center mb-16">
          <span className="text-accent font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs mb-3 block">Concierge Services</span>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white tracking-tight mb-4">
            Connect With <span className="italic font-light">SS</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Whether you're looking to acquire a new masterpiece, schedule a consultation, or sell your premium vehicle, our concierge team is at your absolute disposal.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 md:p-10 shadow-premium border border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-8">Direct Channels</h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4 group">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl group-hover:bg-accent group-hover:text-white text-accent transition-colors">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">VIP Line</p>
                    <p className="text-slate-900 dark:text-white font-medium">+1 (212) 555-0198</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl group-hover:bg-accent group-hover:text-white text-accent transition-colors">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email Reservations</p>
                    <p className="text-slate-900 dark:text-white font-medium">concierge@ssmotors.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl group-hover:bg-accent group-hover:text-white text-accent transition-colors">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Flagship Showroom</p>
                    <p className="text-slate-900 dark:text-white font-medium">450 Luxury Avenue<br />Beverly Hills, CA 90210</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-premium p-8 md:p-12 border border-slate-100 dark:border-slate-800">
              <form onSubmit={handleSubmit} className="space-y-6">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                    <input type="email" required className="input-field" placeholder="james@mi6.gov" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Inquiry Type</label>
                    <select required className="input-field">
                      <option value="">Select a topic</option>
                      <option value="buy">Acquire a Vehicle</option>
                      <option value="sell">Sell My Vehicle</option>
                      <option value="consult">Schedule Consultation</option>
                      <option value="other">General Inquiry</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Message</label>
                  <textarea required className="input-field" rows={5} placeholder="How may we assist you today?"></textarea>
                </div>

                <div className="pt-4">
                  <button type="submit" disabled={submitting} className="btn-primary w-full md:w-auto px-10 py-4 flex items-center justify-center space-x-2 relative group overflow-hidden">
                    <span className="relative z-10">{submitting ? 'Transmitting...' : 'Send Inquiry'}</span>
                    {!submitting && <Send className="h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform" />}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
