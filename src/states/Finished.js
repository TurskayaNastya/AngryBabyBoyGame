export default class Finished {

    create() {
        const GAME_SETTINGS = this.game.levelsJSON.gameSettings;

        this.game.bgMusic.pause();
        this.levelFailedSound = this.game.add.audio('finished');
        this.levelFailedSound.play();

        this.window = this.game.add.group();
        let windowBg = this.window.create(0, 0, "finishedWindowBg");
        let selectLevelBtn = this.createButton(this.window, 'windowBtn', this.onSelectLevelClick);
        let selectLevelText = this.game.add.bitmapText(0, 0, 'segoes', "Menu", 24);
        selectLevelText.x = (selectLevelBtn.width - selectLevelText.width) / 2;
        selectLevelText.y = (selectLevelBtn.height - selectLevelText.height - 6) / 2;
        selectLevelBtn.addChild(selectLevelText);
        selectLevelBtn.x = GAME_SETTINGS.canvasWidth / 2 - selectLevelBtn.width / 2;
    }

    createButton(parent, asset, callback) {
        let btn = this.game.make.button(0, 500, asset, callback, this, 1, 0, 2);
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
