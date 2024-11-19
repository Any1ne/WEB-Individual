export interface ParcelSize {
    length: number;
    width: number;
    height: number;
  }
  
  export class Parcel {
    type: string;
    size: ParcelSize;
    weight: number;
  
    constructor(type: string, size: ParcelSize, weight: number) {
      this.type = type;
      this.size = size;
      this.weight = weight;
    }
  }
  
  export class Delivery {
    deliveryCode: string;
    parcelCode: string;
    status: string;
    senderCoords: { lat: number; lon: number };
    receiverCoords: { lat: number; lon: number };
    price: number;
    time: Date;
    parcel: Parcel;
  
    constructor(
      deliveryCode: string,
      parcelCode: string,
      senderCoords: { lat: number; lon: number },
      receiverCoords: { lat: number; lon: number },
      parcel: Parcel
    ) {
      this.deliveryCode = deliveryCode;
      this.parcelCode = parcelCode;
      this.status = "Pending"; // Статус за замовчуванням
      this.senderCoords = senderCoords;
      this.receiverCoords = receiverCoords;
      this.price = 0; // Початково ціна дорівнює 0
      this.time = new Date();
      this.parcel = parcel;
    }
  
    // Метод для розрахунку відстані між координатами (в км)
    calculateDistance(): number {
      const toRadians = (deg: number) => (deg * Math.PI) / 180;
  
      const R = 6371; // Радіус Землі в км
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
  
    // Метод для розрахунку ціни доставки
    calculatePrice(): number {
      const distance = this.calculateDistance(); // Відстань у км
      const sizeVolume =
        this.parcel.size.length *
        this.parcel.size.width *
        this.parcel.size.height; // Об'єм
      const baseRate = 0.05; // Базовий коефіцієнт ціни
      const weightRate = 0.1; // Коефіцієнт ціни за вагу
      const distanceRate = 0.2; // Коефіцієнт ціни за відстань
  
      this.price =
        baseRate * sizeVolume + weightRate * this.parcel.weight + distanceRate * distance;
  
      console.log(`Calculated price: $${this.price.toFixed(2)}`);
      return this.price;
    }
  
    // Метод для оновлення статусу
    updateStatus(newStatus: string) {
      this.status = newStatus;
      console.log(`Delivery ${this.deliveryCode} status updated to: ${this.status}`);
    }
  }
  