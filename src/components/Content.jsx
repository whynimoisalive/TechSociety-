import { motion } from 'framer-motion';

const Section = ({ title, children, align = 'left', className = '' }) => (
    <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className={`min-h-[70vh] flex flex-col justify-center px-8 md:px-24 py-32 border-b border-blueprint-ink/10 ${align === 'right' ? 'items-end text-right' : 'items-start text-left'} ${className}`}
    >
        {title && <h2 className="text-4xl md:text-7xl font-serif text-blueprint-ink mb-16 max-w-3xl leading-[0.9] tracking-tighter uppercase">{title}</h2>}
        <div className="text-lg md:text-3xl font-sans text-blueprint-ink/90 max-w-4xl leading-snug space-y-12 font-light tracking-tight">
            {children}
        </div>
    </motion.div>
);

const InvestmentItem = ({ name }) => (
    <div className="group cursor-default py-4 border-b border-blueprint-ink/5 hover:border-blueprint-ink/20 transition-colors flex justify-between items-baseline">
        <span className="text-2xl md:text-4xl font-serif italic text-blueprint-ink/40 group-hover:text-blueprint-ink transition-colors">{name}</span>
        <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-blueprint-ink/20 group-hover:text-blueprint-ink/40 transition-colors">Portfolio</span>
    </div>
);

export default function Content() {
    return (
        <div className="relative bg-blueprint-bg z-10">
            {/* Grid Overlay */}
            <div className="fixed inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />

            {/* Impact Details */}
            <Section title="A 100% FOLLOW-ON RATE OVERALL.">
                <p>In our Fund I, we have a 69% rate of follow-on investment by top-tier firms and a 100% follow-on rate overall.</p>
                <div className="h-[1px] w-full bg-blueprint-ink/10" />
            </Section>

            {/* Investments List */}
            <Section title="Our Investments" align="right">
                <div className="w-full max-w-2xl ml-auto">
                    <InvestmentItem name="Totus Medicines" />
                    <InvestmentItem name="Charm Industrial" />
                    <InvestmentItem name="Voyage Foods" />
                    <InvestmentItem name="Catena Biosciences" />
                    <InvestmentItem name="Limelight Steel" />
                    <InvestmentItem name="Menten AI" />
                </div>
            </Section>

            {/* Team Section */}
            <Section title="WE AIM TO BE THE MOST COLLABORATIVE FUND IN THE WORLD.">
                <div className="flex flex-col md:flex-row gap-12 items-start">
                    <div className="flex-1">
                        <h3 className="text-xl font-serif italic text-blueprint-ink mb-4">Sarah Cone</h3>
                        <p className="text-lg opacity-70">Managing Partner. Sarah’s superpower is plunging obsessively into the data on the most difficult social impact problems.</p>
                    </div>
                    <div className="flex-1 border-t md:border-t-0 md:border-l border-blueprint-ink/10 pt-12 md:pt-0 md:pl-12">
                        <p className="text-sm uppercase tracking-widest text-blueprint-ink/40 mb-6">Network</p>
                        <p className="text-2xl">Plus 40 global venture partners that help founders bend the trajectory of success</p>
                    </div>
                </div>
            </Section>

            {/* Social Proof / Testimonials */}
            <Section title="SOCIAL PROOF" align="right">
                <div className="max-w-2xl space-y-24">
                    <blockquote className="space-y-6">
                        <p className="text-3xl md:text-5xl font-serif italic leading-tight text-blueprint-ink">
                            "If there’s going to be a future at all, we have to build it, and Social Impact Capital is on the forefront of financing it."
                        </p>
                        <cite className="block text-xs font-sans uppercase tracking-[0.3em] text-blueprint-ink/50 not-italic">
                            Peter Thiel, Founders Fund
                        </cite>
                    </blockquote>

                    <blockquote className="space-y-6">
                        <p className="text-2xl md:text-3xl font-serif italic leading-tight text-blueprint-ink/70">
                            "Sarah is a terrific investor that I’ve been happy to work with ... Sarah just really, really does the work."
                        </p>
                        <cite className="block text-xs font-sans uppercase tracking-[0.3em] text-blueprint-ink/40 not-italic">
                            Jason Pontin, TallTrees
                        </cite>
                    </blockquote>
                </div>
            </Section>

            {/* Press Section */}
            <Section title="LATEST PRESS">
                <div className="grid md:grid-cols-2 gap-x-12 gap-y-16">
                    <div className="space-y-4">
                        <span className="text-[10px] uppercase tracking-widest text-blueprint-ink/40">Charm Industrial</span>
                        <h4 className="text-2xl font-serif">Charm Industrial eyes Canadian market after inking a new CDR deal with TD Bank</h4>
                    </div>
                    <div className="space-y-4">
                        <span className="text-[10px] uppercase tracking-widest text-blueprint-ink/40">Wearlinq</span>
                        <h4 className="text-2xl font-serif">Wearlinq gets $19M for continuous heart monitor</h4>
                    </div>
                    <div className="space-y-4">
                        <span className="text-[10px] uppercase tracking-widest text-blueprint-ink/40">Sustainability</span>
                        <h4 className="text-2xl font-serif">Companies are finding new ways to use waste and fight climate change</h4>
                    </div>
                    <div className="space-y-4">
                        <span className="text-[10px] uppercase tracking-widest text-blueprint-ink/40">Industry News</span>
                        <h4 className="text-2xl font-serif">Top 10: Carbon capture companies</h4>
                    </div>
                </div>
            </Section>

            {/* Custom CTA Section */}
            <section className="relative py-48 px-8 border-t border-blueprint-ink/10 bg-blueprint-ink text-blueprint-bg overflow-hidden">
                <div className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-end gap-12">
                    <div className="max-w-2xl">
                        <h3 className="text-5xl md:text-8xl font-serif leading-[0.9] tracking-tighter uppercase mb-12">We’d love to learn more about you.</h3>
                        <p className="text-xl md:text-2xl font-sans font-light opacity-60 uppercase tracking-tight">Building the future requires courage. We are here to support it.</p>
                    </div>
                    <div className="flex flex-col items-end gap-8">
                        <div className="text-right">
                            <p className="text-[10px] uppercase tracking-[0.4em] opacity-40 mb-2">Location</p>
                            <p className="text-lg">NYC / Worldwide</p>
                        </div>
                        <div className="border border-white/20 p-8 flex items-center gap-4 hover:bg-white hover:text-blueprint-ink transition-all cursor-pointer">
                            <span className="uppercase tracking-[0.2em] text-xs">Submit Pitch</span>
                            <span className="text-xl">→</span>
                        </div>
                    </div>
                </div>
                <div className="mt-48 flex justify-between items-baseline opacity-30 text-[10px] uppercase tracking-[0.3em]">
                    <span>SIC &copy; {new Date().getFullYear()}</span>
                    <span>Designed for Impact</span>
                    <span>All Rights Reserved</span>
                </div>
            </section>
        </div>
    );
}
