import { pipe } from "fp-ts/lib/function";
import FieldTargetRange from "./FieldTargetRange";
import { getBookableSlots, Slots } from "./services/getBookableSlots";
import { idMap } from "./types";

type DatesToCheck = { month: number; date: number; hours: number[] };

const datesToCheck: DatesToCheck = {
  // Example: Deember 4th, 20-23 has month = 11, date = 4, hours = [20, 21, 22]
  // month is 0-indexed!!!! so Deember is 11, and January is 0
  month: 11,
  date: 6,
  hours: [9, 10],
};

const fieldTargetRange = new FieldTargetRange(
  datesToCheck.month,
  datesToCheck.date,
  datesToCheck.hours
);

const indoorFilter = (slots: Slots) =>
  slots.filter(
    (slot) => slot.linkedProductId === idMap.indoor.bookableLinkedProductId
  );

const availableFilter = (slots: Slots) =>
  slots.filter((slot) => slot.isAvailable);

export default function main() {
  const intervalMins = 1;
  const intervalMs = intervalMins * 60 * 1000; // 5 minutes in milliseconds

  console.log(`
    Starting Bookable Field Deamon: checking for available slots on 
    ${fieldTargetRange.toString()}
    every ${intervalMins} minutes...
  `);

  const requestDeamon = () => {
    const startDate = fieldTargetRange.getDate();

    setInterval(() => {
      getBookableSlots({ startDate })
        .then((slots) =>
          pipe(
            slots,
            availableFilter,
            indoorFilter,
            fieldTargetRange.filterSlots
          )
        )
        .then(fieldTargetRange.handleBookableSlots);
    }, intervalMs);
  };

  requestDeamon();
}
