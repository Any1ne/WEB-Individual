import { Delivery, Parcel } from "./model.js";
import { Validator } from "./validation.js";

console.log("script.js is loaded");

const deliveries = []; // ToDo: Hash table (key: delivery code, value: delivery)

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

  const deliveryCode = "D123"; // Приклад значення
  const parcelCode = "P456"; // Приклад значення
  const senderCoords = { lat: 50.45, lon: 30.52 }; // Приклад координат
  const receiverCoords = { lat: 51.45, lon: 31.52 }; // Приклад координат

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

export function saveDelivery(delivery) {
  if (delivery) {
    deliveries.push(delivery);
    console.log("Delivery saved:", delivery);
    console.log("All deliveries:", deliveries);
  }
}
