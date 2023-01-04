class Pucherin {
  #game_presets = {
    'min players': 2,
    'max players': 6,
    'cells': 10,             // number of cells
    'puchero': 7,           // number of the puchero
    'starting tokens': 50,  // tokens per player
  }

  // DOM references
  #menu_dom = document.getElementById('menu');
  #roll_button = document.getElementById('throw_dice');

  // Element references
  #board;
  #game_controller;
  #menu;

  constructor() {
    this.#board = new Board();
    this.#menu = new Menu(this, this.#menu_dom);
    this.#game_controller = new GameController(this, this.#game_presets);
  }

  start() {
    this.#board.paint_board(this.#game_controller.get_cells(), this.#game_presets.puchero);
    this.#menu.main_menu();
  }

  handle_click(key) {
    switch (key) {
      case 'new_game':
        this.new_game();
        break;
      case 'end_game':
        this.end_game();
        break;
      case 'throw_dice':
        this.#game_controller.next_turn();
        this.#board.paint_board(this.#game_controller.get_cells(), this.#game_presets.puchero);
        break;
      default:
        console.log(key);
        break;
    }
  }

  async new_game() {
    const n_players = parseInt(document.getElementById('n_players').value);
    if (await this.#menu.game_menu()) {
      this.#game_controller.start_game(n_players);
      this.#menu.print_players(this.#game_controller.get_players());
    }
  }

  end_game() {
    this.#game_controller.close_game();
    this.start();
  }

  log(str) {
    try { this.#menu.log(str); }
    catch { console.log(`Couldn't print: ${str}`) }
  }
}

window.onload = function () {
  const pucherin = new Pucherin();
  pucherin.start();
}

