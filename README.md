# **Bookable Slots Notifier**

A small Node.js + TypeScript service that periodically checks bookable field slots for the KUL beach volleyball hall, and sends WhatsApp notifications using the WhatsApp Cloud API.

## **Scripts**

```bash
npm run dev        # Start in development (tsx)
npm run build      # Compile TypeScript
npm start          # Run compiled app (dist/index.js)
npm run standalone # No Express
```

## **Environment Variables**

The app is integrated with the WhatsApp cloud API, follow the [documentation](https://developers.facebook.com/documentation/business-messaging/whatsapp/get-started) to get the necessary authentication.

Create a `.env` file:

```
WHATSAPP_BUSINESS_PHONE_NUMBER_ID=
WHATSAPP_BUSINESS_ACCOUNT_ID=
SYSTEM_USER_ACCESS_TOKEN=
WHATSAPP_USER_PHONE_NUMBER=32495****
```

## **Run**

```bash
npm install
npm run dev
```

To run the standalone script with arguments, for tomorrow for the hours 12 until 14:

```bash
npm install
npm run build
node dist/startBookableSlotNotifier.js 12 13 14
```