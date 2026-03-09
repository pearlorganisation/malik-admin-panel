'use client';

import React, { useState } from 'react';
import StepIndicator from '@/components/activity/step-indicator';
import Step1BasicInfo from '@/components/activity/steps/Step1BasicInfo';
import Step2Experience from '@/components/activity/steps/Step2Experience';
import Step3Itinerary from '@/components/activity/steps/Step3Itinerary';
import Step4InfoAndLogistics from '@/components/activity/steps/Step4InfoAndLogistics';
import Step5BBQBuffet from '@/components/activity/steps/Step5BBQBuffet';
import Step6PrivateSUV from '@/components/activity/steps/Step6PrivateSUV';
import Step7MediaUpload from '@/components/activity/steps/Step7MediaUpload';
import Step8ReviewSubmit from '@/components/activity/steps/Step8ReviewSubmit';
import { useCreateActivityMutation } from '@/features/activity/activityApi';

export default function CreateActivityForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [createActivity, { isLoading }] = useCreateActivityMutation();
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    placeId: '',
    Experience: {
      title: '',
      note: '',
      description: '',
      highlights: [],
    },
    Itinerary: [],
    InfoAndLogistics: {
      pickupZone: {
        description: '',
        note: '',
        mapLink: '',
      },
      keyInfo: [],
      essentialGuide: [],
    },
    BBQ_BUFFET: {
      title: '',
      description: '',
      fields: [],
    },
    PrivateSUV: {
      available: false,
      fee: 0,
      model: 'SUV',
    },
    images: [],
    video: null,
    isActive: true,
  });

  const steps = [
    { number: 1, label: 'Basic Info' },
    { number: 2, label: 'Experience' },
    { number: 3, label: 'Itinerary' },
    { number: 4, label: 'Info & Logistics' },
    { number: 5, label: 'BBQ Buffet' },
    { number: 6, label: 'Private SUV' },
    { number: 7, label: 'Media Upload' },
    { number: 8, label: 'Review & Submit' },
  ];

  const handleNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleFormDataChange = (newData) => {
    setFormData(prevData => ({
      ...prevData,
      ...newData,
    }));
  };

  const handleSubmit = async () => {
    setError('');
    setSuccessMessage('');

    try {
      const formDataToSend = new FormData();

      formDataToSend.append('name', formData.name);
      formDataToSend.append('categoryId', formData.categoryId);
      formDataToSend.append('placeId', formData.placeId);
      formDataToSend.append('isActive', formData.isActive);

      formDataToSend.append('Experience', JSON.stringify(formData.Experience));
      formDataToSend.append('Itinerary', JSON.stringify(formData.Itinerary));
      formDataToSend.append('InfoAndLogistics', JSON.stringify(formData.InfoAndLogistics));
      formDataToSend.append('BBQ_BUFFET', JSON.stringify(formData.BBQ_BUFFET));
      formDataToSend.append('PrivateSUV', JSON.stringify(formData.PrivateSUV));

      if (formData.images?.length) {
        formData.images.forEach((image) => {
          if (image instanceof File) {
            formDataToSend.append('images', image);
          }
        });
      }

      if (formData.video instanceof File) {
        formDataToSend.append('video', formData.video);
      }

      await createActivity(formDataToSend).unwrap();
      setSuccessMessage('Activity created successfully!');

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      setError(err?.data?.message || err.message || 'Failed to create activity');
    }
  };

  const renderStep = () => {
    const commonProps = {
      formData,
      onFormDataChange: handleFormDataChange,
      onNext: handleNextStep,
      onPrevious: handlePreviousStep,
    };

    switch (currentStep) {
      case 1:
        return <Step1BasicInfo {...commonProps} />;
      case 2:
        return <Step2Experience {...commonProps} />;
      case 3:
        return <Step3Itinerary {...commonProps} />;
      case 4:
        return <Step4InfoAndLogistics {...commonProps} />;
      case 5:
        return <Step5BBQBuffet {...commonProps} />;
      case 6:
        return <Step6PrivateSUV {...commonProps} />;
      case 7:
        return <Step7MediaUpload {...commonProps} />;
      case 8:
        return (
          <Step8ReviewSubmit
            {...commonProps}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 to-slate-200 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8 border-l-4 border-blue-500">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Activity</h1>
          <p className="text-gray-600">Fill in all details to create a comprehensive activity package</p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg flex items-start gap-3">
            <span className="text-lg">⚠️</span>
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-lg flex items-start gap-3">
            <span className="text-lg">✅</span>
            <div>
              <p className="font-semibold">Success</p>
              <p className="text-sm">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} steps={steps} />

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 justify-between">
          {currentStep > 1 && (
            <button
              onClick={handlePreviousStep}
              disabled={isLoading}
              className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous Step
            </button>
          )}

          {currentStep < steps.length && (
            <button
              onClick={handleNextStep}
              disabled={isLoading}
              className="ml-auto px-6 py-3 bg-linear-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next Step →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
