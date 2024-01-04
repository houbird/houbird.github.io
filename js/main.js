const padding = 50;
let scale = 10;
  
function calculateAndDraw() {
  // 自動調整縮放比例以適應所有點
  adjustScale();

  var ctx = document.getElementById('canvas').getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  drawGrid();

  var a = parseCoordinates(document.getElementById('a').value);
  var b = parseCoordinates(document.getElementById('b').value);
  var c = parseCoordinates(document.getElementById('c').value);

  // Drawing points and lines
  drawLine(ctx, a, b, 'blue');
  drawLine(ctx, a, c, 'green');
  drawPoint(ctx, a, 'A');
  drawPoint(ctx, b, 'B');
  drawPoint(ctx, c, 'C');

  // Calculating distances
  var distanceAB = distance(parseCoordinatesForCalculation(document.getElementById('a').value), 
                            parseCoordinatesForCalculation(document.getElementById('b').value));
  var distanceAC = distance(parseCoordinatesForCalculation(document.getElementById('a').value), 
                            parseCoordinatesForCalculation(document.getElementById('c').value));
  var distanceCtoLineAB = pointToLineDistance(parseCoordinatesForCalculation(document.getElementById('c').value), 
                                              parseCoordinatesForCalculation(document.getElementById('a').value), 
                                              parseCoordinatesForCalculation(document.getElementById('b').value));

  // Draw the perpendicular line from C to AB in dashed line
  var closestPoint = getClosestPointOnLine(c, a, b);
  drawDashedLine(ctx, c, closestPoint, 'red');


  // 獲取最近點 T
  var closestPointT = getClosestPointOnLine(c, a, b);
  drawPoint(ctx, closestPointT, 'T'); // 繪製點 T

  // 計算 A 到 T 的距離
  var originalA = parseCoordinatesForCalculation(document.getElementById('a').value);
  var originalT = getClosestPointOnLineOriginal(parseCoordinatesForCalculation(document.getElementById('c').value), 
                                                parseCoordinatesForCalculation(document.getElementById('a').value), 
                                                parseCoordinatesForCalculation(document.getElementById('b').value));

  var distanceAT = distance(originalA, originalT);
  // 繪製並標記 A 到 T 的距離
  drawDashedLineWithDistance(ctx, a, closestPointT, 'purple', distanceAT);

  // Updating message with formulas and process
  document.getElementById('answer').innerHTML = `
    A: (${parseCoordinatesForCalculation(document.getElementById('a').value)}) <br>
    B: (${parseCoordinatesForCalculation(document.getElementById('b').value)}) <br>
    C: (${parseCoordinatesForCalculation(document.getElementById('c').value)}) <br>
    T: (${originalT[0].toFixed(4)}, ${originalT[1].toFixed(4)}) <br>
    <hr/>
    Distance A-B: ${distanceAB.toFixed(4)} <br>
    Distance A-C: ${distanceAC.toFixed(4)} <br>
    Distance from C to line AB: ${distanceCtoLineAB.toFixed(4)} <br>
    Distance A-T: ${distanceAT.toFixed(4)} <br>
    <br>
    `;
  document.getElementById('message').innerHTML = `
    計算公式及過程: <br>
    距離 A-B 的計算: <br>
    使用歐幾里得距離公式，計算兩點間距離: <br>
    √((x2 - x1)² + (y2 - y1)²) <br>
    其中 A(${parseCoordinatesForCalculation(document.getElementById('a').value)}) 和 B(${parseCoordinatesForCalculation(document.getElementById('b').value)}) <br>
    所以距離 A-B = √((${parseCoordinatesForCalculation(document.getElementById('b').value)[0]} - ${parseCoordinatesForCalculation(document.getElementById('a').value)[0]})² + (${parseCoordinatesForCalculation(document.getElementById('b').value)[1]} - ${parseCoordinatesForCalculation(document.getElementById('a').value)[1]})²) = ${distanceAB.toFixed(4)}
    <br>
    <br>
    距離 A-C 的計算: <br>
    使用歐幾里得距離公式，計算兩點間距離: <br>
    √((x2 - x1)² + (y2 - y1)²) <br>
    其中 A(${parseCoordinatesForCalculation(document.getElementById('a').value)}) 和 C(${parseCoordinatesForCalculation(document.getElementById('c').value)}) <br>
    所以距離 A-C = √((${parseCoordinatesForCalculation(document.getElementById('c').value)[0]} - ${parseCoordinatesForCalculation(document.getElementById('a').value)[0]})² + (${parseCoordinatesForCalculation(document.getElementById('c').value)[1]} - ${parseCoordinatesForCalculation(document.getElementById('a').value)[1]})²) = ${distanceAC.toFixed(4)}
    <br>
    <br>
    距離 C 到線段 AB 的計算: <br>
    使用公式: <br>
    |(x2 - x1)(y1 - y0) - (x1 - x0)(y2 - y1)| / √((x2 - x1)² + (y2 - y1)²) <br>
    其中 A(${parseCoordinatesForCalculation(document.getElementById('a').value)}) 和 B(${parseCoordinatesForCalculation(document.getElementById('b').value)}) <br>
    所以距離 C 到線段 AB = |(${parseCoordinatesForCalculation(document.getElementById('b').value)[0]} - ${parseCoordinatesForCalculation(document.getElementById('a').value)[0]})(${parseCoordinatesForCalculation(document.getElementById('a').value)[1]} - ${parseCoordinatesForCalculation(document.getElementById('c').value)[1]}) - (${parseCoordinatesForCalculation(document.getElementById('a').value)[0]} - ${parseCoordinatesForCalculation(document.getElementById('c').value)[0]})(${parseCoordinatesForCalculation(document.getElementById('b').value)[1]} - ${parseCoordinatesForCalculation(document.getElementById('a').value)[1]})| / √((${parseCoordinatesForCalculation(document.getElementById('b').value)[0]} - ${parseCoordinatesForCalculation(document.getElementById('a').value)[0]})² + (${parseCoordinatesForCalculation(document.getElementById('b').value)[1]} - ${parseCoordinatesForCalculation(document.getElementById('a').value)[1]})²) = ${distanceCtoLineAB.toFixed(4)}
    <br>
    <br>
    距離 A-T 的計算: <br>
    使用歐幾里得距離公式，計算兩點間距離: <br>
    √((x2 - x1)² + (y2 - y1)²) <br>
    其中 A(${parseCoordinatesForCalculation(document.getElementById('a').value)}) 和 T(${parseCoordinatesForCalculation(document.getElementById('c').value)}) <br>
    所以距離 A-T = √((${parseCoordinatesForCalculation(document.getElementById('c').value)[0]} - ${parseCoordinatesForCalculation(document.getElementById('a').value)[0]})² + (${parseCoordinatesForCalculation(document.getElementById('c').value)[1]} - ${parseCoordinatesForCalculation(document.getElementById('a').value)[1]})²) = ${distanceAT.toFixed(4)}
    <br>
    <br>
    註: <br>
    1. 歐幾里得距離公式: <br>
    √((x2 - x1)² + (y2 - y1)²) <br>
    2. 兩點間距離公式: <br>
    √((x2 - x1)² + (y2 - y1)²) <br>
  `;

}

function adjustScale() {
  let maxCoordX = Math.max(...['a', 'b', 'c'].map(id => Math.abs(document.getElementById(id).value.split(',')[0])));
  let maxCoordY = Math.max(...['a', 'b', 'c'].map(id => Math.abs(document.getElementById(id).value.split(',')[1])));

  let scaleX = 250 / (maxCoordX || 1); // 避免除以零
  let scaleY = 250 / (maxCoordY || 1); // 避免除以零

  scale = Math.min(scaleX, scaleY, 10);
}

function parseCoordinates(input) {
  let [x, y] = input.split(',').map(Number);
  return [x * scale + 250 - padding, 250 - y * scale + padding];
}

function parseCoordinatesForCalculation(input) {
  return input.split(',').map(Number);
}

function drawDashedLine(ctx, point1, point2, color) {
// 獲取原始座標
var originalPoint1 = parseCoordinatesForCalculation(document.getElementById('c').value);
var originalPoint2 = getClosestPointOnLineOriginal(originalPoint1, 
                                                  parseCoordinatesForCalculation(document.getElementById('a').value), 
                                                  parseCoordinatesForCalculation(document.getElementById('b').value));

ctx.beginPath();
ctx.setLineDash([5, 3]);
ctx.moveTo(point1[0], point1[1]);
ctx.lineTo(point2[0], point2[1]);
ctx.strokeStyle = color;
ctx.stroke();
ctx.setLineDash([]);
ctx.font = '12px Arial';
ctx.fillText(distance(originalPoint1, originalPoint2).toFixed(4), 
             (point1[0] + point2[0]) / 2, 
             (point1[1] + point2[1]) / 2);
}

function getClosestPointOnLine(point, lineStart, lineEnd) {
  var A = point[0] - lineStart[0];
  var B = point[1] - lineStart[1];
  var C = lineEnd[0] - lineStart[0];
  var D = lineEnd[1] - lineStart[1];

  var dot = A * C + B * D;
  var len_sq = C * C + D * D;
  var param = -1;
  if (len_sq != 0) // 避免除以零的情況
      param = dot / len_sq;

  var xx, yy;

  // 如果參數 param 小於 0 或大於 1，則最近的點是線段的一個端點
  if (param < 0) {
    xx = lineStart[0];
    yy = lineStart[1];
  } else if (param > 1) {
    xx = lineEnd[0];
    yy = lineEnd[1];
  } else {
    // 如果 param 介於 0 和 1 之間，則最近的點在線段上
    xx = lineStart[0] + param * C;
    yy = lineStart[1] + param * D;
  }

  return [xx, yy];
}

function getClosestPointOnLineOriginal(point, lineStart, lineEnd) {
  var A = point[0] - lineStart[0];
  var B = point[1] - lineStart[1];
  var C = lineEnd[0] - lineStart[0];
  var D = lineEnd[1] - lineStart[1];

  var dot = A * C + B * D;
  var len_sq = C * C + D * D;
  var param = -1;
  if (len_sq != 0) // 避免除以零的情況
      param = dot / len_sq;

  var xx, yy;

  // 如果參數 param 小於 0 或大於 1，則最近的點是線段的一個端點
  if (param < 0) {
    xx = lineStart[0];
    yy = lineStart[1];
  } else if (param > 1) {
    xx = lineEnd[0];
    yy = lineEnd[1];
  } else {
    // 如果 param 介於 0 和 1 之間，則最近的點在線段上
    xx = lineStart[0] + param * C;
    yy = lineStart[1] + param * D;
  }

  return [xx, yy];
}

function drawLine(ctx, point1, point2, color) {
  ctx.beginPath();
  ctx.moveTo(point1[0], point1[1]);
  ctx.lineTo(point2[0], point2[1]);
  ctx.strokeStyle = color;
  ctx.stroke();
}

function drawPoint(ctx, point, label) {
  ctx.fillStyle = 'red';
  ctx.beginPath();
  ctx.arc(point[0], point[1], 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.font = '20px Arial';
  ctx.fillText(label, point[0] + 10, point[1] + 10);
}

// draw xy grid
function drawGrid() {
  let canvas = document.getElementById('canvas');
  let ctx = canvas.getContext('2d');
  ctx.beginPath();
  ctx.moveTo(padding, 250);
  ctx.lineTo(500 - padding, 250);
  ctx.moveTo(250, padding);
  ctx.lineTo(250, 500 - padding);
  ctx.stroke();
  // 繪製網格線
  for(let i = padding; i < 500 - padding; i += scale) {
    ctx.beginPath();
    ctx.moveTo(i, 250 - 5);
    ctx.lineTo(i, 250 + 5);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(250 - 5, i);
    ctx.lineTo(250 + 5, i);
    ctx.stroke();
  }
}

function distance(point1, point2) {
  return Math.sqrt(Math.pow(point2[0] - point1[0], 2) + Math.pow(point2[1] - point1[1], 2));
}

function pointToLineDistance(point, lineStart, lineEnd) {
  var A = point[0] - lineStart[0];
  var B = point[1] - lineStart[1];
  var C = lineEnd[0] - lineStart[0];
  var D = lineEnd[1] - lineStart[1];

  var dot = A * C + B * D;
  var len_sq = C * C + D * D;
  var param = -1;
  if (len_sq != 0) //in case of 0 length line
      param = dot / len_sq;

  var xx, yy;

  if (param < 0) {
    xx = lineStart[0];
    yy = lineStart[1];
  } else if (param > 1) {
    xx = lineEnd[0];
    yy = lineEnd[1];
  } else {
    xx = lineStart[0] + param * C;
    yy = lineStart[1] + param * D;
  }

  var dx = point[0] - xx;
  var dy = point[1] - yy;
  return Math.sqrt(dx * dx + dy * dy);
}

function drawDashedLineWithDistance(ctx, point1, point2, color, dist) {
  // 繪製虛線
  ctx.beginPath();
  ctx.setLineDash([5, 3]);
  ctx.moveTo(point1[0], point1[1]);
  ctx.lineTo(point2[0], point2[1]);
  ctx.strokeStyle = color;
  ctx.stroke();
  ctx.setLineDash([]);

  // 顯示距離
  ctx.font = '12px Arial';
  ctx.fillText(dist.toFixed(4), 
               (point1[0] + point2[0]) / 2, 
               (point1[1] + point2[1]) / 2);
}