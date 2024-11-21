const API_URL = "https://api.jsonbin.io/v3/b";
const BIN_ID = "673f3c65e41b4d34e4580893";
const API_KEY = "$2a$10$.EBqQkZESprztkJNX05WjOMvp7BpilP39ODZJy2FnZJD1c.kxxffm";

// Заголовки для запитів
const headers = {
  "Content-Type": "application/json",
  "X-Access-Key": API_KEY,
};

// Додавання нової доставки
export async function addDelivery(delivery) {
  try {
    const payload = {
      delivery_code: delivery.deliveryCode,
      parcel_code: delivery.parcelCode,
      status: delivery.status || "Pending",
      sender_coordinates: delivery.senderCoords,
      receiver_coordinates: delivery.receiverCoords,
      price: delivery.price || 0,
      time: delivery.time,

      // Дані з класу Parcel
      parcel: {
        type: delivery.parcel.type,
        size: delivery.parcel.size,
        weight: delivery.parcel.weight,
      },
    };

    // Отримуємо поточні дані
    const response = await fetch(`${API_URL}/${BIN_ID}/latest`, { headers });
    const data = await response.json();

    // Перевірка наявності масиву deliveries
    if (!Array.isArray(data.record.deliveries)) {
      data.record.deliveries = [];
    }

    // Додаємо нову доставку
    data.record.deliveries.push(payload);

    // Оновлюємо дані у JSONBin
    const updateResponse = await fetch(`${API_URL}/${BIN_ID}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data.record),
    });

    if (updateResponse.ok) {
      console.log("Delivery added successfully:", delivery);
    } else {
      console.error("Failed to update bin:", updateResponse.statusText);
    }
  } catch (error) {
    console.error("Error adding delivery:", error);
  }
}

// Отримання всіх доставок
export async function getDeliveries() {
  try {
    const response = await fetch(`${API_URL}/${BIN_ID}/latest`, { headers });
    if (!response.ok) {
      throw new Error(`Failed to fetch deliveries: ${response.statusText}`);
    }
    const data = await response.json();
    console.log("All deliveries:", data.record.deliveries);
    return data.record.deliveries || [];
  } catch (error) {
    console.error("Error fetching deliveries:", error);
  }
}

// Видалення доставки
export async function deleteDelivery(deliveryCode) {
  try {
    const response = await fetch(`${API_URL}/${BIN_ID}/latest`, { headers });
    const data = await response.json();

    // Фільтруємо доставки
    const filteredDeliveries = data.record.deliveries.filter(
      (delivery) => delivery.delivery_code !== deliveryCode
    );

    if (filteredDeliveries.length === data.record.deliveries.length) {
      console.warn(`Delivery with code ${deliveryCode} not found.`);
      return;
    }

    data.record.deliveries = filteredDeliveries;

    // Оновлюємо дані у JSONBin
    const updateResponse = await fetch(`${API_URL}/${BIN_ID}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data.record),
    });

    if (updateResponse.ok) {
      console.log(`Delivery with code ${deliveryCode} deleted successfully.`);
    } else {
      console.error("Failed to update bin:", updateResponse.statusText);
    }
  } catch (error) {
    console.error("Error deleting delivery:", error);
  }
}

// Оновлення статусу доставки
export async function updateDeliveryStatus(deliveryCode, newStatus) {
  try {
    const response = await fetch(`${API_URL}/${BIN_ID}/latest`, { headers });
    const data = await response.json();

    const delivery = data.record.deliveries.find(
      (delivery) => delivery.delivery_code === deliveryCode
    );

    if (!delivery) {
      console.warn(`Delivery with code ${deliveryCode} not found.`);
      return;
    }

    delivery.status = newStatus;

    // Оновлюємо дані у JSONBin
    const updateResponse = await fetch(`${API_URL}/${BIN_ID}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data.record),
    });

    if (updateResponse.ok) {
      console.log(`Status of delivery ${deliveryCode} updated to ${newStatus}`);
    } else {
      console.error("Failed to update bin:", updateResponse.statusText);
    }
  } catch (error) {
    console.error("Error updating delivery status:", error);
  }
}

// // Використання функцій
// (async function () {
//   // Додавання нової доставки
//   await addDelivery({
//     delivery_code: "DEL124",
//     type: "Documents",
//     size: { length: 0, width: 0, height: 0 },
//     weight: 0.5,
//     sender_address: "789 Pine St",
//     receiver_address: "321 Oak St",
//     sender_coordinates: "48.8566, 2.3522",
//     receiver_coordinates: "34.0522, -118.2437",
//     price: 30.0,
//     time: "2024-11-20 16:00",
//     status: "Pending",
//   });

//   // Отримання всіх доставок
//   const deliveries = await getDeliveries();
//   console.log(deliveries);

//   // Оновлення статусу
//   await updateDeliveryStatus("DEL124", "Shipped");

//   // Видалення доставки
//   await deleteDelivery("DEL124");
// })();
