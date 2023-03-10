class Menu {
  #menu;
  #controller;

  constructor(controller) {
    this.#controller = controller;
    this.#menu = document.getElementById('menu');
    this.#menu.addEventListener('click', e => this.#controller.handle_click(e.target.id))
  }

  async main_menu() {
    return this.request('main_menu').then(
      content => {
        this.#menu.innerHTML = content;
        return true;
      }
    ).catch(
      content => {
        this.#menu.innerHTML = content.status;
        return false;
      }
    );
  }

  async game_menu() {
    return this.request('game_menu').then(
      content => {
        this.#menu.innerHTML = content;
        return true;
      }
    ).catch(
      content => {
        this.#menu.innerHTML = content.status;
        return false;
      }
    );
  }

  async request(file) {
    return new Promise(function (resolve, reject) {
      let request = new XMLHttpRequest();
      request.open('GET', `templates/${file}.html`, true);

      request.onload = () => {
        if (request.status !== 200) {
          reject({
            status: request.status,
            statusText: request.statusText
          })
        }
        resolve(request.response)
      };

      request.onerror = function () {
        reject({
          status: request.status,
          statusText: request.statusText
        });
      };

      request.send();
    });
  }

  log(str) {
    let new_log = document.createElement('li');
    new_log.innerHTML = `${str}`;
    document.getElementById('game_log')
      .insertBefore(new_log, document.getElementById('game_log').firstChild);
    console.log(str);
  }

  print_players(players) {
    const player_list = document.getElementById('players');
    player_list.innerHTML = "";

    players.forEach(
      p => {
        const player = document.createElement('div');
        player.id = p.get_name();
        player.classList.add('d-flex');
        player.innerHTML = `
          <p><b>${p.get_name()}</b>:</p>
          <ul style="padding: 0 0.5rem">
          <li style="list-style: none;">${p.get_tokens().toString().padEnd(4, '\xA0')} tokens</li >
          <li style="list-style: none;"> ${p.get_points().toString().padEnd(4, '\xA0')} points</li>
          </ul >
      `;
        player_list.appendChild(player);
      }
    )
  }

  print_turn(player) { document.getElementById('game_info').innerHTML = `${player.get_name()}'s turn:`; }
  print_winner(player) { document.getElementById('game_info').innerHTML = `${player.get_name()} wins the game!`; }

  print_board(cells, puchero) {
    this.log('\xA0');
    cells.forEach(cell => {
      let number = `${cell.get_number()}:`.padEnd(3, '\xA0');
      let tokens = (cell.get_number() != puchero) ? cell.get_tokens() : '?';
      this.log(`Cell #${number} ${tokens} tokens.`);
    });

    this.log('<b>Board Status:</b>');
  }

  hide_throw_dice() {
    document.getElementById('throw_dice').style.display = "none";
    document.getElementById('end_game').classList.remove('btn-outline-secondary');
    document.getElementById('end_game').classList.add('btn-success');
  }

}