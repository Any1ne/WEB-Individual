import { Validator } from "./validation.js";
import { createDelivery, saveDelivery } from "./script.js";

const steps = document.querySelectorAll(".step");
const stepContents = document.querySelectorAll(".step-content");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const submitBtn = document.getElementById("submit-btn");
let currentStep = 1;

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

  if (currentStep === steps.length) {
    displayConfirmation();
  }
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
  return isValid;
}

function displayConfirmation() {
  const delivery = createDelivery();

  if (delivery) {
    const confirmationBlock = document.querySelector(
      ".step-content[data-step='4']"
    );

    // Заповнення значень у відповідні елементи
    document.getElementById("parcel-type").textContent = delivery.parcel.type;
    document.getElementById(
      "parcel-size"
    ).textContent = `${delivery.parcel.size.length} x ${delivery.parcel.size.width} x ${delivery.parcel.size.height}`;
    document.getElementById(
      "parcel-weight"
    ).textContent = `${delivery.parcel.weight} kg`;
    document.getElementById("delivery-code").textContent =
      delivery.deliveryCode;
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
});

submitBtn.addEventListener("click", () => {
  const delivery = createDelivery();
  if (delivery) {
    saveDelivery(delivery);
    alert("Delivery saved successfully!");
  }
});

updateStep();
