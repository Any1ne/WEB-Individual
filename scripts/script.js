import { Delivery, Parcel } from "./model.js";
import { Validator } from "./validation.js";

console.log("script.js is loaded");

const deliveries = [];

function showError(input, message) {
  console.log("showError call");
  const errorSpan = document.getElementById(`${input.id}-error`);
  if (errorSpan) {
    errorSpan.textContent = message;
    errorSpan.style.display = "block";
    input.classList.add("error");
  }
}

function clearError(input) {
  console.log("clearError call");
  const errorSpan = document.getElementById(`${input.id}-error`);
  if (errorSpan) {
    errorSpan.textContent = "";
    errorSpan.style.display = "none";
    input.classList.remove("error");
  }
}

export function createDelivery() {
  console.log("createDelivery call");

  const type = document.getElementById("shipment-type").value;
  console.log("1");
  const length = parseFloat(document.getElementById("length").value);
  console.log("2");
  const width = parseFloat(document.getElementById("width").value);
  console.log("3");
  const height = parseFloat(document.getElementById("height").value);
  console.log("4");
  const weight = parseFloat(document.getElementById("weight").value);

  console.log("createParcel begin process");
  const size = { length, width, height }; // Create the size object
  const parcel = new Parcel(type, size, weight); // Pass size and weight to Parcel

  // Створення об'єкта Delivery з необхідними параметрами
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
