export default class GameStart {

    constructor() {
    }

    create() {

        this.game.bgMusic.play();
        this.game.bgMusic.loop = true;

        this.add.sprite(0, 0, "startGameBg");
        this.game.createToggleMusicBtn(this);

        this.playBtn = this.add.button(this.game.width / 2, this.game.height * 7 / 8, 'startGamePlayBtn', this.onPlayBtnClick, this, 1, 0, 2);
        this.playBtn.anchor.setTo(0.5, 0.5);
        this.playBtn.onInputOver.add(this.over, this);
        this.playBtn.onInputOut.add(this.out, this);
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

    onPlayBtnClick() {
        this.clickSound = this.game.add.audio('click');
        this.clickSound.play();
        this.game.state.start('levelSelect');
        document.body.style.cursor = 'default';
    }
}
