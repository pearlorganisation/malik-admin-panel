// features/hotel/useHotelActions.js
import { useDeleteHotelMutation } from "./hotelApi";

export const useHotelActions = () => {
  const [deleteHotel, { isLoading: isDeleting }] = useDeleteHotelMutation();

  const removeHotel = async (id) => {
    try {
      await deleteHotel(id).unwrap();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return { removeHotel, isDeleting };
};