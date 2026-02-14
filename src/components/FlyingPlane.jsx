import React, { useRef, useEffect } from 'react';

const FlyingPlane = () => {
    const sectionRef = useRef(null);
    const videoRef = useRef(null);
    const textRef = useRef(null);
    const scrollRafRef = useRef(null);

    useEffect(() => {
        const section = sectionRef.current;
        const video = videoRef.current;
        const text = textRef.current;
        if (!section) return;

        if (video) {
            video.muted = true;
            video.loop = true;
            video.playsInline = true;
            video.play().catch(() => { });
        }

        function updatePosition() {
            const rect = section.getBoundingClientRect();
            const vh = window.innerHeight;

            const progress = Math.max(0, Math.min(1,
                (vh - rect.top) / (vh + rect.height)
            ));

            if (!video) return;

            const containerW = section.offsetWidth;
            const planeWidth = video.offsetWidth || 650;
            // Right to left horizontal movement
            const x = containerW - progress * (containerW + planeWidth);

            // Parabolic curve: inverted U (hill shape), peaks at progress=0.5
            const parabolicAmplitude = 600; // EVEN MORE deeper curve
            const parabolicY = -parabolicAmplitude * 4 * progress * (1 - progress);

            const opacity = progress > 0.85 ? Math.max(0, (1 - progress) / 0.15) : 1;

            // Subtle wobble layered on top
            const wobble = Math.sin(Date.now() / 400) * 6;

            // Calculate rotation angle (tangent to the parabolic curve)
            // dy/dp = -A * 4 * (1 - 2p)
            // dx/dp = -(containerW + planeWidth) (approx constant velocity)
            const dy_dp = -parabolicAmplitude * 4 * (1 - 2 * progress);
            const dx_dp = -(containerW + planeWidth);
            const angleRad = Math.atan2(dy_dp, dx_dp);
            let angleDeg = angleRad * (180 / Math.PI);

            // Plane image faces left (180 deg).
            // Normalise angle to 0-360 range to avoid flip when damping.
            if (angleDeg < 0) angleDeg += 360;

            // Rotation relative to 180 deg (Left)
            // Damped rotation: multiply by 0.5 to reduce tilt intensity
            const rotation = (angleDeg - 180) * 0.2;

            video.style.transform = `translate(${x}px, ${parabolicY + wobble}px) rotate(${rotation}deg)`;
            video.style.opacity = opacity;

            if (text) {
                // Text fades in around the peak (0.5)
                // Visible range: roughly 0.25 to 0.75
                // Full opacity plateau: 0.35 to 0.65
                let textOpacity = 0;
                if (progress > 0.35 && progress < 0.65) {
                    textOpacity = 1;
                } else if (progress > 0.25 && progress <= 0.35) {
                    textOpacity = (progress - 0.25) / 0.1;
                } else if (progress >= 0.65 && progress < 0.75) {
                    textOpacity = 1 - (progress - 0.65) / 0.1;
                }

                // Apply similar transform to text
                // Check if we want rotation on text? "just below" usually implies following the object
                text.style.transform = `translate(${x}px, ${parabolicY + wobble}px) rotate(${rotation}deg)`;
                text.style.opacity = textOpacity;
            }

            scrollRafRef.current = requestAnimationFrame(updatePosition);
        }

        scrollRafRef.current = requestAnimationFrame(updatePosition);

        return () => {
            if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current);
        };
    }, []);



    return (
        <section
            ref={sectionRef}
            style={{
                position: 'relative',
                height: '45vh',
                overflow: 'visible',
                backgroundColor: 'transparent',
                zIndex: 5,
            }}
        >
            <video
                ref={videoRef}
                src="/flight.mp4"
                muted
                loop
                playsInline
                style={{
                    position: 'absolute',
                    top: '120%', // Start lower so the high arc fits
                    left: 0,
                    width: '780px',
                    height: 'auto',
                    willChange: 'transform, opacity',
                    pointerEvents: 'none',
                    zIndex: 5,
                }}
            />
            <div
                ref={textRef}
                style={{
                    position: 'absolute',
                    top: '120%',
                    left: 0,
                    width: '780px', // Match video width for centering
                    textAlign: 'center',
                    fontFamily: "'StampatelloFaceto', cursive",
                    fontSize: '1.5rem', // Slightly larger than p but matching style
                    fontWeight: 400,
                    color: '#414eb6',
                    willChange: 'transform, opacity',
                    pointerEvents: 'none',
                    zIndex: 5,
                    opacity: 0,
                    marginTop: '420px', // Increased margin to be significantly below video
                    textShadow: '0 2px 4px rgba(0,0,0,0.1)', // Optional legibility
                }}
            >
                1903 Wright Flyer I
            </div>
        </section>
    );
};

export default FlyingPlane;
