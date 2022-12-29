const pucherin = new Pucherin();

const init = function () {
  pucherin.main_menu();

  document.getElementById('new_game')
    .addEventListener('click', () => { pucherin.new_game() });

  document.getElementById('end_game')
    .addEventListener('click', () => { pucherin.main_menu() });
}

window.addEventListener('load', init);