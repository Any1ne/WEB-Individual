import { Delivery, Parcel } from "./model.js";
import { Validator } from "./validation.js";
import { addDelivery } from "./api.js";

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

  const deliveryCode = "D123";
  const parcelCode = "P456";

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

export async function saveDelivery(delivery) {
  if (delivery) {
    try {
      await addDelivery(delivery);
      console.log("Delivery saved to JSONBin:", delivery);
    } catch (error) {
      showError("Failed to save delivery to JSONBin. Please try again.");
      console.error("Error saving delivery:", error);
    }
  } else {
    showError("Delivery is not defined. Cannot save to JSONBin.");
  }
}
