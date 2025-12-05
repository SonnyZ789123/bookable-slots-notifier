import { pipe } from "fp-ts/lib/function";
import { Slots } from "./services/getBookableSlots";
import { noitifyWhatsAppRecipients } from "./services/whatsappNotifier";
import { idMap } from "./types";

/*
A slot looks something like this:
{
  startDate: '2025-12-06T09:00:00.000Z',
  endDate: '2025-12-06T09:59:00.000Z',
  bookableProductId: 4138, // The field number (4316-4138 are indoor fields 1-3)
  linkedProductId: 4537, // Indoor field
  isAvailable: true,
  linkedProduct: null,
  product: null
}
*/

export default class FieldTargetRange {
  public month: number;
  public date: number;
  public hours: number[];
  private notifiedSlots: Set<string> = new Set();

  constructor(month: number, date: number, hours: number[]) {
    this.month = month;
    this.date = date;
    this.hours = hours;
  }

  public handleBookableSlots = (slots: Slots): void => {
    const slotsToNotify = slots.filter((slot) => {
      const slotId = this.getSlotId(slot);
      return !this.notifiedSlots.has(slotId);
    });

    if (slotsToNotify.length > 0) {
      this.notifyBookableSlots(slotsToNotify);
    }
    this.notifiedSlots = new Set(slots.map((slot) => this.getSlotId(slot)));
  };

  private notifyBookableSlots = (slots: Slots): void => {
    if (slots.length > 0) {
      const fieldDateString = this.getFieldDateString();
      const fieldsString = this.fieldsToString(slots);

      noitifyWhatsAppRecipients({
        fieldDate: fieldDateString,
        fields: fieldsString,
      });
    }
  };

  public getDate = (): Date => {
    return new Date(
      new Date().getFullYear(),
      this.month,
      this.date,
      8,
      0,
      0,
      0
    );
  };

  public toString = (): string => {
    const fieldDate = this.getFieldDateString();

    return `${fieldDate} for hours: ${this.hours.join(", ")}`;
  };

  public filterSlots = (slots: Slots) => {
    return pipe(slots, this.dateFilter);
  };

  private getSlotId = (slot: Slots[number]): string => {
    return `${slot.linkedProductId}-F${slot.bookableProductId}-s${slot.startDate}`;
  };

  private dateFilter = (slots: Slots) => {
    return slots.filter((slot) => {
      // The startDate is in ISO string format
      const slotDate = new Date(slot.startDate);

      return (
        // getMonth returns 0-indexed month
        slotDate.getMonth() === this.month &&
        slotDate.getDate() === this.date &&
        // getHours returns the local hours
        this.hours.includes(slotDate.getHours())
      );
    });
  };

  private getFieldDateString = (): string => {
    // Format: December 5
    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      day: "numeric",
    };
    return this.getDate().toLocaleDateString("en-US", options);
  };

  private fieldsToString = (fields: Slots): string => {
    return fields
      .map((field) => {
        const fieldDate = new Date(field.startDate);
        const hour = fieldDate.getHours();
        const fieldType =
          field.linkedProductId === idMap.indoor.bookableLinkedProductId
            ? "Indoor"
            : "Outdoor";
        const fieldNumberIds =
          idMap[fieldType.toLowerCase() as "indoor" | "outdoor"]
            .bookableProductids;
        const fieldNumber = Object.entries(fieldNumberIds).find(
          ([, id]) => id === field.bookableProductId
        )?.[0];

        return {
          fieldType,
          fieldNumber,
          hour,
        };
      })
      .sort((a, b) => a.hour - b.hour)
      .map(({ fieldType, fieldNumber, hour }) => {
        return `${fieldType} Field ${fieldNumber} at ${hour}:00`;
      })
      .join(", ");
  };
}
