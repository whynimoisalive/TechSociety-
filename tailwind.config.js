/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                'serif-display': ['"Bodoni Moda"', 'serif'],
                sans: ['"Inter"', 'sans-serif'],
                serif: ['"Bodoni Moda"', 'serif'], // Added alias for consistency
            },
            colors: {
                'ink-blue': '#1E3A8A', // Deep Royal Blue
                'ink-blue-light': '#2563EB', // Lighter Blue
                'blueprint-ink': '#1E3A8A', // Alias for ink-blue
                'blueprint-bg': '#f8fafc', // Slate-50/White alias
            },
            backgroundImage: {
                'grid-pattern': "linear-gradient(to right, #1E3A8A 1px, transparent 1px), linear-gradient(to bottom, #1E3A8A 1px, transparent 1px)",
            }
        },
    },
    plugins: [],
}
