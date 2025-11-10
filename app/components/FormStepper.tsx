interface FormStepperProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export default function FormStepper({ currentStep, totalSteps, steps }: FormStepperProps) {
  return (
    <div className="w-full py-8">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs font-medium text-gray-500 mb-2">
          <span>Step {currentStep + 1} of {totalSteps}</span>
          <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step indicators */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="flex items-center w-full">
              {/* Step circle */}
              <div className={`
                relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300
                ${index < currentStep 
                  ? 'bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg' 
                  : index === currentStep 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg ring-4 ring-blue-100' 
                    : 'bg-white border-2 border-gray-300 text-gray-400'}
              `}>
                {index < currentStep ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>

              {/* Connecting line */}
              {index < totalSteps - 1 && (
                <div className="flex-1 h-0.5 mx-2">
                  <div className={`
                    h-full transition-all duration-500
                    ${index < currentStep ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gray-200'}
                  `} />
                </div>
              )}
            </div>

            {/* Step label */}
            <span className={`
              mt-3 text-xs font-medium text-center transition-colors duration-300
              ${index <= currentStep ? 'text-gray-900' : 'text-gray-400'}
            `}>
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
  