class GameController {
  #controller;
  #presets;
  #cells = [];
  #players = [];

  #last_player;

  constructor(controller, presets) {
    this.#controller = controller;
    this.#presets = presets;
    this.create_cells(presets['cells'], presets['puchero'])
  }

  get_cells() { return this.#cells; }

  get_cell(num) { return this.#cells.filter(cell => cell.get_number() == num); }

  get_players() { return this.#players; }

  get_player_tokens() { return this.#players.map(p => p.get_tokens()).reduce((p_1, p_2) => p_1 + p_2) }

  reset_cells() { this.#cells.forEach(cell => cell.reset_tokens()) }

  create_cells(number) {
    this.#cells = [];
    for (let i = 2; i < number + 2; i++) { this.#cells.push(new Cell(i)); }
  }

  create_players(n_players, n_tokens) {
    this.#players = [];
    for (let i = 1; i < n_players + 1; i++)
      this.#players.push(new Player(`Player ${i}`, n_tokens));
  }

  next_turn() {

    let dice = this.dice_roll();
    switch (dice) {
      case 12:
        console.log(' te llevas puchero');
        break;
      default:
        this.#cells[dice - 2].add_token();
    }

  }

  dice_roll() {
    let rolled_number = Math.ceil(Math.random() * 11) + 1;
    this.#controller.log(`The dice rolls: ${rolled_number}`);
    return rolled_number;
  }

  start_game(n_players) {
    this.#last_player = 1;
    this.reset_cells();
    this.create_players(n_players, this.#presets['starting tokens']);

    this.#controller.log('Game starts...');
    this.#controller.log(`${this.get_player_tokens()} tokens have been distributed evenly amongst the players.`);
  }

  close_game() {
    this.reset_cells();
    this.#players = null;

    console.log('game ends');
  }
}