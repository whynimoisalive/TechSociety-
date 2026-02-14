import { ReactLenis } from 'lenis/dist/lenis-react.mjs'
import { useEffect, useRef } from 'react'

function SmoothScroll({ children }) {
    const lenisRef = useRef(null)

    // Keep Lenis raf loop alive even when tab is re-focused after idle
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden && lenisRef.current) {
                lenisRef.current.resize()
            }
        }

        const handleFocus = () => {
            if (lenisRef.current) {
                lenisRef.current.resize()
            }
        }

        // Listen for parent page telling us to recalibrate scroll after transition
        const handleMessage = (e) => {
            if (e.data === 'lenis-resize' && lenisRef.current) {
                lenisRef.current.scrollTo(0, { immediate: true })
                lenisRef.current.resize()
            }
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)
        window.addEventListener('focus', handleFocus)
        window.addEventListener('message', handleMessage)

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange)
            window.removeEventListener('focus', handleFocus)
            window.removeEventListener('message', handleMessage)
        }
    }, [])

    return (
        <ReactLenis
            root
            ref={lenisRef}
            options={{
                lerp: 0.045,           // Lower = more inertia/momentum
                duration: 2.0,         // Longer duration
                smoothWheel: true,
                smoothTouch: false,
                wheelMultiplier: 0.8,
                infinite: false,
                autoResize: true,
            }}
        >
            {children}
        </ReactLenis>
    )
}

export default SmoothScroll
