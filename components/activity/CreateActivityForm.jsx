// 'use client';

// import React, { useState } from 'react';
// import StepIndicator from '@/components/activity/step-indicator';
// import Step1BasicInfo from '@/components/activity/steps/Step1BasicInfo';
// import Step2Experience from '@/components/activity/steps/Step2Experience';
// import Step3Itinerary from '@/components/activity/steps/Step3Itinerary';
// import Step4InfoAndLogistics from '@/components/activity/steps/Step4InfoAndLogistics';
// import Step5BBQBuffet from '@/components/activity/steps/Step5BBQBuffet';
// import Step6PrivateSUV from '@/components/activity/steps/Step6PrivateSUV';
// import Step7MediaUpload from '@/components/activity/steps/Step7MediaUpload';
// import Step8ReviewSubmit from '@/components/activity/steps/Step8ReviewSubmit';
// import { useCreateActivityMutation } from '@/features/activity/activityApi';

// export default function CreateActivityForm() {
//   const [currentStep, setCurrentStep] = useState(1);
//   const [createActivity, { isLoading }] = useCreateActivityMutation();
//   const [error, setError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');

//   const [formData, setFormData] = useState({
//     name: '',
//     categoryId: '',
//     placeId: '',
//     timeSlots: [],
//     Experience: {
//       title: '',
//       note: '',
//       description: '',
//       highlights: [],
//     },
//     Itinerary: [],
//     InfoAndLogistics: {
//       pickupZone: {
//         description: '',
//         note: '',
//         mapLink: '',
//       },
//       keyInfo: [],
//       essentialGuide: [],
//     },
//     BBQ_BUFFET: {
//       title: '',
//       description: '',
//       fields: [],
//     },
//     PrivateSUV: {
//       available: false,
//       fee: 0,
//       model: 'SUV',
//     },
//     images: [],
//     video: null,
//     isActive: true,
//   });

//   const steps = [
//     { number: 1, label: 'Basic Info' },
//     { number: 2, label: 'Experience' },
//     { number: 3, label: 'Itinerary' },
//     { number: 4, label: 'Info & Logistics' },
//     { number: 5, label: 'BBQ Buffet' },
//     { number: 6, label: 'Private SUV' },
//     { number: 7, label: 'Media Upload' },
//     { number: 8, label: 'Review & Submit' },
//   ];

//   const handleNextStep = () => {
//     if (currentStep < steps.length) {
//       setCurrentStep(currentStep + 1);
//       window.scrollTo(0, 0);
//     }
//   };

//   const handlePreviousStep = () => {
//     if (currentStep > 1) {
//       setCurrentStep(currentStep - 1);
//       window.scrollTo(0, 0);
//     }
//   };

//   const handleFormDataChange = (newData) => {
//     setFormData(prevData => ({
//       ...prevData,
//       ...newData,
//     }));
//   };

//   const handleSubmit = async () => {
//     setError('');
//     setSuccessMessage('');

//     try {
//       const formDataToSend = new FormData();

//       formDataToSend.append('name', formData.name);
//       formDataToSend.append('categoryId', formData.categoryId);
//       formDataToSend.append('placeId', formData.placeId);
//       formDataToSend.append(
//         "timeSlots",
//         JSON.stringify(formData.timeSlots)
//       );
//       formDataToSend.append('isActive', formData.isActive);

//       formDataToSend.append('Experience', JSON.stringify(formData.Experience));
//       formDataToSend.append('Itinerary', JSON.stringify(formData.Itinerary));
//       formDataToSend.append('InfoAndLogistics', JSON.stringify(formData.InfoAndLogistics));
//       formDataToSend.append('BBQ_BUFFET', JSON.stringify(formData.BBQ_BUFFET));
//       formDataToSend.append('PrivateSUV', JSON.stringify(formData.PrivateSUV));

//       if (formData.images?.length) {
//         formData.images.forEach((image) => {
//           if (image instanceof File) {
//             formDataToSend.append('images', image);
//           }
//         });
//       }

//       if (formData.video instanceof File) {
//         formDataToSend.append('video', formData.video);
//       }

//       await createActivity(formDataToSend).unwrap();
//       setSuccessMessage('Activity created successfully!');

//       setTimeout(() => {
//         window.location.reload();
//       }, 2000);
//     } catch (err) {
//       setError(err?.data?.message || err.message || 'Failed to create activity');
//     }
//   };

//   const renderStep = () => {
//     const commonProps = {
//       formData,
//       onFormDataChange: handleFormDataChange,
//       onNext: handleNextStep,
//       onPrevious: handlePreviousStep,
//     };

//     switch (currentStep) {
//       case 1:
//         return <Step1BasicInfo {...commonProps} />;
//       case 2:
//         return <Step2Experience {...commonProps} />;
//       case 3:
//         return <Step3Itinerary {...commonProps} />;
//       case 4:
//         return <Step4InfoAndLogistics {...commonProps} />;
//       case 5:
//         return <Step5BBQBuffet {...commonProps} />;
//       case 6:
//         return <Step6PrivateSUV {...commonProps} />;
//       case 7:
//         return <Step7MediaUpload {...commonProps} />;
//       case 8:
//         return (
//           <Step8ReviewSubmit
//             {...commonProps}
//             onSubmit={handleSubmit}
//             isLoading={isLoading}
//           />
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-linear-to-br from-slate-100 to-slate-200 py-8 px-4">
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="bg-white rounded-lg shadow-lg p-8 mb-8 border-l-4 border-blue-500">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Activity</h1>
//           <p className="text-gray-600">Fill in all details to create a comprehensive activity package</p>
//         </div>

//         {/* Alerts */}
//         {error && (
//           <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg flex items-start gap-3">
//             <span className="text-lg">⚠️</span>
//             <div>
//               <p className="font-semibold">Error</p>
//               <p className="text-sm">{error}</p>
//             </div>
//           </div>
//         )}
//         {successMessage && (
//           <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-lg flex items-start gap-3">
//             <span className="text-lg">✅</span>
//             <div>
//               <p className="font-semibold">Success</p>
//               <p className="text-sm">{successMessage}</p>
//             </div>
//           </div>
//         )}

//         {/* Step Indicator */}
//         <StepIndicator currentStep={currentStep} steps={steps} />

//         {/* Form Content */}
//         <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
//           {renderStep()}
//         </div>

//         {/* Navigation Buttons */}
//         <div className="flex gap-4 justify-between">
//           {currentStep > 1 && (
//             <button
//               onClick={handlePreviousStep}
//               disabled={isLoading}
//               className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               ← Previous Step
//             </button>
//           )}

//           {currentStep < steps.length && (
//             <button
//               onClick={handleNextStep}
//               disabled={isLoading}
//               className="ml-auto px-6 py-3 bg-linear-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Next Step →
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }







'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import StepIndicator from '@/components/activity/step-indicator';
import Step1BasicInfo from '@/components/activity/steps/Step1BasicInfo';
import Step2Experience from '@/components/activity/steps/Step2Experience';
import Step3Itinerary from '@/components/activity/steps/Step3Itinerary';
import Step4InfoAndLogistics from '@/components/activity/steps/Step4InfoAndLogistics';
import Step5BBQBuffet from '@/components/activity/steps/Step5BBQBuffet';
import Step6PrivateSUV from '@/components/activity/steps/Step6PrivateSUV';
import Step7MediaUpload from '@/components/activity/steps/Step7MediaUpload';
import Step8ReviewSubmit from '@/components/activity/steps/Step8ReviewSubmit';
import { useRouter } from 'next/navigation';
import { 
  useCreateActivityMutation, 
  useGetActivityByIdQuery 
} from '@/features/activity/activityApi';

export default function CreateActivityForm() {
  const searchParams = useSearchParams();
  const duplicateId = searchParams.get("duplicateId");

  const [currentStep, setCurrentStep] = useState(1);
  const [createActivity, { isLoading }] = useCreateActivityMutation();
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
const router = useRouter();
  // Fetch Duplicate Data
  const { data: duplicateActivityData, isLoading: isFetchingDuplicate } = useGetActivityByIdQuery(
    duplicateId, 
    { skip: !duplicateId }
  );
console.log("activitid",duplicateActivityData)
  const [formData, setFormData] = useState({
    name: '',
    language: '',     
  isDuplicate: false,
    categoryId: '',
    placeId: '',
    timeSlots: [],
    Experience: { title: '', note: '', description: '', highlights: [] },
    Itinerary: [],
    InfoAndLogistics: { pickupZone: { description: '', note: '', mapLink: '' }, keyInfo: [], essentialGuide: [] },
    BBQ_BUFFET: { title: '', description: '', fields: [] },
    PrivateSUV: { available: false, fee: 0, model: 'SUV' },
    images: [], // Will hold Files OR existing image objects
    video: null, // Will hold File OR existing video object
    packages: [], // Added to hold variants
    originalActivityId: null,
    addons: [],
    isActive: true,
  });

  // AUTO-FILL LOGIC FOR DUPLICATION
  useEffect(() => {
    if (duplicateActivityData?.data) {
      const act = duplicateActivityData.data;
      console.log("dddd", duplicateActivityData);

      // Map existing images to be preserved
      const mappedImages = act.Images ? act.Images.map(img => ({
        preview: img.secure_url,
        secure_url: img.secure_url,
        public_id: img.public_id,
        isExisting: true
      })) : [];

      // Map existing video
      const mappedVideo = act.Video?.secure_url ? {
        preview: act.Video.secure_url,
        secure_url: act.Video.secure_url,
        public_id: act.Video.public_id,
        isExisting: true
      } : null;

      // Map packages (remove old DB IDs so backend creates new ones)
      const mappedPackages = act.packages ? act.packages.map(pkg => {
        const { _id, activityId, createdAt, updatedAt, __v, ...rest } = pkg;
        const cleanedBookingFields = rest.bookingFields?.map(bf => {
           const { _id, ...bfRest } = bf;
           return bfRest;
        }) || [];
        return { ...rest, bookingFields: cleanedBookingFields };
      }) : [];

      setFormData(prevData => ({
        ...prevData,
         originalActivityId: act._id,
        // name: act.name ? `${act.name} (Copy)` : 'New Activity (Copy)',
        name: act.name || 'New Activity',
         language: act.languageId?._id || act.languageId || '',
        categoryId: act.categoryId?._id || act.categoryId || '',
        placeId: act.placeId?._id || act.placeId || '',
        timeSlots: act.timeSlots || [],
        Experience: {
          title: act.Experience?.title || '',
          note: act.Experience?.note || '',
          description: act.Experience?.description || '',
          highlights: act.Experience?.highlights || [],
        },
        Itinerary: act.Itinerary || [],
        InfoAndLogistics: {
          pickupZone: {
            description: act.InfoAndLogistics?.pickupZone?.description || '',
            note: act.InfoAndLogistics?.pickupZone?.note || '',
            mapLink: act.InfoAndLogistics?.pickupZone?.mapLink || '',
          },
          keyInfo: act.InfoAndLogistics?.keyInfo || [],
          essentialGuide: act.InfoAndLogistics?.essentialGuide || [],
        },
        BBQ_BUFFET: act.BBQ_BUFFET || { title: '', description: '', fields: [] },
        PrivateSUV: act.PrivateSUV || { available: false, fee: 0, model: 'SUV' },
        images: mappedImages,
        video: mappedVideo,
        packages: mappedPackages,
        addons: act.addons?.map(a => typeof a === 'object' ? a._id : a) || [],
        isActive: true,
      }));
    }
  }, [duplicateActivityData]);

  const steps = [
    { number: 1, label: 'Basic Info' }, { number: 2, label: 'Experience' },
    { number: 3, label: 'Itinerary' }, { number: 4, label: 'Info & Logistics' },
    { number: 5, label: 'BBQ Buffet' }, { number: 6, label: 'Private SUV' },
    { number: 7, label: 'Media Upload' }, { number: 8, label: 'Review & Submit' },
  ];

  const handleNextStep = () => { if (currentStep < steps.length) { setCurrentStep(currentStep + 1); window.scrollTo(0, 0); } };
  const handlePreviousStep = () => { if (currentStep > 1) { setCurrentStep(currentStep - 1); window.scrollTo(0, 0); } };
  const handleFormDataChange = (newData) => setFormData(prev => ({ ...prev, ...newData }));

  // SUBMIT PAYLOAD HANDLER
  const handleSubmit = async () => {
    setError('');
    setSuccessMessage('');

    try {
      const formDataToSend = new FormData();

      // Basic Text & Arrays
      formDataToSend.append('name', formData.name);
       formDataToSend.append('language', formData.language); 
  formDataToSend.append('isDuplicate', formData.isDuplicate);
      formDataToSend.append('categoryId', formData.categoryId);
      formDataToSend.append('placeId', formData.placeId);
  //      if (formData.originalActivityId) {
  //   formDataToSend.append('activityId', formData.originalActivityId);
  // }
     if (formData.isDuplicate && formData.originalActivityId) {
      // Backend controller 'sourceActivityId' expect kar raha hai
      formDataToSend.append('sourceActivityId', formData.originalActivityId);
    }
      formDataToSend.append("timeSlots", JSON.stringify(formData.timeSlots));
      formDataToSend.append('isActive', formData.isActive);

      // Objects
      formDataToSend.append('Experience', JSON.stringify(formData.Experience));
      formDataToSend.append('Itinerary', JSON.stringify(formData.Itinerary));
      formDataToSend.append('InfoAndLogistics', JSON.stringify(formData.InfoAndLogistics));
      formDataToSend.append('BBQ_BUFFET', JSON.stringify(formData.BBQ_BUFFET));
      formDataToSend.append('PrivateSUV', JSON.stringify(formData.PrivateSUV));
      
      // Send Packages
      formDataToSend.append('packages', JSON.stringify(formData.packages || []));
  formDataToSend.append('addons', JSON.stringify(formData.addons || []));
      // Handling Images (Separating new files vs existing duplicated URLs)
      const existingImages = [];
      if (formData.images?.length) {
        formData.images.forEach((image) => {
          if (image instanceof File) {
            formDataToSend.append('images', image); // New upload
          } else if (image.isExisting) {
            existingImages.push({ secure_url: image.secure_url, public_id: image.public_id });
          }
        });
      }
      if (existingImages.length > 0) {
        formDataToSend.append('existingImages', JSON.stringify(existingImages));
      }

      // Handling Video (Separating new file vs existing duplicated URL)
      if (formData.video instanceof File) {
        formDataToSend.append('video', formData.video);
      } else if (formData.video?.isExisting) {
        formDataToSend.append('existingVideo', JSON.stringify({ 
          secure_url: formData.video.secure_url, 
          public_id: formData.video.public_id 
        }));
      }
console.log("lang",formDataToSend)
      await createActivity(formDataToSend).unwrap();
      setSuccessMessage(duplicateId ? 'Activity duplicated successfully!' : 'Activity created successfully!');

      // setTimeout(() => { window.location.reload(); }, 2000);
      setTimeout(() => {
  router.push('/admin/activities');
}, 2000);
    } catch (err) {
      setError(err?.data?.message || err.message || 'Failed to create activity');
    }
  };

  const renderStep = () => {
    const commonProps = { formData, onFormDataChange: handleFormDataChange, onNext: handleNextStep, onPrevious: handlePreviousStep };
    switch (currentStep) {
      case 1: return <Step1BasicInfo {...commonProps} />;
      case 2: return <Step2Experience {...commonProps} />;
      case 3: return <Step3Itinerary {...commonProps} />;
      case 4: return <Step4InfoAndLogistics {...commonProps} />;
      case 5: return <Step5BBQBuffet {...commonProps} />;
      case 6: return <Step6PrivateSUV {...commonProps} />;
      case 7: return <Step7MediaUpload {...commonProps} />;
      case 8: return <Step8ReviewSubmit {...commonProps} onSubmit={handleSubmit} isLoading={isLoading} />;
      default: return null;
    }
  };

  if (duplicateId && isFetchingDuplicate) return <div className="min-h-screen flex items-center justify-center"><p>Loading Duplicate Data...</p></div>;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 to-slate-200 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8 border-l-4 border-blue-500">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {duplicateId ? "Duplicate Activity" : "Create New Activity"}
          </h1>
          <p className="text-gray-600">Fill in all details to create a comprehensive activity package</p>
        </div>

        {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>}
        {successMessage && <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg">{successMessage}</div>}

        <StepIndicator currentStep={currentStep} steps={steps} />

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          {renderStep()}
        </div>

        <div className="flex gap-4 justify-between">
          {currentStep > 1 && (
            <button onClick={handlePreviousStep} disabled={isLoading} className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300">
              ← Previous Step
            </button>
          )}
          {currentStep < steps.length && (
            <button onClick={handleNextStep} disabled={isLoading} className="ml-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
              Next Step →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}