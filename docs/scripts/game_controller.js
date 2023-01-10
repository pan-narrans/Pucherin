class GameController {
  #ctrl;
  #presets;
  #cells;
  #players;

  #turn;

  constructor(controller, presets) {
    this.#ctrl = controller;
    this.#presets = presets;
    this.create_cells(presets['cells'], presets['puchero'])
  }

  get_cells() { return this.#cells; }
  get_players() { return this.#players; }

  /** @returns The sum of tokens from all the cells in the game. */
  get_cell_tokens() { return this.#cells.map(c => c.get_tokens()).reduce((c_1, c_2) => c_1 + c_2) }
  /** @returns The sum of tokens from all the players in the game. */
  get_player_tokens() { return this.#players.map(p => p.get_tokens()).reduce((p_1, p_2) => p_1 + p_2) }
  /** Sorts the player array, use only for the final ranking. */
  sort_players() { this.#players.sort((p_1, p_2) => p_1.get_points() < p_2.get_points()).slice(0, 3); }

  /** Resets all the cells' tokens. */
  reset_cells() { this.#cells.forEach(cell => cell.reset_tokens()) }
  /** Simulates a two dice roll. */
  dice_roll() { return Math.ceil(Math.random() * 11) + 1; }

  /**
   * Resets and creates the cell array used to play the game.
   * @param {*} number Number of cells to create.
   * @param {*} puchero Number corresponding to the puchero cell.
   */
  create_cells(number, puchero) {
    this.#cells = [];
    for (let i = 2; i < number + 2; i++) {
      let capacity = (i !== puchero) ? i : Number.MAX_SAFE_INTEGER;
      this.#cells.push(new Cell(i, capacity));
    }
  }

  /**
   * Resets and creates the player array.
   * @param {*} n_players Number of players to create.
   * @param {*} n_tokens Number of tokens to give each player.
   */
  create_players(n_players, n_tokens) {
    this.#players = [];
    for (let i = 1; i < n_players + 1; i++)
      this.#players.push(new Player(`Player ${i}`, n_tokens));
  }

  // TODO refactor
  next_turn() {
    // Checks if the game has ended;
    if (this.get_cell_tokens() === 0 && this.get_player_tokens() === 0) return false;

    let dice = this.dice_roll();
    let player = this.#turn++ % this.#players.length;
    let cell = dice - 2;

    // Logs the dice roll.
    let log = `${this.#players[player].get_name()} rolls ${[8, 11].includes(dice) ? "an" : "a"} ${dice}.`;

    switch (dice) {
      case 12:
        // If no more tokens can be placed, give out all the tokens in the board.
        if (this.get_player_tokens() === 0) {
          log += `\n ${this.#players[player].get_name()} gets the board!`;
          log += `\n ${this.#players[player].get_name()} gets ${this.get_cell_tokens()} points.`;

          this.#players[player].add_points(this.get_cell_tokens());
          this.reset_cells();
        }
        // If there are still players with tokens available, empty the puchero.
        else {
          cell = this.#presets['puchero'] - 2;

          log += `\n ${this.#players[player].get_name()} gets the puchero!`;
          log += `\n ${this.#players[player].get_name()} gets ${this.#cells[cell].get_tokens()} points.`;

          this.#players[player].add_points(this.#cells[cell].get_tokens());
          this.#cells[cell].reset_tokens()
        }
        break;

      default:
        // If the players hasn't got any tokens and the cell contains tokens,
        // empty the cell and give the tokens to the player.
        if (this.#players[player].get_tokens() === 0 && this.#cells[cell].get_tokens() !== 0) {
          log += `\n ${this.#players[player].get_name()} gets ${this.#cells[cell].get_tokens()} points.`;

          this.#players[player].add_points(this.#cells[cell].get_tokens());
          this.#cells[cell].reset_tokens()
        }
        // If the player has tokens, they place one on the cell.
        // Should this token fill the cell, the get all the tokens inside.
        else {
          this.#cells[cell].add_token();
          this.#players[player].subtract_token();

          if (this.#cells[cell].is_full()) {
            log += `\n  Cell #${this.#cells[cell].get_number()} is full!`;
            log += `\n  ${this.#players[player].get_name()} gets ${this.#cells[cell].get_tokens()} points.`;

            this.#players[player].add_points(this.#cells[cell].get_tokens());
            this.#cells[cell].reset_tokens()
          }
        }
    }

    this.#ctrl.log(log);

    // End game message & sort players.
    if (this.get_cell_tokens() === 0 && this.get_player_tokens() === 0) {
      this.sort_players()
      this.#ctrl.log(`The game has ended.\nThanks for playing.`);
    }

    return true;
  }

  /** Starts the game. */
  start_game(n_players) {
    if (n_players > this.#presets['max players'])
      n_players = this.#presets['max players'];

    this.#turn = 0;
    this.reset_cells();
    this.create_players(n_players, this.#presets['starting tokens']);

    let message = 'Game starts...';
    message += `\n ${this.get_player_tokens()} tokens have been distributed evenly amongst the players.`
    this.#ctrl.log(message);
  }

  /** Ends the game. */
  close_game() { this.reset_cells(); }
}