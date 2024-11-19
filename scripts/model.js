export class Parcel {
    constructor(type, size, weight) {
      this.type = type;
      this.size = size;
      this.weight = weight;
    }
  }
  
  export class Delivery {
    constructor(deliveryCode, parcelCode, senderCoords, receiverCoords, parcel) {
      this.deliveryCode = deliveryCode;
      this.parcelCode = parcelCode;
      this.status = "Pending"; // Default status
      this.senderCoords = senderCoords;
      this.receiverCoords = receiverCoords;
      this.price = 0; // Initial price
      this.time = new Date();
      this.parcel = parcel;
    }
  
    // Calculate distance between sender and receiver coordinates (in km)
    calculateDistance() {
      const toRadians = (deg) => (deg * Math.PI) / 180;
  
      const R = 6371; // Radius of the Earth in km
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
  
    // Calculate delivery price
    calculatePrice() {
      const distance = this.calculateDistance(); // Distance in km
      const sizeVolume =
        this.parcel.size.length *
        this.parcel.size.width *
        this.parcel.size.height; // Volume
      const baseRate = 0.05; // Base price coefficient
      const weightRate = 0.1; // Weight price coefficient
      const distanceRate = 0.2; // Distance price coefficient
  
      this.price =
        baseRate * sizeVolume + weightRate * this.parcel.weight + distanceRate * distance;
  
      console.log(`Calculated price: $${this.price.toFixed(2)}`);
      return this.price;
    }
  
    // Update delivery status
    updateStatus(newStatus) {
      this.status = newStatus;
      console.log(`Delivery ${this.deliveryCode} status updated to: ${this.status}`);
    }
  }
  