var expect = chai.expect;
chai.should();


describe("Dice roll", function () {
  it("Should be less or equal to 12.", function () {
    for (let i = 0; i < 100; i++)
      GameController.dice_roll().should.be.at.most(12);
  });
  it("Should be equal or bigger than 2.", function () {
    for (let i = 0; i < 100; i++)
      GameController.dice_roll().should.be.at.least(2);
  });
});

describe("Better Dice roll", function () {
  dice_rolls = [];
  for (let i = 0; i < 500; i++) { dice_rolls.push(better_dice_roll(6, 2)); }

  it("Should be less or equal to 12.", function () {
    dice_rolls.filter(roll => roll > 12).length.should.be.equal(0);
  });
  it("Should be equal or bigger than 2.", function () {
    dice_rolls.filter(roll => roll < 2).length.should.be.equal(0);
  });
  it("Some should be equal to 2", function () {
    dice_rolls.filter(roll => roll == 2).length.should.be.at.least(1);
  });
  it("Some should be equal to 12", function () {
    dice_rolls.filter(roll => roll == 12).length.should.be.at.least(1);
  });
});

describe("Sort players by score", function () {
  let players = [];
  let sorted_players;

  for (let i = 0; i < 50; i++) {
    players.push(new Player(`Player ${i}`, 0))
    players[i].set_points(Math.ceil(Math.random() * 100))
  }

  sorted_players = GameController.sort_players(players);

  it("Ranking should be in descending order.", function () {
    for (let i = 1; i < sorted_players.length; i++) {
      sorted_players[i - 1].get_points().should.be.at.least(sorted_players[i].get_points())
    }
    for (let i = sorted_players.length - 1; i > 0; i--) {
      sorted_players[i].get_points().should.be.at.most(sorted_players[i - 1].get_points())
    }
  });
});