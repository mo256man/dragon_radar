const canvasW = window.innerWidth;
const canvasH = window.innerHeight;
// const size = Math.min(canvasH, canvasW);
const size = 480;
const center = size/2;
const r = center - 10;

// google map
function initMap() {
    const opts = {
      zoom: 15,
      center: new google.maps.LatLng(35.6807527,139.7670716)
    };
    const elm = document.getElementById("map");
    elm.style.width = size;
    elm.style.height = size;
    elm.style.position = "absolute";
    elm.style.borderRadius = size/2;
    const map = new google.maps.Map(elm, opts);
}

function makeCanvas() {
    var html = "<div style='position:relative'>";
    ["dragonRadar", "cover"].forEach(id => {
        html += `<canvas id="${id}" width="${size}" height="${size}" style="position: absolute"></canvas>`
    });
    html += "</div>"
    document.getElementById("main").innerHTML = html
}

function sotowaku() {
    const canvas = document.getElementById("dragonRadar");
    const ctx = canvas.getContext("2d");

    // 白い四角形を描画
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, size, size);

    // クリッピング領域の設定（円形）
    ctx.beginPath();
    ctx.arc(r, r, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
}


function dragonRadar() {
    const canvas = document.getElementById("dragonRadar");
    const ctx = canvas.getContext("2d");
    // 外枠（白）
    ctx.beginPath();
    ctx.arc(center, center, r+5, 0, 2*Math.PI, false);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.stroke();
    // 内側（緑）
    ctx.beginPath();
    ctx.arc(center, center, r, 0, 2*Math.PI, false);
    ctx.fillStyle = "green";
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.stroke();
}

function cover() {
    const canvas = document.getElementById("cover");
    const ctx = canvas.getContext("2d");
    const rot_time = 1;
    const now = new Date();
    const sec = now.getSeconds() + now.getMilliseconds()/1000;
    const angle = (2 * Math.PI * sec / rot_time) - Math.PI / 2;
    ctx.clearRect(0, 0, size, size);
    // 秒針
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.lineTo(x, y);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "red";
    ctx.stroke();
    //縦線横線
    for (var i=0; i<10; i++) {
        // pとq は xとy および yとx に相当する
        const p = center - r + i * 2 * r / 10;          // 等分した位置 xもしくはy
        const q = Math.sqrt(r**2 - (p-center)**2);      // 相当する位置 yもしくはx
        ctx.moveTo(center + q, p);
        ctx.lineTo(center - q, p);
        ctx.moveTo(p, center + q);
        ctx.lineTo(p, center - q);
    }
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = "black";
    ctx.stroke();
    // アニメーション
    requestAnimationFrame(cover);
}


makeCanvas();
//sotowaku();
//dragonRadar();
//cover();