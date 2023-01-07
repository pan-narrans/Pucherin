class Cell {
  #tokens;
  #number;
  #capacity;

  constructor(number, capacity) {
    this.reset_tokens();
    this.#number = parseInt(number);
    this.#capacity = parseInt(capacity);
  }

  get_tokens() { return this.#tokens; }
  get_number() { return this.#number; }
  get_capacity() { return this.#capacity; }

  add_token() { this.#tokens++; }
  reset_tokens() { this.#tokens = 0; }

  is_full() { return this.get_tokens() === this.get_capacity(); }
}