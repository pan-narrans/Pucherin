# Pucherin

![tablero](img/puchero.jpg)

- [Pucherin](#pucherin)
  - [Historias de usuario](#historias-de-usuario)
  - [Requisitos funcionales (reglas)](#requisitos-funcionales-reglas)
  - [Requisitos técnicos](#requisitos-técnicos)

## Historias de usuario

- Se Inicia partida nueva para entre 1 y 5 jugadores.
- Se reparten 50 fichas entre todos los jugadores
- Cada jugador tira en su turno dos dados de 6 caras en cada turno
- Se añade una ficha a la casilla, si está casilla se completa, te las llevas todas.
- El juego finaliza cuando todos los jugadores han puesto sus fichas y no quedan en el tablero
- Gana el jugador con más fichas

## Requisitos funcionales (reglas)

- Si una ficha se completa, el jugador se lleva todas las fichas de la casilla.
- Si sacas un 7, se añade una ficha al puchero
- Si sacas un 12, te llevas el contenido del puchero
- Si los jugadores no tienen más fichas que poner, se llevan las fichas que queden en la casilla
- Si los jugadores no tienen más fichas que poner y saca un 12, se lleva todas las fichas del tablero, incluido el puchero y finaliza el juego.

## Requisitos técnicos

- Se debe mostrar de quien es cada turno y su número de fichas
- Habría una versión en modo texto
- Habrá otra versión en modo gráfico utilizando canvas
- Se deben utilizar arreglos para almacenar los jugadores,fichas, jugadores, casillas
- Se deben crear objetos para los elementos del juego: jugadores , casillas, dados, puchero ...
