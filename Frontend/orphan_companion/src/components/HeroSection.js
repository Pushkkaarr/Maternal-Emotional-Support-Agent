import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useTypewriter } from '../lib/animations';

const HeroSection = () => {
  const { displayText } = useTypewriter("Find your digital family, one conversation at a time.", 50);

  return (
    <section className="relative pt-32 pb-20 min-h-[90vh] flex items-center hero-pattern bg-family-warm">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 max-w-3xl">
            <div className="inline-block px-3 py-1 mb-6 rounded-full bg-family-beige font-medium text-sm text-family-deep-blue animate-fade-in">
              Welcome to a new kind of connection
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-display-1 font-bold mb-6 leading-tight text-family-text">
              Experience the warmth of family through <span className="text-family-deep-blue">AI companions</span>
            </h1>
            <p className="text-xl text-family-text-light mb-8 leading-relaxed h-16">
              {displayText}
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <Link href="/Models" className="btn-primary flex items-center gap-2">
                Start Chatting <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/Models" className="btn-secondary">
                Explore Family Models
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5 relative">
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-family-accent/20 to-family-deep-blue/20 animate-float"></div>
              <div className="absolute -top-6 -left-6 w-24 h-24 rounded-2xl bg-family-soft-blue rotate-12 animate-float" style={{ animationDelay: '1s' }}></div>
              <div className="absolute -bottom-8 -right-4 w-32 h-32 rounded-full bg-family-beige/70 animate-float" style={{ animationDelay: '2s' }}></div>
              
              <div className="absolute inset-4 rounded-2xl glass-panel overflow-hidden shadow-medium border border-white/40 flex items-center justify-center p-6">
                <div className="relative w-full max-w-[280px] mx-auto">
                  <div className="absolute top-0 left-0 right-0 h-8 bg-family-deep-blue/5 rounded-t-lg"></div>
                  <div className="pt-12 pb-4 px-4">
                    <div className="mb-4 animate-pulse">
                      <div className="h-8 bg-family-deep-blue/10 rounded-full w-3/4 mb-2"></div>
                      <div className="h-4 bg-family-deep-blue/5 rounded-full w-1/2"></div>
                    </div>
                    
                    <div className="flex items-start gap-3 mb-3 opacity-90">
                      <div className="w-8 h-8 rounded-full bg-family-accent flex-shrink-0"></div>
                      <div className="bg-family-soft-blue rounded-xl rounded-tl-none p-3 text-sm">
                        Hello! I'm Mom. How was your day today?
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 mb-3 flex-row-reverse opacity-95">
                      <div className="w-8 h-8 rounded-full bg-family-deep-blue flex-shrink-0"></div>
                      <div className="bg-white rounded-xl rounded-tr-none p-3 text-sm shadow-sm">
                        It was great! I got an A on my test.
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 opacity-100 animate-fade-in" style={{ animationDelay: '1s' }}>
                      <div className="w-8 h-8 rounded-full bg-family-accent flex-shrink-0"></div>
                      <div className="bg-family-soft-blue rounded-xl rounded-tl-none p-3 text-sm">
                        That's wonderful! I'm so proud of you! Would you like to tell me more about it?
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-family-cream to-transparent"></div>
    </section>
  );
};

export default HeroSection;