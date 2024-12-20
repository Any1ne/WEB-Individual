import { Validator } from "./validation.js";
import {
  showError,
  clearError,
  createDelivery,
  saveDelivery,
} from "./script.js";
// import { Delivery } from "./model.js";

const steps = document.querySelectorAll(".step");
const stepContents = document.querySelectorAll(".step-content");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const submitBtn = document.getElementById("submit-btn");
const distanceBtn = document.getElementById("calculate-distance");
let currentStep = 1;
let delivery = null;

function updateStep() {
  steps.forEach((step, index) => {
    step.classList.toggle("active", index + 1 === currentStep);
  });

  stepContents.forEach((content, index) => {
    content.classList.toggle("active", index + 1 === currentStep);
  });

  prevBtn.disabled = currentStep === 1;
  nextBtn.style.display =
    currentStep === steps.length ? "none" : "inline-block";
  submitBtn.style.display =
    currentStep === steps.length ? "inline-block" : "none";

  if (currentStep === 3) {
    console.log("Display cost");
    delivery = createDelivery();
    if (delivery) {
      const price = delivery.calculatePrice().toFixed(2);
      document.getElementById(
        "price-result"
      ).textContent = `Cost of Delivery: ${price}$`;
    }
  }

  if (currentStep === 4) {
    displayConfirmation();
  }

  console.log("Delivery", delivery);
}

function isStepValid() {
  const inputs =
    stepContents[currentStep - 1].querySelectorAll("input, select");
  let isValid = true;

  inputs.forEach((input) => {
    const validationFn = input.dataset.validate;
    if (validationFn && typeof Validator[validationFn] === "function") {
      const value = input.value;
      if (!Validator[validationFn](value)) {
        isValid = false;
        input.classList.add("error");
      } else {
        input.classList.remove("error");
      }
    }
  });

  console.log(isValid);
  if (!isValid) {
    showError("Invalid input. Please correct it.");
  } else {
    clearError();
  }
  return isValid;
}

function displayConfirmation() {
  if (delivery) {
    const confirmationBlock = document.querySelector(
      ".step-content[data-step='4']"
    );
    document.getElementById("parcel-type").textContent = delivery.parcel.type;
    document.getElementById(
      "parcel-size"
    ).textContent = `${delivery.parcel.size.length} x ${delivery.parcel.size.width} x ${delivery.parcel.size.height}`;
    document.getElementById(
      "parcel-weight"
    ).textContent = `${delivery.parcel.weight} kg`;
    document.getElementById(
      "delivery-code"
    ).textContent = `${delivery.deliveryCode}`;
    document.getElementById("parcel-code").textContent = delivery.parcelCode;
    document.getElementById("delivery-status").textContent = delivery.status;
    document.getElementById(
      "sender-coords"
    ).textContent = `Latitude: ${delivery.senderCoords.lat}, Longitude: ${delivery.senderCoords.lon}`;
    document.getElementById(
      "receiver-coords"
    ).textContent = `Latitude: ${delivery.receiverCoords.lat}, Longitude: ${delivery.receiverCoords.lon}`;
    document.getElementById(
      "delivery-price"
    ).textContent = `$${delivery.price.toFixed(2)}`;
    document.getElementById("delivery-time").textContent =
      delivery.time.toLocaleString();

    console.log("Confirmation display updated.");
  }
}

distanceBtn.addEventListener("click", () => {
  const delivery_try = createDelivery();
  if (delivery_try) {
    const distance = delivery_try.calculateDistance().toFixed(3);
    document.getElementById(
      "distance-result"
    ).textContent = `Distance from sender to receiver: ${distance} km`;
  }
});

nextBtn.addEventListener("click", () => {
  if (currentStep < steps.length) {
    if (isStepValid()) {
      currentStep++;
      updateStep();
    }
  }
});

prevBtn.addEventListener("click", () => {
  if (currentStep > 1) {
    currentStep--;
    updateStep();
  }
  const statusResult = document.getElementById("status-result");
  statusResult.textContent = "";
});

submitBtn.addEventListener("click", async () => {
  const statusResult = document.getElementById("status-result");
  statusResult.textContent = "Adding delivery...";

  if (delivery) {
    const result = await saveDelivery(delivery);
    if (result === 1) {
      statusResult.textContent = "Delivery saved successfully!";
      console.log("Delivery saved successfully!", delivery);
      submitBtn.disabled = true;
      prevBtn.disabled = true;
    } else {
      statusResult.textContent = "No connection with server.";
      console.log("Failed to save delivery.");
    }
  } else {
    statusResult.textContent = "Delivery data is missing.";
  }
});

updateStep();
