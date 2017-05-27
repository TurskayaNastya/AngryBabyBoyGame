export default class Preload {

    constructor() {
        this.loaderSprite = null;
        this.ready = false;
    }

    preload() {
        this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
        this.loaderSprite = this.add.sprite(this.game.width / 2 - 100, this.game.height / 2 - 102, 'loader');
        this.loaderSprite.animations.add('loaderPlay');
        this.loaderSprite.animations.play('loaderPlay', 30, true);
        this.load.setPreloadSprite(this.loaderSprite);
        this.load.image('startGameBg', 'assets/UI/startGameBg.jpg');
        this.load.image('pointer', 'assets/UI/pointer.png');
        this.load.image('scoreBg', 'assets/UI/scoreBg.png');
        this.load.spritesheet('menuBtn', 'assets/UI/menuBtn.png', 82, 76);
        this.load.spritesheet('startGamePlayBtn', 'assets/UI/spritePlayBtn.png', 282, 122);
        this.load.spritesheet('windowBtn', 'assets/UI/statesBtn.png', 203, 88);
        this.load.spritesheet('musicBtn', 'assets/UI/musicBtn.png', 83, 84);

        this.load.spritesheet('levelselecticons', 'assets/UI/levelSelectIcon.png', 96, 96);
        this.load.image('levelSelectBg', 'assets/UI/selectLevelBg.png');
        this.load.bitmapFont('cooperBold', 'assets/cooperBold.png', 'assets/cooperBold.fnt'); // created with http://kvazars.com/littera/
        this.load.bitmapFont('segoes', 'assets/segoes.png', 'assets/segoes.fnt'); // created with http://kvazars.com/littera/ //
        this.load.image('milkBottle', 'assets/images/bottle.png');

        this.load.image('roomBg', 'assets/images/roomBg.png');
        this.load.image('secondRoom', 'assets/images/secondRoom.png');
        this.load.image('rack', 'assets/images/rack.png');

        this.load.image('slingshotHandle', 'assets/images/slingshotHandle.png');
        this.load.image('slingshotHandleRightPart', 'assets/images/slingshotHandleRightPart.png');
        this.load.image('ball', 'assets/images/ball.png');

        this.load.image('levelUpWindowBg', 'assets/UI/levelUp.jpg');
        this.load.image('levelFailedWindowBg', 'assets/UI/levelFailed.jpg');
        this.load.image('finishedWindowBg', 'assets/UI/finishedGame.jpg');

        this.load.image('greenBox', 'assets/images/greenBox.png');
        this.load.image('purpleBox', 'assets/images/purpleBox.png');
        this.load.image('yellowBox', 'assets/images/yellowBox.png');

        this.load.image('rope', 'assets/images/rope.png');
        this.load.image('toy', 'assets/images/toy.png');
        this.load.image('duck', 'assets/images/duck.png');
        this.load.image('car', 'assets/images/car.png');
        this.load.image('elephant', 'assets/images/elephant.png');

        this.load.physics('physics', 'assets/physics.json');

        this.game.levelsJSON = this.game.cache.getJSON('levels');

        this.load.audio('scoreSound', 'assets/sounds/score.mp3');
        this.load.audio('slingshotSound', 'assets/sounds/slingshot.mp3');
        this.load.audio('click', 'assets/sounds/click.wav');
        this.load.audio('pullSound', 'assets/sounds/pull.mp3');
        this.load.audio('boxSound', 'assets/sounds/ballkick.mp3');
        this.load.audio('winSound', 'assets/sounds/levelWin.wav');
        this.load.audio('levelFailedSound', 'assets/sounds/levelLost.wav');
        this.load.audio('bottleSound', 'assets/sounds/bottleDestroy.wav');
        this.load.audio('finished', 'assets/sounds/level_win_1.wav');
        this.load.audio('bgMusic', 'assets/sounds/background-music.mp3');
    }

    create() {
        this.game.bgMusic = this.game.add.audio('bgMusic');
        this.game.bgMusic.loop = true;
    }

    update() {
        if (this.cache.isSoundDecoded('scoreSound') && this.cache.isSoundDecoded('slingshotSound') && this.cache.isSoundDecoded('click') &&
            this.cache.isSoundDecoded('pullSound') && this.cache.isSoundDecoded('boxSound') && this.ready == true) {
            this.state.start('gameStart');
        }
    }

    onLoadComplete() {
        this.ready = true;
    }
}
