import { pipe } from "fp-ts/lib/function.js";
import { getBookableSlots } from "../services/getBookableSlots.js";
import {
  availableFilter,
  indoorFilter,
  notNullFilter,
} from "../utils/slotFilter.js";
import FieldTargetRange from "./FieldTargetRange.js";

export const startBookableSlotNotifierDaemon = ({
  month,
  date,
  hours,
  intervalMs,
}: {
  month: number;
  date: number;
  hours: number[];
  intervalMs: number;
}) => {
  const fieldTargetRange = new FieldTargetRange(month, date, hours);

  const startDate = fieldTargetRange.getDate();

  const interval = setInterval(() => {
    getBookableSlots({ startDate })
      .then((slots) =>
        pipe(
          slots,
          notNullFilter,
          availableFilter,
          indoorFilter,
          fieldTargetRange.filterSlots
        )
      )
      .then(fieldTargetRange.handleBookableSlots)
      .catch((err) => {
        console.error("Error fetching or handling bookable slots:", err);
      });
  }, intervalMs);

  return { fieldTargetRange, interval };
};
