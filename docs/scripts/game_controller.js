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

  get_players() { return this.#players; }

  get_player_tokens() { return this.#players.map(p => p.get_tokens()).reduce((p_1, p_2) => p_1 + p_2) }

  reset_cells() { this.#cells.forEach(cell => cell.reset_tokens()) }

  create_cells(number) {
    this.#cells = [];
    for (let i = 2; i < number + 2; i++) {
      let capacity = (i !== this.#presets['puchero']) ? i : Number.MAX_SAFE_INTEGER;
      this.#cells.push(new Cell(i, capacity));
    }
  }

  create_players(n_players, n_tokens) {
    this.#players = [];
    for (let i = 1; i < n_players + 1; i++)
      this.#players.push(new Player(`Player ${i}`, n_tokens));
  }

  // TODO limpiar
  // TODO win condition
  next_turn() {
    let dice = this.dice_roll();
    let player = this.#last_player++ % this.#players.length;
    let cell = dice - 2;

    this.#controller.log(`${this.#players[player].get_name()} rolls a ${dice}.`);

    switch (dice) {
      case 12:
        cell = this.#presets['puchero'] - 2;

        this.#controller.log(` `);
        this.#controller.log(`${this.#players[player].get_name()} gets ${this.#cells[cell].get_tokens()} points.`);
        this.#controller.log(`${this.#players[player].get_name()} gets the puchero!`)
        this.#controller.log(` `);

        this.#players[player].add_points(this.#cells[cell].get_tokens());
        this.#cells[cell].reset_tokens()
        break;

      default:
        this.#cells[cell].add_token();
        this.#players[player].subtract_token();

        if (this.#cells[cell].is_full()) {
          this.#controller.log(` `);
          this.#controller.log(`${this.#players[player].get_name()} gets ${this.#cells[cell].get_tokens()} points.`);
          this.#controller.log(`Cell #${this.#cells[cell].get_number()} is full!`);
          this.#controller.log(` `);

          this.#players[player].add_points(this.#cells[cell].get_tokens());
          this.#cells[cell].reset_tokens()
        }
    }


  }

  dice_roll() {
    let rolled_number = Math.ceil(Math.random() * 11) + 1;
    return rolled_number;
  }

  start_game(n_players) {
    this.#last_player = 0;
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