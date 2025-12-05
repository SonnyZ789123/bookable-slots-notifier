import axios from "axios";

export const noitifyWhatsAppRecipients = async ({
  fieldDate,
  fields,
}: {
  fieldDate: string;
  fields: string;
}) => {
  const result = axios.post(
    `https://graph.facebook.com/v24.0/${process.env.WHATSAPP_BUSINESS_PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to: process.env.WHATSAPP_USER_PHONE_NUMBER,
      type: "template",
      template: {
        name: "field_availability_alert",
        language: { code: "en" },
        components: [
          {
            type: "body",
            parameters: [
              {
                type: "text",
                text: fieldDate,
                parameter_name: "field_date",
              },
              {
                type: "text",
                text: fields,
                parameter_name: "fields",
              },
            ],
          },
        ],
      },
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.SYSTEM_USER_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );

  return result;
};
