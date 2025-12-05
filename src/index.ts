import "dotenv/config";
import express from "express";
import startBookableSlotNotifier from "./bookableSlotNotifier";

const app = express();
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Bookable Slot Notifier is running 🚀");
});

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
  startBookableSlotNotifier();
});
