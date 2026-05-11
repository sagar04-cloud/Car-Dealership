import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Shield, Clock, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Car as CarType } from '../types';
import CarCard from '../components/cars/CarCard';
import SearchFilter from '../components/search/SearchFilter';
import CarService from '../services/carService';
import SEO from '../components/seo/SEO';

const Home: React.FC = () => {
  const [featuredCars, setFeaturedCars] = useState<CarType[]>(() => {
    const cached = localStorage.getItem('featured_cars_cache');
    return cached ? JSON.parse(cached) : [];
  });
  const [loading, setLoading] = useState(!localStorage.getItem('featured_cars_cache'));

  // Structured data for SEO
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "AutomotiveBusiness",
      "name": "SS MOTORS",
      "url": "https://ssmotors.com",
      "logo": "https://ssmotors.com/logo.png",
      "description": "Premium car dealership offering new and used vehicles with competitive prices and excellent service.",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "123 Main Street",
        "addressLocality": "New York",
        "addressRegion": "NY",
        "postalCode": "10001",
        "addressCountry": "US"
      },
      "telephone": "+1-555-0123",
      "openingHours": "Mo-Fr 09:00-19:00, Sa 10:00-18:00, Su Closed",
      "sameAs": [
        "https://www.facebook.com/ssmotors",
        "https://www.instagram.com/ssmotors",
        "https://www.twitter.com/ssmotors"
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "SS MOTORS",
      "url": "https://ssmotors.com",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://ssmotors.com/cars?search={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  ];

  useEffect(() => {
    // Show the 6 newest cars on the homepage
    // We use stale-while-revalidate by rendering from local cache instantly 
    // while the real-time Firebase subscription syncs in the background.
    const unsubscribe = CarService.subscribeToCars({}, null, 1, 6, ({ cars }) => {
      const topCars = cars.slice(0, 6);
      setFeaturedCars(topCars);
      setLoading(false);
      localStorage.setItem('featured_cars_cache', JSON.stringify(topCars));
    });

    return () => unsubscribe();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-[#0A0C10] dark:to-slate-900 transition-colors duration-500">
      <SEO 
        title="Premium Car Dealership - Find Your Dream Car | SS MOTORS"
        description="Discover luxury and performance vehicles at SS MOTORS. Wide selection of new and used cars with competitive prices, financing options, and exceptional service. Visit us today!"
        keywords="luxury cars, sports cars, SUV dealership, premium vehicles, car financing, test drive, certified pre-owned, automotive dealership"
        structuredData={structuredData}
      />
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Luxury Background Layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0C10] to-slate-900 dark:from-[#0A0C10] dark:to-slate-900 transition-colors duration-500">
          {/* Luxury Background Layers removed for stability */}
          
          {/* Studio Lights / Glows */}
          <div className="absolute top-[20%] right-[10%] w-1/3 h-1/3 bg-accent/20 rounded-full blur-[140px] animate-pulse" />
          <div className="absolute bottom-[20%] left-[5%] w-1/4 h-1/4 bg-blue-600/10 rounded-full blur-[100px] animate-pulse delay-700" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Text Content */}
            <div className="lg:col-span-6 text-left">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-accent/5 border border-accent/10 text-accent text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-8 shadow-sm backdrop-blur-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                  </span>
                  <span>The Evolution of Luxury</span>
                </div>
                
                <h1 className="text-5xl sm:text-7xl md:text-8xl font-display font-extrabold text-slate-900 dark:text-white mb-8 tracking-tighter leading-[0.95]">
                  Experience <br />
                  <span className="text-gradient">Pure Power</span>
                </h1>
                
                <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-lg leading-relaxed font-light">
                  Where precision meets passion. Explore our curated collection of high-performance vehicles 
                  designed for those who demand more than just transportation.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <Link
                    to="/cars"
                    className="btn-primary px-10 py-5 text-lg group overflow-hidden relative"
                  >
                    <span className="relative z-10">Explore Our Fleet</span>
                    <ArrowRight className="h-5 w-5 relative z-10 transition-transform group-hover:translate-x-1" />
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  </Link>
                  <Link
                    to="/compare"
                    className="flex items-center gap-3 py-5 text-slate-700 dark:text-slate-300 font-semibold hover:text-accent dark:hover:text-accent transition-all group"
                  >
                    Compare All Models
                    <div className="w-10 h-[1px] bg-slate-300 dark:bg-slate-700 group-hover:w-16 group-hover:bg-accent transition-all duration-300" />
                  </Link>
                </div>

                {/* Micro stats under CTA */}
                <div className="mt-16 grid grid-cols-3 gap-8">
                  <div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">500+</div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Premium Cars</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">12k+</div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Elite Members</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">25+</div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Showrooms</div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Hero Car Visual */}
            <div className="lg:col-span-6 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: 100 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                className="relative z-20"
              >
                {/* Main Car Image */}
                <div className="relative group perspective-1000">
                  <motion.img 
                    src="/hero-car.png" 
                    alt="Porsche 911 GT3 RS" 
                    className="w-full h-auto drop-shadow-[0_35px_35px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_35px_35px_rgba(0,0,0,0.6)] object-contain"
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  />
                  
                  {/* Decorative Elements around the car */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-[#0A0C10] via-transparent to-transparent h-20 bottom-0 z-30" />
                  
                  {/* Floating Performance Indicator */}
                  <div className="absolute -top-10 -right-4 bg-white/90 dark:glass-dark p-4 rounded-2xl shadow-premium border border-white/20 backdrop-blur-md hidden md:block">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center font-black text-accent text-lg italic">
                        GT3
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-tighter">0-100 km/h</div>
                        <div className="text-lg font-display font-black text-slate-900 dark:text-white">3.2s</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Shadow effect on the floor */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-4/5 h-12 bg-black/20 dark:bg-black/40 blur-[40px] rounded-[100%] z-10" 
              />
            </div>

          </div>
        </div>
      </section>


      {/* Featured Collections Section */}
      <section className="py-24 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto section-padding">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6">
            <div className="max-w-xl">
              <span className="text-accent font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs mb-3 block">New Arrivals</span>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 dark:text-white leading-tight">
                Featured <span className="italic font-light">Collections</span>
              </h2>
            </div>
            <Link
              to="/cars"
              className="group flex items-center gap-3 text-slate-900 dark:text-white font-bold hover:text-accent dark:hover:text-accent transition-colors text-sm md:text-base"
            >
              <span className="border-b-2 border-slate-900 dark:border-white group-hover:border-accent transition-colors">Browse Full Showroom</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-96 rounded-3xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
              ))}
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
            >
              {featuredCars.map((car) => (
                <motion.div key={car.id} variants={itemVariants} className="h-full">
                  <CarCard car={car} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Modern Search/Filter Experience */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900 border-y border-slate-100 dark:border-white/5 relative overflow-hidden">
        {/* Subtle grid/glow background effect for dark mode */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20viewBox=%220%200%20200%20200%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter%20id=%22noiseFilter%22%3E%3CfeTurbulence%20type=%22fractalNoise%22%20baseFrequency=%220.65%22%20numOctaves=%223%22%20stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect%20width=%22100%25%22%20height=%22100%25%22%20filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')] opacity-[0.03] dark:opacity-[0.05] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto section-padding relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold text-slate-900 dark:text-white mb-4">Precision Search</h2>
            <p className="text-slate-500 dark:text-slate-400">Filter through our elite fleet with absolute detail</p>
          </div>
          <div className="card !bg-white/80 dark:!bg-slate-800/80 p-8 rounded-[2.5rem] shadow-premium border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl">
            <SearchFilter />
          </div>
        </div>
      </section>

      {/* Why SS MOTORS Section - Redesigned */}
      <section className="py-32 bg-white dark:bg-slate-900 overflow-hidden relative">
        <div className="max-w-7xl mx-auto section-padding relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-4">Unparalleled Service</h2>
            <div className="w-24 h-1.5 bg-accent mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              {
                icon: Shield,
                title: 'Quality Assured',
                description: '300-point rigorous technical inspection for every vehicle.',
              },
              {
                icon: Clock,
                title: 'Rapid Financing',
                description: 'Seamless financial approvals in under 24 hours with elite partners.',
              },
              {
                icon: Award,
                title: 'Market Leaders',
                description: 'Voted #1 premium dealership for 3 consecutive years.',
              },
              {
                icon: Star,
                title: 'Platinum Care',
                description: 'Exclusive 2-year comprehensive warranty coverage included.',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="mb-6 w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-accent transition-all duration-500 group-hover:rotate-6">
                  <feature.icon className="h-8 w-8 text-accent group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ultra CTA Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="relative rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-slate-900 p-8 md:p-24 text-center">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920')] bg-cover bg-fixed opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-r from-accent/40 to-blue-600/40 mix-blend-multiply" />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-6xl font-display font-bold text-white mb-6 leading-[1.1]">
                Your Automotive Legacy <br className="hidden md:block" /> Starts Here
              </h2>
              <p className="text-blue-100/80 mb-10 md:mb-12 max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed">
                Join our exclusive circle of owners and experience the future of transportation today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
                <Link
                  to="/cars"
                  className="bg-white text-slate-900 px-8 md:px-10 py-4 rounded-xl font-bold hover:bg-accent hover:text-white transition-all shadow-xl hover:-translate-y-1 block"
                >
                  Start Your Journey
                </Link>
                <Link
                  to="/contact"
                  className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 md:px-10 py-4 rounded-xl font-bold hover:bg-white hover:text-slate-900 transition-all block"
                >
                  Schedule Consultation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
