import React, { useState, useEffect } from 'react';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Hide header on scroll down, show on scroll up
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling down & past threshold
                setIsVisible(false);
            } else {
                // Scrolling up
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    return (
        <header style={{
            position: 'fixed',
            top: isVisible ? 0 : '-100px',
            left: 0,
            width: '100%',
            boxSizing: 'border-box',
            zIndex: 1000,
            backgroundColor: 'rgba(219, 216, 222, 0.95)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(30, 58, 138, 0.1)',
            padding: '1.5rem 0',
            transition: 'top 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
            <nav style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '95%',
                maxWidth: 'none',
                margin: '0 auto',
            }}>
                {/* Left Links - Desktop */}
                <div style={{
                    display: 'flex',
                    gap: '2rem',
                    fontSize: '1rem',
                    fontWeight: 500,
                    letterSpacing: '0.05em',
                }}>
                    <a href="#" className="nav-link">Projects</a>
                    <a href="#" className="nav-link">Team</a>
                    <a href="#" className="nav-link">Events</a>
                    <a href="#" className="nav-link">Manifesto</a>
                    <a href="#" className="nav-link">Contact</a>
                </div>

                {/* Center Logo */}
                <div style={{
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    textAlign: 'center',
                }}>
                    <div style={{
                        fontFamily: "'Bodoni Moda', serif",
                        fontWeight: 500,
                        fontSize: '2.2rem',
                        lineHeight: 1,
                        letterSpacing: '0.1em',
                        color: '#000000',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}>
                        <span>IIT</span>
                        <span style={{ fontSize: '0.7rem', letterSpacing: '0.3em' }}>MADRAS</span>
                    </div>
                </div>

                {/* Right Action */}
                <div>
                    <a
                        href="#"
                        className="join-btn"
                    >
                        Join Us
                    </a>
                </div>
            </nav>

            {/* Mobile Menu Button - Hidden on desktop */}
            <button
                onClick={toggleMenu}
                style={{
                    display: 'none', // Show only on mobile via media query
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    color: '#1E3A8A',
                }}
            >
                ☰
            </button>
        </header>
    );
};

export default Header;
