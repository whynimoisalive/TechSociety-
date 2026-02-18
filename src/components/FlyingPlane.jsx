import React, { useRef, useEffect } from 'react';

const FlyingPlane = () => {
    const sectionRef = useRef(null);
    const videoRef = useRef(null);
    const textRef = useRef(null);
    const rafRef = useRef(null);
    const cachedRef = useRef({ containerW: 0, planeWidth: 650 });

    useEffect(() => {
        const section = sectionRef.current;
        const video = videoRef.current;
        const text = textRef.current;
        if (!section) return;

        if (video) {
            video.muted = true;
            video.loop = true;
            video.playsInline = true;
        }

        // Cache layout values   only recalc on resize
        const cacheLayout = () => {
            cachedRef.current.containerW = section.offsetWidth;
            cachedRef.current.planeWidth = (video && video.offsetWidth) || 650;
        };
        cacheLayout();

        let isVisible = false;
        let ticking = false;

        function updatePosition() {
            const rect = section.getBoundingClientRect();
            const vh = window.innerHeight;
            const { containerW, planeWidth } = cachedRef.current;

            const progress = Math.max(0, Math.min(1,
                (vh - rect.top) / (vh + rect.height)
            ));

            if (!video) { ticking = false; return; }

            const x = containerW - progress * (containerW + planeWidth);

            const parabolicAmplitude = 600;
            const parabolicY = -parabolicAmplitude * 4 * progress * (1 - progress);

            const opacity = progress > 0.85 ? Math.max(0, (1 - progress) / 0.15) : 1;

            const dy_dp = -parabolicAmplitude * 4 * (1 - 2 * progress);
            const dx_dp = -(containerW + planeWidth);
            const angleRad = Math.atan2(dy_dp, dx_dp);
            let angleDeg = angleRad * (180 / Math.PI);
            if (angleDeg < 0) angleDeg += 360;
            const rotation = (angleDeg - 180) * 0.2;

            video.style.transform = `translate3d(${x}px, ${parabolicY}px, 0) rotate(${rotation}deg)`;
            video.style.opacity = opacity;

            if (text) {
                let textOpacity = 0;
                if (progress > 0.35 && progress < 0.65) {
                    textOpacity = 1;
                } else if (progress > 0.25 && progress <= 0.35) {
                    textOpacity = (progress - 0.25) / 0.1;
                } else if (progress >= 0.65 && progress < 0.75) {
                    textOpacity = 1 - (progress - 0.65) / 0.1;
                }
                text.style.transform = `translate3d(${x}px, ${parabolicY}px, 0) rotate(${rotation}deg)`;
                text.style.opacity = textOpacity;
            }

            ticking = false;
        }

        const handleScroll = () => {
            if (!isVisible || ticking) return;
            ticking = true;
            rafRef.current = requestAnimationFrame(updatePosition);
        };

        // Visibility observer   pause/resume video & animation
        const observer = new IntersectionObserver(
            ([entry]) => {
                isVisible = entry.isIntersecting;
                if (video) {
                    if (isVisible) {
                        video.play().catch(() => { });
                        handleScroll(); // initial position update
                    } else {
                        video.pause();
                    }
                }
            },
            { rootMargin: '300px' }
        );
        observer.observe(section);

        const handleResize = () => { cacheLayout(); handleScroll(); };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleResize, { passive: true });

        return () => {
            observer.disconnect();
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            className="flying-plane-section"
            style={{
                position: 'relative',
                height: '45vh',
                overflow: 'visible',
                backgroundColor: 'transparent',
                zIndex: 5,
            }}
        >
            <style>{`
                @media (max-width: 1440px) and (max-height: 900px) {
                    .flying-plane-section {
                        height: 35vh !important;
                    }
                    .flying-plane-video {
                        width: 580px !important;
                    }
                    .flying-plane-text {
                        width: 580px !important;
                        font-size: 1.2rem !important;
                        margin-top: 310px !important;
                    }
                }
                @media (max-height: 768px) {
                    .flying-plane-section {
                        height: 30vh !important;
                    }
                    .flying-plane-video {
                        width: 500px !important;
                    }
                    .flying-plane-text {
                        width: 500px !important;
                        font-size: 1rem !important;
                        margin-top: 270px !important;
                    }
                }
            `}</style>
            <video
                ref={videoRef}
                src="/flight.mp4"
                muted
                loop
                playsInline
                preload="auto"
                className="flying-plane-video"
                style={{
                    position: 'absolute',
                    top: '120%',
                    left: 0,
                    width: '780px',
                    height: 'auto',
                    willChange: 'transform',
                    pointerEvents: 'none',
                    zIndex: 5,
                }}
            />
            <div
                ref={textRef}
                className="flying-plane-text"
                style={{
                    position: 'absolute',
                    top: '120%',
                    left: 0,
                    width: '780px',
                    textAlign: 'center',
                    fontFamily: "'StampatelloFaceto', cursive",
                    fontSize: '1.5rem',
                    fontWeight: 400,
                    color: '#414eb6',
                    willChange: 'transform',
                    pointerEvents: 'none',
                    zIndex: 5,
                    opacity: 0,
                    marginTop: '420px',
                    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
            >
                1903 Wright Flyer I
            </div>
        </section>
    );
};

export default FlyingPlane;

