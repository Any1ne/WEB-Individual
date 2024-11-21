let map;
let senderMarker;
let receiverMarker;

function initMap() {
  // Ініціалізація карти
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 50.4501, lng: 30.5234 }, // Київ
    zoom: 10,
  });

  // Додаємо Autocomplete для полів адрес
  const senderInput = document.getElementById("sender-address");
  const receiverInput = document.getElementById("receiver-address");

  const senderAutocomplete = new google.maps.places.Autocomplete(senderInput);
  const receiverAutocomplete = new google.maps.places.Autocomplete(receiverInput);

  senderAutocomplete.bindTo("bounds", map);
  receiverAutocomplete.bindTo("bounds", map);

  // Додаємо маркер відправника
  senderAutocomplete.addListener("place_changed", () => {
    const place = senderAutocomplete.getPlace();
    if (!place.geometry || !place.geometry.location) return;

    if (senderMarker) senderMarker.setMap(null);

    senderMarker = new google.maps.Marker({
      position: place.geometry.location,
      map,
      title: "Sender Address",
    });

    map.setCenter(place.geometry.location);
  });

  // Додаємо маркер отримувача
  receiverAutocomplete.addListener("place_changed", () => {
    const place = receiverAutocomplete.getPlace();
    if (!place.geometry || !place.geometry.location) return;

    if (receiverMarker) receiverMarker.setMap(null);

    receiverMarker = new google.maps.Marker({
      position: place.geometry.location,
      map,
      title: "Receiver Address",
    });

    map.setCenter(place.geometry.location);
  });

  // Кнопка для обчислення дистанції
  document.getElementById("calculate-distance").addEventListener("click", () => {
    calculateDistance();
  });
}

// Функція для обчислення фізичної дистанції (Haversine Formula)
function calculateDistance() {
  if (!senderMarker || !receiverMarker) {
    alert("Please select both sender and receiver addresses.");
    return;
  }

  const senderPosition = senderMarker.getPosition();
  const receiverPosition = receiverMarker.getPosition();

  const distance = haversineDistance(
    { lat: senderPosition.lat(), lng: senderPosition.lng() },
    { lat: receiverPosition.lat(), lng: receiverPosition.lng() }
  );

  document.getElementById("distance-result").textContent = `Distance: ${distance.toFixed(2)} meters`;
}

// Формула Haversine
function haversineDistance(coord1, coord2) {
  const R = 6371000; // Радіус Землі в метрах
  const lat1 = (coord1.lat * Math.PI) / 180;
  const lat2 = (coord2.lat * Math.PI) / 180;
  const deltaLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const deltaLng = ((coord2.lng - coord1.lng) * Math.PI) / 180;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Відстань у метрах
}

// Завантаження карти
window.initMap = initMap;
