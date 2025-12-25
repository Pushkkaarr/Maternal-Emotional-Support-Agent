import { Heart } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-12">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="md:col-span-5">
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-display font-bold text-family-deep-blue">
                Family<span className="text-family-accent">Connect</span>
              </span>
            </Link>
            <p className="text-family-text-light mb-6 max-w-md">
              Creating meaningful connections through AI family members, 
              providing support and understanding whenever you need it.
            </p>
            <div className="flex items-center text-family-text-light">
              <span>Made with</span>
              <Heart className="w-4 h-4 mx-1 text-family-accent" />
              <span>for everyone seeking connection</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="md:col-span-2">
            <h3 className="font-medium text-lg mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-family-text-light hover:text-family-deep-blue transition-colors">Home</Link></li>
              <li><Link href="/about" className="text-family-text-light hover:text-family-deep-blue transition-colors">About</Link></li>
              <li><Link href="/models" className="text-family-text-light hover:text-family-deep-blue transition-colors">Family Models</Link></li>
              <li><Link href="/chatbot" className="text-family-text-light hover:text-family-deep-blue transition-colors">Chatbot</Link></li>
              <li><Link href="/Donation" className="text-family-text-light hover:text-family-deep-blue transition-colors">Donate</Link></li>
              <li><Link href="/Adoption" className="text-family-text-light hover:text-family-deep-blue transition-colors">Adopt</Link></li>
            </ul>
          </div>

          {/* Family Models */}
          <div className="md:col-span-2">
            <h3 className="font-medium text-lg mb-4">Family Models</h3>
            <ul className="space-y-2">
              <li><Link href="/chatbot?model=mom" className="text-family-text-light hover:text-family-deep-blue transition-colors">Mom</Link></li>
              <li><Link href="/chatbot?model=dad" className="text-family-text-light hover:text-family-deep-blue transition-colors">Dad</Link></li>
              <li><Link href="/chatbot?model=sibling" className="text-family-text-light hover:text-family-deep-blue transition-colors">Sibling</Link></li>
              <li><Link href="/chatbot?model=grandparent" className="text-family-text-light hover:text-family-deep-blue transition-colors">Grandparent</Link></li>
            </ul>
          </div>

          {/* Support Section */}
          <div className="md:col-span-3">
            <h3 className="font-medium text-lg mb-4">Support Our Mission</h3>
            <p className="text-family-text-light mb-4">
              Help us provide care and connection to those who need it most.
            </p>
            <div className="flex flex-col space-y-2">
              <Link href="/Donation" className="btn-primary inline-flex justify-center">
                Donate Today
              </Link>
              <Link href="/Adoption" className="btn-secondary inline-flex justify-center">
                Sponsor a Child
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 border-t border-gray-100 text-center text-family-text-light text-sm">
          <p>© {new Date().getFullYear()} FamilyConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
