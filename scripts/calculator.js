import { Validator } from "./validation.js";
import { showError, clearError, createDelivery } from "./script.js";

const distanceBtn = document.getElementById("calculate_distance");
const costBtn = document.getElementById("calculate_cost");

function isValid() {
  const inputs = document.querySelectorAll("input, select");
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

distanceBtn.addEventListener("click", () => {
  if (isValid()) {
    const delivery = createDelivery();
    if (delivery) {
      const distance = delivery.calculateDistance().toFixed(3);
      document.getElementById("distance-result").textContent = `Distance from sender to receiver: ${distance} km`;
    }
  }
});

costBtn.addEventListener("click", () => {
  if (isValid()) {
    const delivery = createDelivery();
    if (delivery) {
      const price = delivery.calculatePrice().toFixed(2);
      document.getElementById("price-result").textContent = `Cost of Delivery: ${price}$`;
    }
  }
});
