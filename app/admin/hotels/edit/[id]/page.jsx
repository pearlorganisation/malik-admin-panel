import HotelForm from "@/features/hotel/HotelForm";
export default async function EditHotelPage({ params }) {
  const { id } = await params; 
  
  return <HotelForm id={id} />;
}