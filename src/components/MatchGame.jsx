import React, { useRef, useState, useEffect } from 'react';

const MatchGame = () => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const sectionRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    const [isDrawing, setIsDrawing] = useState(false);
    const [startItem, setStartItem] = useState(null);
    const [currentPath, setCurrentPath] = useState([]);
    const [connections, setConnections] = useState([]);
    const [leftPositions, setLeftPositions] = useState({});
    const [rightPositions, setRightPositions] = useState({});

    const leftItems = [
        { id: 1, text: "Supervised Learning" },
        { id: 2, text: "Unsupervised Learning" },
        { id: 3, text: "Deep Learning" },
        { id: 4, text: "Reinforcement Learning" }
    ];

    const rightItems = [
        { id: 4, text: "Maximizes reward through trial & error" },
        { id: 3, text: "Uses neural networks for complex patterns" },
        { id: 2, text: "Finds hidden structures in unlabeled data" },
        { id: 1, text: "Maps labeled inputs to outputs" }
    ];

    // Intersection Observer for scroll-based visibility
    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            {
                threshold: 0.15, // Trigger when 15% of section is visible
                rootMargin: '0px 0px -50px 0px',
            }
        );

        observer.observe(section);
        return () => observer.disconnect();
    }, []);

    // Update positions when component mounts/resizes
    useEffect(() => {
        const updatePositions = () => {
            if (!containerRef.current) return;

            const containerRect = containerRef.current.getBoundingClientRect();
            const newLeftPos = {};
            const newRightPos = {};

            leftItems.forEach(item => {
                const el = document.getElementById(`left-${item.id}`);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    newLeftPos[item.id] = {
                        x: rect.right - containerRect.left,
                        y: rect.top + rect.height / 2 - containerRect.top
                    };
                }
            });

            rightItems.forEach(item => {
                const el = document.getElementById(`right-${item.id}`);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    newRightPos[item.id] = {
                        x: rect.left - containerRect.left,
                        y: rect.top + rect.height / 2 - containerRect.top
                    };
                }
            });

            setLeftPositions(newLeftPos);
            setRightPositions(newRightPos);
        };

        setTimeout(updatePositions, 100);
        window.addEventListener('resize', updatePositions);
        return () => window.removeEventListener('resize', updatePositions);
    }, []);

    // Resize canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const resize = () => {
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;
            redrawCanvas();
        };

        resize();
        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize);
    }, [connections]);

    const redrawCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw existing connections
        connections.forEach(conn => {
            drawSmoothPath(ctx, conn.path, conn.correct ? '#2d5a27' : '#8b3a3a', 3);
        });

        // Draw current path
        if (currentPath.length > 1) {
            drawSmoothPath(ctx, currentPath, '#414eb6', 3);
        }
    };

    // Simplify path by removing points that are too close together
    const simplifyPath = (path, tolerance = 8) => {
        if (path.length < 3) return path;

        const result = [path[0]];
        let lastPoint = path[0];

        for (let i = 1; i < path.length - 1; i++) {
            const dist = Math.sqrt(
                Math.pow(path[i].x - lastPoint.x, 2) +
                Math.pow(path[i].y - lastPoint.y, 2)
            );
            if (dist >= tolerance) {
                result.push(path[i]);
                lastPoint = path[i];
            }
        }

        result.push(path[path.length - 1]);
        return result;
    };

    const drawSmoothPath = (ctx, rawPath, color, width) => {
        const path = simplifyPath(rawPath, 10);
        if (path.length < 2) return;

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if (path.length === 2) {
            ctx.moveTo(path[0].x, path[0].y);
            ctx.lineTo(path[1].x, path[1].y);
        } else {
            ctx.moveTo(path[0].x, path[0].y);

            // Use cardinal spline for smoother curves
            for (let i = 0; i < path.length - 1; i++) {
                const p0 = path[Math.max(0, i - 1)];
                const p1 = path[i];
                const p2 = path[Math.min(path.length - 1, i + 1)];
                const p3 = path[Math.min(path.length - 1, i + 2)];

                const tension = 0.3;
                const cp1x = p1.x + (p2.x - p0.x) * tension;
                const cp1y = p1.y + (p2.y - p0.y) * tension;
                const cp2x = p2.x - (p3.x - p1.x) * tension;
                const cp2y = p2.y - (p3.y - p1.y) * tension;

                ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
            }
        }

        ctx.stroke();
    };

    useEffect(() => {
        redrawCanvas();
    }, [currentPath, connections]);

    const getMousePos = (e) => {
        const rect = containerRef.current.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    // Start drawing on mousedown
    const handleMouseDown = (item, side, e) => {
        if (connections.some(c =>
            (side === 'left' && c.leftId === item.id) ||
            (side === 'right' && c.rightId === item.id)
        )) return;

        e.preventDefault();
        const pos = getMousePos(e);

        setIsDrawing(true);
        setStartItem({ ...item, side });
        setCurrentPath([pos]); // Start from mouse position
    };

    // Draw while dragging with mouse held down
    const handleMouseMove = (e) => {
        if (!isDrawing || !startItem) return;

        const pos = getMousePos(e);
        const lastPos = currentPath[currentPath.length - 1];
        if (lastPos) {
            const dist = Math.sqrt(Math.pow(pos.x - lastPos.x, 2) + Math.pow(pos.y - lastPos.y, 2));
            if (dist > 3) {
                setCurrentPath(prev => [...prev, pos]);
            }
        }
    };

    // Complete connection on mouseup
    const handleMouseUp = (e) => {
        if (!isDrawing || !startItem) {
            setIsDrawing(false);
            setStartItem(null);
            setCurrentPath([]);
            return;
        }

        const pos = getMousePos(e);
        let connected = false;

        // Check right items
        for (const item of rightItems) {
            if (startItem.side === 'left') {
                const rightPos = rightPositions[item.id];
                if (rightPos && Math.abs(pos.x - rightPos.x) < 80 && Math.abs(pos.y - rightPos.y) < 40) {
                    if (!connections.some(c => c.rightId === item.id)) {
                        const finalPath = [...currentPath, pos];
                        const correct = startItem.id === item.id;
                        setConnections([...connections, { leftId: startItem.id, rightId: item.id, path: finalPath, correct }]);
                        connected = true;
                        break;
                    }
                }
            }
        }

        // Check left items
        if (!connected) {
            for (const item of leftItems) {
                if (startItem.side === 'right') {
                    const leftPos = leftPositions[item.id];
                    if (leftPos && Math.abs(pos.x - leftPos.x) < 80 && Math.abs(pos.y - leftPos.y) < 40) {
                        if (!connections.some(c => c.leftId === item.id)) {
                            const finalPath = [...currentPath, pos];
                            const correct = startItem.id === item.id;
                            setConnections([...connections, { leftId: item.id, rightId: startItem.id, path: finalPath, correct }]);
                            connected = true;
                            break;
                        }
                    }
                }
            }
        }

        setIsDrawing(false);
        setStartItem(null);
        setCurrentPath([]);
    };

    const undoLast = () => {
        setConnections(prev => prev.slice(0, -1));
    };

    const resetAll = () => {
        setConnections([]);
        setStartItem(null);
        setCurrentPath([]);
    };

    const isConnected = (id, side) => {
        return connections.some(c =>
            (side === 'left' && c.leftId === id) ||
            (side === 'right' && c.rightId === id)
        );
    };

    const getConnectionStatus = (id, side) => {
        const conn = connections.find(c =>
            (side === 'left' && c.leftId === id) ||
            (side === 'right' && c.rightId === id)
        );
        return conn?.correct;
    };

    const allCorrect = connections.length === 4 && connections.every(c => c.correct);

    // Shared styles
    // Shared styles
    const handwrittenFont = "'StampatelloFaceto', cursive";
    const heroFont = "'StampatelloFaceto', cursive";
    const heroColor = '#414eb6';

    return (
        <section
            ref={sectionRef}
            className="match-game-section"
            style={{
                padding: '60px 20px 80px',
                background: '#d9d8dd',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
            }}
        >
            <style>{`
                @media (max-width: 1440px) and (max-height: 900px) {
                    .match-game-section {
                        padding: 40px 16px 60px !important;
                    }
                    .match-game-title {
                        font-size: clamp(1.6rem, 4vw, 2.4rem) !important;
                    }
                    .match-game-instruction {
                        font-size: 0.85rem !important;
                        margin-bottom: 30px !important;
                    }
                    .match-game-col-header {
                        font-size: 1.6rem !important;
                    }
                    .match-game-left-item {
                        font-size: 1.3rem !important;
                        padding: 8px 12px !important;
                    }
                    .match-game-right-item {
                        font-size: 1.1rem !important;
                        padding: 8px 12px !important;
                    }
                    .match-game-btn {
                        font-size: 1.1rem !important;
                    }
                }
                @media (max-height: 768px) {
                    .match-game-section {
                        padding: 30px 12px 40px !important;
                    }
                    .match-game-title {
                        font-size: clamp(1.4rem, 3.5vw, 2rem) !important;
                    }
                    .match-game-left-item {
                        font-size: 1.1rem !important;
                    }
                    .match-game-right-item {
                        font-size: 1rem !important;
                    }
                }
            `}</style>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                {/* Title - Hero Style */}
                <h2 className="match-game-title" style={{
                    fontFamily: heroFont,
                    fontSize: 'clamp(2rem, 5vw, 3rem)',
                    fontWeight: '400',
                    color: heroColor,
                    textAlign: 'center',
                    marginBottom: '8px',
                    letterSpacing: '0.05em',
                }}>
                    Match the Following
                </h2>

                {/* Instruction - Hero Style */}
                <p className="match-game-instruction" style={{
                    fontFamily: heroFont,
                    color: heroColor,
                    textAlign: 'center',
                    marginBottom: '40px',
                    fontSize: '1rem',
                    fontWeight: '500',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                }}>
                    Draw a line to connect each term with its definition
                </p>

                {/* Paper-like Container */}
                <div
                    ref={containerRef}
                    style={{
                        position: 'relative',
                        background: 'transparent',
                        borderRadius: '0',
                        padding: '40px 30px',
                        minHeight: '420px',
                        cursor: startItem ? 'crosshair' : 'default',
                        userSelect: 'none',
                    }}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={() => {
                        if (startItem) {
                            setStartItem(null);
                            setCurrentPath([]);
                        }
                    }}
                    onTouchMove={(e) => {
                        e.preventDefault();
                        handleMouseMove(e);
                    }}
                    onTouchEnd={handleMouseUp}
                >
                    <canvas
                        ref={canvasRef}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            pointerEvents: 'none',
                        }}
                    />

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'stretch',
                        position: 'relative',
                        zIndex: 1,
                    }}>
                        {/* Left Column - Terms */}
                        <div style={{ width: '38%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div className="match-game-col-header" style={{
                                fontFamily: handwrittenFont,
                                fontSize: '2rem',
                                color: heroColor,
                                textAlign: 'center',
                                paddingBottom: '8px',
                                borderBottom: `2px solid ${heroColor}`,
                                marginBottom: '8px',
                            }}>
                                Terms
                            </div>
                            {leftItems.map(item => {
                                const connected = isConnected(item.id, 'left');
                                const correct = getConnectionStatus(item.id, 'left');
                                const isActive = startItem?.id === item.id && startItem?.side === 'left';

                                return (
                                    <div
                                        key={item.id}
                                        id={`left-${item.id}`}
                                        className="match-game-left-item"
                                        onMouseDown={(e) => handleMouseDown(item, 'left', e)}
                                        style={{
                                            fontFamily: handwrittenFont,
                                            fontSize: '1.6rem',
                                            background: 'transparent',
                                            color: connected
                                                ? (correct ? '#2d5a27' : '#8b3a3a')
                                                : heroColor,
                                            padding: '12px 16px',
                                            cursor: connected ? 'default' : 'pointer',
                                            transition: 'color 0.2s ease',
                                            borderRight: '3px solid transparent',
                                            textDecoration: connected ? (correct ? 'none' : 'line-through') : 'none',
                                        }}
                                    >
                                        {item.text}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Right Column - Definitions */}
                        <div style={{ width: '55%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div className="match-game-col-header" style={{
                                fontFamily: handwrittenFont,
                                fontSize: '2rem',
                                color: heroColor,
                                textAlign: 'center',
                                paddingBottom: '8px',
                                borderBottom: `2px solid ${heroColor}`,
                                marginBottom: '8px',
                            }}>
                                Definitions
                            </div>
                            {rightItems.map(item => {
                                const connected = isConnected(item.id, 'right');
                                const correct = getConnectionStatus(item.id, 'right');

                                return (
                                    <div
                                        key={item.id}
                                        id={`right-${item.id}`}
                                        className="match-game-right-item"
                                        onMouseDown={(e) => handleMouseDown(item, 'right', e)}
                                        style={{
                                            fontFamily: handwrittenFont,
                                            fontSize: '1.4rem',
                                            background: 'transparent',
                                            color: connected
                                                ? (correct ? '#2d5a27' : '#8b3a3a')
                                                : heroColor,
                                            padding: '12px 16px',
                                            cursor: connected ? 'default' : 'pointer',
                                            transition: 'color 0.2s ease',
                                            borderLeft: '3px solid transparent',
                                            textDecoration: connected ? (correct ? 'none' : 'line-through') : 'none',
                                        }}
                                    >
                                        {item.text}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Controls - Handwritten Style */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '24px',
                    marginTop: '24px',
                }}>
                    <button
                        onClick={undoLast}
                        disabled={connections.length === 0}
                        style={{
                            fontFamily: handwrittenFont,
                            fontSize: '1.3rem',
                            background: 'transparent',
                            color: connections.length === 0 ? '#999' : heroColor,
                            border: 'none',
                            borderBottom: connections.length === 0 ? '1px dashed #999' : `2px solid ${heroColor}`,
                            padding: '8px 16px',
                            cursor: connections.length === 0 ? 'default' : 'pointer',
                            transition: 'all 0.2s',
                        }}
                    >
                        Undo Last
                    </button>
                    <button
                        onClick={resetAll}
                        style={{
                            fontFamily: handwrittenFont,
                            fontSize: '1.3rem',
                            background: 'transparent',
                            color: '#8b3a3a',
                            border: 'none',
                            borderBottom: '2px solid #8b3a3a',
                            padding: '8px 16px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                        }}
                    >
                        Start Over
                    </button>
                </div>

                {/* Success Message */}
                {allCorrect && (
                    <div style={{
                        marginTop: '32px',
                        padding: '20px',
                        textAlign: 'center',
                        fontFamily: handwrittenFont,
                        fontSize: '2rem',
                        color: '#2d5a27',
                    }}>
                        ✓ Perfect! All matches correct!
                    </div>
                )}
            </div>
        </section>
    );
};

export default MatchGame;
