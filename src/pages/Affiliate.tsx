import { motion } from 'motion/react';
import { CheckCircle, Award, Star } from 'lucide-react';

export default function Affiliate() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5FKynIS4CtMepkqAdbHADWaUDVW_wB01_NK__LDUykxJFSKH1BAymYHkZcBlZZLhVB6sbCJd-qcF8pABmg30pwIUF4UtZcc2HwP1ntYzHcIiXqKzi5ofMRkZPb1zzSvtUGUReL5nF4LAbX1enACvR3AEORBJpcvTISO5C1fojgaEfFc1kc8F2f7umL3NRN8Zt_soPFeExikGG21QjpRyAV_wb5xhZjjT6fmRW1gjEL95aeHsNBbcbNwob9CzaUoidbMhtLsmWGTc" 
            alt="Affiliate Hero" 
            className="w-full h-full object-cover opacity-30 grayscale brightness-50" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 w-full text-center flex flex-col items-center">
          <span className="text-primary font-black tracking-widest uppercase mb-6 block text-sm">BE-FOX Elite Network</span>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-8xl uppercase font-black text-white mb-8 tracking-tighter"
          >
            Monetize Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-red-500">Dominance</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto mb-12"
          >
            Join the most aggressive affiliate program in sports nutrition. Turn your influence into serious revenue while repping the highest-performing supplements on the market.
          </motion.p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#apply" className="bg-primary text-white px-12 py-5 rounded-full font-black uppercase tracking-widest hover:bg-primary-hover transition-all shadow-xl shadow-primary/20">
              Apply Now
            </a>
            <a href="#structure" className="bg-zinc-900 border border-zinc-800 text-white px-12 py-5 rounded-full font-black uppercase tracking-widest hover:bg-zinc-800 transition-all">
              View Commission
            </a>
          </div>
        </div>
      </section>

      {/* Structure */}
      <section className="py-32 max-w-7xl mx-auto px-6 md:px-10" id="structure">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-black uppercase text-white mb-4 tracking-tighter">Commission Structure</h2>
          <p className="text-zinc-400 max-w-xl mx-auto">Tiered rewards built for high performers. The more you push, the heavier the payout.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
          <TierCard 
            tier="Base Tier" 
            rate="10%" 
            icon={<Award className="w-12 h-12" />} 
            perks={["10% on all referred sales", "Personal 15% discount code", "Access to marketing assets"]} 
            footer="Entry level for new recruits."
          />
          <TierCard 
            tier="Pro Tier" 
            rate="15%" 
            highlight 
            icon={<Star className="w-12 h-12" />} 
            perks={["15% on all referred sales", "Personal 20% discount code", "Early access to new drops", "Quarterly performance bonuses"]} 
            footer="Requires $1k+/mo in generated revenue."
          />
          <TierCard 
            tier="Elite Tier" 
            rate="20%" 
            icon={<Star className="w-12 h-12" />} 
            perks={["20% on all referred sales", "Personal 25% discount code", "Free monthly stack supply", "Exclusive brand trip invites"]} 
            footer="Invite only or $5k+/mo sustained."
          />
        </div>
      </section>

      {/* Application */}
      <section className="py-32 border-t border-zinc-900 relative overflow-hidden" id="apply">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEklL9hL_Itk1-8mAZvVgAYEL_wJh0qMzXiee210L74gy-4E7KditufNn3kmacqDzySJhjTU8ZDT_nSrskziZBIskiaYuLrTrBFlOfHuYIjZ4l5lu8XLyocAP__O-1-0dyM0a3CJcmBPpKOFuMDPDPTtwJDhi1ADGuJPTbqCA9joXJQ3J5OVoZEjDiNUz3OQTo1oeBNl4TN_GIFY-8lYtdCgdc66XGQVl2L_PcSnyCR5tpbNZkE4jaWcGLNkbOMF8LbhExdR2JPUE" 
            className="w-full h-full object-cover opacity-10 grayscale" 
            alt="Gym"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-black uppercase text-white mb-8 tracking-tighter">Ready to Join the Pack?</h2>
            <p className="text-lg text-zinc-400 mb-12">
              We don't accept everyone. We are looking for athletes, trainers, and influencers who live the BE-FOX ethos. If you are built to perform and ready to dominate your space, submit your application.
            </p>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input className="bg-black border border-zinc-800 text-white p-5 focus:border-primary outline-none transition-all placeholder-zinc-700" placeholder="FIRST NAME" />
                <input className="bg-black border border-zinc-800 text-white p-5 focus:border-primary outline-none transition-all placeholder-zinc-700" placeholder="LAST NAME" />
              </div>
              <input className="w-full bg-black border border-zinc-800 text-white p-5 focus:border-primary outline-none transition-all placeholder-zinc-700" placeholder="EMAIL ADDRESS" />
              <input className="w-full bg-black border border-zinc-800 text-white p-5 focus:border-primary outline-none transition-all placeholder-zinc-700" placeholder="PRIMARY SOCIAL MEDIA LINK" />
              <button className="w-full bg-primary text-white py-6 rounded-full font-black uppercase tracking-widest hover:bg-primary-hover shadow-xl shadow-primary/20 transition-all mt-6">
                Submit Application
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

function TierCard({ tier, rate, icon, perks, footer, highlight }: any) {
  return (
    <div className={`p-10 border flex flex-col relative transition-all duration-500 overflow-hidden ${
      highlight 
        ? 'bg-zinc-900 border-primary shadow-2xl shadow-primary/10 scale-105 z-10 md:-translate-y-4' 
        : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
    }`}>
      {highlight && <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-orange-500" />}
      <div className={`mb-8 ${highlight ? 'text-primary' : 'text-zinc-700'}`}>
        {icon}
      </div>
      <span className={`text-xs font-black uppercase tracking-widest mb-2 block ${highlight ? 'text-primary' : 'text-zinc-500'}`}>{tier}</span>
      <h3 className="text-4xl font-black text-white mb-10">{rate} Payout</h3>
      <ul className="space-y-5 mb-12 flex-grow">
        {perks.map((p: any) => (
          <li key={p} className="flex items-start gap-3">
            <CheckCircle className={`w-5 h-5 shrink-0 mt-0.5 ${highlight ? 'text-primary' : 'text-zinc-800'}`} />
            <span className={`text-sm font-medium ${highlight ? 'text-zinc-100' : 'text-zinc-500'}`}>{p}</span>
          </li>
        ))}
      </ul>
      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 pt-6 border-t border-zinc-900">{footer}</p>
    </div>
  );
}
