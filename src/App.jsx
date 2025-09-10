import React, { useState, useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser'; // <-- Add this import
import Modal from './Modal'; // Import the new Modal component

// Data for sections - makes the JSX cleaner and easier to manage
const benefits = [
    {
        icon: <svg className="h-8 w-8 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962a3.75 3.75 0 015.25 0m-5.25 0a3.75 3.75 0 00-5.25 0M3 13.5a9 9 0 0118 0v2.25a9 9 0 01-18 0v-2.25z" /></svg>,
        title: "Reach More Customers",
        description: "Tap into our vast user base and expand your reach beyond your local neighborhood."
    },
    {
        icon: <svg className="h-8 w-8 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>,
        title: "Easy Management",
        description: "A simple dashboard to manage your menu, orders, and customer subscriptions effortlessly."
    },
    {
        icon: <svg className="h-8 w-8 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 21z" /></svg>,
        title: "Timely Payments",
        description: "Get reliable, automated payments directly to your bank account with transparent reports."
    },
    {
        icon: <svg className="h-8 w-8 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 01-4.5-4.5v-4.5a4.5 4.5 0 014.5-4.5h7.5a4.5 4.5 0 014.5 4.5v4.5a4.5 4.5 0 01-4.5 4.5h-.75m-9-3.75h9.5m-9.5 0a2.25 2.25 0 01-2.25-2.25v-1.5a2.25 2.25 0 012.25-2.25h13.5a2.25 2.25 0 012.25 2.25v1.5a2.25 2.25 0 01-2.25-2.25m-13.5 0v-3.75" /></svg>,
        title: "Marketing Support",
        description: "Benefit from our marketing campaigns that put your tiffin service in the spotlight."
    }
];

const testimonials = [
    {
        quote: "Joining Rasoi Rider was the best decision for my tiffin service. My orders have tripled in just three months! The platform is so easy to use, and I can focus entirely on my passion for cooking.",
        author: "Anita Das",
        location: "Anita's Kitchen, Kalinga Nagar",
        avatar: "https://placehold.co/100x100/f87171/ffffff?text=Ani"
    },
    {
        quote: "I was worried about the technology part, but the Rasoi Rider team handled everything. Now I get a steady stream of subscribers without any marketing hassle. The weekly payments are always on time.",
        author: "Sourav",
        location: "Souvi's Homely Meals, Saheed Nagar",
        avatar: "https://placehold.co/100x100/60a5fa/ffffff?text=Souvi"
    },
    {
        quote: "The support from Rasoi Rider is fantastic. They helped me design my menu and pricing. My little kitchen now feels like a professional business reaching customers all over BBSR.",
        author: "Laxmi Mausi",
        location: "Mo Kitchen, Nayapalli",
        avatar: "https://placehold.co/100x100/34d399/ffffff?text=Laxmi"
    }
];

// App Component
const App = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const sliderRef = useRef(null);

    // Form state management
    const [formData, setFormData] = useState({
        serviceName: '',
        contactPerson: '',
        phone: '',
        email: '',
        city: '',
    });
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalState, setModalState] = useState({
        isOpen: false,
        type: '', // 'success' or 'error'
        message: ''
    });

    const form = useRef();
    // Testimonial slider effect
    useEffect(() => {
        const slideInterval = setInterval(() => {
            setCurrentSlide(prevSlide => (prevSlide + 1) % testimonials.length);
        }, 5000);

        return () => clearInterval(slideInterval);
    }, []);

    useEffect(() => {
        if (sliderRef.current) {
            sliderRef.current.style.transform = `translateX(-${currentSlide * 100}%)`;
        }
    }, [currentSlide]);

    // Form handling logic
    const validateField = (name, value) => {
        let error = '';
        switch (name) {
            case 'serviceName':
            case 'contactPerson':
            case 'city':
                if (!value.trim()) error = `${name.replace(/([A-Z])/g, ' $1').toLowerCase()} is required.`;
                break;
            case 'phone':
                if (!/^[0-9]{10}$/.test(value)) error = 'Please enter a valid 10-digit phone number.';
                break;
            case 'email':
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Please enter a valid email address.';
                break;
            default:
                break;
        }
        return error;
    };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (formErrors[name]) {
            setFormErrors({ ...formErrors, [name]: validateField(name, value) });
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        setFormErrors({ ...formErrors, [name]: error });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = Object.keys(formData).reduce((acc, key) => {
            const error = validateField(key, formData[key]);
            if (error) acc[key] = error;
            return acc;
        }, {});

        setFormErrors(errors);

        if (Object.keys(errors).length === 0) {
            setIsSubmitting(true);

            emailjs.sendForm(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                form.current,
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY
            )
            .then((result) => {
                console.log('SUCCESS!', result.text);
                setModalState({
                    isOpen: true,
                    type: 'success',
                    message: 'Your inquiry has been received. Our team will get in touch with you within 24 hours.'
                });
                // Reset form after successful submission
                setFormData({ serviceName: '', contactPerson: '', phone: '', email: '', city: '' });
            }, (error) => {
                console.log('FAILED...', error.text);
                setModalState({
                    isOpen: true,
                    type: 'error',
                    message: 'Failed to send your inquiry. Please check your connection and try again.'
                });
            })
            .finally(() => setIsSubmitting(false));
        }
    };

    return (
        <>
            <Modal
                isOpen={modalState.isOpen}
                onClose={() => setModalState({ ...modalState, isOpen: false })}
                title={modalState.type === 'success' ? 'Thank You!' : 'Submission Failed'}
                type={modalState.type}
            >
                <p>{modalState.message}</p>
            </Modal>
            {/* Styles are included here for single-file convenience */}
            <style>{`
                html {
                    scroll-behavior: smooth;
                }
                body {
                    font-family: 'Inter', sans-serif;
                }
                .hero-bg {
                    background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=2940&auto=format&fit=crop');
                    background-size: cover;
                    background-position: center;
                }
                .form-input {
                    transition: all 0.3s ease;
                }
                .form-input:focus {
                    box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.4);
                    border-color: #fb923c;
                }
                .cta-button {
                    transition: all 0.3s ease;
                }
                .cta-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                }
            `}</style>

            <div className="bg-gray-50 text-gray-800">
                {/* Header */}
                <header className="bg-white shadow-sm fixed w-full z-50">
                    <nav className="container mx-auto px-6 lg:px-8 py-4 flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                             <img src="/logo4.png" alt="Rasoi Rider Logo" className="h-10 w-10 rounded-full" />
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Rasoi Rider</h1>
                        </div>
                        <div className="hidden md:flex items-center space-x-6">
                            <a href="#benefits" className="text-gray-600 hover:text-orange-500">Benefits</a>
                            <a href="#how-it-works" className="text-gray-600 hover:text-orange-500">How It Works</a>
                            <a href="#testimonials" className="text-gray-600 hover:text-orange-500">Success Stories</a>
                            <a href="#contact" className="bg-orange-500 text-white font-semibold px-5 py-2 rounded-full cta-button">Partner With Us</a>
                        </div>
                        <div className="md:hidden">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-800 focus:outline-none">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                            </button>
                        </div>
                    </nav>
                    <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden px-6 lg:px-8 pt-2 pb-4 bg-white`}>
                        <a href="#benefits" className="block py-2 text-gray-600 hover:text-orange-500">Benefits</a>
                        <a href="#how-it-works" className="block py-2 text-gray-600 hover:text-orange-500">How It Works</a>
                        <a href="#testimonials" className="block py-2 text-gray-600 hover:text-orange-500">Success Stories</a>
                        <a href="#contact" className="block mt-2 bg-orange-500 text-white text-center font-semibold px-5 py-2 rounded-full cta-button">Partner With Us</a>
                    </div>
                </header>

                <main>
                    {/* Hero Section */}
                    <section className="hero-bg text-white pt-32 pb-20">
                        <div className="container mx-auto px-6 lg:px-8 text-center">
                            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-4">Grow Your Tiffin Business With Us</h2>
                            <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto mb-8 text-gray-200">Connect with thousands of hungry customers in your city. We handle the technology, marketing, and delivery logistics, so you can focus on what you do best: cooking delicious meals.</p>
                            <a href="#contact" className="bg-orange-500 text-white font-bold text-lg px-6 py-3 sm:px-8 sm:py-4 rounded-full inline-block cta-button">Inquire Now & Get Started</a>
                        </div>
                    </section>

                    {/* Benefits Section */}
                    <section id="benefits" className="py-16 sm:py-20 bg-white">
                        <div className="container mx-auto px-6 lg:px-8">
                            <div className="text-center mb-12">
                                <h3 className="text-3xl sm:text-4xl font-bold text-gray-800">Why Partner With Rasoi Rider?</h3>
                                <p className="text-gray-600 mt-2 max-w-2xl mx-auto">We provide the tools and support you need to succeed in the digital food landscape.</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                {benefits.map((benefit, index) => (
                                    <div key={index} className="bg-gray-50 p-6 sm:p-8 rounded-xl shadow-md text-center hover:shadow-xl transition-shadow duration-300">
                                        <div className="bg-orange-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                                            {benefit.icon}
                                        </div>
                                        <h4 className="text-xl font-semibold mb-2">{benefit.title}</h4>
                                        <p className="text-gray-600">{benefit.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                     {/* How It Works Section */}
                    <section id="how-it-works" className="py-16 sm:py-20">
                        <div className="container mx-auto px-6 lg:px-8">
                            <div className="text-center mb-12">
                                <h3 className="text-3xl sm:text-4xl font-bold text-gray-800">Getting Started is Easy</h3>
                                <p className="text-gray-600 mt-2">Just a few simple steps to join our network.</p>
                            </div>
                            <div className="flex flex-col md:flex-row justify-center items-center md:space-x-8 lg:space-x-16 space-y-8 md:space-y-0">
                                <div className="flex flex-col items-center text-center max-w-xs">
                                    <div className="bg-orange-500 text-white font-bold rounded-full h-16 w-16 flex items-center justify-center text-2xl mb-4">1</div>
                                    <h4 className="text-xl font-semibold mb-2">Inquire & Sign Up</h4>
                                    <p className="text-gray-600">Fill out the form below. Our team will contact you to complete the simple onboarding process.</p>
                                </div>
                                <div className="hidden md:block h-1 w-16 lg:w-24 bg-gray-200"></div>
                                <div className="flex flex-col items-center text-center max-w-xs">
                                    <div className="bg-orange-500 text-white font-bold rounded-full h-16 w-16 flex items-center justify-center text-2xl mb-4">2</div>
                                    <h4 className="text-xl font-semibold mb-2">Set Up Your Menu</h4>
                                    <p className="text-gray-600">We'll help you list your tiffin plans and menu on our platform to attract customers.</p>
                                </div>
                                <div className="hidden md:block h-1 w-16 lg:w-24 bg-gray-200"></div>
                                <div className="flex flex-col items-center text-center max-w-xs">
                                    <div className="bg-orange-500 text-white font-bold rounded-full h-16 w-16 flex items-center justify-center text-2xl mb-4">3</div>
                                    <h4 className="text-xl font-semibold mb-2">Start Receiving Orders</h4>
                                    <p className="text-gray-600">Once live, you'll start getting orders from customers in your service area.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Success Stories Section */}
                    <section id="testimonials" className="py-16 sm:py-20 bg-orange-50">
                        <div className="container mx-auto px-6 lg:px-8">
                            <div className="text-center mb-12">
                                <h3 className="text-3xl sm:text-4xl font-bold text-gray-800">Success Stories from Our Partners</h3>
                                <p className="text-gray-600 mt-2 max-w-2xl mx-auto">Hear from home chefs who have grown their business with Rasoi Rider.</p>
                            </div>
                            <div className="relative max-w-xl lg:max-w-2xl mx-auto">
                                <div className="overflow-hidden rounded-lg bg-white shadow-md">
                                    <div ref={sliderRef} className="flex transition-transform duration-700 ease-in-out">
                                        {testimonials.map((testimonial, index) => (
                                            <div key={index} className="w-full flex-shrink-0">
                                                <figure className="max-w-screen-sm mx-auto text-center p-6 sm:p-8">
                                                    <svg className="w-8 h-8 mx-auto mb-3 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 14"><path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z"/></svg> 
                                                    <blockquote><p className="text-lg sm:text-xl italic font-medium text-gray-900">"{testimonial.quote}"</p></blockquote>
                                                    <figcaption className="flex items-center justify-center mt-6 space-x-3">
                                                        <img className="w-10 h-10 rounded-full" src={testimonial.avatar} alt="profile picture" />
                                                        <div className="flex items-center divide-x-2 divide-gray-500">
                                                            <cite className="pr-3 font-medium text-gray-900">{testimonial.author}</cite>
                                                            <cite className="pl-3 text-sm text-gray-500">{testimonial.location}</cite>
                                                        </div>
                                                    </figcaption>
                                                </figure>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex justify-center space-x-3 mt-8">
                                    {testimonials.map((_, index) => (
                                        <button key={index} onClick={() => setCurrentSlide(index)} className={`w-3 h-3 rounded-full ${currentSlide === index ? 'bg-orange-500' : 'bg-gray-300'} hover:bg-gray-400 transition-colors`} aria-label={`Go to slide ${index + 1}`}></button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Inquiry Form Section */}
                    <section id="contact" className="py-16 sm:py-20 bg-white">
                        <div className="container mx-auto px-6 lg:px-8">
                            <div className="md:flex md:items-center md:space-x-12">
                                <div className="md:w-1/2">
                                    <h3 className="text-3xl sm:text-4xl font-bold text-gray-800">Ready to Join Us?</h3>
                                    <p className="text-gray-600 mt-4 max-w-lg">Fill out this quick form, and one of our partnership managers will get in touch with you shortly to discuss the next steps. Let's grow your business together!</p>
                                    <div className="mt-8">
                                        <img src="./rasoi-rider-photo.png" alt="Happy chef in a kitchen" className="rounded-lg shadow-lg w-auto h-100 object-cover"/>
                                    </div>
                                </div>
                                <div className="md:w-1/2 mt-12 md:mt-0">
                                    <div className="bg-gray-50 p-6 sm:p-8 rounded-2xl shadow-lg">
                                        <form ref={form} onSubmit={handleSubmit} noValidate>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                <div>
                                                    <label htmlFor="serviceName" className="font-semibold text-gray-700 block mb-2">Tiffin Service Name</label>
                                                    <input type="text" id="serviceName" name="serviceName" value={formData.serviceName} onChange={handleInputChange} onBlur={handleBlur} className={`form-input block w-full px-4 py-3 bg-white border ${formErrors.serviceName ? 'border-red-500' : 'border-gray-300'} rounded-lg`} required />
                                                    <p className="text-red-500 text-sm mt-1 h-4">{formErrors.serviceName || ''}</p>
                                                </div>
                                                <div>
                                                    <label htmlFor="contactPerson" className="font-semibold text-gray-700 block mb-2">Your Name</label>
                                                    <input type="text" id="contactPerson" name="contactPerson" value={formData.contactPerson} onChange={handleInputChange} onBlur={handleBlur} className={`form-input block w-full px-4 py-3 bg-white border ${formErrors.contactPerson ? 'border-red-500' : 'border-gray-300'} rounded-lg`} required />
                                                    <p className="text-red-500 text-sm mt-1 h-4">{formErrors.contactPerson || ''}</p>
                                                </div>
                                            </div>
                                            <div className="mt-6">
                                                <label htmlFor="phone" className="font-semibold text-gray-700 block mb-2">Phone Number</label>
                                                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} onBlur={handleBlur} className={`form-input block w-full px-4 py-3 bg-white border ${formErrors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg`} required />
                                                 <p className="text-red-500 text-sm mt-1 h-4">{formErrors.phone || ''}</p>
                                            </div>
                                            <div className="mt-6">
                                                <label htmlFor="email" className="font-semibold text-gray-700 block mb-2">Email Address</label>
                                                <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} onBlur={handleBlur} className={`form-input block w-full px-4 py-3 bg-white border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg`} required />
                                                <p className="text-red-500 text-sm mt-1 h-4">{formErrors.email || ''}</p>
                                            </div>
                                            <div className="mt-6">
                                                <label htmlFor="city" className="font-semibold text-gray-700 block mb-2">City / Area of Operation</label>
                                                <input type="text" id="city" name="city" placeholder="e.g., Bhubaneswar, Odisha" value={formData.city} onChange={handleInputChange} onBlur={handleBlur} className={`form-input block w-full px-4 py-3 bg-white border ${formErrors.city ? 'border-red-500' : 'border-gray-300'} rounded-lg`} required />
                                                <p className="text-red-500 text-sm mt-1 h-4">{formErrors.city || ''}</p>
                                            </div>
                                            <div className="mt-8">
                                                <button type="submit" disabled={isSubmitting} className="w-full bg-orange-500 text-white font-bold py-4 px-6 rounded-lg cta-button flex items-center justify-center disabled:opacity-75 disabled:cursor-not-allowed">
                                                    {isSubmitting ? (
                                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                    ) : (
                                                        <span>Submit Inquiry</span>
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer className="bg-gray-800 text-white">
                    <div className="container mx-auto px-6 lg:px-8 py-10">
                        <div className="sm:flex sm:justify-between sm:items-center">
                            <div className="mb-8 sm:mb-0">
                                <h3 className="text-xl font-bold">Rasoi Rider</h3>
                                <p className="mt-2 text-gray-400">Connecting home chefs and tiffin services to customers everywhere.</p>
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <h4 className="text-lg font-semibold">Quick Links</h4>
                                    <ul className="mt-2 space-y-1">
                                        <li><a href="#benefits" className="text-gray-400 hover:text-white">Benefits</a></li>
                                        <li><a href="#how-it-works" className="text-gray-400 hover:text-white">How It Works</a></li>
                                        <li><a href="#testimonials" className="text-gray-400 hover:text-white">Stories</a></li>
                                        <li><a href="#contact" className="text-gray-400 hover:text-white">Contact Us</a></li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold">Connect With Us</h4>
                                    <p className="mt-2 text-gray-400">info@rasoirider.com</p>
                                    <p className="text-gray-400">Bhubaneswar, Odisha</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 border-t border-gray-700 pt-6 text-center text-gray-500">
                            <p>&copy; 2025 Rasoi Rider. All Rights Reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
};

export default App;
