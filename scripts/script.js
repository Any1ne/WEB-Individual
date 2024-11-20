import { Parcel, Delivery } from "./model.js";
import { Validator } from "./validation.js";

console.log("script.js is loaded");

function showError(input, message) {
  const errorSpan = document.getElementById(`${input.id}-error`);
  if (errorSpan) {
    errorSpan.textContent = message;
    errorSpan.style.display = "block";
    input.classList.add("error");
  }
}

function clearError(input) {
  const errorSpan = document.getElementById(`${input.id}-error`);
  if (errorSpan) {
    errorSpan.textContent = "";
    errorSpan.style.display = "none";
    input.classList.remove("error");
  }
}

function validateForm() {
  let isValid = true;

  const shipmentType = document.getElementById("shipment-type");
  if (!Validator.isValidShipmentType(shipmentType.value)) {
    showError(shipmentType, "Please select a valid shipment type.");
    isValid = false;
  } else {
    clearError(shipmentType);
  }

  const length = document.getElementById("length");
  if (!Validator.isPositiveNumber(length.value)) {
    showError(length, "Enter a valid length.");
    isValid = false;
  } else {
    clearError(length);
  }

  const width = document.getElementById("width");
  if (!Validator.isPositiveNumber(width.value)) {
    showError(width, "Enter a valid width.");
    isValid = false;
  } else {
    clearError(width);
  }

  const height = document.getElementById("height");
  if (!Validator.isPositiveNumber(height.value)) {
    showError(height, "Enter a valid height.");
    isValid = false;
  } else {
    clearError(height);
  }

  const weight = document.getElementById("weight");
  if (!Validator.isPositiveNumber(weight.value)) {
    showError(weight, "Enter a valid weight.");
    isValid = false;
  } else {
    clearError(weight);
  }

  const cardNumber = document.getElementById("card-number");
  if (!Validator.isValidCardNumber(cardNumber.value)) {
    showError(cardNumber, "Enter a valid 16-digit card number.");
    isValid = false;
  } else {
    clearError(cardNumber);
  }

  const expiryDate = document.getElementById("expiry-date");
  if (!Validator.isValidExpiryDate(expiryDate.value)) {
    showError(expiryDate, "Enter a valid expiry date (MM/YY).");
    isValid = false;
  } else {
    clearError(expiryDate);
  }

  const cvv = document.getElementById("cvv");
  if (!Validator.isValidCVV(cvv.value)) {
    showError(cvv, "Enter a valid CVV (3-4 digits).");
    isValid = false;
  } else {
    clearError(cvv);
  }

  const senderLat = document.getElementById("sender-lat");
  if (!Validator.isValidLatitude(senderLat.value)) {
    showError(senderLat, "Enter a valid sender latitude (-90 to 90).");
    isValid = false;
  } else {
    clearError(senderLat);
  }

  const senderLon = document.getElementById("sender-lon");
  if (!Validator.isValidLongitude(senderLon.value)) {
    showError(senderLon, "Enter a valid sender longitude (-180 to 180).");
    isValid = false;
  } else {
    clearError(senderLon);
  }

  const receiverLat = document.getElementById("receiver-lat");
  if (!Validator.isValidLatitude(receiverLat.value)) {
    showError(receiverLat, "Enter a valid receiver latitude (-90 to 90).");
    isValid = false;
  } else {
    clearError(receiverLat);
  }

  const receiverLon = document.getElementById("receiver-lon");
  if (!Validator.isValidLongitude(receiverLon.value)) {
    showError(receiverLon, "Enter a valid receiver longitude (-180 to 180).");
    isValid = false;
  } else {
    clearError(receiverLon);
  }

  return isValid;
}

export function createDelivery() {
  console.log("createDelivery call");
  if (!validateForm()) {
    alert("Please correct the errors in the form.");
    return null;
  }

  const type = document.getElementById("shipment-type").value;
  const length = parseFloat(document.getElementById("length").value);
  const width = parseFloat(document.getElementById("width").value);
  const height = parseFloat(document.getElementById("height").value);
  const weight = parseFloat(document.getElementById("weight").value);
  const senderLat = parseFloat(document.getElementById("sender-lat").value);
  const senderLon = parseFloat(document.getElementById("sender-lon").value);
  const receiverLat = parseFloat(document.getElementById("receiver-lat").value);
  const receiverLon = parseFloat(document.getElementById("receiver-lon").value);

  const deliveryCode = `D${Math.floor(Math.random() * 10000)}`;
  const parcelCode = `P${Math.floor(Math.random() * 10000)}`;

  const parcel = new Parcel(type, { length, width, height }, weight);
  const delivery = new Delivery(
    deliveryCode,
    parcelCode,
    { lat: senderLat, lon: senderLon },
    { lat: receiverLat, lon: receiverLon },
    parcel
  );

  const price = delivery.calculatePrice();
  alert(`Delivery created successfully! Price: $${price.toFixed(2)}`);
  return delivery;
}

document.getElementById("submit-btn").addEventListener("click", createDelivery);
