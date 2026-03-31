'use client';

import React from 'react';

export default function StepIndicator({ steps, currentStep }) {
  return (
    <div className="w-full bg-white rounded-lg p-6 mb-8 shadow-sm border border-gray-200">
      <div className="flex flex-col gap-4">
        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-linear-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {steps.map((step) => {
            let status = 'pending';
            if (currentStep > step.number) status = 'completed';
            else if (currentStep === step.number) status = 'active';

            return (
              <div 
                key={step.number} 
                className={`flex flex-col items-center gap-2 transition-all duration-300 ${
                  status === 'active' ? 'scale-105' : ''
                }`}
              >
                <div 
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                    transition-all duration-300 shadow-sm
                    ${status === 'completed' ? 'bg-green-500 text-white' : ''}
                    ${status === 'active' ? 'bg-blue-500 text-white shadow-lg ring-2 ring-blue-300' : ''}
                    ${status === 'pending' ? 'bg-gray-200 text-gray-500' : ''}
                  `}
                >
                  {status === 'completed' ? '✓' : step.number}
                </div>
                <span className={`
                  text-xs font-semibold text-center leading-tight
                  ${status === 'pending' ? 'text-gray-400' : 'text-gray-700'}
                  ${status === 'active' ? 'text-blue-600 font-bold' : ''}
                `}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Current Step Info */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-600">
            Step {currentStep} of {steps.length} • {steps[currentStep - 1]?.label}
          </p>
        </div>
      </div>
    </div>
  );
}
