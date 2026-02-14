import React, { useEffect, useState } from 'react';

const BelowHero = () => {
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setOffset(window.pageYOffset);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <section style={{
            backgroundColor: '#d9d8dd',
            padding: '100px 5%',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            gap: '80px',
            overflow: 'hidden', // Prevent scrollbar from parallax movement
        }}>
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
                <div style={{
                    gridColumn: 'span 6', // Increased from 5 to 6
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    // Parallax effect on the wrapper
                    transform: `scale(1) translateY(${offset * 0.1 - 70}px) translateX(-5%)`,
                    transition: 'transform 0.1s linear',
                    transformOrigin: 'center',
                }}>
                    <img
                        src="/belowherosection.png"
                        alt="Satellite illustration"
                        style={{
                            width: '100%',
                            maxWidth: '900px', // Increased 1.5x from 600px
                            height: 'auto',
                            objectFit: 'contain',
                            animation: 'wobble-float 6s ease-in-out infinite',
                            transformOrigin: 'top left', // Anchor to corner for wobble effect
                        }}
                    />
                </div>

                {/* Right Side - Text Content */}
                <div style={{
                    gridColumn: 'span 6', // Decreased from 7 to 6
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    paddingLeft: '40px', // Reduced padding
                    position: 'relative',
                    zIndex: 10,
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '24px',
                    }}>
                        <h2 style={{
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

                        <p style={{
                            fontFamily: "'StampatelloFaceto', cursive",
                            fontSize: '1.2rem', // Slightly larger for readability
                            lineHeight: 1.7,
                            color: '#414eb6',
                            fontWeight: 400,
                        }}>
                            Tech Society IITM brings curious minds together to explore, prototype, and ship practical technology. We support campus teams, guide budding developers, and keep IITM's digital presence reliable and accessible. We believe learning should move beyond theory into real execution. Our goal is to create an environment where students build systems that people actually use. From beginners writing their first programs to experienced members deploying full-scale applications, we create a clear path for growth.
                        </p>

                        <p style={{
                            fontFamily: "'StampatelloFaceto', cursive",
                            fontSize: '1.2rem',
                            lineHeight: 1.7,
                            color: '#414eb6',
                            fontWeight: 400,
                        }}>
                            The society bridges curiosity and capability through structured learning, hands-on build sessions, and real-world projects. Members learn how to plan, collaborate, debug, and deliver reliable solutions. We focus on impact by building tools that solve real IITM needs, improve student services, and strengthen campus operations. Reliability, performance, and usability are treated as essential engineering standards.
                        </p>

                        <p style={{
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
