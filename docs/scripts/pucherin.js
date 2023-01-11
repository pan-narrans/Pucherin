class Pucherin {
  #game_presets = {
    'min players': 2,
    'max players': 6,
    'cells': 10,              // number of cells
    'puchero': 7,             // number of the puchero
    'starting tokens': 50,    // tokens per player
  }

  // DOM references
  #menu_dom = document.getElementById('menu');

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
        this.next_turn();
        break;
      case 'print_board':
        this.#menu.print_board(this.#game_controller.get_cells())
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
      this.#menu.print_turn(this.#game_controller.get_current_player());
    }
  }

  next_turn() {
    // Game is in progress.
    if (this.#game_controller.next_turn()) {
      this.#board.paint_board(this.#game_controller.get_cells(), this.#game_presets.puchero);
      this.#menu.print_players(this.#game_controller.get_players());
      this.#menu.print_turn(this.#game_controller.get_current_player());
    }
    // Game has ended. 
    else {
      this.#menu.print_winner(this.#game_controller.get_winner())
      this.#menu.hide_throw_dice();
    }
  }

  end_game() {
    this.#game_controller.close_game();
    this.start();
  }

  log(str) {
    try { this.#menu.log(''); str.split('\n').reverse().forEach(line => { this.#menu.log(line.trim()); }); }
    catch { console.log(`Couldn't print: ${str}`) }
  }

  auto_game() {
    while (this.#game_controller.next_turn()) { }
  }
}

let pucherin;

window.onload = function () {
  pucherin = new Pucherin();
  pucherin.start();
}

function auto_game() {
  pucherin.auto_game();
}
