import { motion } from 'motion/react';
import { FlaskConical, ShieldCheck, CheckCircle, Bolt } from 'lucide-react';

export default function About() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <header className="relative w-full min-h-[70vh] flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNg4NumU35I2AJDvhgumwfdYjsEnXqK-seesXMCk1-pdgN-fAmsKYjpYscyHoYqsBFRhMmSPO0uPXUR3Zvk9ym3K8-Y39cRQWu0PdkGZPSdIKD0hWM6cbg8h1LyeSQQUrvJZTsMDYv3E9gKtmvsC29EgSriZvay5VI6Hr-DvzFzp6PU9GAKJ4gLVLOQ676GKbDBn_83y8eDmS_MGA6TEAHaSJuIRBccdZIRVmUPEakHWDuQHXvexrIb5XkvxPXQMkiScxYXYjBVSg" 
            alt="Built to Perform Hero" 
            className="w-full h-full object-cover opacity-40 grayscale" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-black/60 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 w-full text-center flex flex-col items-center">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter mb-6"
          >
            Built To <span className="text-primary">Perform</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto"
          >
            We don't engineer supplements for the average. We formulate raw power for the relentless. Every scoop is designed to break limits and command dominance.
          </motion.p>
        </div>
      </header>

      {/* The Mission Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-8">The Mission</h2>
            <div className="w-16 h-1 bg-primary mb-10"></div>
            <p className="text-zinc-400 mb-6 leading-relaxed">
              FIT Supplements was forged in the fires of competitive necessity. We saw a market saturated with under-dosed, proprietary blends hiding behind flashy marketing. The mission was brutally simple: engineer the highest-grade, scientifically validated sports nutrition on the planet.
            </p>
            <p className="text-zinc-400 leading-relaxed">
              No fillers. No compromises. Just absolute, unadulterated performance fuel designed to push the human body beyond its perceived threshold. We stand for transparency, intensity, and the relentless pursuit of physical supremacy.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative aspect-square overflow-hidden border border-zinc-800"
          >
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuFpUe7RTuWxGnngwKkSeYq-QHNcj6prRNfY_YWiBMfeXkJZIgyqv_JLqa2VpAieV3ubJ3-yyRD5sYf5RN8bbzz6SkW5J_rrB8ykeyEcORRkCMV8AOVLxHwyLzEw2QYYzkA8Nb9IcFImlWjwOz3aT0sy-TyHPioiP2mijASmT7p0I7Zgm85JUmA8IHTfeD_31XFwEv7f2710YUFVn2-Fal_Wsl7JaE7HxttfsGxOpClnOSuyl9O7y0TzK8RIt-z7MeW5fCFlpJY-8" 
              alt="Our Mission" 
              className="w-full h-full object-cover grayscale brightness-50" 
            />
            <div className="absolute inset-0 bg-primary/10 mix-blend-overlay"></div>
          </motion.div>
        </div>
      </section>

      {/* Our Science Section (Bento Grid) */}
      <section className="py-24 bg-zinc-950 border-y border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">Our Science</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Precision engineering meets brutal efficacy. Our formulations are backed by clinical data, not hype.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-zinc-900 p-10 border border-zinc-800 md:col-span-2 flex flex-col justify-end min-h-[350px] relative overflow-hidden group">
               <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8AvVDmHu54zSilFEhAqYvzjv6NMbHTSDimu12SnaV-3NztCo1edXzjnaVWuXY-WOOLJcdxTRr70uUJmFhJknSfbva7vLrCaQ1LFMmQxg3ofwPTnsdevxnzyx8Cyk-u59xjzXhGrpb8I0wwpma10zNdNA3J1im0_npk1Ui-VJRDXYJZYVw6Et_aVKJghrCV_lSGaIO4CAgFQ7nRuSuzX6OWLpgKdz_hJVeM0MB14t35bKJsjXLud0BAZ7Q3bnENfU4zQLC_UNOSZs" 
                className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity grayscale"
                alt="Powder"
               />
              <div className="relative z-10">
                <FlaskConical className="text-primary w-12 h-12 mb-6" />
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Clinical Dosing</h3>
                <p className="text-zinc-400">We don't do 'fairy dusting'. Every active ingredient is dosed at the exact levels used in human clinical trials.</p>
              </div>
            </div>

            <div className="bg-zinc-900 p-10 border border-zinc-800 flex flex-col justify-center min-h-[350px]">
              <ShieldCheck className="text-primary w-12 h-12 mb-6" />
              <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-4">100% Transparent</h3>
              <p className="text-sm text-zinc-400">No proprietary blends. What you see on the label is exactly what is in the tub. Absolute transparency for absolute trust.</p>
            </div>

            <div className="bg-zinc-900 p-10 border border-zinc-800 flex flex-col justify-center min-h-[350px]">
              <CheckCircle className="text-primary w-12 h-12 mb-6" />
              <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-4">Third-Party Tested</h3>
              <p className="text-sm text-zinc-400">Every batch is rigorously tested by independent labs for purity, potency, and banned substances. Certified clean.</p>
            </div>

            <div className="bg-zinc-900 p-10 border border-zinc-800 md:col-span-2 flex items-center gap-10 min-h-[350px]">
              <div className="hidden md:block">
                <Bolt className="text-primary w-24 h-24" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Maximum Bioavailability</h3>
                <p className="text-zinc-400 leading-relaxed">We utilize premium, patented ingredient forms to ensure maximum absorption. It's not about what you consume; it's about what your body can utilize.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

