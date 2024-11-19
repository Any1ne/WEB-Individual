export class Validator {
    static isValidShipmentType(type: string): boolean {
      return type === "Parcel" || type === "Documents";
    }
  
    static isPositiveNumber(value: string): boolean {
      const num = parseFloat(value);
      return !isNaN(num) && num > 0;
    }
  
    static isValidCardNumber(cardNumber: string): boolean {
      // Простий шаблон: 16 цифр
      return /^\d{16}$/.test(cardNumber.replace(/\s+/g, ""));
    }
  
    static isValidExpiryDate(expiry: string): boolean {
      // Формат MM/YY
      if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
      const [month, year] = expiry.split("/").map(Number);
      if (month < 1 || month > 12) return false;
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100; // Останні дві цифри року
      const currentMonth = currentDate.getMonth() + 1;
      if (year < currentYear || (year === currentYear && month < currentMonth)) return false;
      return true;
    }
  
    static isValidCVV(cvv: string): boolean {
      return /^\d{3,4}$/.test(cvv);
    }
    static isValidLatitude(lat: string): boolean {
        const num = parseFloat(lat);
        return !isNaN(num) && num >= -90 && num <= 90;
      }
    
      static isValidLongitude(lon: string): boolean {
        const num = parseFloat(lon);
        return !isNaN(num) && num >= -180 && num <= 180;
      }
    }