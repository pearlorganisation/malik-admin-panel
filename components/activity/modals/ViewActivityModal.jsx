'use client';

import React, { useState } from 'react';
import {
  X,
  FileText,
  Clock,
  MapPin,
  Utensils,
  Image as ImageIcon,
  Video,
  Layers,
  Info,
  CheckCircle,
    Edit,       
  Trash2,     
  Eye         
} from 'lucide-react';
import toast from 'react-hot-toast'; 
import AddPackageModal from './AddPackageModal';
import ViewPackageModal from './ViewPackageModal';
import UpdatePackageModal from './UpdatePackageModal';
import { useGetPackagesByActivityQuery,useDeletePackageMutation  } from '@/features/activity/activityApi';

export default function ViewActivityModal({
  activity,
  onClose,
  onPackageAdded,
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddPackage, setShowAddPackage] = useState(false);

  const [selectedPackage, setSelectedPackage] = useState(null);
const [showViewPackage, setShowViewPackage] = useState(false);
  const [showUpdatePackage, setShowUpdatePackage] = useState(false);
  const [packageToEdit, setPackageToEdit] = useState(null);
  if (!activity) return null;
  // console.log("act",activity)

  // const { data: packagesData, isLoading } =
  // useGetPackagesByActivityQuery(activity._id, {
  //   skip: activeTab !== "packages",
  // });
  console.log("act", activity);

const activityIdToUse = activity?.sourceActivityId || activity?._id;

const { data: packagesData, isLoading } =
  useGetPackagesByActivityQuery(activityIdToUse, {
    skip: activeTab !== "packages" || !activityIdToUse,
  });
const [deletePackage, { isLoading: isDeleting }] = useDeletePackageMutation();
const packages = packagesData?.data || [];

console.log("pak",packages)
  const formatDate = (date) => {
    if (!date) return '—';
    try {
      return new Date(date).toLocaleDateString();
    } catch {
      return '—';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'itinerary', label: 'Itinerary', icon: Clock },
    { id: 'logistics', label: 'Logistics', icon: MapPin },
    { id: 'dining', label: 'Dining', icon: Utensils },
    { id: 'media', label: 'Media', icon: ImageIcon },
    { id: 'packages', label: 'Packages', icon: Layers },
  ];

  const handleViewPackage = (pkg) => {
  setSelectedPackage(pkg);
  setShowViewPackage(true);
};
 const handleEditPackage = (pkg) => {
    setPackageToEdit(pkg);
    setShowUpdatePackage(true);
  };

 const handleDeletePackage = async (packageId) => {
  const isConfirm = window.confirm("Are you sure you want to delete this package?");
  if (!isConfirm) return;

  try {
    const res = await deletePackage(packageId).unwrap();
    toast.success(res.message || "Package deleted successfully!");
  } catch (error) {
    console.error("Delete Error:", error);
    toast.error(error?.data?.message || "Failed to delete package");
  }
};
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* ================= HEADER ================= */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100 bg-white sticky top-0 z-10">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h2 className="text-2xl font-bold text-gray-900">
                {activity.name}
              </h2>
              <StatusBadge active={activity.isActive} />
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
              <span>
                {activity.categoryId?.name ||
                  activity.categoryId ||
                  'No Category'}
              </span>
              <span>•</span>
              <span>
                {activity.placeId?.name ||
                  activity.placeId ||
                  'No Location'}
              </span>
              <span>•</span>
              <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">
                /{activity.slug || '—'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* ================= TABS ================= */}
        <div className="flex border-b border-gray-100 px-4 sm:px-6 py-4 overflow-x-auto scrollbar-hide bg-white">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                  isActive
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ================= CONTENT ================= */}
        <div className="flex-1 overflow-y-auto scrollbar-hide bg-gray-50 p-4 sm:p-6">
          <div className="max-w-4xl mx-auto space-y-6">

            {/* ================= OVERVIEW ================= */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <SectionCard title="Basic Information" icon={Info}>
                    <InfoGrid>
                      <InfoItem label="Name" value={activity.name} />
                      <InfoItem label="Slug" value={activity.slug} />
                      <InfoItem
                        label="Category"
                        value={activity.categoryId?.name}
                      />
                      <InfoItem
                        label="Location"
                        value={activity.placeId?.name}
                      />
                      <InfoItem
                        label="Time Slots"
                        value={
                          activity.timeSlots?.length
                            ? activity.timeSlots.join(', ')
                            : '—'
                        }
                      />
                    </InfoGrid>
                  </SectionCard>

                  {activity.Experience && (
                    <SectionCard title="Experience" icon={FileText}>
                      <div className="space-y-3 text-sm">
                        <p className="font-semibold">
                          {activity.Experience.title}
                        </p>

                        {activity.Experience.note && (
                          <p className="text-amber-700 bg-amber-50 px-3 py-2 rounded-lg inline-block">
                            Note: {activity.Experience.note}
                          </p>
                        )}

                        <p className="text-gray-600 whitespace-pre-line">
                          {activity.Experience.description}
                        </p>

                        {activity.Experience.highlights?.length > 0 && (
                          <ul className="grid sm:grid-cols-2 gap-2 mt-2">
                            {activity.Experience.highlights.map((h, i) => (
                              <li key={i} className="flex gap-2 text-gray-700">
                                <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5" />
                                {h}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </SectionCard>
                  )}
                </div>

                <div className="space-y-6">
                  <SectionCard title="System Details" icon={Info}>
                    <dl className="space-y-2 text-xs">
                      <MetaRow label="ID" value={activity._id} />
                      <MetaRow
                        label="Created"
                        value={formatDate(activity.createdAt)}
                      />
                      <MetaRow
                        label="Updated"
                        value={formatDate(activity.updatedAt)}
                      />
                    </dl>
                  </SectionCard>
                </div>
              </div>
            )}

            {/* ================= ITINERARY ================= */}
            {activeTab === 'itinerary' && (
              <SectionCard title="Itinerary Timeline" icon={Clock}>
                {activity.Itinerary?.length ? (
                  <div className="space-y-4">
                    {activity.Itinerary.map((item, i) => (
                      <ItineraryCard key={i} item={item} />
                    ))}
                  </div>
                ) : (
                  <EmptyState message="No itinerary details available." />
                )}
              </SectionCard>
            )}

            {/* ================= LOGISTICS ================= */}
            {activeTab === 'logistics' && (
              <div className="space-y-6">
                <SectionCard title="Pickup Zone" icon={MapPin}>
                  {activity.InfoAndLogistics?.pickupZone ? (
                    <div className="space-y-2 text-sm">
                      <p>
                        {activity.InfoAndLogistics.pickupZone.description ||
                          '—'}
                      </p>

                      {activity.InfoAndLogistics.pickupZone.note && (
                        <p className="text-amber-700 bg-amber-50 px-3 py-2 rounded-lg inline-block">
                          Note: {activity.InfoAndLogistics.pickupZone.note}
                        </p>
                      )}

                      {activity.InfoAndLogistics.pickupZone.mapLink && (
                        <a
                          href={activity.InfoAndLogistics.pickupZone.mapLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 font-medium hover:underline"
                        >
                          View Map
                        </a>
                      )}
                    </div>
                  ) : (
                    <EmptyState message="No pickup information." />
                  )}
                </SectionCard>

                <SectionCard title="Private SUV" icon={Layers}>
                  {activity.PrivateSUV?.available ? (
                    <div className="text-sm space-y-1">
                      <p className="font-medium text-emerald-600">
                        Available
                      </p>
                      <p>Model: {activity.PrivateSUV.model}</p>
                      <p>Fee: AED {activity.PrivateSUV.fee}</p>
                    </div>
                  ) : (
                    <EmptyState message="Private SUV not available." />
                  )}
                </SectionCard>
              </div>
            )}

            {/* ================= DINING ================= */}
            {activeTab === 'dining' && (
              <SectionCard title="BBQ Buffet" icon={Utensils}>
                {activity.BBQ_BUFFET ? (
                  <div className="space-y-4">
                    <p className="font-semibold">
                      {activity.BBQ_BUFFET.title}
                    </p>

                    <p className="text-sm text-gray-600">
                      {activity.BBQ_BUFFET.description}
                    </p>

                    {activity.BBQ_BUFFET.fields?.map((field, i) => (
                      <div key={i}>
                        <p className="font-medium text-sm mb-1">
                          {field.category}
                        </p>

                        <ul className="grid sm:grid-cols-2 gap-2 text-sm">
                          {field.items.map((item, idx) => (
                            <li key={idx} className="flex gap-2 text-gray-700">
                              <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState message="No dining information available." />
                )}
              </SectionCard>
            )}

            {/* ================= MEDIA ================= */}
            {activeTab === 'media' && (
              <div className="space-y-6">
                {activity.Video?.secure_url && (
                  <SectionCard title="Video Tour" icon={Video}>
                    <video
                      src={activity.Video.secure_url}
                      controls
                      className="w-full rounded-xl"
                    />
                  </SectionCard>
                )}

                <SectionCard
                  title={`Gallery (${activity.Images?.length || 0})`}
                  icon={ImageIcon}
                >
                  {activity.Images?.length ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {activity.Images.map((img, i) => (
                        <img
                          key={i}
                          src={img.secure_url}
                          alt=""
                          className="h-24 w-full object-cover rounded-xl hover:scale-105 transition"
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyState message="No images available." />
                  )}
                </SectionCard>
              </div>
            )}

            {/* ================= PACKAGES ================= */}
            {/* {activeTab === 'packages' && (
              <SectionCard
                title={`Packages (${activity.packageCount || 0})`}
                icon={Layers}
                action={
                  <button
                    onClick={() => setShowAddPackage(true)}
                    className="px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition"
                  >
                    + Add Package
                  </button>
                }
              >
                {activity.packages?.length ? (
                  <div className="grid md:grid-cols-2 gap-4">
                   {activity.packages.map((pkg) => (
  <PackageCard
    key={pkg._id}
    pkg={pkg}
    onClick={() => handleViewPackage(pkg)}
  />
))}
                  </div>
                ) : (
                  <EmptyState message="No packages yet." />
                )}
              </SectionCard>
            )} */}

            {activeTab === 'packages' && (
  <SectionCard
    title={`Packages (${packages.length})`}
    icon={Layers}
    action={
      <button
        onClick={() => setShowAddPackage(true)}
        className="px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition"
      >
        + Add Package
      </button>
    }
  >
    {isLoading ? (
      <p className="text-sm text-gray-500">Loading packages...</p>
    ) : packages.length ? (
      <div className="grid md:grid-cols-2 gap-4">
        {packages.map((pkg) => (
  <PackageCard
    key={pkg._id}
    pkg={pkg}
    onView={() => handleViewPackage(pkg)}  
    onEdit={() => handleEditPackage(pkg)}
    onDelete={() => handleDeletePackage(pkg._id)}
  />
))}
      </div>
    ) : (
      <EmptyState message="No packages yet." />
    )}
  </SectionCard>
)}
          </div>
        </div>
      </div>

      {/* ADD PACKAGE MODAL */}
     {showAddPackage && (
  <AddPackageModal
    activityId={activity._id}
    onClose={() => setShowAddPackage(false)}
    onSuccess={() => {
      setShowAddPackage(false);
      onPackageAdded?.();
    }}
  />
  
)}

{showViewPackage && (
  <ViewPackageModal
    package={selectedPackage}
    isOpen={showViewPackage}
    onClose={() => setShowViewPackage(false)}
  />
)}

{showUpdatePackage && (
  <UpdatePackageModal
    packageData={packageToEdit}
    isOpen={showUpdatePackage}
    onClose={() => setShowUpdatePackage(false)}
    onSuccess={() => {
      setShowUpdatePackage(false);
    }}
  />
)}
    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */

const StatusBadge = ({ active }) => (
  <span
    className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
      active
        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
        : 'bg-rose-50 text-rose-700 border-rose-200'
    }`}
  >
    {active ? 'Active' : 'Inactive'}
  </span>
);

const SectionCard = ({ title, icon: Icon, children, action }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
    <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-50">
      <div className="flex items-center gap-2">
        {Icon && (
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <h3 className="font-bold text-gray-900">{title}</h3>
      </div>
      {action}
    </div>
    {children}
  </div>
);

const InfoGrid = ({ children }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
    {children}
  </div>
);

const InfoItem = ({ label, value }) => (
  <div className="bg-gray-50 rounded-xl p-3">
    <p className="text-gray-500 text-xs">{label}</p>
    <div className="font-semibold text-gray-900">{value || '—'}</div>
  </div>
);

const MetaRow = ({ label, value }) => (
  <div className="flex justify-between border-b border-gray-100 py-1">
    <dt className="text-gray-500">{label}</dt>
    <dd className="text-gray-900 font-mono truncate ">
      {value || '—'}
    </dd>
  </div>
);

const ItineraryCard = ({ item }) => (
  <div className="bg-white border border-gray-100 rounded-xl p-4">
    <div className="flex justify-between mb-2">
      <p className="font-semibold">{item.title}</p>
      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
        {item.time}
      </span>
    </div>
    <p className="text-sm text-gray-600">{item.description}</p>
    {item.image?.secure_url && (
      <img
        src={item.image.secure_url}
        alt=""
        className="mt-3 h-40 w-full object-cover rounded-lg"
      />
    )}
    
  </div>
);

const PackageCard = ({ pkg, onView, onEdit, onDelete }) => (
  <div className="group bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-lg hover:border-blue-200 transition-all duration-200">
    {/* HEADER */}
    <div className="flex items-start justify-between mb-3">
      <div>
        <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition">
          {pkg.name}
        </h4>

        <span
          className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${
            pkg.isActive
              ? "bg-emerald-50 text-emerald-600"
              : "bg-red-50 text-red-500"
          }`}
        >
          {pkg.isActive ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="text-right flex flex-col items-end gap-2">
        <p className="text-lg font-bold text-blue-600">AED {pkg.price}</p>
        
        {/* ================= ACTIONS (VIEW, EDIT, DELETE) ================= */}
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView();
            }}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition"
            title="View Package"
          >
            <Eye className="w-4 h-4" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition"
            title="Edit Package"
          >
            <Edit className="w-4 h-4" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition"
            title="Delete Package"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    {/* DESCRIPTION */}
    {pkg.description && (
      <p className="text-sm text-gray-500 line-clamp-2 mb-3">
        {pkg.description}
      </p>
    )}

    {/* INCLUDE / EXCLUDE */}
    <div className="grid grid-cols-2 gap-3 text-xs mb-3">
      <div>
        <p className="font-semibold text-gray-600 mb-1">Includes</p>
        <ul className="space-y-1 text-gray-500">
          {pkg.whatInclude?.slice(0, 2).map((i, idx) => (
            <li key={idx} className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-emerald-500" />
              {i}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="font-semibold text-gray-600 mb-1">Excludes</p>
        <ul className="space-y-1 text-gray-500">
          {pkg.whatExclude?.slice(0, 2).map((i, idx) => (
            <li key={idx} className="flex items-center gap-1">
              <X className="w-3 h-3 text-red-400" />
              {i}
            </li>
          ))}
        </ul>
      </div>
    </div>

    {/* BOOKING FIELDS */}
    {pkg.bookingFields?.length > 0 && (
      <div className="border-t pt-3 mt-2">
        <p className="text-xs font-semibold text-gray-600 mb-1">
          Booking Options
        </p>

        <div className="flex flex-wrap gap-1">
          {pkg.bookingFields.slice(0, 3).map((f, i) => (
            <span
              key={i}
              className="text-[11px] px-2 py-1 bg-gray-100 rounded-md text-gray-600"
            >
              {f.name}
            </span>
          ))}

          {pkg.bookingFields.length > 3 && (
            <span className="text-[11px] text-gray-400">
              +{pkg.bookingFields.length - 3} more
            </span>
          )}
        </div>
      </div>
    )}
  </div>
);

const EmptyState = ({ message }) => (
  <div className="text-center py-8 px-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
    <p className="text-gray-400 text-sm">{message}</p>
  </div>
);