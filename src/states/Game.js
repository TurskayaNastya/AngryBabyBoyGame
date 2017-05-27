export default class Game extends Phaser.State {

    constructor() {
        super();
        this._levelNumber = 0;
    }

    create() {
        this.FLOOR_HEIGHT = 30;
        this.gameSettings = this.game.levelsJSON.gameSettings;
        this.levelsSettings = this.game.levelsJSON.levels;
        this.ballSettings = this.game.levelsJSON.ballSettings;

        this.pulling = false;
        this.launched = false;
        this.bullets = 0;
        this.knockedDownAims = 0;
        this.aimsCount = 0;
        this.slingshotPlayingSound = false;
        this.ballOnFloor = false;
        this.ballTouchesWall = false;

        if (!this.game.bgMusic.isPlaying)
            this.game.bgMusic.play();

        this.initPhysicWorld();

        this.game.add.image(0, 0, this.levelsSettings[this._levelNumber].locationBg);

        this.createSlingshot();
        this.createLevel();
        this.createGameInterface();

        this.resetBoard();

        this.game.physics.p2.updateBoundsCollisionGroup();

        this.game.physics.p2.setImpactEvents(true);
    }

    initPhysicWorld() {
        this.game.world.resize(this.gameSettings.worldWidth, this.gameSettings.worldHeight + this.FLOOR_HEIGHT);
        this.game.world.setBounds(0, 0, this.gameSettings.worldWidth, this.gameSettings.worldHeight);
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.game.physics.p2.gravity.y = this.gameSettings.gravity;
        this.ropeCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.ballCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.aimsCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.blocksCollisionGroup = this.game.physics.p2.createCollisionGroup();
    }

    createGameInterface() {
        this.createScoreView();
        this.createMenuBtn();
        this.game.createToggleMusicBtn(this);
    }

    createScoreView() {
        let bg = this.game.add.sprite(0, 0, 'scoreBg');
        bg.fixedToCamera = true;
        this.txtScore = this.game.add.bitmapText(45, 30, 'segoes', "ATTEMPTS:", 20);
        this.txtScore.fixedToCamera = true;
    }

    createMenuBtn() {
        let menuBtn = this.game.add.button(this.gameSettings.canvasWidth - 160, 0,
            "menuBtn", this.onMenuClick, this, 1, 0, 2);
        menuBtn.fixedToCamera = true;
    }

    onMenuClick() {
        let clickSound = this.game.add.audio('click');
        clickSound.play();
        this.state.start('levelSelect');
    }

    playerWins() {
        this.game.PLAYER_DATA[this._levelNumber] = this.bullets;

        // unlock next level
        if (this._levelNumber < this.game.PLAYER_DATA.length) {
            if (this.game.PLAYER_DATA[this._levelNumber + 1] < 0) {
                this.game.PLAYER_DATA[this._levelNumber + 1] = 0;
            }
        }
        // and write to local storage
        window.localStorage.setItem('mygame_progress', JSON.stringify(this.game.PLAYER_DATA));

        if (this._levelNumber == this.levelsSettings.length - 1) {
            this.state.start('finished');
        }
        else this.state.start('levelUp');
    }

    createSlingshot() {
        this.stripes = this.add.graphics(0, 0);
        let handlePart = this.add.sprite(182, 480, 'slingshotHandleRightPart');
        this.createBall();
        let handle = this.add.sprite(160, 480, 'slingshotHandle');
    }

    createBall() {
        this.ball = this.add.sprite(this.ballSettings.startPos.x, this.ballSettings.startPos.y, 'ball');
        this.physics.p2.enable(this.ball, false);
        this.ball.body.setCircle(this.ballSettings.radius, 0, 0);
        this.ball.inputEnabled = true;
        this.ball.body.mass = this.ballSettings.mass;

        this.ball.body.setCollisionGroup(this.ballCollisionGroup);
        this.ball.body.collides([this.ropeCollisionGroup]);
        this.ball.body.collides(this.aimsCollisionGroup, this.hitAim, this);
        this.ball.body.collides([this.blocksCollisionGroup], this.boxHit, this);
    }

    startPull() {
        this.pulling = true;
        this.ballOnFloor = false;
        this.ballTouchesWall = false;
        this.game.input.onUp.addOnce(this.endPull, this);
        this.game.camera.follow(this.ball);

        this.slingshotSound = this.game.add.audio('slingshotSound');
        this.slingshotSound.volume = 0.1;
        this.slingshotSound.play();
    }

    endPull() {
        this.pulling = false;
        this.launched = true;

        let forceLine = new Phaser.Line(this.input.activePointer.x, this.input.activePointer.y, this.ballSettings.startPos.x, this.ballSettings.startPos.y);
        this.ball.body.motionState = Phaser.Physics.P2.Body.DYNAMIC;
        this.ball.body.velocity.x = Math.cos(forceLine.angle) * forceLine.length * 6;
        this.ball.body.velocity.y = Math.sin(forceLine.angle) * forceLine.length * 6;
        this.stripes.clear();
        this.bullets--;
        this.pullSpound = this.game.add.audio('pullSound');
        this.pullSpound.volume = 0.3;
        this.pullSpound.play();
    }

    resetBoard() {
        this.launched = false;
        this.resetBall();
        this.txtScore.setText("ATTEMPTS: " + this.bullets);
    }

    resetBall() {
        this.checkLevelResult();
        this.slingshotPlayingSound = false;

        this.ball.body.reset();
        this.ball.body.rotation = 0;
        this.ball.body.motionState = Phaser.Physics.P2.Body.STATIC;
        this.ball.events.onInputDown.addOnce(this.startPull, this);
        this.ball.body.x = this.ballSettings.startPos.x;
        this.ball.body.y = this.ballSettings.startPos.y;
    }

    levelFailed() {
        this.state.start('levelFailed');
    }

    createLevel() {
        this.bullets = +this.levelsSettings[this._levelNumber].bullets;
        this.boxGroup = this.game.add.group();
        this.aimsGroup = this.game.add.group();

        for (let i = 0, length = this.levelsSettings[this._levelNumber].things.length; i < length; i++) {
            let thing = this.levelsSettings[this._levelNumber].things[i];
            switch (thing.type) {
                case 'box': {
                    this.createBox(thing.startPos, thing.width, thing.height, thing.asset, thing.mass);
                    break;
                }
                case 'aim': {
                    this.createAim(thing.startPos, thing.width, thing.height, thing.asset, thing.scorePoints, thing.mass);
                    break;
                }
            }
        }

        this.game.camera.focusOnXY(this.boxGroup.x, this.boxGroup.y);

        setTimeout(function (currentState) {
                currentState.game.add.tween(currentState.game.camera).to({x: 0}, 2000, Phaser.Easing.Linear.None, true);
            }
            , 3000, this);
    }

    createAim(startPos, width, height, id, scorePoints, mass) {
        let aim = this.aimsGroup.create(startPos.x, startPos.y, id);
        aim.id = id;
        aim.alpha = 0;
        let tween = this.game.add.tween(aim).to({alpha: 1}, 2000, Phaser.Easing.Linear.None, true);
        aim.scale.setTo(width / aim.width, height / aim.height);
        this.physics.enable(aim, Phaser.Physics.P2JS, false);
        aim.body.clearShapes();
        aim.body.loadPolygon('physics', id);
        aim.body.setCollisionGroup(this.aimsCollisionGroup);
        aim.body.collideWorldBounds = true;
        aim.body.collides([this.blocksCollisionGroup, this.ballCollisionGroup, this.aimsCollisionGroup]);
        aim.body.mass = mass;
        aim.body.scorePoints = scorePoints;
        this.aimsCount += 1;
    }

    createBox(startPos, width, height, id, mass) {
        let box = this.createBlock(startPos, id, width, height);
        box.body.setCollisionGroup(this.blocksCollisionGroup);
        box.body.collides([this.blocksCollisionGroup, this.ballCollisionGroup, this.aimsCollisionGroup]);
        box.body.mass = mass;
    }

    createBlock(startPos, id, width, height) {
        let block = this.boxGroup.create(startPos.x, startPos.y, id);
        block.scale.setTo(width / block.width, height / block.height);
        this.physics.p2.enable(block, false);
        return block;
    }

    checkLevelResult() {
        if (this.knockedDownAims == this.aimsCount) {
            this.playerWins();
        } else if (this.bullets < 1) {
            this.levelFailed();
        }
    }

    update() {
        if (this.pulling) {
            this.ball.body.x = this.input.activePointer.x;
            this.ball.body.y = this.input.activePointer.y;
            this.stripes.clear();
            this.stripes.lineStyle(5, 0xffc850, 1);
            this.stripes.moveTo(this.ball.body.x - 5, this.ball.body.y - 5);
            this.stripes.lineTo(this.ballSettings.startPos.x - 10, this.ballSettings.startPos.y - 10);
            this.stripes.moveTo(this.ball.body.x + 5, this.ball.body.y + 5);
            this.stripes.lineTo(200, 487);
        }
        if (this.launched) {
            this.ball.body.force.y = 70;
            this.ball.body.force.x = 70;

            if (Math.round(Math.abs(this.ball.body.velocity.y)) < 1 && Math.round(Math.abs(this.ball.body.velocity.x)) < 1)
                this.resetBoard();
        }
        if (!this.ballTouchesWall && this.gameSettings.worldWidth - Math.round(this.ball.x) == this.ballSettings.radius) {
            this.ballTouchesWall = true;
            this.boxHit();
        }
        if (!this.ballOnFloor && this.gameSettings.worldHeight - Math.round(this.ball.y) == this.ballSettings.radius) {
            this.ballOnFloor = true;
            this.boxHit();
        }
    }

    hitAim(body1, body2) {
        if (body2.sprite.alive) {
            body2.sprite.kill();
            if (body2.sprite.id == "milkBottle") {
                this.bottleSound = this.game.add.audio('bottleSound');
                this.bottleSound.play();
            }
            else {
                this.scoreSound = this.game.add.audio('scoreSound');
                this.scoreSound.play();
            }
            this.knockedDownAims++;
        }
    }

    boxHit() {
        this.boxSound = this.game.add.audio('boxSound');
        this.boxSound.volume = 0.3;
        this.boxSound.play();
    }

    render() {

    }
}
