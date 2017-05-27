export default class LevelSelect extends Phaser.State {

    constructor() {
        super();

        this.holdicons = [];
    }

    preload() {
        this.initProgressData();
    }

    create() {
        if (!this.game.bgMusic.isPlaying)
            this.game.bgMusic.play();

        this.add.sprite(0, 0, "levelSelectBg");
        this.game.createToggleMusicBtn(this);
        this.game.stage.backgroundColor = 0x80a0ff;
        this.createLevelIcons(this.game.levelsJSON.levels.length);
        this.animateLevelIcons();
    }

    initProgressData() {
        if (!this.game.PLAYER_DATA) {
            // retrieve from local storage (to view in Chrome, Ctrl+Shift+J -> Resources -> Local Storage)
            let str = window.localStorage.getItem('mygame_progress');
            // error checking, localstorage might not exist yet at first time start up
            try {
                this.game.PLAYER_DATA = JSON.parse(str);
            } catch (e) {
                this.game.PLAYER_DATA = []; //error in the above string(in this case,yes)!
            }
            // error checking just to be sure, if localstorage contains something else then a JSON array (hackers?)
            if (Object.prototype.toString.call(this.game.PLAYER_DATA) !== '[object Array]') {
                this.game.PLAYER_DATA = [];
            }
        }
    }

    createLevelIcons(levelsCount) {
        const STARS_COUNT = 3;
        const HOR_PADDING = 50;
        const VERT_PADDING = 15;
        const ITEM_WIDTH = 128;
        const ITEM_HEIGHT = 128;
        const VERTICAL_OFFSET = 160;

        let levelNumber = 0;
        let rowCount = 3;
        let columnCount = parseInt(levelsCount / rowCount);
        let horizontalOffset = (this.game.levelsJSON.gameSettings.canvasWidth -
            (columnCount - 1 ) * (ITEM_WIDTH + HOR_PADDING) -
            ITEM_WIDTH) / 2;

        let xPos;
        let yPos;

        for (let row = 0; row < rowCount; row++) {
            for (let column = 0; column < columnCount; column++) {
                // next level
                levelNumber = levelNumber + 1;

                // check if array not yet initialised
                if (typeof this.game.PLAYER_DATA[levelNumber - 1] !== 'number') {
                    // value is null or undefined, i.e. array not defined or too short between app upgrades with more levels
                    if (levelNumber == 1) {
                        this.game.PLAYER_DATA[levelNumber - 1] = 0; // level 1 should never be locked
                    } else {
                        this.game.PLAYER_DATA[levelNumber - 1] = -1;
                    }
                }

                // player progress info for this level
                let playdata = this.game.PLAYER_DATA[levelNumber - 1];

                let isLocked = true;
                let stars = 0;

                // check if level is unlocked
                if (playdata > -1) {
                    isLocked = false; // unlocked
                    if (playdata <= STARS_COUNT) {
                        stars = playdata;
                    }
                }

                xPos = horizontalOffset + (HOR_PADDING + ITEM_WIDTH) * column;
                yPos = VERTICAL_OFFSET + (row * (ITEM_HEIGHT + VERT_PADDING));

                this.holdicons[levelNumber - 1] = this.createLevelIcon(xPos, yPos, levelNumber, isLocked, stars);
                let backicon = this.holdicons[levelNumber - 1].getAt(0);
                backicon.levelNumber = levelNumber;
                backicon.inputEnabled = true;
                backicon.events.onInputDown.add(this.onSpriteDown, this);
                backicon.events.onInputOver.add(this.overSprite, this);
                backicon.events.onInputOut.add(this.outSprite, this);
            }
        }
    }

    overSprite() {
        document.querySelector("canvas").style.cursor = 'none';
        this.pointer = this.add.sprite(this.input.x - 25, this.input.y - 32, "pointer");
        this.input.addMoveCallback(function (pointer, x, y) {
            this.pointer.x = x - 25;
            this.pointer.y = y - 32;
        }, this);
    }

    outSprite() {
        document.querySelector("canvas").style.cursor = 'default';
        this.input.deleteMoveCallback();
        this.pointer.destroy();
    }

    createLevelIcon(xPos, yPos, levelNumber, isLocked, stars) {
        let iconGroup = this.game.add.group();
        iconGroup.x = xPos;
        iconGroup.y = yPos;

        // keep original position, for restoring after certain tweens
        iconGroup.xOrg = xPos;
        iconGroup.yOrg = yPos;

        // determine background frame
        let frame = 0;
        if (isLocked == false) {
            frame = 1
        }
        //let icon1 = this.game.add.sprite(0, 0, 'levelselecticons', frame);
        iconGroup.create(0, 0, 'levelselecticons', frame);

        // add stars, if needed
        if (isLocked == false) {
            let txt = this.game.add.bitmapText(24, 16, 'cooperBold', '' + levelNumber, 48);
            let iconWithStars = this.game.add.sprite(0, 0, 'levelselecticons', (2 + stars));
            iconGroup.add(txt);
            iconGroup.add(iconWithStars);
        }
        return iconGroup;
    }

    onSpriteDown(sprite, pointer) {
        let levelNumber = sprite.levelNumber;
        let iconGroup = this.holdicons[levelNumber - 1];

        if (this.game.PLAYER_DATA[levelNumber - 1] < 0) {
            let xPos = iconGroup.xOrg;
            let tween = this.game.add.tween(iconGroup)
                .to({x: xPos + 6}, 20, Phaser.Easing.Linear.None)
                .to({x: xPos - 5}, 20, Phaser.Easing.Linear.None)
                .to({x: xPos + 4}, 20, Phaser.Easing.Linear.None)
                .to({x: xPos - 3}, 20, Phaser.Easing.Linear.None)
                .to({x: xPos + 2}, 20, Phaser.Easing.Linear.None)
                .to({x: xPos}, 20, Phaser.Easing.Linear.None)
                .start();
        } else {
            let tween = this.game.add.tween(iconGroup.scale)
                .to({x: 0.9, y: 0.9}, 100, Phaser.Easing.Linear.None)
                .to({x: 1.0, y: 1.0}, 100, Phaser.Easing.Linear.None)
                .start();
            tween.onComplete.add(function () {
                this.onLevelSelected(levelNumber - 1);
            }, this);

            this.clickSound = this.game.add.audio('click');
            this.clickSound.play();
            document.querySelector("canvas").style.cursor = 'default';
        }
    }

    // slide all icons into screen
    animateLevelIcons() {
        const START_POSITION = 600;
        for (let i = 0, length = this.holdicons.length; i < length; i++) {
            // get variables
            let iconGroup = this.holdicons[i];
            iconGroup.y = iconGroup.y + START_POSITION;
            let y = iconGroup.y;

            // tween animation
            this.game.add.tween(iconGroup).to({y: y - START_POSITION}, 500, Phaser.Easing.Back.Out, true, (i * 40));
        }
    }

    onLevelSelected(levelNumber) {
        this.game.state.states['game']._levelNumber = levelNumber;
        this.state.start('game');
        document.querySelector("canvas").style.cursor = 'default';
    }
}
