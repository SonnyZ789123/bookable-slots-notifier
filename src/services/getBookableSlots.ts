import axios from "axios";
import { isLeft } from "fp-ts/lib/Either";
import { URLS } from "../config/constants";
import {
  GetBookableSlotsFilterQueryParams,
  GetBookableSlotsResponse,
  idMap,
} from "../types";

export type Slots = Awaited<ReturnType<typeof getBookableSlots>>;

const getBookableSlotsFilterQueryParams = ({
  startDate,
}: {
  /** If startDate is undefined, then we use today */
  startDate?: Date;
}): GetBookableSlotsFilterQueryParams => {
  const date = startDate || new Date();
  const endDate = new Date(date);
  endDate.setHours(24, 0, 0, 0);
  const now = new Date();

  return {
    startDate: date.toISOString(),
    endDate: endDate.toISOString(),
    tagIds: {
      $in: [idMap.beachvolleyballTagId],
    },
    availableFromDate: {
      $gt: now.toISOString(),
    },
    availableTillDate: {
      $gte: date.toISOString(), // The startDate
    },
  };
};

export const getBookableSlots = async ({ startDate }: { startDate?: Date }) => {
  const filterQueryString = JSON.stringify(
    getBookableSlotsFilterQueryParams({ startDate })
  );

  const response = await axios.get(URLS["getBookableSlots"], {
    params: {
      s: filterQueryString,
    },
  });

  const decodedResponse = GetBookableSlotsResponse.decode(response.data);
  if (isLeft(decodedResponse)) {
    throw new Error("Failed to decode getBookableSlots response");
  }

  return decodedResponse.right.data;
};
