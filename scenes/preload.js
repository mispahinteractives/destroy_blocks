export default class Preload extends Phaser.Scene {

    width = null
    height = null
    handlerScene = null
    sceneStopped = false

    constructor() {
        super({ key: 'preload' })
    }

    init() {

        //  Inject our CSS
        var element = document.createElement('style');

        document.head.appendChild(element);

        var sheet = element.sheet;

        var styles1 = '@font-face { font-family: "Flame_Regular"; src: url("fonts/Flame_Regular.ttf") format("truetype"); }\n';

        sheet.insertRule(styles1, 0);

    }

    preload() {
        // Images
        this.load.image('bg', 'assets/bg.png');
        this.load.image('blue', 'assets/blue.png');
        this.load.image('bg2', 'assets/bg2.png');
        this.load.image('yellow', 'assets/yellow.png');
        this.load.image('red', 'assets/red.png');
        this.load.image('white', 'assets/white.png');
        this.load.atlas('sheet', 'assets/sheet.png', 'assets/sheet.json');

        this.load.script('webfont', 'lib/webfont.js');
        this.load.plugin('rextagtextplugin', 'lib/rextagtextplugin.min.js', true);
        // this.load.audio('bgm','sounds/bgm.mp3');
        // this.load.audio('win','sounds/win.mp3');
        this.load.audio('countdown', 'sounds/countdown.mp3');
        this.load.audio('break1', 'sounds/break1.mp3');
        this.load.audio('break2', 'sounds/break2.mp3');
        this.load.audio('break3', 'sounds/break3.mp3');

        //---------------------------------------------------------------------->

        this.canvasWidth = this.sys.game.canvas.width
        this.canvasHeight = this.sys.game.canvas.height

        this.width = this.game.screenBaseSize.width
        this.height = this.game.screenBaseSize.height

        this.sceneStopped = false


        this.load.on('progress', (value) => {

        })

        this.load.on('complete', () => {

        })
    }

    create() {

        this.firstTime = false;
        let _this = this;
        WebFont.load({

            custom: {
                families: ['Flame_Regular']

            },
            active: function() {

                _this.scene.stop('preload');
                _this.scene.launch('GameScene');
            }
        });
    }
}