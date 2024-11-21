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
    this.price = this.calculatePrice(parcel.size, parcel.weight, senderCoords, receiverCoords);
    this.time = new Date();
    
  }
  calculateDistance(senderCoords, receiverCoords) {
    const toRadians = (deg) => (deg * Math.PI) / 180;

    const R = 6371; // Earth's radius in kilometers
    const dLat = toRadians(receiverCoords.lat - senderCoords.lat);
    const dLon = toRadians(receiverCoords.lon - senderCoords.lon);

    const lat1 = toRadians(senderCoords.lat);
    const lat2 = toRadians(receiverCoords.lat);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    console.log(`Calculated distance: ${distance.toFixed(2)} km`);
    return distance;
  }

  calculatePrice(size, weight, senderCoords, receiverCoords) {
    const distance = this.calculateDistance(senderCoords, receiverCoords); // Distance in kilometers
    const sizeVolume =
      size.length *
      size.width *
      size.height;
    const baseRate = 0.05;
    const weightRate = 0.1;
    const distanceRate = 0.2;

    this.price =
      baseRate * sizeVolume +
      weightRate * weight +
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
