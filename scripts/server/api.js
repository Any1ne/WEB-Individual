const API_URL = "https://api.jsonbin.io/v3/b";
const BIN_ID = "673f3c65e41b4d34e4580893";
const API_KEY = "$2a$10$.EBqQkZESprztkJNX05WjOMvp7BpilP39ODZJy2FnZJD1c.kxxffm";

const headers = {
  "Content-Type": "application/json",
  "X-Access-Key": API_KEY,
};

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
      parcel: {
        type: delivery.parcel.type,
        size: delivery.parcel.size,
        weight: delivery.parcel.weight,
      },
    };

    const response = await fetch(`${API_URL}/${BIN_ID}/latest`, { headers });
    const data = await response.json();

    if (!Array.isArray(data.record.deliveries)) {
      data.record.deliveries = [];
    }

    data.record.deliveries.push(payload);

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

export async function getDeliveries() {
  try {
    const response = await fetch(`${API_URL}/${BIN_ID}/latest`, { headers });
    if (!response.ok) {
      throw new Error(`Failed to fetch deliveries: ${response.statusText}`);
    }
    const data = await response.json();
    return data.record.deliveries || [];
  } catch (error) {
    console.error("Error fetching deliveries:", error);
  }
}

export async function deleteDelivery(deliveryCode) {
  try {
    const response = await fetch(`${API_URL}/${BIN_ID}/latest`, { headers });
    const data = await response.json();

    const filteredDeliveries = data.record.deliveries.filter(
      (delivery) => delivery.delivery_code !== deliveryCode
    );

    if (filteredDeliveries.length === data.record.deliveries.length) {
      console.warn(`Delivery with code ${deliveryCode} not found.`);
      return;
    }

    data.record.deliveries = filteredDeliveries;

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
