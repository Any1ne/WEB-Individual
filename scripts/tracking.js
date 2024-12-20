import { config } from "./server/config.js";

document.addEventListener("DOMContentLoaded", () => {
  const searchButton = document.getElementById("search-button");
  const deliveryCodeInput = document.getElementById("delivery-code");
  const parcelInfo = document.getElementById("parcel-info");

  async function fetchDeliveries() {
    try {
      const response = await fetch(`${config.IP_SERVER}/deliveries`, {
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": config.API_KEY_SERVER,
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch deliveries: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      throw error;
    }
  }

  searchButton.addEventListener("click", async () => {
    const deliveryCode = deliveryCodeInput.value.trim();
    if (!deliveryCode) {
      parcelInfo.textContent = "Please enter a delivery code.";
      return;
    }

    try {
      const deliveries = await fetchDeliveries();
      const delivery = deliveries.find((d) => d.delivery_code === deliveryCode);

      if (delivery) {
        parcelInfo.innerHTML = `
          <strong>Delivery Code:</strong> ${delivery.delivery_code}<br />
          <strong>Parcel Code:</strong> ${delivery.parcel_code}<br />
          <strong>Status:</strong> ${delivery.status}<br />
          <strong>Sender Coordinates:</strong> (${
            delivery.sender_coordinates.lat
          }, ${delivery.sender_coordinates.lon})<br />
          <strong>Receiver Coordinates:</strong> (${
            delivery.receiver_coordinates.lat
          }, ${delivery.receiver_coordinates.lon})<br />
          <strong>Price:</strong> $${delivery.price.toFixed(2)}<br />
          <strong>Time:</strong> ${new Date(
            delivery.time
          ).toLocaleString()}<br />
          <strong>Parcel Type:</strong> ${delivery.parcel.type}<br />
          <strong>Size:</strong> ${delivery.parcel.size.length} x ${
          delivery.parcel.size.width
        } x ${delivery.parcel.size.height} cm<br />
          <strong>Weight:</strong> ${delivery.parcel.weight} kg<br />
        `;
      } else {
        parcelInfo.textContent =
          "Delivery not found. Please check the code and try again.";
      }
    } catch (error) {
      parcelInfo.textContent =
        "An error occurred while fetching the deliveries. Please try again later.";
    }
  });
});
