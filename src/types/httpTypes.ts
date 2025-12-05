export const idMap = {
  indoor: {
    bookableLinkedProductId: 4537,
    bookableProductids: {
      1: 4136,
      2: 4137,
      3: 4138,
    },
  },
  outdoor: {
    bookableLinkedProductId: 4536,
    bookableProductids: {
      1: 118,
      2: 119,
      3: 120,
      4: 121,
      5: 122,
    },
  },
  beachvolleyballTagId: 78,
} as const;

export type PostParticipationsPayload = {
  organizationId: number | null;
  memberId: number;
  primaryPurchaseMessage: string | null;
  secondaryPurchaseMessage: string | null;
  params: {
    /** The date in ISO string format */
    startDate: string;
    /** The date in ISO string format */
    endDate: string;
    bookableProductId: number;
    bookableLinkedProductId: number;
    invitedMemberEmails: Array<string>;
    invitedGuests: Array<string>; // not sure
    invitedOthers: Array<string>; // not sure
    primaryPurchaseMessage: string | null;
    secondaryPurchaseMessage: string | null;
  };
  /** The date in ISO string format */
  dateOfRegistration: string | null;
};

import * as t from "io-ts";

export const PostParticipationsResponse = t.type({
  id: t.number,
  status: t.number,
  type: t.number,
  claimed: t.boolean,
  claimCode: t.string,
  bookingId: t.number,
  memberId: t.number,
  organizationId: t.union([t.number, t.null]),
  invitedMemberId: t.union([t.number, t.null]),
  attended: t.boolean,
  dateOfRegistration: t.string, // Assume ISO date string
  paymentType: t.number,
  paid: t.boolean,
  amount: t.number,
  primaryPurchaseMessage: t.union([t.string, t.null]),
  secondaryPurchaseMessage: t.union([t.string, t.null]),
  isUnconfirmed: t.boolean,
  firstName: t.union([t.string, t.null]),
  lastName: t.union([t.string, t.null]),
  mobile: t.union([t.string, t.null]),
  email: t.union([t.string, t.null]),
  saleItemId: t.union([t.number, t.null]),
  siteId: t.number,
  updatedAt: t.string, // Assume ISO date string
});

export type PostParticipationsResponseType = t.TypeOf<
  typeof PostParticipationsResponse
>;

export const HttpError = t.type({
  message: t.string,
  error: t.string,
  statusCode: t.number,
});

export type GetBookableSlotsFilterQueryParams = {
  /** The date in ISO string format */
  startDate: string;
  /** The date in ISO string format */
  endDate: string;
  tagIds: { $in: Array<number> };
  availableFromDate: {
    /** The date in ISO string format */
    $gt: string;
  };
  availableTillDate: {
    /** The date in ISO string format */
    $gte: string;
  };
};

const BookableSlot = t.type({
  bookableProductId: t.number,
  endDate: t.string,
  isAvailable: t.boolean,
  linkedProduct: t.unknown,
  linkedProductId: t.number,
  product: t.unknown,
  startDate: t.string,
});

export const GetBookableSlotsResponse = t.type({
  count: t.number,
  data: t.array(BookableSlot),
  page: t.number,
  pageCount: t.number,
  total: t.number,
});
