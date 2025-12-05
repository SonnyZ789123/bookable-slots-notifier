import { Request, Response } from "express";
import { isLeft } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { StartDaemonBody } from "../domain /apiDefinitions";
import FieldTargetRange from "../domain /FieldTargetRange";
import { getBookableSlots } from "../services/getBookableSlots.js";
import { availableFilter, indoorFilter } from "../utils/slotFilter";

const INTERVAL_MINS = 5;

let daemonInterval: NodeJS.Timeout | null = null;

export const startDaemon = async (req: Request, res: Response) => {
  if (daemonInterval) {
    return res.status(400).json({ message: "A daemon is already running." });
  }

  const decoded = StartDaemonBody.decode(req.body);

  if (isLeft(decoded)) {
    return res.status(400).json({
      message:
        "Expected fields: { month: number, date: number, hours: number[] }",
      errors: decoded.left,
    });
  }

  const { month, date, hours } = decoded.right;

  const fieldTargetRange = new FieldTargetRange(month, date, hours);

  const intervalMs = INTERVAL_MINS * 60 * 1000;

  console.log(`
Starting Bookable Field Daemon: checking for available slots on 
${fieldTargetRange.toString()}
every ${INTERVAL_MINS} minutes...
    `);

  const startDate = fieldTargetRange.getDate();

  daemonInterval = setInterval(() => {
    getBookableSlots({ startDate })
      .then((slots) =>
        pipe(slots, availableFilter, indoorFilter, fieldTargetRange.filterSlots)
      )
      .then(fieldTargetRange.handleBookableSlots);
  }, intervalMs);

  res.json({
    message: "Daemon started",
    target: fieldTargetRange.toString(),
  });
};

export const stopDaemon = (_req: Request, res: Response) => {
  if (!daemonInterval) {
    return res.status(400).json({ message: "Daemon is not running." });
  }

  clearInterval(daemonInterval);
  daemonInterval = null;

  res.json({ message: "Daemon stopped." });
};
