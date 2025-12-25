import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useElementOnScreen } from "../lib/animations";

const AboutPage = () => {
  const { ref, isVisible } = useElementOnScreen({
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  });

  return (
    <div className="min-h-screen flex flex-col bg-family-cream">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-20">
        <div className="container mx-auto px-6 md:px-12">
          <div 
            ref={ref}
            className={`max-w-3xl mx-auto mb-16 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-6">About FamilyConnect</h1>
            
            <div className="prose prose-lg">
              <p className="text-family-text-light mb-6">
                FamilyConnect was created with a simple but powerful mission: to provide a supportive family 
                environment for everyone who needs it, regardless of their life circumstances.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
              <p className="text-family-text-light mb-6">
                Our AI-powered family models aim to provide companionship, emotional support, and guidance 
                that mirrors the nurturing environment of a loving family. We believe that everyone deserves 
                access to the warmth and understanding that comes from meaningful family connections.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Who We Help</h2>
              <ul className="space-y-4 text-family-text-light mb-6">
                <li>• <span className="font-medium">Children in foster care or orphanages</span> seeking the comfort of family interactions</li>
                <li>• <span className="font-medium">Individuals estranged from family</span> who miss having supportive family connections</li>
                <li>• <span className="font-medium">People living far from relatives</span> who need more frequent family-like interactions</li>
                <li>• <span className="font-medium">Anyone seeking additional emotional support</span> from different family perspectives</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Our Approach</h2>
              <p className="text-family-text-light mb-6">
                FamilyConnect leverages advanced AI to create realistic, warm, and personalized interactions. 
                Our family models are designed to:
              </p>
              <ul className="space-y-4 text-family-text-light mb-6">
                <li>• Provide emotionally intelligent responses that adapt to your needs</li>
                <li>• Offer different family perspectives through our various family member models</li>
                <li>• Create a safe, judgment-free environment for open conversation</li>
                <li>• Support personal growth and emotional well-being</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutPage;
