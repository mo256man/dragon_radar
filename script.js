const lat = 35.6807527;
const lng = 139.7670716;

var isDragging = false;
const elmMap = document.getElementById("map");

function initMap() {
    const styleOptions = {
        featureType: "all",
        elementType: "labels",
        stylers: [
            {"visibility": "off"},
        ],
    };

    const opts = {
        zoom: 8,
        disableDefaultUI: false,
        mapTypeControl: false,
        zoomControl: false,
        scaleControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        keyboardShortcuts: false,
        styles: styleOptions,
        mapTypeId: google.maps.MapTypeId.SATELLITE,
        center: new google.maps.LatLng(lat, lng),
    };
    const map = new google.maps.Map(elmMap, opts);
  }

const clickMap = () => {
    console.log("click");
}

// クリックとドラッグを区別する処理
elmMap.addEventListener("mousedown", () => isDragging = false);
elmMap.addEventListener("mousemove", () => isDragging = true);
elmMap.addEventListener("mouseup", () => {
    if (! isDragging) {
        clickMap();
    }
    isDragging = false;
});
