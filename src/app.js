var game;

import Boot from "./states/Boot.js";
import Preload from "./states/Preload.js";
import GameStart from "./states/GameStart.js";
import LevelSelect from "./states/LevelSelect.js";
import Game from "./states/Game.js";
import LevelUp from "./states/LevelUp.js";
import LevelFailed from "./states/LevelFailed.js";
import Finished from "./states/Finished.js";

window.onload = function () {
  game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');
  game.state.add('boot', Boot);
  game.state.add('preload', Preload);
  game.state.add('gameStart', GameStart);
  game.state.add('levelSelect', LevelSelect);
  game.state.add('game', Game);
  game.state.add('levelUp', LevelUp);
  game.state.add('levelFailed', LevelFailed);
  game.state.add('finished', Finished);
  game.state.start('boot');

};
