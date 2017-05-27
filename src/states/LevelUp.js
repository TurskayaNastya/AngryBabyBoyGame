export default class LevelUp {

    create() {
        const GAME_SETTINGS = this.game.levelsJSON.gameSettings;
        const BUTTON_PADDING = 20;

        if (!this.game.bgMusic.mute) {
            this.game.bgMusic.pause();
        }
        this.winSound = this.game.add.audio('winSound');
        this.winSound.play();

        this.window = this.game.add.group();
        let windowBg = this.window.create(0, 0, "levelUpWindowBg");
        let selectLevelBtn = this.createButton(this.window, 'windowBtn', this.onSelectLevelClick);
        let selectLevelText = this.game.add.bitmapText(0, 0, 'segoes', "Menu", 24);
        selectLevelText.x = (selectLevelBtn.width - selectLevelText.width) / 2;
        selectLevelText.y = (selectLevelBtn.height - selectLevelText.height - 6) / 2;
        selectLevelBtn.addChild(selectLevelText);

        let replayBtn = this.createButton(this.window, 'windowBtn', this.onReplayClick);
        let replayText = this.game.add.bitmapText(0, 0, 'segoes', "Replay", 24);
        replayText.x = (replayBtn.width - replayText.width) / 2;
        replayText.y = (replayBtn.height - replayText.height - 6) / 2;
        replayBtn.addChild(replayText);

        let nextLevelBtn = this.createButton(this.window, 'windowBtn', this.onNextLevelClick);
        let nextText = this.game.add.bitmapText(0, 0, 'segoes', "Next", 24);
        nextText.x = (nextLevelBtn.width - nextText.width) / 2;
        nextText.y = (nextLevelBtn.height - nextText.height - 6) / 2;
        nextLevelBtn.addChild(nextText);

        selectLevelBtn.x = (GAME_SETTINGS.canvasWidth - selectLevelBtn.width * 3 - BUTTON_PADDING * 2) / 2;
        replayBtn.x = (GAME_SETTINGS.canvasWidth - replayBtn.width) / 2;
        nextLevelBtn.x = GAME_SETTINGS.canvasWidth / 2 + replayBtn.width / 2 + BUTTON_PADDING;
    }

    createButton(parent, asset, callback) {
        let btn = this.game.make.button(0, 460, asset, callback, this, 1, 0, 2);
        parent.add(btn);
        btn.onInputOver.add(this.over, this);
        btn.onInputOut.add(this.out, this);
        return btn;
    }

    onSelectLevelClick() {
        let clickSound = this.game.add.audio('click');
        clickSound.play();
        this.state.start('levelSelect');
        document.querySelector("canvas").style.cursor = 'default';
    }

    onNextLevelClick() {
        let clickSound = this.game.add.audio('click');
        clickSound.play();
        this.game.state.states['game']._levelNumber++;
        this.state.start('game');
        document.querySelector("canvas").style.cursor = 'default';
    }

    onReplayClick() {
        let clickSound = this.game.add.audio('click');
        clickSound.play();
        this.state.start('game');
        document.querySelector("canvas").style.cursor = 'default';
    }

    over() {
        document.querySelector("canvas").style.cursor = 'none';
        this.pointer = this.add.sprite(this.input.x - 25, this.input.y - 32, "pointer");
        this.input.addMoveCallback(function (pointer, x, y) {
            this.pointer.x = x - 25;
            this.pointer.y = y - 32;
        }, this);
    }

    out() {
        document.querySelector("canvas").style.cursor = 'default';
        this.input.deleteMoveCallback();
        this.pointer.destroy();
    }
}
