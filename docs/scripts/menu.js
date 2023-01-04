class Menu {
  #menu;
  #controller;

  constructor(controller, menu) {
    this.#controller = controller;
    this.#menu = menu;
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
  }

  print_players(players) {
    const ul = document.getElementById('players');
    ul.innerHTML = "";

    players.forEach(
      p => {
        const li = document.createElement('li');
        li.innerHTML = ` ${p.get_name()}: ${p.get_tokens()} tokens`
        ul.appendChild(li);
      }
    )
  }

}