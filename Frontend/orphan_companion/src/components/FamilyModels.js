"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useElementOnScreen } from "../lib/animations";

const models = [
  {
    role: "Mom",
    name: "Sarah",
    description: "Warm, nurturing, and always ready with practical advice and unconditional support.",
    color: "bg-[#E8A87C]",
    traits: ["Nurturing", "Compassionate", "Wise"],
    previewMessage: "How was your day, dear? Would you like to talk about it?",
    modelId: "mom" // Internal model ID for navigation and API mapping
  }
];

const ModelCard = ({ model, index }) => {
  const { ref, isVisible } = useElementOnScreen({
    root: null,
    rootMargin: "0px",
    threshold: 0.1
  });

  return (
    <div
      ref={ref}
      className={`feature-card hover:shadow-xl flex flex-col transition-opacity transform ${
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-12 h-12 rounded-full ${model.color} flex items-center justify-center text-white font-bold text-lg`}>
          {model.role.charAt(0)}
        </div>
        <div>
          <h3 className="text-xl font-semibold">{model.role}</h3>
          <p className="text-family-text-light text-sm">{model.name}</p>
        </div>
      </div>

      <p className="text-family-text-light mb-6">{model.description}</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {model.traits.map((trait, i) => (
          <span key={i} className="px-3 py-1 bg-family-soft-blue text-family-deep-blue text-xs font-medium rounded-full">
            {trait}
          </span>
        ))}
      </div>

      <div className="mt-auto">
        <div className="p-4 bg-family-soft-blue/50 rounded-xl mb-4">
          <p className="text-sm italic">"{model.previewMessage}"</p>
        </div>

        {/* Use modelId for navigation instead of role */}
        <Link
          href={`/ChatBot?model=${model.modelId}`}
          className="text-family-deep-blue font-medium flex items-center gap-1 hover:gap-2 transition-all"
        >
          Chat with {model.name} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

const FamilyModels = () => {
  const { ref, isVisible } = useElementOnScreen({
    root: null,
    rootMargin: "0px",
    threshold: 0.1
  });

  return (
    <section className="py-20 bg-family-warm">
      <div className="container mx-auto px-6 md:px-12">
        <div
          ref={ref}
          className={`max-w-3xl mx-auto mb-16 transition-opacity ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Your Digital Family</h2>
          <p className="text-lg text-family-text-light">
            Each of our family models brings a unique personality and perspective, 
            providing different types of support and connection based on your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {models.map((model, index) => (
            <ModelCard key={index} model={model} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FamilyModels;