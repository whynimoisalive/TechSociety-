import React from 'react';

const Hero = () => {
    return (
        <section
            style={{
                position: 'relative',
                marginTop: '85px', // Push hero below the fixed header
                display: 'grid',
                placeItems: 'center',
                width: '100%',
            }}
        >
            {/* Hero Image - Controls Section Height */}
            <img
                src="/Picsart_26-02-07_22-36-34-658.png"
                alt="Tech Society Hero"
                style={{
                    gridColumn: '1 / -1',
                    gridRow: '1 / -1',
                    width: '95%',
                    height: 'auto',
                    objectFit: 'contain',
                    zIndex: 1,
                }}
            />

            {/* Content Overlay */}
            <div style={{
                gridColumn: '1 / -1',
                gridRow: '1 / -1',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: '0 1rem',
                width: '100%',
                height: '100%', // Ensure it covers the same area
            }}>
                {/* Date/Tagline */}
                <div className="fade-in-up delay-100" style={{ marginBottom: '1.5rem' }}>
                    <p style={{
                        fontSize: '0.9rem',
                        fontFamily: "'Bodoni Moda', serif",
                        letterSpacing: '0.3em',
                        color: '#414eb6',
                        textTransform: 'uppercase',
                    }}>
                        EST • MMXXV
                    </p>
                </div>

                {/* Main Title */}
                <div className="fade-in-up delay-200" style={{ position: 'relative', zIndex: 10 }}>
                    <h1 style={{
                        fontFamily: "'Bodoni Moda', serif",
                        fontSize: 'clamp(6rem, 10vw, 8rem)',
                        lineHeight: 0.9,
                        color: '#414eb6',
                        margin: 0,
                    }}>
                        <span style={{ display: 'block' }}>TECH</span>
                        <span style={{ display: 'block', fontStyle: 'italic', fontWeight: 300 }}>SOCIETY</span>
                    </h1>
                </div>

                {/* Subtitle */}
                <div className="fade-in-up delay-300" style={{ marginTop: '2rem', maxWidth: '500px' }}>
                    <p style={{
                        color: '#414eb6',
                        fontWeight: 500,
                        fontSize: 'clamp(0.75rem, 2vw, 1rem)',
                        lineHeight: 1.6,
                        padding: '0.5rem',
                        borderRadius: '4px',
                    }}>
                        INNOVATING THE PRESENT TO ARCHITECT THE HISTORY OF TOMORROW.
                    </p>
                </div>

                {/* Animated Arrow */}
                <div
                    className="fade-in-up delay-300"
                    style={{
                        marginTop: '3rem', // Add spacing since it's now in flow or we can keep absolute but relative to this wrapper
                        color: '#1E3A8A',
                        animation: 'bounce 2s infinite',
                    }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
                    </svg>
                </div>
            </div>

            <style>{`
                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
                    40% { transform: translateX(-50%) translateY(-10px); }
                    60% { transform: translateX(-50%) translateY(-5px); }
                }
            `}</style>
        </section>
    );
};

export default Hero;
