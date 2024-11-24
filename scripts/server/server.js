import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import https from "https";
import fs from "fs";
import dotenv from "dotenv";
import {
  addDelivery,
  getDeliveries,
  updateDeliveryStatus,
  deleteDelivery,
} from "./api.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT;
const privateKey = fs.readFileSync("./cert/key.pem", "utf8");
const certificate = fs.readFileSync("./cert/cert.pem", "utf8");
const credentials = { key: privateKey, cert: certificate };

app.use(cors({ origin: "https://any1ne.github.io" })); // { origin: "https://any1ne.github.io" } { origin: "http://127.0.0.1:5500" }
app.use(bodyParser.json());
app.use(authenticateAPIKey);

const API_KEY = process.env.API_KEY_SERVER;

function authenticateAPIKey(req, res, next) {
  const clientKey = req.headers["x-api-key"];
  if (clientKey && clientKey === API_KEY) {
    next();
  } else {
    res.status(403).send({ error: "Forbidden: Invalid API Key" });
  }
}

const deliveryStatuses = ["Pending", "In Progress", "Dispatched", "Delivered"];
const statusDurations = [5000, 30000, 30000];

app.post("/add-delivery", async (req, res) => {
  const delivery = req.body;
  console.log(`POST /add-delivery - Запит на додавання доставки:`, delivery);

  try {
    await addDelivery(delivery);
    res.status(200).send({ message: "Delivery added successfully!" });

    updateDeliveryStatusSequentially(delivery.deliveryCode);
  } catch (error) {
    console.error(`Помилка при додаванні доставки: ${error}`);
    res.status(500).send({ error: "Failed to add delivery." });
  }
});

async function updateDeliveryStatusSequentially(deliveryCode) {
  for (
    let currentIndex = 0;
    currentIndex < deliveryStatuses.length - 1;
    currentIndex++
  ) {
    const newStatus = deliveryStatuses[currentIndex + 1];
    const duration = statusDurations[currentIndex];

    try {
      await new Promise((resolve) => setTimeout(resolve, duration));

      console.log(`Оновлюємо статус доставки ${deliveryCode} на: ${newStatus}`);
      await updateDeliveryStatus(deliveryCode, newStatus);
      console.log(`Статус доставки ${deliveryCode} оновлено на: ${newStatus}`);
    } catch (error) {
      console.error(
        `Помилка при оновленні статусу доставки ${deliveryCode}: ${error}`
      );
      break;
    }

    console.log(
      `Доставка ${deliveryCode} досягла фінального статусу: ${
        deliveryStatuses[deliveryStatuses.length - 1]
      }`
    );
  }
}

app.get("/deliveries", async (req, res) => {
  console.log("GET /deliveries - Запит на отримання всіх доставок");

  try {
    const deliveries = await getDeliveries();
    res.status(200).send(deliveries);
  } catch (error) {
    console.error(`Помилка при отриманні доставок: ${error}`);
    res.status(500).send({ error: "Failed to fetch deliveries." });
  }
});

app.patch("/update-status", async (req, res) => {
  const { deliveryCode, newStatus } = req.body;
  console.log(`PATCH /update-status - Запит на оновлення статусу доставки:`, {
    deliveryCode,
    newStatus,
  });

  try {
    await updateDeliveryStatus(deliveryCode, newStatus);
    res.status(200).send({ message: "Delivery status updated successfully!" });
  } catch (error) {
    console.error(`Помилка при оновленні статусу доставки: ${error}`);
    res.status(500).send({ error: "Failed to update delivery status." });
  }
});

app.delete("/delete-delivery", async (req, res) => {
  const { deliveryCode } = req.body;
  console.log(
    `DELETE /delete-delivery - Запит на видалення доставки: ${deliveryCode}`
  );

  try {
    await deleteDelivery(deliveryCode);
    res.status(200).send({ message: "Delivery deleted successfully!" });
  } catch (error) {
    console.error(`Помилка при видаленні доставки: ${error}`);
    res.status(500).send({ error: "Failed to delete delivery." });
  }
});

app.use("/", (req, res, next) => {
  res.send("Server connected🔒");
});

https.createServer(credentials, app).listen(PORT, () => {
  console.log(`Server is running on ${process.env.IP_SERVER}`);
});
