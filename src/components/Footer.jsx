import React from 'react';

const FOOTER_HEIGHT = 800;

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <div
            className="footer-clipper"
            style={{
                position: 'relative',
                height: `${FOOTER_HEIGHT}px`,
                clipPath: 'polygon(0% 0, 100% 0%, 100% 100%, 0 100%)',
            }}
        >
            <div
                style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: `${FOOTER_HEIGHT}px`,
                }}
            >
                <div className="ts-footer-inner">

                    {/* ── Top section: branding + nav + contact ── */}
                    <div className="ts-footer-grid">

                        {/* Left: Branding */}
                        <div className="ts-footer-brand">
                            <h2 className="ts-footer-logo">IITM</h2>
                            <p className="ts-footer-tagline"> BS Degree Programme</p>
                            <p className="ts-footer-desc">
                                Building the digital backbone of campus life from
                                election portals to fest websites, we ship technology
                                that 40,000+ students rely on.
                            </p>
                        </div>

                        {/* Center: Quick Links */}
                        <nav className="ts-footer-nav">
                            <h4 className="ts-footer-col-title">Navigate</h4>
                            <ul>
                                <li><a href="#">Projects</a></li>
                                <li><a href="#">Team</a></li>
                                <li><a href="#">Events</a></li>
                                <li><a href="#">Manifesto</a></li>
                                <li><a href="#">Contact</a></li>
                            </ul>
                        </nav>

                        {/* Right: Contact */}
                        <div className="ts-footer-contact">
                            <h4 className="ts-footer-col-title">Get in Touch</h4>
                            <div className="ts-footer-contact-item">
                                <span className="ts-footer-icon">✉</span>
                                <a href="mailto:techsociety@study.iitm.ac.in">techsociety@study.iitm.ac.in</a>
                            </div>
                            <div className="ts-footer-contact-item">
                                <span className="ts-footer-icon">𝕏</span>
                                <a href="#">@TechSocIITM</a>
                            </div>
                            <div className="ts-footer-contact-item">
                                <span className="ts-footer-icon">◉</span>
                                <a href="#">Instagram</a>
                            </div>
                            <a href="mailto:techsociety@study.iitm.ac.in" className="ts-footer-cta">
                                Reach Out →
                            </a>
                        </div>
                    </div>

                    {/* ── Bottom mega text + copyright ── */}
                    <div className="ts-footer-bottom">
                        <h1 className="ts-footer-mega">Tech Society</h1>
                        <div className="ts-footer-bottom-row">
                            <span className="ts-footer-copy">© {currentYear} Tech Society · All rights reserved</span>
                            <span className="ts-footer-badge">IITM BS</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
