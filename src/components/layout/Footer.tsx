import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'About Us', path: '/about' },
      { name: 'Careers', path: '/careers' },
      { name: 'Press', path: '/press' },
      { name: 'Blog', path: '/blog' },
    ],
    support: [
      { name: 'Contact Us', path: '/contact' },
      { name: 'FAQ', path: '/faq' },
      { name: 'Terms of Service', path: '/terms' },
      { name: 'Privacy Policy', path: '/privacy' },
    ],
    services: [
      { name: 'Buy a Car', path: '/cars' },
      { name: 'Sell Your Car', path: '/sell' },
      { name: 'Car Comparison', path: '/compare' },
      { name: 'Test Drive', path: '/cars' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, url: '#' },
    { name: 'Twitter', icon: Twitter, url: '#' },
    { name: 'Instagram', icon: Instagram, url: '#' },
    { name: 'LinkedIn', icon: Linkedin, url: '#' },
  ];

  return (
    <footer className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border-t border-slate-100 dark:border-slate-800 transition-colors duration-500 font-sans">
      <div className="max-w-7xl mx-auto section-padding py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-2 group">
              <img src="/logo.png" alt="SSX MOTORS Logo" className="h-12 w-auto object-contain dark:invert" />
              <span className="text-2xl font-display font-black text-slate-900 dark:text-white tracking-tighter">
                SSX<span className="text-accent underline decoration-accent/30 underline-offset-4">MOTORS</span>
              </span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs font-light">
              Defining the future of luxury transportation. We curate only the finest vehicles for the most discerning drivers.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400 text-xs font-bold group cursor-pointer hover:text-accent dark:hover:text-white transition-colors">
                <Mail className="h-4 w-4 text-accent" />
                <span>concierge@ssxmotors.com</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400 text-xs font-bold group cursor-pointer hover:text-accent dark:hover:text-white transition-colors">
                <Phone className="h-4 w-4 text-accent" />
                <span>+1 (212) 555-0198</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-xs font-display font-bold uppercase tracking-[0.2em] mb-8 text-slate-900 dark:text-slate-100">Company</h3>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-slate-500 dark:text-slate-400 hover:text-accent dark:hover:text-accent hover:translate-x-1 inline-block transition-all text-sm font-medium"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-xs font-display font-bold uppercase tracking-[0.2em] mb-8 text-slate-900 dark:text-slate-100">Client Care</h3>
            <ul className="space-y-4">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-slate-500 dark:text-slate-400 hover:text-accent dark:hover:text-accent hover:translate-x-1 inline-block transition-all text-sm font-medium"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="text-xs font-display font-bold uppercase tracking-[0.2em] mb-8 text-slate-900 dark:text-slate-100">Our Services</h3>
            <ul className="space-y-4">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-slate-500 dark:text-slate-400 hover:text-accent dark:hover:text-accent hover:translate-x-1 inline-block transition-all text-sm font-medium"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-20 pt-10 border-t border-slate-100 dark:border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 text-slate-500">
            <p className="text-xs font-bold tracking-wide">
              &copy; {currentYear} SSX MOTORS. Crafted for Excellence.
            </p>
            <div className="flex items-center space-x-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full border border-slate-200 dark:border-white/5 text-slate-400 hover:border-accent hover:bg-accent hover:text-white transition-all duration-300"
                  aria-label={social.name}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
