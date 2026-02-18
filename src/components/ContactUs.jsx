import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

/* ───────── Letter-by-letter reveal ───────── */
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

/* ───────── Draggable Card Component ───────── */
const DraggableCard = ({ project, index, updateZIndex, initialX = 0, initialY = 0, initialRotate = 0 }) => {
    return (
        <motion.div
            drag
            dragConstraints={{ left: -400, right: 400, top: -250, bottom: 250 }}
            dragElastic={0.05}
            dragMomentum={true}
            // Retaining the "Heavy Paper" physics
            dragTransition={{ power: 0.2, timeConstant: 200 }}

            whileHover={{ scale: 1.02, cursor: "grab", boxShadow: "0 20px 40px -5px rgba(65, 78, 182, 0.15)" }} // Blue-tinted shadow on hover
            whileTap={{ scale: 1.05, cursor: "grabbing" }}
            onPointerDown={() => updateZIndex(project.id)}

            initial={{
                rotate: initialRotate,
                x: initialX,
                y: 100 + initialY,
                opacity: 0
            }}
            whileInView={{
                opacity: 1,
                y: initialY,
                transition: { duration: 0.6, delay: index * 0.1 }
            }}
            viewport={{ once: true }}
            className="text-card"
            style={{
                zIndex: project.zIndex,
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                margin: 'auto',
            }}
        >
            <div className="card-header-row">
                <div className="card-id">#{project.id}</div>
                <div className="card-tags">
                    {project.tags.map((tag, t) => (
                        <span key={t} className="card-tag">{tag}</span>
                    ))}
                </div>
            </div>

            <div className="card-body">
                <h3>{project.title}</h3>
                <p>{project.desc}</p>
            </div>

            <div className="card-footer">
                <a href="#" className="card-link">{project.link} &rarr;</a>
            </div>
        </motion.div>
    );
};

/* ───────── Main Component ───────── */
const ContactUs = () => {
    const mainRef = useRef(null);
    const containerRef = useRef(null);
    const [btnHover, setBtnHover] = useState(false);
    const [teamBtnHover, setTeamBtnHover] = useState(false);

    const [highestZ, setHighestZ] = useState(10);
    const [projects, setProjects] = useState([
        {
            id: '01',
            title: 'Election Portal',
            tags: ['Official', '40k+ Users'],
            year: '2025',
            desc: "The official IITM BS democratic platform. 40,000+ students, real-time voting, seamless secure architecture.",
            link: "View Case Study",
            zIndex: 1
        },
        {
            id: '02',
            title: "Paradox '25 Site",
            tags: ['Flagship Event', 'Web Design'],
            year: '2025',
            desc: "The digital face of IITM's biggest fest. An immersive web experience connecting students across the globe.",
            link: "Visit Site",
            zIndex: 2
        },
        {
            id: '03',
            title: 'Student Activity Site',
            tags: ['Platform', 'In Progress'],
            year: '2026',
            desc: "A unified ecosystem for student life. One dashboard to manage, discover, and track every campus activity.",
            link: "Learn More",
            zIndex: 3
        }
    ]);

    const bringToFront = (id) => {
        setHighestZ(prev => prev + 1);
        setProjects(prevProjects =>
            prevProjects.map(p =>
                p.id === id ? { ...p, zIndex: highestZ + 1 } : p
            )
        );
    };

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const headerTl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".contact-projects-header",
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            });

            headerTl.fromTo(".project-header-line",
                { scaleX: 0, transformOrigin: "left" },
                { scaleX: 1, duration: 1.2, ease: "expo.out" }
            );
        }, mainRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={mainRef} style={{ overflowX: 'hidden', backgroundColor: '#d9d8dd' }}>
            <style>{`
                /* Import Aesthetic Handwriting Font */
                @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&display=swap');

                @font-face {
                    font-family: 'StampatelloFaceto';
                    src: url('/fonts/StampatelloFaceto.otf') format('opentype');
                    font-display: swap;
                }
                html { scroll-behavior: smooth; }

                /* ─── TEAM SECTION ─── */
                .team-card {
                    background: transparent;
                    padding: 0 1rem;
                    transition: transform 0.45s cubic-bezier(0.25,0.46,0.45,0.94);
                    cursor: pointer;
                    text-align: center;
                    transform: translateZ(0); 
                }
                .team-card:hover { transform: translateY(-6px); }
                .team-img-wrapper {
                    width: 100%;
                    aspect-ratio: 3 / 4;
                    border-radius: 50% 50% 4px 4px / 40% 40% 0 0;
                    overflow: hidden;
                    position: relative;
                    -webkit-mask-image: -webkit-radial-gradient(white, black);
                }
                .team-card-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.5s ease;
                }
                .team-card:hover .team-card-img { transform: scale(1.03); }

                /* ─── BLUE INK HANDWRITTEN CARDS ─── */
                .project-playground {
                    position: relative;
                    width: 100%;
                    min-height: 60vh; 
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    perspective: 1000px;
                }

                .text-card {
                    /* Warm Paper White */
                    background: #fffef8;
                    
                    /* Blue Ink Border (Thin & Elegant) */
                    border: 1px solid rgba(65, 78, 182, 0.3);
                    border-radius: 4px;
                    
                    /* Soft Shadow */
                    box-shadow: 0 10px 30px -5px rgba(65, 78, 182, 0.08), 0 5px 15px -5px rgba(0,0,0,0.05);
                    
                    padding: 2.5rem;
                    box-sizing: border-box;
                    width: 100%;
                    max-width: 500px;
                    min-height: 320px;
                    
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    touch-action: none; 
                }

                .card-header-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    /* Blue Ink Separator */
                    border-bottom: 1px solid rgba(65, 78, 182, 0.15); 
                    padding-bottom: 1rem;
                    margin-bottom: 1.5rem;
                    pointer-events: none;
                }

                .card-id {
                    /* Handwritten ID */
                    font-family: 'Caveat', cursive;
                    font-weight: 700;
                    font-size: 2rem;
                    color: #414eb6; 
                }
                .card-tags {
                    display: flex;
                    gap: 8px;
                }
                .card-tag {
                    /* Handwritten Tags */
                    font-family: 'Caveat', cursive;
                    font-weight: 600;
                    font-size: 1rem;
                    color: #414eb6; 
                    border: 1.5px solid #414eb6;
                    padding: 4px 14px;
                    border-radius: 50px; 
                    background: transparent;
                }

                .card-body h3 {
                    /* Handwritten Title */
                    font-family: 'Caveat', cursive;
                    font-size: clamp(3rem, 5vw, 4rem);
                    font-weight: 700;
                    margin: 0 0 1rem 0;
                    line-height: 0.9;
                    color: #414eb6; 
                    pointer-events: none;
                }

                .card-body p {
                    /* Handwritten Body Text */
                    font-family: 'Caveat', cursive;
                    font-size: 1.5rem; 
                    line-height: 1.3;
                    color: #414eb6; 
                    opacity: 0.8;
                    margin: 0;
                    pointer-events: none;
                    max-width: 95%;
                }

                .card-footer {
                    display: flex;
                    justify-content: flex-end;
                    margin-top: 2rem;
                }
                
                .card-link {
                    /* Handwritten Link */
                    font-family: 'Caveat', cursive;
                    font-size: 1.4rem;
                    font-weight: 600;
                    color: #414eb6; /* BLUE INK */
                    text-decoration: none;
                    border-bottom: 1.5px solid #414eb6;
                    padding-bottom: 2px;
                    transition: all 0.3s;
                    cursor: pointer;
                }
                .text-card:hover .card-link {
                    opacity: 0.7;
                }

                @media (max-width: 768px) {
                    .text-card { padding: 1.5rem; min-height: auto; max-width: 90%; }
                    .card-header-row { flex-direction: column; gap: 0.5rem; }
                    .card-tags { flex-wrap: wrap; }
                }
            `}</style>



            {/* ════════════════ TEAM SECTION ════════════════ */}
            <section className="contact-team-section" style={{
                backgroundColor: '#d9d8dd',
                padding: '6rem 5%',
            }}>
                <div style={{ borderTop: '1.5px solid #000000', paddingTop: '2rem', marginBottom: '3rem' }}>
                    <h2 className="contact-team-heading" style={{
                        fontFamily: "'Bodoni Moda', serif",
                        fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                        fontWeight: 400,
                        color: '#0a0a0a',
                        margin: 0,
                        lineHeight: 1,
                        textTransform: 'uppercase',
                    }}>
                        Secretaries
                    </h2>
                    <p style={{ fontFamily: "'Bodoni Moda', serif", fontSize: 'clamp(1rem, 2vw, 1.15rem)', color: '#0a0a0a', opacity: 0.6, marginTop: '0.75rem', maxWidth: '500px' }}>
                        A passionate team of builders, designers, and dreamers shaping the IITM BS tech story.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem', padding: '0 2%', marginBottom: '4rem' }}>
                    {[
                        { name: 'Nimish Shinde', role: 'Secretary', img: '/secretary.png' },
                        { name: 'Twisha Shriyam', role: 'Deputy Secretary', img: '/deputysecretary.png' },
                        { name: 'Arka Dash', role: 'Former Secretary', img: '/formersecretary.png' },
                    ].map((person, i) => (
                        <div key={i} className="team-card">
                            <div className="team-img-wrapper">
                                <img className="team-card-img" src={person.img} alt={person.name} loading="lazy" />
                            </div>
                            <div style={{ padding: '1.5rem 0 0', textAlign: 'left' }}>
                                <h3 style={{ fontFamily: "'Bodoni Moda', serif", fontSize: 'clamp(1.4rem, 2.2vw, 1.75rem)', fontWeight: 400, color: '#0a0a0a', margin: 0, textTransform: 'uppercase' }}>
                                    {person.name}
                                </h3>
                                <p style={{ fontFamily: "'Bodoni Moda', serif", fontSize: '0.9rem', color: '#0a0a0a', marginTop: '0.5rem', letterSpacing: '0.05em', textTransform: 'uppercase', opacity: 0.7 }}>
                                    {person.role}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', paddingLeft: 'calc(2% + 1rem)' }}>
                    <a href="#" onMouseEnter={() => setTeamBtnHover(true)} onMouseLeave={() => setTeamBtnHover(false)}
                        style={{ display: 'inline-block', padding: '14px 36px', fontFamily: "'Bodoni Moda', serif", fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: teamBtnHover ? '#ffffff' : '#0a0a0a', textDecoration: 'none', border: '1px solid #0a0a0a', background: teamBtnHover ? '#0a0a0a' : 'transparent', transition: 'all 0.3s ease', cursor: 'pointer' }}
                    >
                        See Full Team
                    </a>
                </div>

            </section>

            {/* ════════════════ SELECTED WORKS (BLUE INK PILE) ════════════════ */}
            <div style={{ backgroundColor: '#d9d8dd', paddingBottom: '0' }}>

                {/* Header */}
                <div className="contact-projects-header" style={{ padding: '6rem 5% 1rem 5%' }}>
                    <div className="project-header-line" style={{ width: '100%', height: '1px', backgroundColor: '#000', marginBottom: '2rem' }}></div>
                    <div style={{ marginTop: '1rem' }}>
                        <h2 className="new-project-heading" style={{
                            fontWeight: 400,
                            color: '#414eb6',
                            margin: 0,
                            lineHeight: 0.9,
                            fontFamily: 'Samarkan',
                            fontSize: 'clamp(2rem, 5vw, 5rem)',
                            letterSpacing: '1px',
                            textTransform: 'uppercase',
                            textAlign: 'center',
                        }}>
                            Siddhirbhavati <br />Karmaja
                        </h2>
                        <p style={{ fontFamily: "'StampatelloFaceto'", fontSize: '1.2rem', fontStyle: 'italic', marginTop: '1rem', marginBottom: '10px', color: '#0a0a0a', opacity: 0.8, textAlign: 'center' }}>
                            Official work done under IITM BS degree
                        </p>
                    </div>
                </div>

                {/* DRAGGABLE PLAYGROUND */}
                <div className="project-playground" ref={containerRef}>
                    {projects.map((project, i) => (
                        <DraggableCard
                            key={project.id}
                            project={project}
                            index={i}
                            updateZIndex={bringToFront}
                            initialX={i === 0 ? -150 : i === 1 ? 20 : 190}
                            initialY={i === 0 ? 50 : i === 1 ? -60 : 60}
                            initialRotate={i === 0 ? -5 : i === 1 ? 2 : 4}
                        />
                    ))}
                </div>
            </div>




        </div>
    );
};

export default ContactUs;