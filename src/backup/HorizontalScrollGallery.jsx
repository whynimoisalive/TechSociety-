import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const HorizontalScrollGallery = () => {
    const targetRef = useRef(null);
    const contentRef = useRef(null);
    const [contentWidth, setContentWidth] = useState(0);
    const [viewportW, setViewportW] = useState(0);

    // Measure viewport
    useEffect(() => {
        setViewportW(window.innerWidth);
        const handleResize = () => setViewportW(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Measure content width
    useEffect(() => {
        if (!contentRef.current) return;

        const measure = () => {
            // We use just the width of the content itself
            if (contentRef.current) {
                // If we want them to travel across the screen, we need the full width
                // plus the viewport width to go from "fully right" to "fully left"
                setContentWidth(contentRef.current.scrollWidth);
            }
        };

        measure();

        const resizeObserver = new ResizeObserver(() => measure());
        resizeObserver.observe(contentRef.current);

        const imgs = contentRef.current.querySelectorAll('img');
        imgs.forEach(img => {
            if (img.complete) measure();
            else img.onload = measure;
        });

        return () => resizeObserver.disconnect();
    }, [viewportW]);

    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end end"]
    });

    const physics = { damping: 15, mass: 0.27, stiffness: 55 };
    const springScroll = useSpring(scrollYProgress, physics);

    // Logic:
    // To go from Rightmost to Leftmost:
    // Start: x = viewportW (just offscreen right, or at right edge)
    // End: x = -contentWidth (just offscreen left, or fully scrolled past)

    // Row 1: Right -> Left (Top Image)
    // Starts exactly at the right viewport edge.
    const xLeft = useTransform(
        springScroll,
        [0, 1],
        [`${viewportW}px`, `-${contentWidth}px`]
    );

    // Row 2: Left -> Right (Bottom Image)
    // Starts exactly at the left viewport edge (offscreen by its width).
    // Actually, to "Start from Leftmost", it should start at -contentWidth
    const xRight = useTransform(
        springScroll,
        [0, 1],
        [`-${contentWidth}px`, `${viewportW}px`]
    );

    // Total scroll distance needed = Content + Viewport
    // This allows the full travel animation to play out
    const scrollDistance = contentWidth + viewportW;

    return (
        <section
            ref={targetRef}
            style={{
                height: `${scrollDistance}px`, // Distance to scroll
                position: 'relative',
                backgroundColor: '#d9d8dd'
            }}
        >
            <div
                style={{
                    position: 'sticky',
                    top: 0,
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center', // Center aligned vertically
                    overflow: 'hidden',
                }}
            >
                {/* 
                   We measure this container. 
                   It wraps both rows to get a consistent width.
                */}
                <div
                    ref={contentRef}
                    style={{
                        width: 'max-content',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '60px', // margin between rows
                    }}
                >

                    {/* Row 1: Moves Left (Starts Right) */}
                    <motion.div style={{ x: xLeft }} className="flex">
                        <img
                            src="/horizontalscroll1.png"
                            alt="Horizontal Scroll 1"
                            className="gallery-img"
                            style={{
                                height: '25vh',
                                width: 'auto',
                                maxWidth: 'none',
                                objectFit: 'cover',
                                borderRadius: '12px',
                                // No shadow
                            }}
                        />
                    </motion.div>

                    {/* Row 2: Moves Right (Starts Left) */}
                    <motion.div style={{ x: xRight }} className="flex">
                        <img
                            src="/horizontalscroll2.png"
                            alt="Horizontal Scroll 2"
                            className="gallery-img"
                            style={{
                                height: '25vh',
                                width: 'auto',
                                maxWidth: 'none',
                                objectFit: 'cover',
                                borderRadius: '12px',
                                // No shadow
                            }}
                        />
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default HorizontalScrollGallery;
