import { Slots } from "../services/getBookableSlots.js";
import { idMap } from "../types/index.js";

export const indoorFilter = (slots: Slots) =>
  slots.filter(
    (slot) => slot.linkedProductId === idMap.indoor.bookableLinkedProductId
  );

export const availableFilter = (slots: Slots) =>
  slots.filter((slot) => slot.isAvailable);
