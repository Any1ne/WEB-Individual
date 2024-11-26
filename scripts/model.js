export class Parcel {
  constructor(type, size, weight) {
    console.log("Parcel constructor");
    this.type = type;
    this.size = size;
    this.weight = weight;
  }
}

export class Delivery {
  constructor(deliveryCode, parcelCode, senderCoords, receiverCoords, parcel) {
    console.log("Delivery constructor");
    this.deliveryCode = deliveryCode;
    this.parcelCode = parcelCode;
    this.parcel = parcel;
    this.status = "Pending";
    this.senderCoords = senderCoords;
    this.receiverCoords = receiverCoords;
    this.price = this.calculatePrice();
    this.time = new Date();
  }
  calculateDistance() {
    const toRadians = (deg) => (deg * Math.PI) / 180;

    const R = 6371; // Earth's radius in kilometers
    const dLat = toRadians(this.receiverCoords.lat - this.senderCoords.lat);
    const dLon = toRadians(this.receiverCoords.lon - this.senderCoords.lon);

    const lat1 = toRadians(this.senderCoords.lat);
    const lat2 = toRadians(this.receiverCoords.lat);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    console.log(`Calculated distance: ${distance.toFixed(2)} km`);
    return distance;
  }

  calculatePrice() {
    const distance = this.calculateDistance(); // Distance in kilometers
    const sizeVolume =
      this.parcel.size.length *
      this.parcel.size.width *
      this.parcel.size.height;
    const baseRate = 0.005;
    const weightRate = 0.01;
    const distanceRate = 0.02;

    this.price =
      baseRate * sizeVolume +
      weightRate * this.parcel.weight +
      distanceRate * distance;

    console.log(`Calculated price: $${this.price.toFixed(2)}`);
    return this.price;
  }

  updateStatus(newStatus) {
    const validStatuses = ["Pending", "In Transit", "Delivered", "Cancelled"];
    if (!validStatuses.includes(newStatus)) {
      throw new Error(
        `Invalid status: ${newStatus}. Valid statuses are: ${validStatuses.join(
          ", "
        )}`
      );
    }

    this.status = newStatus;
    console.log(
      `Delivery ${this.deliveryCode} status updated to: ${this.status}`
    );
  }
}
