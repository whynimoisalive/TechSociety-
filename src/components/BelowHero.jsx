import React, { useEffect, useRef } from 'react';

const BelowHero = () => {
    const imgWrapperRef = useRef(null);
    const rafRef = useRef(null);

    useEffect(() => {
        let ticking = false;

        const updateParallax = () => {
            if (imgWrapperRef.current) {
                const offset = window.pageYOffset;
                imgWrapperRef.current.style.transform =
                    `translateY(${offset * 0.1 - 70}px) translateX(-5%) translateZ(0)`;
            }
            ticking = false;
        };

        const handleScroll = () => {
            if (!ticking) {
                rafRef.current = requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return (
        <section className="below-hero-section" style={{
            backgroundColor: '#d9d8dd',
            padding: '100px 5%',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            gap: '80px',
            overflow: 'hidden',
        }}>
            <style>{`
                @media (max-width: 1440px) and (max-height: 900px) {
                    .below-hero-section {
                        padding: 60px 5% !important;
                        gap: 50px !important;
                        min-height: auto !important;
                    }
                    .below-hero-heading {
                        font-size: clamp(2.2rem, 5vw, 3.5rem) !important;
                    }
                    .below-hero-text {
                        font-size: 1rem !important;
                    }
                }
                @media (max-height: 768px) {
                    .below-hero-section {
                        padding: 40px 5% !important;
                        gap: 40px !important;
                    }
                    .below-hero-heading {
                        font-size: clamp(2rem, 4vw, 3rem) !important;
                    }
                    .below-hero-text {
                        font-size: 0.9rem !important;
                    }
                }
            `}</style>
            {/* Main Content Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(12, 1fr)',
                gap: '40px',
                maxWidth: '1400px',
                margin: '0 auto',
                width: '100%',
                position: 'relative',
            }}>
                {/* Left Side - Satellite Image */}
                <div
                    ref={imgWrapperRef}
                    style={{
                        gridColumn: 'span 6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transform: 'translateY(-70px) translateX(-5%) translateZ(0)',
                        transformOrigin: 'center',
                        willChange: 'transform',
                    }}
                >
                    <img
                        src="/belowherosection.png"
                        alt="Satellite illustration"
                        loading="lazy"
                        decoding="async"
                        style={{
                            width: '100%',
                            maxWidth: '900px',
                            height: 'auto',
                            objectFit: 'contain',
                            animation: 'wobble-float 6s ease-in-out infinite',
                            transformOrigin: 'top left',
                            willChange: 'transform',
                        }}
                    />
                </div>

                {/* Right Side - Text Content */}
                <div style={{
                    gridColumn: 'span 6',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    paddingLeft: '40px',
                    position: 'relative',
                    zIndex: 10,
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '24px',
                    }}>
                        <h2 className="below-hero-heading" style={{
                            fontFamily: "'StampatelloFaceto', cursive",
                            fontSize: 'clamp(3rem, 6vw, 5rem)',
                            lineHeight: 1,
                            color: '#414eb6',
                            fontWeight: 400,
                            marginBottom: '16px',
                            letterSpacing: '0.05em',
                        }}>
                            Our Mission
                        </h2>

                        <p className="below-hero-text" style={{
                            fontFamily: "'StampatelloFaceto', cursive",
                            fontSize: '1.2rem',
                            lineHeight: 1.7,
                            color: '#414eb6',
                            fontWeight: 400,
                        }}>
                            Tech Society IITM brings curious minds together to explore, prototype, and ship practical technology. We support campus teams, guide budding developers, and keep IITM's digital presence reliable and accessible. We believe learning should move beyond theory into real execution. Our goal is to create an environment where students build systems that people actually use. From beginners writing their first programs to experienced members deploying full-scale applications, we create a clear path for growth.
                        </p>

                        <p className="below-hero-text" style={{
                            fontFamily: "'StampatelloFaceto', cursive",
                            fontSize: '1.2rem',
                            lineHeight: 1.7,
                            color: '#414eb6',
                            fontWeight: 400,
                        }}>
                            The society bridges curiosity and capability through structured learning, hands-on build sessions, and real-world projects. Members learn how to plan, collaborate, debug, and deliver reliable solutions. We focus on impact by building tools that solve real IITM needs, improve student services, and strengthen campus operations. Reliability, performance, and usability are treated as essential engineering standards.
                        </p>

                        <p className="below-hero-text" style={{
                            fontFamily: "'StampatelloFaceto', cursive",
                            fontSize: '1.2rem',
                            lineHeight: 1.7,
                            color: '#414eb6',
                            fontWeight: 400,
                        }}>
                            Through mentorship, peer learning, hackathons, and technical sessions, we prepare students to think and work like real developers. Learn fast. Build often. Ship what matters.
                        </p>
                    </div>
                </div>
            </div>


        </section>
    );
};

export default BelowHero;
