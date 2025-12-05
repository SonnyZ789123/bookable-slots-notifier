import "dotenv/config";
import { INTERVAL_MINS } from "./config/constants.js";
import { startBookableSlotNotifierDaemon } from "./domain/daemon.js";

type DatesToCheck = { month: number; date: number; hours: number[] };

// For if you want to hardcode the target range here
const FIELD_TARGET_RANGE: DatesToCheck = {
  // Example: Deember 4th, 20-23 has month = 11, date = 4, hours = [20, 21, 22]
  // month is 0-indexed!!!! so Deember is 11, and January is 0
  month: 11,
  date: 6,
  hours: [9, 10],
};

function main() {
  const [, , ...hoursArg] = process.argv;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (hoursArg.length > 0) {
    FIELD_TARGET_RANGE.month = tomorrow.getMonth();
    FIELD_TARGET_RANGE.date = tomorrow.getDate();
    FIELD_TARGET_RANGE.hours = hoursArg
      .map((h) => parseInt(h, 10))
      .filter((h) => !isNaN(h));
  }

  const { fieldTargetRange } = startBookableSlotNotifierDaemon({
    ...FIELD_TARGET_RANGE,
    intervalMs: INTERVAL_MINS * 60 * 1000,
  });

  console.log(`
Starting Bookable Field Daemon: checking for available slots on 
${fieldTargetRange.toString()}
every ${INTERVAL_MINS} minutes...
    `);
}

main();
