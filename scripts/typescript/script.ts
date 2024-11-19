import { Parcel, Delivery } from "./model";
import { Validator } from "./validation";

// Функція для відображення повідомлень про помилки
function showError(input: HTMLInputElement | HTMLSelectElement, message: string) {
  const errorSpan = document.getElementById(`${input.id}-error`) as HTMLElement;
  if (errorSpan) {
    errorSpan.textContent = message;
    errorSpan.style.display = "block";
    input.classList.add("error");
  }
}

function clearError(input: HTMLInputElement | HTMLSelectElement) {
  const errorSpan = document.getElementById(`${input.id}-error`) as HTMLElement;
  if (errorSpan) {
    errorSpan.textContent = "";
    errorSpan.style.display = "none";
    input.classList.remove("error");
  }
}

// Функція для валідації всіх полів форми
function validateForm(): boolean {
  let isValid = true;

  // Валідація Shipment Type
  const shipmentType = document.getElementById("shipment-type") as HTMLSelectElement;
  if (!Validator.isValidShipmentType(shipmentType.value)) {
    showError(shipmentType, "Будь ласка, виберіть тип відправлення.");
    isValid = false;
  } else {
    clearError(shipmentType);
  }

  // Валідація розміру посилки
  const length = document.getElementById("length") as HTMLInputElement;
  if (!Validator.isPositiveNumber(length.value)) {
    showError(length, "Введіть коректну довжину.");
    isValid = false;
  } else {
    clearError(length);
  }

  const width = document.getElementById("width") as HTMLInputElement;
  if (!Validator.isPositiveNumber(width.value)) {
    showError(width, "Введіть коректну ширину.");
    isValid = false;
  } else {
    clearError(width);
  }

  const height = document.getElementById("height") as HTMLInputElement;
  if (!Validator.isPositiveNumber(height.value)) {
    showError(height, "Введіть коректну висоту.");
    isValid = false;
  } else {
    clearError(height);
  }

  // Валідація ваги
  const weight = document.getElementById("weight") as HTMLInputElement;
  if (!Validator.isPositiveNumber(weight.value)) {
    showError(weight, "Введіть коректну вагу.");
    isValid = false;
  } else {
    clearError(weight);
  }

  // Валідація Payment Details
  const cardNumber = document.getElementById("card-number") as HTMLInputElement;
  if (!Validator.isValidCardNumber(cardNumber.value)) {
    showError(cardNumber, "Введіть коректний номер картки (16 цифр).");
    isValid = false;
  } else {
    clearError(cardNumber);
  }

  const expiryDate = document.getElementById("expiry-date") as HTMLInputElement;
  if (!Validator.isValidExpiryDate(expiryDate.value)) {
    showError(expiryDate, "Введіть коректну дату закінчення (MM/YY).");
    isValid = false;
  } else {
    clearError(expiryDate);
  }

  const cvv = document.getElementById("cvv") as HTMLInputElement;
  if (!Validator.isValidCVV(cvv.value)) {
    showError(cvv, "Введіть коректний CVV (3-4 цифри).");
    isValid = false;
  } else {
    clearError(cvv);
  }

  // Валідація координат
  const senderLat = document.getElementById("sender-lat") as HTMLInputElement;
  if (!Validator.isValidLatitude(senderLat.value)) {
    showError(senderLat, "Введіть коректну широту відправника (-90 до 90).");
    isValid = false;
  } else {
    clearError(senderLat);
  }

  const senderLon = document.getElementById("sender-lon") as HTMLInputElement;
  if (!Validator.isValidLongitude(senderLon.value)) {
    showError(senderLon, "Введіть коректну довготу відправника (-180 до 180).");
    isValid = false;
  } else {
    clearError(senderLon);
  }

  const receiverLat = document.getElementById("receiver-lat") as HTMLInputElement;
  if (!Validator.isValidLatitude(receiverLat.value)) {
    showError(receiverLat, "Введіть коректну широту отримувача (-90 до 90).");
    isValid = false;
  } else {
    clearError(receiverLat);
  }
  const receiverLon = document.getElementById("receiver-lon") as HTMLInputElement;
  if (!Validator.isValidLongitude(receiverLon.value)) {
    showError(receiverLon, "Введіть коректну довготу отримувача (-180 до 180).");
    isValid = false;
  } else {
    clearError(receiverLon);
  }

  return isValid;
}

// Функція для створення доставки
export function createDelivery(): Delivery | null {
  if (!validateForm()) {
    alert("Будь ласка, виправте помилки у формі.");
    return null;
  }

  // Зчитуємо дані з полів форми
  const type = (document.getElementById("shipment-type") as HTMLSelectElement).value;
  const length = parseFloat((document.getElementById("length") as HTMLInputElement).value);
  const width = parseFloat((document.getElementById("width") as HTMLInputElement).value);
  const height = parseFloat((document.getElementById("height") as HTMLInputElement).value);
  const weight = parseFloat((document.getElementById("weight") as HTMLInputElement).value);
  const senderLat = parseFloat((document.getElementById("sender-lat") as HTMLInputElement).value);
  const senderLon = parseFloat((document.getElementById("sender-lon") as HTMLInputElement).value);
  const receiverLat = parseFloat((document.getElementById("receiver-lat") as HTMLInputElement).value);
  const receiverLon = parseFloat((document.getElementById("receiver-lon") as HTMLInputElement).value);

  // Генеруємо унікальні коди
  const deliveryCode = `D${Math.floor(Math.random() * 10000)}`;
  const parcelCode = `P${Math.floor(Math.random() * 10000)}`;

  // Створюємо об'єкти
  const parcel = new Parcel(type, { length, width, height }, weight);
  const delivery = new Delivery(
    deliveryCode,
    parcelCode,
    { lat: senderLat, lon: senderLon },
    { lat: receiverLat, lon: receiverLon },
    parcel
  );

  console.log("Parcel Created:", parcel);
  console.log("Delivery Created:", delivery);

  // Розраховуємо ціну
  delivery.calculatePrice();

  // Відображаємо деталі для підтвердження
  displayVerification(delivery);

  return delivery;
}

// Функція для відображення деталей підтвердження
function displayVerification(delivery: Delivery) {
  const verificationDiv = document.getElementById("verification-details") as HTMLElement;
  verificationDiv.innerHTML = `
    <p><strong>Delivery Code:</strong> ${delivery.deliveryCode}</p>
    <p><strong>Parcel Code:</strong> ${delivery.parcelCode}</p>
    <p><strong>Status:</strong> ${delivery.status}</p>
    <p><strong>Sender Coordinates:</strong> (${delivery.senderCoords.lat}, ${delivery.senderCoords.lon})</p>
    <p><strong>Receiver Coordinates:</strong> (${delivery.receiverCoords.lat}, ${delivery.receiverCoords.lon})</p>
    <p><strong>Price:</strong> $${delivery.price.toFixed(2)}</p>
    <p><strong>Time:</strong> ${delivery.time.toLocaleString()}</p>
    `
  ;
}

// Функція для автоматичного оновлення статусу
export function startStatusUpdate(delivery: Delivery) {
  const statuses = ["Pending", "In Transit", "Delivered"];
  let currentIndex = 0;

  const intervalId = setInterval(() => {
    currentIndex++;
    if (currentIndex < statuses.length) {
      delivery.updateStatus(statuses[currentIndex]);
      displayVerification(delivery);
    } else {
      clearInterval(intervalId);
    }
  }, 10000); // Оновлення кожні 10 секунд
}

// Обробник події для кнопки "Calculate Price"
document.getElementById("calculate-distance")?.addEventListener("click", () => {
  const delivery = createDelivery();
  if (delivery) {
    startStatusUpdate(delivery);
  }
});