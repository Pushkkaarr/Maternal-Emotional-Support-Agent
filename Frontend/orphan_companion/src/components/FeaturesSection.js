import { Heart, MessageCircle, Users, Shield, BrainCircuit, Puzzle } from "lucide-react";
import { useElementOnScreen } from "../lib/animations";

const features = [
  {
    icon: <Heart className="w-10 h-10 text-family-accent" />,
    title: "Emotional Support",
    description:
      "Experience the warmth and understanding that comes from meaningful family interactions, available whenever you need it.",
  },
  {
    icon: <MessageCircle className="w-10 h-10 text-family-deep-blue" />,
    title: "Natural Conversations",
    description:
      "Engage in authentic, flowing conversations that adapt to your personal communication style.",
  },
  {
    icon: <Users className="w-10 h-10 text-family-accent" />,
    title: "Multiple Family Roles",
    description:
      "Connect with different family member models, each with their own unique personality and perspective.",
  },
  {
    icon: <Shield className="w-10 h-10 text-family-deep-blue" />,
    title: "Safe Environment",
    description: "Enjoy a judgment-free space where you can express yourself openly and honestly.",
  },
  {
    icon: <BrainCircuit className="w-10 h-10 text-family-accent" />,
    title: "Personalized Interaction",
    description:
      "Family models learn and adapt to your preferences, creating more meaningful connections over time.",
  },
  {
    icon: <Puzzle className="w-10 h-10 text-family-deep-blue" />,
    title: "Growth & Development",
    description:
      "Receive guidance and support for personal growth in a nurturing, family-like environment.",
  },
];

const FeatureCard = ({ feature, index }) => {
  const { ref, isVisible } = useElementOnScreen({
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  });

  return (
    <div
      ref={ref}
      className={`feature-card transform transition-opacity duration-500 ${
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="mb-4">{feature.icon}</div>
      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
      <p className="text-family-text-light">{feature.description}</p>
    </div>
  );
};

const FeaturesSection = () => {
  const { ref, isVisible } = useElementOnScreen({
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  });

  return (
    <section className="py-20 bg-family-cream">
      <div className="container mx-auto px-6 md:px-12">
        <div
          ref={ref}
          className={`text-center max-w-3xl mx-auto mb-16 transition-opacity duration-700 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose Our Family Models?
          </h2>
          <p className="text-lg text-family-text-light">
            Our AI-powered family members provide the support, understanding, and connection
            that everyone deserves, accessible anytime you need it.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
