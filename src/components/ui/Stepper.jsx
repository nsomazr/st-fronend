import { Check } from 'lucide-react';

export default function Stepper({ steps, currentStep }) {
  return (
    <div className="flex items-center justify-center mb-6">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          <div className="flex flex-col items-center min-w-[4.5rem]">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                index < currentStep
                  ? 'bg-brand-gold text-brand-navy'
                  : index === currentStep
                  ? 'bg-brand-navy text-white ring-4 ring-brand-gold/30'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
            </div>
            <span
              className={`mt-1.5 text-xs font-medium ${
                index <= currentStep ? 'text-brand-navy' : 'text-gray-400'
              }`}
            >
              {step}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-16 sm:w-24 h-0.5 mx-3 mb-5 rounded transition-all duration-300 ${
                index < currentStep ? 'bg-brand-gold' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
