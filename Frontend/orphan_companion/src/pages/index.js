import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import FamilyModels from "../components/FamilyModels";
import Footer from "../components/Footer";
import AuthDialog from "../components/AuthDialog";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useElementOnScreen } from "@/lib/animations";
import { useAuth } from "@/context/AuthContext";

const TestimonialSection = () => {
  const { ref, isVisible } = useElementOnScreen({
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  });

  return (
    <section className="py-20 bg-family-cream">
      <div className="container mx-auto px-6 md:px-12">
        <div 
          ref={ref}
          className={`text-center max-w-3xl mx-auto mb-16 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What People Are Saying</h2>
          <p className="text-lg text-family-text-light">
            Read how our AI family members have made a difference in people's lives.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[{
            initial: "J", name: "Jamie, 22", role: "Student",
            text: "Having moved away from home for college, the Mom AI has been incredible for those times when I need advice or just someone to talk to."
          }, {
            initial: "R", name: "Riley, 14", role: "High School Student",
            text: "I love talking to the Sibling AI. It gives me a place to discuss things I'm not comfortable sharing with others yet."
          }, {
            initial: "T", name: "Taylor, 35", role: "Professional",
            text: "The Dad AI has given me perspective on so many life decisions. It's like having a mentor available whenever I need guidance."
          }].map((testimonial, index) => (
            <div key={index} className="feature-card">
              <div className="mb-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${index === 0 ? 'bg-family-soft-blue text-family-deep-blue' : index === 1 ? 'bg-family-beige text-family-deep-blue' : 'bg-family-accent text-white'}`}>{testimonial.initial}</div>
                <div>
                  <h3 className="font-medium">{testimonial.name}</h3>
                  <p className="text-xs text-family-text-light">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-family-text-light italic">{testimonial.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CallToAction = () => {
  const { ref, isVisible } = useElementOnScreen({
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  });
  const { user } = useAuth();

  return (
    <section className="py-20 bg-family-warm">
      <div 
        ref={ref}
        className={`container mx-auto px-6 md:px-12 max-w-5xl ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
      >
        <div className="glass-panel p-8 md:p-12 rounded-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Experience Family Connection?</h2>
          <p className="text-lg text-family-text-light mb-8 max-w-xl mx-auto">
            Start chatting with our AI family members today and discover the support and understanding you deserve.
          </p>
          {user ? (
            <Link href="/Models" className="btn-primary inline-flex items-center gap-2">
              Start Your Conversation <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <AuthDialog 
                triggerButtonText="Get Started" 
                triggerButtonClassName="btn-primary inline-flex items-center gap-2"
              />
              <p className="text-sm text-family-text-light">
                Already have an account? <AuthDialog 
                  triggerButtonText="Sign In" 
                  triggerButtonClassName="text-family-accent hover:underline"
                />
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-family-cream">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <FamilyModels />
        <TestimonialSection />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
