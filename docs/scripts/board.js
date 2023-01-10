/**
 * Manages the canvas and paints the *Pucherin* board using the received cell info.
 */
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
    'black': '#222'
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

  #puchero_colors = [
    [this.#color.black, 30],
    [this.#color.lime, 2],
    [this.#color.dark_green, 1],
    [this.#color.red, 25],
    [this.#color.dark_green, 1],
    [this.#color.lime, 2],
    [this.#color.dark_green, 1],
  ];

  constructor() {
  }

  static resize_canvas() {
    const canvas = document.getElementById('board_canvas');
    let scale = 2;

    let width = document.getElementById('board').clientWidth;
    let height = document.getElementById('board').clientHeight;

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    canvas.style.width = "100%";
    canvas.style.height = "auto";

    canvas.width = width * scale;
    canvas.height = height * scale;
  }

  paint_cell(x, y, r, n, color) {
    // Generate gradient
    let color_weight_sum = 0;
    color.forEach(e => color_weight_sum += e[1]);

    const gradient = this.#ctx.createRadialGradient(x, y, 0, x, y, r)

    // Two color stops are added at the same place with different colors,
    // to achieve sharp edges.
    let two = 0;
    for (let i = 0; i < color.length; i++) {
      let one = two;
      two += (color[i][1] / color_weight_sum); // Weights are normalized to [0,1]
      gradient.addColorStop(one, color[i][0]);
      gradient.addColorStop(two, color[i][0]);
    }

    this.paint_circle(x, y, r, gradient)

    // Paint number
    // Size based on the radius of the inner-most circle.
    let size = (color[0][1] / color_weight_sum * r * 1.25);

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

  // TODO: make the board look good on mobile devices by making it vertical.
  /**
   * Paints the pucherin board.
   * @param {*} cells Cell objects to paint.
   * @param {*} puchero Number of the puchero cell.
   */
  paint_board(cells, puchero) {
    let board_width = this.#canvas.width / 3;
    let board_height = this.#canvas.height / 3;
    let section_radius = board_width / 4.5;
    let puchero_radius = section_radius * 1.1;
    let angle = 10;

    // Paint and space out the cells
    for (let i = 0; i < cells.length; i++) {
      if (i == puchero - 2) continue;

      // Calculate cosine and sine, converting the angle to radians.
      let cos = Math.cos(Math.PI * angle / 180);
      let sin = Math.sin(Math.PI * angle / 180);

      // Calculate the coordinates of the center of the sections using the circle formula,
      // but lying to make it look elliptical.
      // let c1 = 0.45 / board_width;
      // let c2 = 0.03 / board_width;
      // let coordinates = {
      //   'x': board_width * cos * Math.exp(c1 * Math.abs(board_width * cos)) + this.#canvas.width / 2,
      //   'y': board_width * sin * (1 / Math.exp(c2 * Math.abs(board_width * sin))) + this.#canvas.height / 2,
      // }
      let coordinates = {
        'x': board_width * cos + this.#canvas.width / 2,
        'y': board_height * sin + this.#canvas.height / 2,
      }

      // Paint the section and increase the angle.
      this.paint_cell(coordinates.x, coordinates.y, section_radius, cells[i].get_number(), this.#cell_colors);
      this.paint_tokens(coordinates.x, coordinates.y, section_radius, cells[i].get_number(), cells[i].get_tokens());
      angle += 360 / (cells.length - 1);
    }

    // Pain puchero
    let coordinates = { 'x': this.#canvas.width / 2, 'y': this.#canvas.height / 2, }
    this.paint_cell(coordinates.x, coordinates.y, puchero_radius, cells[puchero - 2].get_number(), this.#puchero_colors);
    //this.paint_tokens(coordinates.x, coordinates.y, puchero_radius, 15, cells[puchero - 2].get_tokens());
  }
}

document.getElementById('board')
  .addEventListener('change', Board.resize_canvas())
