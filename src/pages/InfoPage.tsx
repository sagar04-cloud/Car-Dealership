import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const InfoPage: React.FC = () => {
  const location = useLocation();

  const getPageContent = () => {
    switch (location.pathname) {
      case '/about':
        return {
          title: 'About SSX MOTORS',
          subtitle: 'Our Heritage & Vision',
          content: (
            <>
              <p className="mb-6">Founded on the principle that buying a luxury vehicle should be as exceptional as driving one, SSX MOTORS has revolutionized the premium automotive market.</p>
              <p className="mb-6">We don't just sell cars; we curate collections. Every vehicle in our showroom undergoes a rigorous 300-point inspection by factory-certified master technicians. Our commitment to excellence ensures that whether you're acquiring a classic masterpiece or the latest hypercar, you are receiving absolute perfection.</p>
              <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white mt-12 mb-6">Our Philosophy</h3>
              <p>Transparency, exclusivity, and unparalleled client care. We aim to build lifelong relationships with our clientele, providing white-glove service that extends far beyond the point of sale.</p>
            </>
          )
        };
      case '/careers':
        return {
          title: 'Careers at SSX',
          subtitle: 'Join the Elite',
          content: (
            <>
              <p className="mb-6">We are always looking for exceptional talent to join our growing team. At SSX MOTORS, we foster an environment of passion, precision, and performance.</p>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 mt-8">
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">Current Openings</h4>
                <ul className="space-y-4 mt-6">
                  <li className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-700">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Senior Sales Concierge</p>
                      <p className="text-sm text-slate-500">Beverly Hills, CA • Full-time</p>
                    </div>
                    <button className="text-accent text-sm font-bold hover:underline">Apply</button>
                  </li>
                  <li className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-700">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Master Technician (Porsche/Ferrari)</p>
                      <p className="text-sm text-slate-500">Beverly Hills, CA • Full-time</p>
                    </div>
                    <button className="text-accent text-sm font-bold hover:underline">Apply</button>
                  </li>
                </ul>
              </div>
            </>
          )
        };
      case '/press':
        return {
          title: 'Press & Media',
          subtitle: 'SSX in the News',
          content: (
            <>
              <p className="mb-8">Latest announcements, press releases, and media coverage.</p>
              <div className="space-y-8">
                <article>
                  <p className="text-accent text-sm font-bold mb-2">October 2025</p>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">SSX MOTORS Expands to European Market</h4>
                  <p className="text-slate-600 dark:text-slate-400">Announcing our new flagship showroom opening in Monaco, bringing our curated collection to the European elite.</p>
                </article>
                <article>
                  <p className="text-accent text-sm font-bold mb-2">June 2025</p>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Voted #1 Luxury Dealership</h4>
                  <p className="text-slate-600 dark:text-slate-400">MotorTrend luxury division ranks SSX highest in client satisfaction and inventory quality for the third consecutive year.</p>
                </article>
              </div>
            </>
          )
        };
      case '/blog':
        return {
          title: 'The Apex Blog',
          subtitle: 'Insights from the fast lane',
          content: (
            <div className="text-center py-12">
              <p className="text-slate-500 dark:text-slate-400 text-lg mb-6">Our new editorial platform is launching soon. Subscribe to our newsletter to be notified.</p>
              <Link to="/contact" className="btn-primary inline-flex items-center gap-2">Contact Us <ArrowRight className="w-4 h-4" /></Link>
            </div>
          )
        };
      case '/faq':
        return {
          title: 'Frequently Asked Questions',
          subtitle: 'Client Support',
          content: (
            <div className="space-y-8">
              <div>
                <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Do you offer international shipping?</h4>
                <p className="text-slate-600 dark:text-slate-400">Yes, we provide fully insured, enclosed white-glove transport to almost any destination worldwide.</p>
              </div>
              <div>
                <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-2">What financing options are available?</h4>
                <p className="text-slate-600 dark:text-slate-400">We partner with premier financial institutions to offer bespoke financing and leasing solutions tailored to high-net-worth individuals.</p>
              </div>
              <div>
                <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Can I trade in my current exotic?</h4>
                <p className="text-slate-600 dark:text-slate-400">Absolutely. We offer highly competitive acquisition values for premium vehicles. Visit our "Sell Your Car" page to request a valuation.</p>
              </div>
            </div>
          )
        };
      case '/terms':
        return {
          title: 'Terms of Service',
          subtitle: 'Legal Agreements',
          content: (
            <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 space-y-4">
              <p>Last Updated: October 1, 2025</p>
              <h4 className="text-slate-900 dark:text-white font-bold mt-8 mb-4">1. Agreement to Terms</h4>
              <p>By accessing or using the SSX MOTORS website, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access our services.</p>
              <h4 className="text-slate-900 dark:text-white font-bold mt-8 mb-4">2. Vehicle Listings and Availability</h4>
              <p>While we strive for accuracy, inventory changes rapidly. A vehicle listed on our website does not guarantee its availability. Prices are subject to change without prior notice.</p>
            </div>
          )
        };
      case '/privacy':
        return {
          title: 'Privacy Policy',
          subtitle: 'Data Protection',
          content: (
            <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 space-y-4">
              <p>At SSX MOTORS, client confidentiality is paramount. We adhere to the strictest data protection standards.</p>
              <h4 className="text-slate-900 dark:text-white font-bold mt-8 mb-4">Information Collection</h4>
              <p>We collect information necessary to provide our premium services, verify identity for high-value transactions, and fulfill legal requirements. This includes contact details, financial information (when applying for financing), and browsing data.</p>
              <h4 className="text-slate-900 dark:text-white font-bold mt-8 mb-4">Data Security</h4>
              <p>Your data is secured using enterprise-grade encryption. We never sell your personal information to third parties.</p>
            </div>
          )
        };
      default:
        return {
          title: 'Information',
          subtitle: '',
          content: <p>Information unavailable.</p>
        };
    }
  };

  const pageData = getPageContent();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-20 pb-32">
      <div className="max-w-4xl mx-auto px-6">
        <header className="mb-16">
          <span className="text-accent font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs mb-4 block">
            {pageData.subtitle}
          </span>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
            {pageData.title}
          </h1>
        </header>
        
        <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 md:p-12 shadow-premium border border-slate-100 dark:border-slate-800">
          <div className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
            {pageData.content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPage;
