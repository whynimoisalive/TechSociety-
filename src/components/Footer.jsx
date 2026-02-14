import React, { useState, useEffect } from 'react';

const Footer = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    // Hide footer on scroll down, show on scroll up
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
        <footer
            className="ticker-wrap"
            style={{
                transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
                transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
        >
            <div className="ticker">
                <span className="ticker-item">↗ New Hackathon Announced for March 2026</span>
                <span className="ticker-item">•</span>
                <span className="ticker-item">↗ Congrats to our AI Team for winning the State Finals</span>
                <span className="ticker-item">•</span>
                <span className="ticker-item">↗ Recruitment Drive Open: Designers, Developers, and Visionaries Needed</span>
                <span className="ticker-item">•</span>
                <span className="ticker-item">↗ Tech Society Podcast Ep. 42 is live</span>
                <span className="ticker-item">•</span>
                <span className="ticker-item">↗ Workshop: Introduction to Quantum Computing this Friday</span>
                <span className="ticker-item">•</span>
                {/* Duplicate items for seamless loop */}
                <span className="ticker-item">↗ New Hackathon Announced for March 2026</span>
                <span className="ticker-item">•</span>
                <span className="ticker-item">↗ Congrats to our AI Team for winning the State Finals</span>
                <span className="ticker-item">•</span>
                <span className="ticker-item">↗ Recruitment Drive Open: Designers, Developers, and Visionaries Needed</span>
                <span className="ticker-item">•</span>
                <span className="ticker-item">↗ Tech Society Podcast Ep. 42 is live</span>
                <span className="ticker-item">•</span>
                <span className="ticker-item">↗ Workshop: Introduction to Quantum Computing this Friday</span>
            </div>
        </footer>
    );
};

export default Footer;
