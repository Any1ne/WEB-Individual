export class Validator {
  static isValidShipmentType(type) {
    console.log("isValidShipmentType");
    return type === "Parcel" || type === "Documents";
  }

  static isPositiveNumber(value) {
    console.log("isPositiveNumber");
    const num = parseFloat(value);
    return !isNaN(num) && num > 0;
  }

  static isValidCardNumber(cardNumber) {
    console.log("isValidCardNumber");
    // Simple pattern: 16 digits
    return /^\d{16}$/.test(cardNumber.replace(/\s+/g, ""));
  }

  static isValidExpiryDate(expiry) {
    console.log("isValidExpiryDate");
    // Format MM/YY
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
    const [month, year] = expiry.split("/").map(Number);
    if (month < 1 || month > 12) return false;

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100; // Last two digits of the year
    const currentMonth = currentDate.getMonth() + 1;

    if (year < currentYear || (year === currentYear && month < currentMonth))
      return false;
    return true;
  }

  static isValidCVV(cvv) {
    console.log("isValidCVV");
    return /^\d{3,4}$/.test(cvv);
  }

  static isValidLatitude(lat) {
    console.log("isValidLatitude");
    const num = parseFloat(lat);
    return !isNaN(num) && num >= -90 && num <= 90;
  }

  static isValidLongitude(lon) {
    console.log("isValidLongitude");
    console.log(lon);
    const num = parseFloat(lon);
    console.log(num);
    return !isNaN(num) && num >= -180 && num <= 180;
  }
}
