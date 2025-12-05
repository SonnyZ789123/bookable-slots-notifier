import axios from "axios";
import { URLS } from "../config/constants";
import {
  idMap,
  IndoorField,
  OutdoorField,
  PostParticipationsPayload,
} from "../types";

type BookFieldPayloadParams = (IndoorField | OutdoorField) & {
  memberId: number;
};

const bookFieldPayload = ({
  _tag,
  fieldNumber,
  memberId,
  startDate,
}: BookFieldPayloadParams): PostParticipationsPayload => {
  // Trim the startDate to the hour
  startDate.setMinutes(0, 0, 0);
  // Set the end date 59 minutes later
  const endDate = new Date(startDate);
  endDate.setMinutes(59);

  const { bookableLinkedProductId, bookableProductids } = idMap[_tag];
  // @ts-expect-error type checked the fieldnumber
  const bookableProductId = bookableProductids[fieldNumber];

  return {
    organizationId: null,
    memberId,
    primaryPurchaseMessage: null,
    secondaryPurchaseMessage: null,
    params: {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      bookableProductId,
      bookableLinkedProductId,
      invitedMemberEmails: [],
      invitedGuests: [],
      invitedOthers: [],
      primaryPurchaseMessage: null,
      secondaryPurchaseMessage: null,
    },
    dateOfRegistration: null,
  } as const;
};

export const bookField = async (
  payload: BookFieldPayloadParams & { accessToken: string }
) => {
  const response = await axios.post(
    URLS["bookField"],
    bookFieldPayload(payload),
    {
      headers: {
        Authorization: `Bearer ${payload.accessToken}`,
        origin: "https://usc.kuleuven.cloud/",
        referer: "https://usc.kuleuven.cloud/",
      },
    }
  );

  return response;
};
