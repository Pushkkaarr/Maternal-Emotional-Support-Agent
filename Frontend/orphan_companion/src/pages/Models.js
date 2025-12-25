import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FamilyModels from "../components/FamilyModels";
import { useElementOnScreen } from "../lib/animations";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const ModelsPage = () => {
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
          {/* <div 
            ref={ref}
            className={`max-w-3xl mx-auto mb-16 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Our Family Models</h1>
            
            <p className="text-lg text-family-text-light mb-8">
              FamilyConnect offers various AI family member models, each with a unique personality 
              and perspective designed to provide different types of emotional support and guidance.
            </p>
            
            <p className="text-family-text-light mb-8">
              Choose the family model that best suits your needs, or interact with multiple models 
              to experience different perspectives and forms of support.
            </p>
          </div> */}
          
          <FamilyModels />
          
          <div className="mt-20 text-center">
            <div className="max-w-2xl mx-auto glass-panel p-8 rounded-2xl">
              <h2 className="text-2xl font-semibold mb-3">Ready to connect?</h2>
              <p className="text-family-text-light mb-6">
                Start a conversation with any of our family models and experience 
                the support and understanding you deserve.
              </p>
              <Link href="/ChatBot" className="btn-primary inline-flex items-center gap-2">
                Begin Your Conversation <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ModelsPage;
