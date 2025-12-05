import { Slots } from "../services/getBookableSlots";
import { idMap } from "../types";

export const indoorFilter = (slots: Slots) =>
  slots.filter(
    (slot) => slot.linkedProductId === idMap.indoor.bookableLinkedProductId
  );

export const availableFilter = (slots: Slots) =>
  slots.filter((slot) => slot.isAvailable);
