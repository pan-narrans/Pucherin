
class Board {
  #canvas = document.getElementById('board_canvas');
  #ctx = this.#canvas.getContext('2d');

  #color = {
    'lime': '#A19B75',
    'green': '#396C41',
    'dark_green': '#32350E',
    'yellow': '#D0BE58',
    'orange': '#9E4B27',
    'red': '#B8342E',
    'brown': '#3C211A',
  }

  #cell_colors = [
    [this.#color.yellow, 20],
    [this.#color.brown, 15],
    [this.#color.lime, 2],
    [this.#color.dark_green, 1],
    [this.#color.green, 20],
    [this.#color.dark_green, 1],
    [this.#color.lime, 2],
    [this.#color.dark_green, 1],
  ];


  constructor() {
  }

  static resize_canvas() {
    document.getElementById('board_canvas').width = document.getElementById('board').clientWidth;
    document.getElementById('board_canvas').height = document.getElementById('board').clientHeight * 0.997;
  }

  paint_cell(x, y, r, n) {
    // Generate gradient
    let color_weight_sum = 0;
    this.#cell_colors.forEach(e => color_weight_sum += e[1]);

    const gradient = this.#ctx.createRadialGradient(x, y, 0, x, y, r)

    // Two color stops are added at the same place with different colors,
    // to achieve sharp edges.
    let two = 0;
    for (let i = 0; i < this.#cell_colors.length; i++) {
      let one = two;
      two += (this.#cell_colors[i][1] / color_weight_sum); // Weights are normalized to [0,1]
      gradient.addColorStop(one, this.#cell_colors[i][0]);
      gradient.addColorStop(two, this.#cell_colors[i][0]);
    }

    this.paint_circle(x, y, r, gradient)

    // Paint number
    // Size based on the radius of the inner-most circle.
    let size = (this.#cell_colors[0][1] / color_weight_sum * r * 1.25);

    this.#ctx.fillStyle = this.#color.orange;
    this.#ctx.font = `bold ${size}px Arial`;
    this.#ctx.textAlign = "center";
    this.#ctx.textBaseline = "middle";

    this.#ctx.fillText(n, x, y);
  }

  paint_tokens(x, y, r, n, reds) {
    let angle = n * 90;
    for (let i = 0; i < n; i++) {
      // Calculate cosine and sine, converting the angle to radians.
      let cos = Math.cos(Math.PI * angle / 180);
      let sin = Math.sin(Math.PI * angle / 180);

      // Calculate the coordinates of the center of the sections using the circle formula,
      // but lying to make it look elliptical.
      // TODO: make 0,77 dependent of weights to remove hardcoding
      let coordinates = {
        'x': r * cos * 0.77 + x,
        'y': r * sin * 0.77 + y,
      }

      this.paint_circle(coordinates.x, coordinates.y, r / 8, this.#color.dark_green)
      this.paint_circle(coordinates.x, coordinates.y, r / 10, (reds-- > 0) ? "red" : "grey")

      angle += 360 / n;
    }
  }

  paint_circle(x, y, r, fill) {
    this.#ctx.beginPath();
    this.#ctx.arc(x, y, r, 0, Math.PI * 2);
    this.#ctx.fillStyle = fill;
    this.#ctx.fill();
  }

  paint_board(numbers) {
    let board_radius = this.#canvas.clientWidth / 5;
    let section_radius = board_radius / 3;
    let angle = 50;

    // Paint and space out the cells
    for (let i = 0; i < numbers.length; i++) {
      // Calculate cosine and sine, converting the angle to radians.
      let cos = Math.cos(Math.PI * angle / 180);
      let sin = Math.sin(Math.PI * angle / 180);

      // Calculate the coordinates of the center of the sections using the circle formula,
      // but lying to make it look elliptical.
      let c1 = 0.45 / board_radius;
      let c2 = 0.03 / board_radius;
      let coordinates = {
        'x': board_radius * cos * Math.exp(c1 * Math.abs(board_radius * cos)) + this.#canvas.width / 2,
        'y': board_radius * sin * (1 / Math.exp(c2 * Math.abs(board_radius * sin))) + this.#canvas.height / 2,
      }
      // let c = 1.000006;
      // let coordinates = {
      //   'x': board_radius * cos * Math.pow(c, Math.pow(board_radius * cos, 2)) + this.#canvas.width / 2,
      //   'y': board_radius * sin + this.#canvas.height / 2,
      // }

      // Paint the section and increase the angle.
      this.paint_cell(coordinates.x, coordinates.y, section_radius, numbers[i]);
      this.paint_tokens(coordinates.x, coordinates.y, section_radius, numbers[i], 3);
      angle += 360 / numbers.length;
    }
  }

}

document.getElementById('board')
  .addEventListener('change', Board.resize_canvas())
