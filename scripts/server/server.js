import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import https from "https";
import fs from "fs";
import {
  addDelivery,
  getDeliveries,
  updateDeliveryStatus,
  deleteDelivery,
} from "./api.js";

const app = express();
const PORT = 3001;
const privateKey = fs.readFileSync("./cert/key.pem", "utf8");
const certificate = fs.readFileSync("./cert/cert.pem", "utf8");
const credentials = { key: privateKey, cert: certificate };

app.use(cors({ origin: "https://any1ne.github.io/WEB-Individual/" })); // { origin: "https://any1ne.github.io/WEB-Individual/" } { origin: "http://127.0.0.1:5500" }
app.use(bodyParser.json());

app.post("/add-delivery", async (req, res) => {
  const delivery = req.body;
  console.log(`POST /add-delivery - Запит на додавання доставки:`, delivery);

  try {
    await addDelivery(delivery);
    res.status(200).send({ message: "Delivery added successfully!" });
  } catch (error) {
    console.error(`Помилка при додаванні доставки: ${error}`);
    res.status(500).send({ error: "Failed to add delivery." });
  }
});

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

https.createServer(credentials, app).listen(PORT, () => {
  console.log(`Server is running on https://134.249.60.9:${PORT}`);
});
