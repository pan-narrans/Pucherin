class Player {
  #name;
  #tokens;
  #points;

  constructor(name, n_tokens) {
    this.#name = name;
    this.#tokens = n_tokens;
    this.#points = 0;
  }

  get_name() {
    return this.#name;
  }

  get_tokens() {
    return this.#tokens;
  }

  get_points() {
    return this.#points;
  }

  add_points(n) {
    this.#points += n;
  }

  subtract_token() {
    this.set_tokens(this.#tokens--);
  }

  set_tokens(tokens) {
    this.#tokens = (tokens > 0) ? tokens : 0;
  }
}