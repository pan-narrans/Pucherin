const color = {
  'lime': '#A19B75',
  'green': '#396C41',
  'dark_green': '#32350E',
  'yellow': '#D0BE58',
  'orange': '#9E4B27',
  'red': '#B8342E',
  'brown': '#3C211A',
}

const colors = [
  [color.yellow, 20],
  [color.brown, 15],
  [color.lime, 2],
  [color.dark_green, 1],
  [color.green, 20],
  [color.dark_green, 1],
  [color.lime, 2],
  [color.dark_green, 1],
]

let color_weight_sum = 0;
colors.forEach(e => color_weight_sum += e[1]);

const canvas = document.getElementById('test');
const ctx = test.getContext('2d');

(function resize_canvas() {
  canvas.width = document.getElementsByTagName('body')[0].clientWidth * 0.995;
  canvas.height = document.getElementsByTagName('body')[0].clientHeight * 0.995;
})();

function paint_section(x, y, r, n) {
  // Generate gradient
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, r)

  // Two color stops are added at the same place with different colors,
  // to achieve sharp edges.
  let two = 0;
  for (let i = 0; i < colors.length; i++) {
    let one = two;
    two += (colors[i][1] / color_weight_sum); // Weights are normalized to [0,1]
    gradient.addColorStop(one, colors[i][0]);
    gradient.addColorStop(two, colors[i][0]);
  }

  // Paint circle
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();

  // Paint number
  // Size based on the radius of the inner-most circle.
  let size = (colors[0][1] / color_weight_sum * r * 1.25);

  ctx.fillStyle = color.orange;
  ctx.font = `bold ${size}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillText(n, x, y);
}

function paint_board() {
  const numbers = [3, 4, 5, 6, 8, 9, 10, 11, 2];
  let board_radius = canvas.height / 4;
  let section_radius = board_radius / 3;
  let angle = 90;


  for (let i = 0; i < numbers.length; i++) {
    // Calculate cosine and sine, converting the angle to radians.
    let cos = Math.cos(Math.PI * angle / 180);
    let sin = Math.sin(Math.PI * angle / 180);

    // Calculate the coordinates of the center of the sections using the circle formula,
    // but lying to make it look elliptical.
    let coordinates = {
      'x': board_radius * cos * Math.pow(1.0015, Math.abs(board_radius * cos)) * 1.1 + canvas.width / 2,
      'y': board_radius * sin + canvas.height / 2,
    }

    // Paint the section and increase the angle.
    paint_section(coordinates.x, coordinates.y, section_radius, numbers[i]);
    angle += 360 / numbers.length;
  }
}


paint_board();












// var container = document.querySelector(".box");
// const casillas = 9;

// // crear puchero
// var puchero = document.createElement('canvas');
// puchero.classList.add('puchero');
// puchero.width = 120;
// puchero.height = 120;
// container.appendChild(puchero);
// pintarPuchero(puchero);
// // Crear elementos canvas para las casillas
// // Usar un bucle for para crear los elementos de manera automática

// // Los canvas se formarán en una elipse
// for (var i = 0; i < casillas; i++) {
//   // Crear un elemento canvas
//   var canvas = document.createElement('canvas');
//   canvas.classList.add('casilla');
//   // Establecer el ancho y alto del canvas en 50 (cada canvas será de 50 x 50)
//   canvas.width = 120;
//   canvas.height = 120;
//   // Añadir el canvas a la página
//   container.appendChild(canvas);

// }

// // Obtener una referencia a todos los elementos canvas en la página
// var canvases = document.querySelectorAll('.casilla');



// // Dibujar una elipse en cada canvas y posicionarlos en una elipse de
// for (var i = 0; i < canvases.length; i++) {
//   // Obtener el contexto del canvas en 2D
//   var ctx = canvases[i].getContext('2d');

//   // Dibujar una elipse en el canvas
//   ctx.beginPath();

//   //ctx.ellipse(35, 35, 35, 35, 0, 0, 2 * Math.PI);
//   //ctx.stroke();

//   // Posicionar el canvas en la elipse
//   canvases[i].style.left = Math.cos(2 * Math.PI * i / casillas) * 400 + 400 - 25 + 'px';
//   canvases[i].style.top = Math.sin(2 * Math.PI * i / casillas) * 250 + 300 - 25 + 'px';

//   if (i > 4) pintarCasilla(canvases[i], i + 3)
//   else pintarCasilla(canvases[i], i + 2)
// }



// function pintarCasilla(canvas, fichas, num) {
//   var ctx = canvas.getContext('2d');
//   ctx.arc(canvas.width / 2, canvas.height / 2, 60, 0, 2 * Math.PI);
//   ctx.fillStyle = 'green';
//   ctx.fill();
//   for (var i = 0; i < fichas; i++) {
//     // Calcular la posición en el círculo para cada ficha
//     var x = Math.cos(2 * Math.PI * i / fichas) * 35 + canvas.width / 2;
//     var y = Math.sin(2 * Math.PI * i / fichas) * 35 + canvas.height / 2;

//     // Dibujar la ficha en la posición calculada
//     ctx.beginPath();
//     ctx.arc(x, y, 9, 0, 2 * Math.PI);
//     if (i < num) ctx.fillStyle = 'red'
//     else ctx.fillStyle = 'white'
//     ctx.fill();

//     ctx.fillStyle = 'white';
//     // Establecer la fuente para el texto
//     ctx.font = '24px sans-serif';
//     // Dibujar el número en el canvas usando el método fillText()
//     x = canvas.width / 2 - ctx.measureText(fichas).width / 2;
//     y = canvas.height / 2 + 10;
//     ctx.fillText(fichas, x, y);
//   }

// }

// function pintarPuchero(canvas) {
//   var ctx = canvas.getContext('2d');
//   ctx.arc(canvas.width / 2, canvas.height / 2, 60, 0, 2 * Math.PI);
//   ctx.fillStyle = 'red';
//   ctx.fill();
//   for (var i = 0; i < 4; i++) {
//     // Calcular la posición en el círculo para cada ficha
//     var x = Math.cos(2 * Math.PI * i / 4) * 35 + canvas.width / 2;
//     var y = Math.sin(2 * Math.PI * i / 4) * 35 + canvas.height / 2;

//     // Dibujar la ficha en la posición calculada
//     ctx.beginPath();
//     ctx.arc(x, y, 9, 0, 2 * Math.PI);

//     ctx.fillStyle = 'white'
//     ctx.fill();


//     ctx.fillStyle = 'white';
//     // Establecer la fuente para el texto
//     ctx.font = '24px sans-serif';
//     // Dibujar el número en el canvas usando el método fillText()
//     x = canvas.width / 2 - ctx.measureText(7).width / 2;
//     y = canvas.height / 2 + 10;
//     ctx.fillText(7, x, y);
//   }

// }

// // pintamos fichas aleatorias en el tablero
// for (let i = 0; i < canvases.length; i++) {
//   let fichas = Math.ceil(Math.random() * (i + 2));
//   if (i > 4) pintarCasilla(canvases[i], i + 3, fichas)
//   else pintarCasilla(canvases[i], i + 2, fichas)

//   console.log(i + " " + (i + 2) + " " + fichas);
// }

// //pintarCasilla(canvases[2], 4, 2); // pinta dos fichas en el 4
// //pintarCasilla(canvases[8], 11, 5); // pinta 5 fichas en el 11
// //pintarCasilla(canvases[6], 9, 3); // pinta 3 fichas en el 9
