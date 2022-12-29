class GameController {
  #dice_button = document.getElementById('throw_dice');
  #log = document.getElementById('game_log');
  #cells = [];
  #players = [];

  constructor() {
  }

  create_cells(cell_numbers) {
    this.#cells = [];
    cell_numbers.forEach(number => this.#cells.push(new Cell(number)));
  }

  create_players(n_players, n_tokens) {
    this.#players = [];
    for (let i = 0; i < n_players; i++)
      this.#players.push(new Player(`Player ·${i}`, n_tokens));
  }

  roll_dice() {
    let rolled_number = Math.ceil(Math.random() * 6);
    this.add_log(`dice roll: ${rolled_number}`);
    return rolled_number;
  }

  get_player_tokens() {
    return this.#players
      .map(player => player.get_tokens())
      .reduce((player_1, player_2) => player_1 + player_2)
  }

  play() {
  }

  start_game(cell_numbers, n_players) {
    this.#dice_button.addEventListener('click', e => this.roll_dice());

    this.create_cells(cell_numbers);
    this.create_players(n_players, 50);

    this.#log.innerHTML = "";
    this.add_log('Game starts...');
    this.add_log(`${this.get_player_tokens()} tokens have been distributed evenly amongst the players.`);
  }

  add_log(str) {
    let new_log = document.createElement('li');
    new_log.innerHTML = `${str}`;
    this.#log.insertBefore(new_log, this.#log.firstChild);
  }

  close_game() {
    this.#cells = null;
    this.#players = null;

    console.log('game ends');
    this.#dice_button.removeEventListener('click', e => this.roll_dice());
  }
}