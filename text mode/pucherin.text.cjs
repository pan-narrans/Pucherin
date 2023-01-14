const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const presets = {
  'min_players': 2,
  'max_players': 6,
  'cells': 10,              // number of cells
  'puchero': 7,             // number of the puchero
  'starting tokens': 50,    // tokens per player
}

const printMixin = function (obj) {
  obj.prototype.print = function () {
    console.log('');
    for (let prop in this) { console.log(prop, this[prop]); }
  }
}

function Cells() { }

Cells.prototype = {
  array: [],
  create_cells: function (num, puchero) {
    this.array = [];
    for (let i = 2; i < num + 2; i++) {
      let capacity = (i !== puchero) ? i : Number.MAX_SAFE_INTEGER;
      this.array.push(new Cell(i, capacity));
    }
  },
  reset_cells: function () { this.array.forEach(cell => cell.reset_tokens()); },
  get_tokens: function () { return this.array.map(c => c.tokens).reduce((c1, c2) => c1 + c2); },
  print: function () {
    console.log('BOARD STATUS')
    this.array.forEach(cell => {
      let name = `${cell.name}:`.padEnd(9, '\xA0');
      let tokens = (cell.number != presets.puchero) ? cell.tokens : '?';
      console.log(name, tokens);
    })
  },
}

function Cell(number, capacity) {
  this.name = `Cell #${number}`;
  this.reset_tokens();
  this.number = parseInt(number);
  this.capacity = parseInt(capacity);
}

Cell.prototype = {
  add_token: function () { this.tokens++; },
  reset_tokens: function () { this.tokens = 0; },
  is_full: function () { return this.tokens === this.capacity; },
}

function Players() { }

Players.prototype = {
  array: [],
  create_players: function (num, tokens) {
    this.array = []
    for (let i = 1; i < num + 1; i++) { this.array.push(new Player(`Player ${i}`, tokens)); }
  },
  get_tokens: function () { return this.array.map(p => p.tokens).reduce((p1, p2) => p1 + p2) },
  get_winner: function () { return this.array.slice().sort((p1, p2) => p1.points < p2.points)[0]; }, print: function () {
    console.log('PLAYERS')
    this.array.forEach(player => {
      let name = `${player.name}:`;
      console.log(name, player.tokens, 'tokens,', player.points, 'points');
    })
  },
}

function Player(name, tokens) {
  this.name = name;
  this.tokens = tokens;
  this.points = 0;
}

Player.prototype = {
  add_points: function (points) { this.points += points; },
  set_tokens: function (tokens) { this.tokens = (tokens > 0) ? tokens : 0; },
  subtract_token: function () { this.set_tokens(this.tokens - 1); },
};


let cells = new Cells();
let players = new Players();

printMixin(Cell);
printMixin(Player);

function get_input(prompt = '') {
  return new Promise(resolve =>
    rl.question(prompt, input => resolve(input))
  );
}

function valid_int(num, min, max) {
  try { num = parseInt(num); return min <= num && num <= max; }
  catch { return false; }
}

function dice_roll(faces, num) { return Math.floor(Math.random() * ((faces * num + 1) - num) + num); }

ask_number_of_players = async function () {
  let num_players = await get_input("Introduce el número de jugadores: ");

  while (!valid_int(num_players, presets.min_players, presets.max_players))
    num_players = await get_input("Introduce el número de jugadores: ")

  return parseInt(num_players);
}

let turn = 0;

new_game = async function () {
  turn = 0;
  players.create_players(await ask_number_of_players(), 50);
  cells.create_cells(presets.cells, presets.puchero);

  play();
}


play = async function () {
  while (true) {
    while (await get_input('\nPress Enter to roll the dice ') != '') { }
    if (!next_turn()) break;
    cells.print();
    players.print();
  }

  // Print everything one last time.
  cells.print();
  players.print();

  menu();
}

next_turn = function () {
  // Checks if the game has ended;
  if (cells.get_tokens() == 0 && players.get_tokens() == 0) return false;

  let dice = dice_roll(6, 2);
  let player = players.array[turn % players.array.length];
  let cell = dice - 2;

  // Logs the dice roll.
  let log = `${player.name} rolls ${[8, 11].includes(dice) ? "an" : "a"} ${dice}.`;
  switch (dice) {
    case 12:
      // If no more tokens can be placed, give out all the tokens in the board.
      if (players.get_tokens() === 0) {
        log += `\n${player.name} gets the board!`;
        log += `\n${player.name} gets ${cells.get_tokens()} points.`;

        player.add_points(cells.get_tokens());
        cells.reset_cells();
      }
      // If there are still players with tokens available, empty the puchero.
      else {
        cell = presets['puchero'] - 2;

        log += `\n${player.name} gets the puchero!`;
        log += `\n${player.name} gets ${cells.array[cell].tokens} points.`;

        player.add_points(cells.array[cell].tokens);
        cells.array[cell].reset_tokens()
      }
      break;

    default:
      // If the players hasn't got any tokens and the cell contains tokens,
      // empty the cell and give the tokens to the player.
      if (player.tokens == 0 && cells.array[cell].tokens != 0 && cell != presets['puchero'] - 2) {
        log += `\n${player.name} gets ${cells.array[cell].tokens} points.`;

        player.add_points(cells.array[cell].tokens);
        cells.array[cell].reset_tokens()
      }
      // If the player has tokens, they place one on the cell.
      // Should this token fill the cell, the get all the tokens inside.
      else if (player.tokens != 0) {
        cells.array[cell].add_token();
        player.subtract_token();
        log += `\nAnd places a token in cell #${dice}`;

        if (cells.array[cell].is_full()) {
          log += `\nCell #${cells.array[cell].number} is full!`;
          log += `\n${player.name} gets ${cells.array[cell].tokens} points.`;

          player.add_points(cells.array[cell].tokens);
          cells.array[cell].reset_tokens()
        }
      } else { log += '\nNothing happens...'; }
  }

  console.log(log);

  // End game message & sort players.
  if (cells.get_tokens() == 0 && players.get_tokens() == 0) {
    let message = 'The game has ended.';
    message += `\n${players.get_winner().name} wins the game!`;
    message += '\nThanks for playing.';
    console.log(message);
    return false;
  }

  turn++;
  return true;
}

exit = function () { console.log("¡Adios!"); rl.close(); }

menu = async function () {
  let menu = "";
  menu += "\n === PUCHERIN ===";
  menu += "\n 1. NUEVA PARTIDA";
  menu += "\n 2. SALIR";
  console.log(menu);

  let option = await get_input('Selecciona una opción: ');
  while (!valid_int(option, 1, 2)) {
    option = await get_input("Selecciona una opción: ")
  }

  switch (option) {
    case '1': new_game(); break;
    case '2': exit(); break;
    default: break;
  }
}

menu();