import React, { useState, useEffect, useRef } from 'react';

/* ───────── letter-by-letter reveal ───────── */
const AnimatedText = ({ text, style, className = '' }) => {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true); },
            { threshold: 0.2 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    const words = text.split(' ');

    let globalIdx = 0;

    return (
        <span ref={ref} className={className} style={style}>
            {words.map((word, wi) => (
                <span key={wi} style={{ display: 'inline-block', whiteSpace: 'pre' }}>
                    {word.split('').map((ch) => {
                        const idx = globalIdx++;
                        return (
                            <span
                                key={idx}
                                style={{
                                    display: 'inline-block',
                                    opacity: visible ? 1 : 0,
                                    transform: visible ? 'translateY(0)' : 'translateY(40px)',
                                    transition: `opacity 0.5s cubic-bezier(0.16,1,0.3,1) ${idx * 0.035}s, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${idx * 0.035}s`,
                                }}
                            >
                                {ch}
                            </span>
                        );
                    })}
                    {wi < words.length - 1 && <span>&nbsp;</span>}
                </span>
            ))}
        </span>
    );
};

/* ───────── main component ───────── */
const ContactUs = () => {
    const [btnHover, setBtnHover] = useState(false);
    const [teamBtnHover, setTeamBtnHover] = useState(false);
    const [prevBtnHover, setPrevBtnHover] = useState(false);

    return (
        <>
            {/* ════════════════ TEAM SECTION ════════════════ */}
            <section style={{
                backgroundColor: '#d9d8dd',
                padding: '6rem 5%',
                borderTop: '1px solid rgba(30,58,138,0.1)',
            }}>
                {/* Leader */}
                <div style={{
                    borderTop: '1.5px solid #414eb6',
                    paddingTop: '2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '1rem',
                }}>
                    <div>
                        <h3 style={{
                            fontFamily: "'Bodoni Moda', serif",
                            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                            fontWeight: 400,
                            color: '#0a0a0a',
                            margin: 0,
                            lineHeight: 1,
                            textTransform: 'uppercase',
                        }}>
                            Nimish Shinde
                        </h3>
                        <p style={{
                            fontFamily: "'Bodoni Moda', serif",
                            fontSize: '0.85rem',
                            color: '#414eb6',
                            fontWeight: 600,
                            marginTop: '0.5rem',
                            letterSpacing: '0.02em',
                        }}>
                            Secretary
                        </p>
                    </div>
                    <span style={{
                        fontSize: '1.8rem',
                        color: '#0a0a0a',
                        lineHeight: 1,
                        cursor: 'pointer',
                    }}>↗</span>
                </div>

                {/* Deputy */}
                <div style={{
                    borderTop: '1px solid rgba(30,58,138,0.12)',
                    marginTop: '2.5rem',
                    paddingTop: '2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '1rem',
                }}>
                    <div>
                        <h3 style={{
                            fontFamily: "'Bodoni Moda', serif",
                            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                            fontWeight: 400,
                            color: '#0a0a0a',
                            margin: 0,
                            lineHeight: 1,
                            textTransform: 'uppercase',
                        }}>
                            Twisha Shriyam
                        </h3>
                        <p style={{
                            fontFamily: "'Bodoni Moda', serif",
                            fontSize: '0.85rem',
                            color: '#414eb6',
                            fontWeight: 600,
                            marginTop: '0.5rem',
                            letterSpacing: '0.02em',
                        }}>
                            Deputy Secretary
                        </p>
                    </div>
                    <span style={{
                        fontSize: '1.8rem',
                        color: '#0a0a0a',
                        lineHeight: 1,
                        cursor: 'pointer',
                    }}>↗</span>
                </div>

                {/* Sub-text + buttons */}
                <div style={{
                    borderTop: '1px solid rgba(30,58,138,0.08)',
                    marginTop: '3rem',
                    paddingTop: '2rem',
                }}>
                    <p style={{
                        fontFamily: "'Bodoni Moda', serif",
                        fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                        color: '#0a0a0a',
                        maxWidth: '460px',
                        lineHeight: 1.5,
                        marginBottom: '1.5rem',
                    }}>
                        A passionate team of builders, designers, and dreamers shaping the IITM BS tech story.
                    </p>

                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        {/* See Full Team */}
                        <a
                            href="#"
                            onMouseEnter={() => setTeamBtnHover(true)}
                            onMouseLeave={() => setTeamBtnHover(false)}
                            style={{
                                display: 'inline-block',
                                padding: '10px 28px',
                                fontFamily: "'Bodoni Moda', serif",
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                                color: '#0a0a0a',
                                textDecoration: 'none',
                                border: '1.5px solid #0a0a0a',
                                borderRadius: '28px',
                                background: teamBtnHover ? 'rgba(0,0,0,0.06)' : 'transparent',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                            }}
                        >
                            See Full Team
                        </a>

                        {/* See Previous Secretary */}
                        <a
                            href="#"
                            onMouseEnter={() => setPrevBtnHover(true)}
                            onMouseLeave={() => setPrevBtnHover(false)}
                            style={{
                                display: 'inline-block',
                                padding: '10px 28px',
                                fontFamily: "'Bodoni Moda', serif",
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                                color: '#414eb6',
                                textDecoration: 'none',
                                border: '1.5px solid #414eb6',
                                borderRadius: '28px',
                                background: prevBtnHover ? 'rgba(65,78,182,0.08)' : 'transparent',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                            }}
                        >
                            See Previous Secretary
                        </a>
                    </div>
                </div>
            </section>

            {/* ════════════════ WHAT HAVE WE DONE ════════════════ */}
            <section style={{
                backgroundColor: '#d9d8dd',
                padding: '6rem 5%',
                borderTop: '1px solid rgba(30,58,138,0.1)',
            }}>
                {/* Section header */}
                <div style={{
                    marginBottom: '3.5rem',
                }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.8rem' }}>
                        <h2 style={{
                            fontFamily: "'Bodoni Moda', serif",
                            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                            fontWeight: 400,
                            color: '#0a0a0a',
                            margin: 0,
                            lineHeight: 1,
                            textTransform: 'uppercase',
                        }}>
                            What Have We Done
                        </h2>
                        <span style={{ fontSize: '1.5rem', color: '#0a0a0a' }}>↗</span>
                    </div>
                    <p style={{
                        fontFamily: "'Bodoni Moda', serif",
                        fontSize: '0.85rem',
                        color: '#0a0a0a',
                        opacity: 0.7,
                        marginTop: '0.75rem',
                        maxWidth: '500px',
                    }}>
                        We could talk about ourselves but it's better to let the work speak.
                    </p>
                </div>

                {/* Project cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '2rem',
                }}>
                    {/* Card 1 */}
                    <div style={{
                        borderTop: '1.5px solid rgba(30,58,138,0.15)',
                        paddingTop: '1.5rem',
                    }}>
                        <p style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '0.7rem',
                            fontWeight: 500,
                            color: '#414eb6',
                            textTransform: 'uppercase',
                            letterSpacing: '0.15em',
                            marginBottom: '0.5rem',
                        }}>Election Portal</p>
                        <h4 style={{
                            fontFamily: "'Bodoni Moda', serif",
                            fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
                            fontWeight: 400,
                            color: '#0a0a0a',
                            lineHeight: 1.35,
                            margin: 0,
                        }}>
                            Built the official IITM BS Election Site   powering democratic student elections with 40,000+ students casting their votes seamlessly.
                        </h4>
                        <p style={{
                            fontFamily: "'Bodoni Moda', serif",
                            fontSize: '0.75rem',
                            color: '#0a0a0a',
                            opacity: 0.45,
                            marginTop: '1.5rem',
                            fontStyle: 'italic',
                        }}>
                            Trusted by the Student Government & Administration.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div style={{
                        borderTop: '1.5px solid rgba(30,58,138,0.15)',
                        paddingTop: '1.5rem',
                    }}>
                        <p style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '0.7rem',
                            fontWeight: 500,
                            color: '#414eb6',
                            textTransform: 'uppercase',
                            letterSpacing: '0.15em',
                            marginBottom: '0.5rem',
                        }}>Paradox</p>
                        <h4 style={{
                            fontFamily: "'Bodoni Moda', serif",
                            fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
                            fontWeight: 400,
                            color: '#0a0a0a',
                            lineHeight: 1.35,
                            margin: 0,
                        }}>
                            Designed, developed, and deployed the official Paradox website   a flagship Tech Society collaboration bringing the event to life online.
                        </h4>
                        <p style={{
                            fontFamily: "'Bodoni Moda', serif",
                            fontSize: '0.75rem',
                            color: '#0a0a0a',
                            opacity: 0.45,
                            marginTop: '1.5rem',
                            fontStyle: 'italic',
                        }}>
                            In collaboration with the Tech Society design & dev team.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div style={{
                        borderTop: '1.5px solid rgba(30,58,138,0.15)',
                        paddingTop: '1.5rem',
                    }}>
                        <p style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '0.7rem',
                            fontWeight: 500,
                            color: '#414eb6',
                            textTransform: 'uppercase',
                            letterSpacing: '0.15em',
                            marginBottom: '0.5rem',
                        }}>Student Activity Hub</p>
                        <h4 style={{
                            fontFamily: "'Bodoni Moda', serif",
                            fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
                            fontWeight: 400,
                            color: '#0a0a0a',
                            lineHeight: 1.35,
                            margin: 0,
                        }}>
                            Currently building the Student Activity Site   a unified platform where students can manage, discover, and track all student-related activities in one place.
                        </h4>
                        <p style={{
                            fontFamily: "'Bodoni Moda', serif",
                            fontSize: '0.75rem',
                            color: '#0a0a0a',
                            opacity: 0.45,
                            marginTop: '1.5rem',
                            fontStyle: 'italic',
                        }}>
                            Actively in development   launching soon.
                        </p>
                    </div>
                </div>
            </section>

            {/* ════════════════ CONTACT / CTA ════════════════ */}
            <section
                style={{
                    position: 'relative',
                    width: '100%',
                    overflow: 'hidden',
                    padding: '0 2.5%',
                    boxSizing: 'border-box',
                    backgroundColor: '#d9d8dd',
                }}
            >
                {/* Image wrapper with border radius */}
                <div style={{
                    position: 'relative',
                    width: '100%',
                    borderRadius: '18px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    {/* Background Image   full visible */}
                    <img
                        src="/contactus.png"
                        alt=""
                        style={{
                            width: '100%',
                            height: 'auto',
                            display: 'block',
                        }}
                    />

                    {/* Content overlay centred on the image */}
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            zIndex: 10,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            textAlign: 'center',
                            padding: '4rem 6%',
                        }}
                    >
                        {/* Main Heading   letter animation */}
                        <h2 style={{
                            fontFamily: "'Bodoni Moda', serif",
                            fontSize: 'clamp(2rem, 5vw, 4rem)',
                            lineHeight: 1.1,
                            color: '#FFFFFF',
                            margin: 0,
                            fontWeight: 400,
                            textTransform: 'uppercase',
                            letterSpacing: '0.02em',
                            maxWidth: '800px',
                        }}>
                            <AnimatedText text="Working on something for IITM BS? Let's make it real." />
                        </h2>

                        {/* Reach Out Button */}
                        <div style={{ marginTop: '3rem' }}>
                            <a
                                href="mailto:techsociety@iitm.ac.in"
                                onMouseEnter={() => setBtnHover(true)}
                                onMouseLeave={() => setBtnHover(false)}
                                style={{
                                    display: 'inline-block',
                                    padding: '12px 44px',
                                    fontFamily: "'Bodoni Moda', serif",
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    letterSpacing: '0.25em',
                                    textTransform: 'uppercase',
                                    color: '#FFFFFF',
                                    textDecoration: 'none',
                                    border: '1.5px solid #FFFFFF',
                                    borderRadius: '30px',
                                    background: btnHover
                                        ? 'rgba(255, 255, 255, 0.15)'
                                        : 'transparent',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer',
                                    transform: btnHover ? 'scale(1.05)' : 'scale(1)',
                                }}
                            >
                                Reach Out
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ContactUs;
