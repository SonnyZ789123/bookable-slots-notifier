import { pipe } from "fp-ts/lib/function.js";
import FieldTargetRange from "../domain/FieldTargetRange.js";
import { getBookableSlots } from "../services/getBookableSlots.js";
import { availableFilter, indoorFilter } from "./slotFilter.js";

type DatesToCheck = { month: number; date: number; hours: number[] };

const FIELD_TARGET_RANGE: DatesToCheck = {
  // Example: Deember 4th, 20-23 has month = 11, date = 4, hours = [20, 21, 22]
  // month is 0-indexed!!!! so Deember is 11, and January is 0
  month: 11,
  date: 6,
  hours: [9, 10],
};

const fieldTargetRange = new FieldTargetRange(
  FIELD_TARGET_RANGE.month,
  FIELD_TARGET_RANGE.date,
  FIELD_TARGET_RANGE.hours
);

export default function main() {
  const intervalMins = 1;
  const intervalMs = intervalMins * 60 * 1000; // 5 minutes in milliseconds

  console.log(`
    Starting Bookable Field Daemon: checking for available slots on 
    ${fieldTargetRange.toString()}
    every ${intervalMins} minutes...
  `);

  const requestDaemon = () => {
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

  requestDaemon();
}
