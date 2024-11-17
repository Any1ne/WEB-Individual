const steps = document.querySelectorAll(".step");
const stepContents = document.querySelectorAll(".step-content");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
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
  nextBtn.textContent = currentStep === steps.length ? "Submit" : "Next";
}

// Handle Next Button Click
nextBtn.addEventListener("click", () => {
  if (currentStep < steps.length) {
    currentStep++;
    updateStep();
  } else {
    alert("Form submitted!");
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
