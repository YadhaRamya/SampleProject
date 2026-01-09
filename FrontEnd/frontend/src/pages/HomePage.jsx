import React, { useEffect, useState, useRef, useCallback } from 'react';
import { 
    FaShoppingBag, FaBars, FaTimes, FaArrowUp, FaStar, FaTruck, 
    FaShieldAlt, FaHeadset, FaUser, FaUserShield, FaChevronDown, 
    FaPhone, FaEnvelope, FaFacebook, FaInstagram, FaTwitter, FaArrowRight 
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

/**
 * Professional Interactive E-commerce Site
 * Palette: Slate-900 (Primary), Amber-500 (Accent), Gray-50 (Neutral)
 */
const useIntersectionObserver = (options) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.unobserve(entry.target);
            }
        }, options);
        if (ref.current) observer.observe(ref.current);
        return () => { if (ref.current) observer.unobserve(ref.current); };
    }, [options]);

    return [ref, isVisible];
};

const EcommerceSite = () => {
    const navigate = useNavigate();
    const [isNavScrolled, setIsNavScrolled] = useState(false);
    const [isMobileMenuActive, setIsMobileMenuActive] = useState(false);
    const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
    const [isScrollTopVisible, setIsScrollTopVisible] = useState(false);
    
    const [heroRef, isHeroVisible] = useIntersectionObserver({ threshold: 0.1 });
    const [productsRef, isProductsVisible] = useIntersectionObserver({ threshold: 0.1 });

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            setIsNavScrolled(scrollTop > 50);
            setIsScrollTopVisible(scrollTop > 300);
        };
        const closeDropdown = () => setIsLoginDropdownOpen(false);
        
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('click', closeDropdown);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('click', closeDropdown);
        };
    }, []);

    const scrollToSection = useCallback((id) => {
        const element = document.getElementById(id);
        if (element) {
            window.scrollTo({ top: element.offsetTop - 80, behavior: 'smooth' });
        }
        setIsMobileMenuActive(false);
    }, []);

    const products = [
        { id: 1, name: "Elite Wireless Studio", price: "$349", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800", tag: "Limited Edition" },
        { id: 2, name: "Apex Smart Chrono", price: "$225", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800", tag: "New Arrival" },
        { id: 3, name: "Lumix Pro Series", price: "$1,450", image: "https://images.unsplash.com/photo-1526170315836-e55473ef5aa8?w=800", tag: "Best Seller" },
    ];

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-amber-200">
            
            {/* Top Bar - Professional Contact Header */}
            <div className="hidden lg:block bg-slate-900 py-2 border-b border-slate-800">
                <div className="container mx-auto px-6 flex justify-between items-center text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">
                    <div className="flex gap-6">
                        <span className="flex items-center gap-2"><FaPhone className="text-amber-500"/> +1 800 LUXE 00</span>
                        <span className="flex items-center gap-2"><FaEnvelope className="text-amber-500"/> concierge@luxemart.com</span>
                    </div>
                    <span>Global Express Shipping Available</span>
                </div>
            </div>

            {/* Navigation Bar */}
            <nav className={`fixed top-0 lg:top-10 left-0 right-0 z-50 transition-all duration-700 ${
                isNavScrolled ? 'lg:top-0 bg-white/90 backdrop-blur-md shadow-2xl py-3' : 'bg-transparent py-6'
            }`}>
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <button onClick={() => scrollToSection('home')} className="flex items-center text-2xl font-black tracking-tighter group">
                        <div className="bg-slate-900 p-2 rounded-lg mr-2 group-hover:rotate-12 transition-transform duration-500">
                            <FaShoppingBag className="text-amber-500 text-xl" />
                        </div>
                        LUXE<span className="text-amber-600">MART</span>
                    </button>
                    
                    <ul className="hidden lg:flex space-x-12 items-center">
                        {['home', 'about', 'contact'].map(id => (
                            <li key={id}>
                                <button onClick={() => scrollToSection(id)} className="text-[11px] uppercase tracking-[0.3em] font-black text-slate-600 hover:text-amber-600 transition-all relative group">
                                    {id}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 transition-all duration-300 group-hover:w-full"></span>
                                </button>
                            </li>
                        ))}
                        
                        {/* Interactive Account Dropdown */}
                        <li className="relative group">
                            <button 
                                onClick={(e) => { e.stopPropagation(); setIsLoginDropdownOpen(!isLoginDropdownOpen); }}
                                className="flex items-center px-8 py-3 bg-slate-900 text-amber-500 text-[11px] font-black tracking-[0.2em] rounded-full hover:bg-slate-800 hover:shadow-xl hover:shadow-amber-500/20 transition-all border border-slate-700"
                            >
                                ACCOUNT <FaChevronDown className={`ml-3 transition-transform duration-500 ${isLoginDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isLoginDropdownOpen && (
                                <div className="absolute right-0 mt-4 w-64 bg-slate-900 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-800 p-2 overflow-hidden animate-fadeInUp">
                                    <button onClick={() => navigate('/user-login')} className="flex items-center w-full px-6 py-4 text-left hover:bg-slate-800 text-slate-300 font-bold text-sm transition-all rounded-2xl group">
                                        <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center mr-4 group-hover:bg-amber-500 group-hover:text-slate-900 transition-all">
                                            <FaUser />
                                        </div>
                                        Customer Login
                                    </button>
                                    <button onClick={() => navigate('/admin-login')} className="flex items-center w-full px-6 py-4 text-left hover:bg-slate-800 text-slate-300 font-bold text-sm transition-all rounded-2xl group">
                                        <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center mr-4 group-hover:bg-amber-500 group-hover:text-slate-900 transition-all">
                                            <FaUserShield />
                                        </div>
                                        Staff Portal
                                    </button>
                                </div>
                            )}
                        </li>
                    </ul>

                    <button className="lg:hidden text-slate-900 text-2xl" onClick={() => setIsMobileMenuActive(true)}>
                        <FaBars />
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section id="home" className="relative pt-40 pb-24 lg:pt-64 lg:pb-48 bg-slate-50 overflow-hidden" ref={heroRef}>
                <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-900/5 -skew-x-12 transform origin-top translate-x-1/2"></div>
                <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
                    <div className={`space-y-10 transition-all duration-1000 ${isHeroVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}>
                        <div className="inline-flex items-center py-2 px-5 rounded-full bg-white border border-slate-200 shadow-sm">
                            <span className="flex h-2 w-2 rounded-full bg-amber-500 mr-3 animate-pulse"></span>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">New Collection 2026</span>
                        </div>
                        <h1 className="text-7xl lg:text-9xl font-black text-slate-900 leading-[0.85] tracking-tighter">
                            Pure <br /><span className="text-amber-500">Elegance.</span>
                        </h1>
                        <p className="text-lg text-slate-500 max-w-lg leading-relaxed font-medium">
                            Experience the intersection of high-end craftsmanship and modern technology. Our curated catalog defines the next generation of luxury.
                        </p>
                        <div className="flex gap-4">
                            <button className="px-12 py-5 bg-slate-900 text-amber-500 rounded-2xl font-black text-xs tracking-widest hover:scale-105 transition-all shadow-2xl shadow-slate-900/20 flex items-center gap-3">
                                SHOP NOW <FaArrowRight />
                            </button>
                        </div>
                    </div>
                    <div className={`relative transition-all duration-1000 delay-300 ${isHeroVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                        <div className="absolute -inset-10 bg-amber-500/10 rounded-full blur-[100px]"></div>
                        <img 
                            src="https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1200" 
                            alt="Hero" 
                            className="relative rounded-[40px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] object-cover" 
                        />
                    </div>
                </div>
            </section>

            {/* Product Grid Section */}
            <section id="about" className="py-32 bg-white" ref={productsRef}>
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                        <div className="space-y-4">
                            <h2 className="text-amber-600 text-xs font-black uppercase tracking-[0.5em]">The Catalog</h2>
                            <h3 className="text-5xl font-black text-slate-900">Iconic Pieces</h3>
                        </div>
                        <div className="flex gap-4">
                            {['All', 'Audio', 'Watches', 'Camera'].map(cat => (
                                <button key={cat} className="px-6 py-2 rounded-full border border-slate-100 text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-amber-500 transition-all">{cat}</button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-12">
                        {products.map((p, i) => (
                            <div key={p.id} className={`group relative transition-all duration-1000 ${isProductsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`} style={{ transitionDelay: `${i * 200}ms` }}>
                                <div className="relative overflow-hidden rounded-[32px] bg-slate-50 aspect-[4/5] mb-8 group-hover:shadow-2xl group-hover:shadow-slate-200 transition-all duration-500">
                                    <div className="absolute top-6 left-6 z-10 bg-slate-900 text-amber-500 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">
                                        {p.tag}
                                    </div>
                                    <img src={p.image} alt={p.name} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-1000 grayscale-[0.2] group-hover:grayscale-0" />
                                    
                                    {/* Quick Action Overlay */}
                                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center translate-y-10 group-hover:translate-y-0 transition-transform">
                                        <button className="bg-amber-500 text-slate-900 px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl">Add To Cart</button>
                                    </div>
                                </div>
                                <h4 className="text-2xl font-black text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">{p.name}</h4>
                                <div className="flex items-center gap-4">
                                    <span className="text-slate-400 font-bold line-through text-sm">$1,999</span>
                                    <span className="text-slate-900 font-black text-xl">{p.price}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Premium Contact Section */}
            <section id="contact" className="py-32 bg-slate-900 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-96 h-96 border-[40px] border-amber-500 rounded-full translate-x-1/2 -translate-y-1/2"></div>
                </div>
                <div className="container mx-auto px-6 text-center relative z-10">
                    <h2 className="text-5xl lg:text-7xl font-black text-white mb-10 tracking-tighter">Inquiries & <br /><span className="text-amber-500">Bespoke Orders</span></h2>
                    <p className="text-slate-400 mb-16 max-w-2xl mx-auto text-lg leading-relaxed">Our consultants are available for personalized shopping experiences and bulk commercial procurement.</p>
                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        <div className="bg-slate-800 p-10 rounded-[32px] border border-slate-700 hover:border-amber-500 transition-all group">
                            <FaPhone className="text-4xl text-amber-500 mb-6 mx-auto group-hover:scale-110 transition-transform" />
                            <h4 className="text-white font-black text-xl mb-2">Speak With Us</h4>
                            <p className="text-slate-400">+1 800 LUXE 00</p>
                        </div>
                        <div className="bg-slate-800 p-10 rounded-[32px] border border-slate-700 hover:border-amber-500 transition-all group">
                            <FaEnvelope className="text-4xl text-amber-500 mb-6 mx-auto group-hover:scale-110 transition-transform" />
                            <h4 className="text-white font-black text-xl mb-2">Email Our Team</h4>
                            <p className="text-slate-400">concierge@luxemart.com</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Professional Footer */}
            <footer className="bg-white pt-32 pb-12">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-4 gap-20 mb-20">
                        <div className="col-span-1 lg:col-span-2 space-y-8">
                            <div className="text-3xl font-black text-slate-900 tracking-tighter">LUXEMART</div>
                            <p className="text-slate-500 max-w-sm text-sm leading-relaxed font-medium">Since 2021, we have defined the digital retail space by providing only the most authentic and high-performance lifestyle products to a global audience.</p>
                            <div className="flex gap-6">
                                <FaFacebook className="text-slate-300 hover:text-slate-900 transition-colors cursor-pointer text-xl" />
                                <FaInstagram className="text-slate-300 hover:text-slate-900 transition-colors cursor-pointer text-xl" />
                                <FaTwitter className="text-slate-300 hover:text-slate-900 transition-colors cursor-pointer text-xl" />
                            </div>
                        </div>
                        <div className="space-y-8">
                            <h5 className="font-black uppercase text-[10px] tracking-[0.4em] text-slate-900">Legal Portal</h5>
                            <ul className="space-y-4 text-sm text-slate-500 font-bold">
                                <li className="hover:text-amber-600 transition-all cursor-pointer">Terms of Service</li>
                                <li className="hover:text-amber-600 transition-all cursor-pointer">Data Privacy</li>
                                <li className="hover:text-amber-600 transition-all cursor-pointer">Shipping Policy</li>
                            </ul>
                        </div>
                        <div className="space-y-8">
                            <h5 className="font-black uppercase text-[10px] tracking-[0.4em] text-slate-900">Join The Circle</h5>
                            <div className="relative">
                                <input type="text" placeholder="your@email.com" className="w-full border-b-2 border-slate-100 py-3 outline-none focus:border-amber-500 transition-all text-sm font-bold" />
                                <button className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-900 font-black text-[10px] uppercase tracking-widest">Sign Up</button>
                            </div>
                        </div>
                    </div>
                    <div className="pt-12 border-t border-slate-100 flex flex-col md:row justify-between items-center gap-6">
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">&copy; 2026 LUXEMART ENTERPRISE. ALL RIGHTS RESERVED.</p>
                        <div className="flex gap-4 items-center grayscale opacity-30">
                            <FaShieldAlt className="text-2xl" />
                            <FaTruck className="text-2xl" />
                        </div>
                    </div>
                </div>
            </footer>

            {/* Professional Scroll Top */}
            <button 
                className={`fixed bottom-10 right-10 w-16 h-16 bg-slate-900 text-amber-500 rounded-2xl shadow-2xl transition-all duration-700 flex items-center justify-center z-50 group border border-slate-700 ${
                    isScrollTopVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                }`}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
                <FaArrowUp className="group-hover:-translate-y-2 transition-transform duration-500" />
            </button>
        </div>
    );
}

export default EcommerceSite;