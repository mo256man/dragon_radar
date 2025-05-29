const lat = 35.58559722;
const lng =  137.01127778;
const BALL_CNT = 7;

const loadCityData = async () => {
  const response = await fetch("./cities_coordinates.csv");
  const text = await response.text();
  const rows = text.trim().split('\n');
  rows.shift();     // 最初の行（見出し）を削除
  const shuffled = rows.sort(() => 0.5 - Math.random()).slice(0, BALL_CNT);
  const dataArray = shuffled.map(item => item.split(","));
  window.dataArray = dataArray;
}

const createTable = () => {
  const table = document.getElementById("quiz");
  const headers = ["都道府県", "市"];
  const headerRow = document.createElement("tr");

  // ヘッダー
  headers.forEach(text => {
    const th = document.createElement("th");
    th.textContent = text;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  // 解答欄
  for (let r=0; r<BALL_CNT; r++) {
    const row = document.createElement("tr");
    for (let c=0; c<3; c++) {
      const td = document.createElement("td");
      const td_container = document.createElement("div");
      td_container.className = "td_container"
      const mark = document.createElement("div");
      mark.className = "mark right";
      mark.innerHTML = "👍"
      td.appendChild(td_container);
      if (c<2) {
        const input = document.createElement("input");
        input.type = "text";
        input.className = "input right";
        input.setAttribute("autocomplete", "off");
        td_container.appendChild(mark);
        td_container.appendChild(input);
        td.appendChild(td_container);
      } else {
        const div = document.createElement("div");
        div.className = "checkAnswer";
        div.innerHTML = "";
        td.appendChild(div);
      }
      row.appendChild(td);
    }
    table.appendChild(row);
  }
}

const checkAnswer = () => {
  const table = document.getElementById("quiz");
  const inputValues = Array.from(table.rows).map(row =>
    Array.from(row.cells).map(cell => cell.querySelector("input")?.value || "")
  );
  inputValues.shift(); // 先頭の行（th行）を削除

  let totalScore = 0;
  for (let r=0; r<BALL_CNT; r++) {
    let sc = 0;
    const answer0 = inputValues[r][0];
    const answer1 = inputValues[r][1];
    const correct0 = window.dataArray[r][0];
    const correct1 = window.dataArray[r][1];
    if (answer0 == correct0) {
      sc += 30;
    }
    if (answer1 == correct1) {
      sc += 70;
    }
    totalScore += sc;
    console.log("sc:", sc);
  }
  console.log("totalScore", totalScore);
}


// 画面描画後に実行されるメイン処理
document.addEventListener("DOMContentLoaded", async () => {
  await loadCityData();
  document.getElementById("answer").addEventListener("click", () => checkAnswer())
  console.log("answers:");
  console.log(window.dataArray);
  console.log("");
  createTable();
});


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
    zoom: 5,
    disableDefaultUI: false,
    styles: styleOptions,
    mapTypeId: google.maps.MapTypeId.SATELLITE,
    center: new google.maps.LatLng(lat, lng),
  };
  window.map = new google.maps.Map(elmMap, opts);

  // 2. 緯度経度のアレイのアレイ
  const latlngs = [
    [35.6807527, 139.7670716]
  ];

  // 3. マーカーを設置
  latlngs.forEach(([lat, lng]) => {
    new google.maps.Marker({
      position: { lat, lng },
      map: map,
    });
  });
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
