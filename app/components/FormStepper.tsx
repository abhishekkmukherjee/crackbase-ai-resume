interface FormStepperProps {
    currentStep: number;
    totalSteps: number;
    steps: string[];
  }
  
  export default function FormStepper({ currentStep, totalSteps, steps }: FormStepperProps) {
    return (
      <div className="w-full py-4">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${index < currentStep ? 'bg-green-500 text-white' : 
                  index === currentStep ? 'bg-blue-500 text-white' : 
                  'bg-gray-200 text-gray-600'}
              `}>
                {index + 1}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700">
                {step}
              </span>
              {index < totalSteps - 1 && (
                <div className={`
                  w-12 h-0.5 mx-4
                  ${index < currentStep ? 'bg-green-500' : 'bg-gray-200'}
                `} />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
  