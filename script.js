const lat = 35.6807527;
const lng = 139.7670716;

var isDragging = false;
const elmMap = document.getElementById("map");

const styleOptions = [
  {
    featureType: "all",
    elementType: "labels",
    stylers: [
      { "visibility": "off" },
    ],
  },
];

window.map = null;
let cityMarkers = [];

function initMap() {
  const opts = {
    zoom: 8,
    disableDefaultUI: false,
    styles: styleOptions,
    mapTypeId: google.maps.MapTypeId.SATELLITE,
    center: new google.maps.LatLng(lat, lng),
  };
  window.map = new google.maps.Map(elmMap, opts);
  loadRandomCSVRows();
}

elmMap.addEventListener("mousedown", () => isDragging = false);
elmMap.addEventListener("mousemove", () => isDragging = true);
elmMap.addEventListener("mouseup", () => {
  if (!isDragging) {
    console.log("click");
  }
  isDragging = false;
});

function clearCityMarkers() {
  cityMarkers.forEach(marker => marker.remove());
  cityMarkers = [];
}

async function loadRandomCSVRows(count = 7) {
  try {
    const response = await fetch("./cities_coordinates.csv");
    const text = await response.text();
    const rows = text.trim().split('\n');
    const headers = rows.shift().split(',');

    const shuffled = rows.sort(() => 0.5 - Math.random()).slice(0, count);
    const dataArray = shuffled.map(row => {
      const values = row.split(',');
      return Object.fromEntries(headers.map((h, i) => [h, values[i]]));
    });

    clearCityMarkers();

    dataArray.forEach(city => {
      const lat = Number(city.latitude);
      const lng = Number(city.longitude);
      const name = city.name || "";
      const marker = document.createElement('gmp-advanced-marker');
      marker.position = { lat, lng };
      if (name) marker.title = name;
      marker.map = window.map;
      cityMarkers.push(marker);
    });

    console.log(dataArray);
  } catch (error) {
    console.error('CSV読み込みエラー:', error);
  }
}