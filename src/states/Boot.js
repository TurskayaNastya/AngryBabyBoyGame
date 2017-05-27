export default class Boot {

    preload() {
        this.load.image('loading_bg', 'assets/images/loading_bg.jpg');
        this.load.spritesheet('loader', 'assets/images/loader.png', 200, 204, 12);
        this.game.load.json('levels', 'assets/levels.json');
        this.game.stage.backgroundColor = 'fff';
    }

    create() {
        this.game.state.start('preload');

        this.game.toggleSound = function () {

            if (!this.musicToggleBtn.frame)
                this.musicToggleBtn.frame = 1;
            else
                this.musicToggleBtn.frame = 0;

            if (!this.game.bgMusic.mute)
                this.game.bgMusic.mute = true;
            else
                this.game.bgMusic.mute = false;
        }

        this.game.createToggleMusicBtn = function (state) {
            state.musicToggleBtn = state.add.button(800 - 80, 0, 'musicBtn', state.game.toggleSound, state);
            if (!state.game.bgMusic.mute)
                state.musicToggleBtn.frame = 0;
            else
                state.musicToggleBtn.frame = 1;
            state.musicToggleBtn.fixedToCamera = true;
        }
    }

}
