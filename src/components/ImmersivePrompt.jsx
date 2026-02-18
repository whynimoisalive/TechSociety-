import React, { useState, useEffect } from 'react';

const ImmersivePrompt = () => {
    const [visible, setVisible] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        // Don't show if already in fullscreen
        if (document.fullscreenElement) return;

        // Short delay so the page renders first
        const timer = setTimeout(() => setVisible(true), 400);
        return () => clearTimeout(timer);
    }, []);

    const dismiss = () => {
        setFadeOut(true);
        setTimeout(() => setVisible(false), 400);
    };

    const enterFullscreen = () => {
        document.documentElement.requestFullscreen?.().catch(() => { });
        dismiss();
    };

    if (!visible) return null;

    return (
        <>
            <style>{`
                @keyframes immersiveFadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                @keyframes immersiveSlideUp {
                    from { opacity: 0; transform: translateY(30px) scale(0.96); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>

            <div
                onClick={dismiss}
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(10, 10, 10, 0.65)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    animation: 'immersiveFadeIn 0.4s ease',
                    opacity: fadeOut ? 0 : 1,
                    transition: 'opacity 0.35s ease',
                }}
            >
                <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        background: 'rgba(217, 216, 221, 0.95)',
                        border: '1px solid rgba(0, 0, 0, 0.12)',
                        borderRadius: '14px',
                        padding: '3rem 2.5rem',
                        maxWidth: '420px',
                        width: '90%',
                        textAlign: 'center',
                        animation: 'immersiveSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                        boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
                    }}
                >
                    {/* Icon */}
                    <div style={{
                        fontSize: '2.2rem',
                        marginBottom: '1.2rem',
                        opacity: 0.8,
                    }}>
                        ⛶
                    </div>

                    {/* Title */}
                    <h2 style={{
                        fontFamily: "'Bodoni Moda', serif",
                        fontSize: 'clamp(1.3rem, 3vw, 1.6rem)',
                        fontWeight: 400,
                        color: '#0a0a0a',
                        margin: '0 0 0.75rem',
                        lineHeight: 1.2,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                    }}>
                        Immersive Experience
                    </h2>

                    {/* Description */}
                    <p style={{
                        fontFamily: "'Bodoni Moda', serif",
                        fontSize: '0.9rem',
                        color: '#0a0a0a',
                        opacity: 0.6,
                        lineHeight: 1.6,
                        margin: '0 0 2rem',
                    }}>
                        This site is best experienced in fullscreen. Would you like to enter immersive mode?
                    </p>

                    {/* Buttons */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                        alignItems: 'center',
                    }}>
                        <button
                            onClick={enterFullscreen}
                            style={{
                                width: '100%',
                                padding: '13px 0',
                                fontFamily: "'Bodoni Moda', serif",
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                letterSpacing: '0.12em',
                                textTransform: 'uppercase',
                                color: '#ffffff',
                                background: '#0a0a0a',
                                border: '1.5px solid #0a0a0a',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                transition: 'all 0.25s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#1a1a1a';
                                e.currentTarget.style.transform = 'scale(1.02)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#0a0a0a';
                                e.currentTarget.style.transform = 'scale(1)';
                            }}
                        >
                            Enter Fullscreen
                        </button>

                        <button
                            onClick={dismiss}
                            style={{
                                width: '100%',
                                padding: '13px 0',
                                fontFamily: "'Bodoni Moda', serif",
                                fontSize: '0.8rem',
                                fontWeight: 400,
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                                color: '#0a0a0a',
                                background: 'transparent',
                                border: '1px solid rgba(0, 0, 0, 0.2)',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                transition: 'all 0.25s ease',
                                opacity: 0.7,
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.opacity = '1';
                                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.5)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.opacity = '0.7';
                                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.2)';
                            }}
                        >
                            Continue Without
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ImmersivePrompt;
