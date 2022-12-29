class Cell {
  number;
  #tokens;

  constructor(number) {
    this.reset_tokens();
    this.number = number;
  }

  add_token() {
    this.#tokens++;
  }

  reset_tokens() {
    this.#tokens = 0;
  }

  get_tokens() {
    return this.#tokens;
  }

  get_number() {
    return this.number;
  }
}