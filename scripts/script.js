import { Delivery, Parcel } from "./model.js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "./server/.env") });

console.log("script.js is loaded");

export function showError(message) {
  console.log("Show error");
  let errorInfo = document.getElementById(`error-info`);
  errorInfo.textContent = message;
  errorInfo.style.display = "block";
}

export function clearError() {
  const errorInfo = document.getElementById(`error-info`);
  if (errorInfo) {
    errorInfo.textContent = "";
    errorInfo.style.display = "none";
  }
}

export function createDelivery() {
  console.log("createDelivery call");

  const type = document.getElementById("shipment-type").value;
  const length = parseFloat(document.getElementById("length").value);
  const width = parseFloat(document.getElementById("width").value);
  const height = parseFloat(document.getElementById("height").value);
  const weight = parseFloat(document.getElementById("weight").value);

  console.log("createParcel begin process");
  const size = { length, width, height };
  const parcel = new Parcel(type, size, weight);

  const deliveryCode = generateUniqueCode("D");
  const parcelCode = generateUniqueCode("P");

  const senderLat = parseFloat(
    document.getElementById("sender-latitude").value
  );
  const senderLong = parseFloat(
    document.getElementById("sender-longtitude").value
  );
  const receiverLat = parseFloat(
    document.getElementById("receiver-latitude").value
  );
  const receiverLong = parseFloat(
    document.getElementById("receiver-longtitude").value
  );

  const senderCoords = { lat: senderLat, lon: senderLong };
  const receiverCoords = { lat: receiverLat, lon: receiverLong };

  // Create the delivery object
  const delivery = new Delivery(
    deliveryCode,
    parcelCode,
    senderCoords,
    receiverCoords,
    parcel
  );

  console.log("Delivery created:", delivery);
  return delivery;
}

function generateUniqueCode(prefix) {
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  const timestampPart = Date.now().toString().slice(-5);
  return `${prefix}-${randomPart}${timestampPart}`;
}

export async function saveDelivery(delivery) {
  console.log("Delivery start saving to server:");
  if (delivery) {
    try {
      const response = await fetch("https://134.249.60.9:3001/add-delivery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.API_KEY_SERVER,
        },
        body: JSON.stringify(delivery),
      });

      if (!response.ok) {
        throw new Error("Failed to save delivery to server.");
      }

      console.log("Delivery saved to server:", delivery);
    } catch (error) {
      showError("Failed to save delivery to server. Please try again.");
      console.error("Error saving delivery:", error);
    }
  } else {
    showError("Delivery is not defined. Cannot save to server.");
  }
}
