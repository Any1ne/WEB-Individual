// import { Validator } from "./validation.js";

const steps = document.querySelectorAll(".step");
const stepContents = document.querySelectorAll(".step-content");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const submitBtn = document.getElementById("submit-btn");
let currentStep = 1;

// Update Stepper and Content Visibility
function updateStep() {
  steps.forEach((step, index) => {
    step.classList.toggle("active", index + 1 === currentStep);
  });

  stepContents.forEach((content, index) => {
    content.classList.toggle("active", index + 1 === currentStep);
  });

  // Disable/Enable Buttons
  prevBtn.disabled = currentStep === 1;
  nextBtn.style.display = currentStep === steps.length ? "none" : "inline-block"; // Hide "Next" on last step
  submitBtn.style.display = currentStep === steps.length ? "inline-block" : "none"; // Show "Submit" on last step
}

// Validate Input for Current Step
function isStepValid() {
  const currentStepContent = stepContents[currentStep - 1];
  const inputs = currentStepContent.querySelectorAll("input, textarea, select");
  let isValid = true;

  inputs.forEach((input) => {
    if (!input.checkValidity()) {
      isValid = false;
      input.classList.add("invalid");
      const errorMessage = input.nextElementSibling;
      if (errorMessage && errorMessage.classList.contains("error-message")) {
        errorMessage.textContent = input.validationMessage;
      }
    } else {
      input.classList.remove("invalid");
      const errorMessage = input.nextElementSibling;
      if (errorMessage && errorMessage.classList.contains("error-message")) {
        errorMessage.textContent = "";
      }
    }
  });

  return isValid;
}

// Handle Next Button Click
nextBtn.addEventListener("click", () => {
  if (currentStep < steps.length) {
    if (isStepValid()) {
      currentStep++;
      updateStep();
    }
  }
});

// Handle Submit Button Click (Final Step)
submitBtn.addEventListener("click", () => {
  if (isStepValid()) {
    alert("Form submitted!");
    // You can add the form submission logic here
  }
});

// Handle Previous Button Click
prevBtn.addEventListener("click", () => {
  if (currentStep > 1) {
    currentStep--;
    updateStep();
  }
});

// Initialize
updateStep();
