import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import MatchGame from './components/MatchGame';
import AlgorithmVisualizer from './components/AlgorithmVisualizer';

import ContactUs from './components/ContactUs';
import BelowHero from './components/BelowHero';
import FlyingPlane from './components/FlyingPlane';
import Footer from './components/Footer';
import SmoothScroll from './components/SmoothScroll';

function App() {
  return (
    <SmoothScroll>
      <div style={{
        backgroundColor: '#d9d8dd',
        minHeight: '100vh',
        fontFamily: "'Inter', sans-serif",
        color: '#1E3A8A',
      }}>
        <Header />
        <main style={{ position: 'relative', zIndex: 1, backgroundColor: '#d9d8dd' }}>
          <Hero />
          <BelowHero />
          <FlyingPlane />
          <MatchGame />
          <AlgorithmVisualizer />
          <ContactUs />

        </main>
        <Footer />
      </div>
    </SmoothScroll>
  )
}

export default App
