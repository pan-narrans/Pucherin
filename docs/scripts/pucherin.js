class Pucherin {
  #board;
  #game_controller;

  #max_players = 6;
  #cell_numbers = [3, 4, 5, 6, 8, 9, 10, 11, 2];

  #main_menu = document.getElementById('main_menu');
  #game_menu = document.getElementById('game_menu');
  #roll_button = document.getElementById('throw_dice');

  constructor() {
    this.#board = new Board();
    this.#game_controller = new GameController();
  }

  main_menu() {
    this.#board.paint_board(this.#cell_numbers);

    this.#main_menu.style.display = 'block';
    this.#game_menu.style.display = 'none';
  }

  new_game() {
    this.#main_menu.style.display = 'none';
    this.#game_menu.style.display = 'block';
    this.#game_controller.start_game(this.#cell_numbers, this.#max_players);
  }

}

