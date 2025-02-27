export default class Boot extends Phaser.Scene {

    width = null
    height = null
    handlerScene = null
    sceneStopped = false

    constructor() {
        super({ key: 'boot' })
    }

    init() {}

    preload() {
        this.load.image('bg', 'assets/bg.png');
        this.load.image('blue', 'assets/blue.png');
        this.load.image('bg2', 'assets/bg2.png');
        this.load.image('yellow', 'assets/yellow.png');
        this.load.image('red', 'assets/red.png');
        this.load.image('white', 'assets/white.png');
        this.load.image('loading_bar_unfilled', 'assets/loading_bar_unfilled.png');
        this.load.image('loading_bar_filled', 'assets/loading_bar_filled.png');
        this.load.atlas('sheet', 'assets/sheet.png', 'assets/sheet.json');

        this.load.script('webfont', 'lib/webfont.js');
        this.load.plugin('rextagtextplugin', 'lib/rextagtextplugin.min.js', true);
        // this.load.audio('bgm','sounds/bgm.mp3');
        // this.load.audio('win','sounds/win.mp3');
        this.load.audio('countdown', 'sounds/countdown.mp3');
        this.load.audio('break', 'sounds/break.mp3');

    }

    create() {


        this.scene.stop('boot');
        this.scene.launch('preload');
    }
}