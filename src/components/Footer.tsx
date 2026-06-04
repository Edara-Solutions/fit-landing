import { Link } from 'react-router-dom';
import ContactActions from './ContactActions';

const FOOTER_LINKS = [
  { name: 'Shipping & Returns', href: '/shipping' },
  { name: 'Contact', href: '/contact' },
  { name: 'Privacy Policy', href: '/legal#privacy' },
  { name: 'About', href: '/about' },
  // { name: 'Terms of Service', href: '/legal#terms' },
  // { name: 'Affiliate Program', href: '/affiliate' },
];

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t-4 border-primary mt-24">
      <div className="max-w-7xl mx-auto py-20 px-8 flex flex-col items-center gap-12">
        <Link to="/" className="text-3xl font-black text-primary tracking-tighter uppercase italic">
          FIT
        </Link>

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="text-[10px] text-zinc-500 font-light uppercase tracking-[0.2em] hover:text-white transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <ContactActions variant="footer" />

        <div className="text-[10px] text-zinc-600 font-light uppercase tracking-[0.2em] text-center">
          © {new Date().getFullYear()} FIT SUPPLEMENT. BUILT TO PERFORM.
        </div>
      </div>
    </footer>
  );
}
