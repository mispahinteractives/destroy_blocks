import config from "../config.js";

export class GamePlay extends Phaser.GameObjects.Container {
    constructor(scene, x, y, gameScene, dimensions) {
        super(scene);
        this.scene = scene;
        this.dimensions = dimensions;
        this.x = x;
        this.y = y;
        this.gameScene = gameScene;
        this.scene.add.existing(this);

        this.init();
    }

    init() {
        this.blocksArr = [];
        this.circleArr = [];
        this.colors = [0x00ffff, 0xfd752b];
        this.colorsType = ["blue", "orange"];
        this.blockWidth = 470;
        this.blockHeight = 50;
        this.blockSpacing = -40;
        this.blockSpeed = 1000;
        this.score = 0;

        this.currentColor = this.colors[1];
        this.currentColorType = this.colorsType[1];

        this.createBlocks();
        this.createBigCircle();
        this.createLine();

        this.scoreText = this.scene.add.text(-230, 340, this.score, {
            fontFamily: "Arial",
            fontSize: "40px",
            color: "#ffffff",
        })
        this.scoreText.setOrigin(0, 0.5);
        this.add(this.scoreText);

        this.visible = false;
        this.show();
    }

    show() {
        if (this.visible) return;
        this.visible = true;

        this.blockLoop = this.scene.time.addEvent({
            delay: this.blockSpeed,
            callback: this.createBlocks,
            callbackScope: this,
            loop: true,
        });

        this.circleLoop = this.scene.time.addEvent({
            delay: 1000,
            callback: this.createSmallCircle,
            callbackScope: this,
            loop: true,
        });
    }

    createBlocks() {
        if (this.gameOver) return;

        const colorIndex = Math.floor(Math.random() * this.colors.length);
        const color = this.colors[colorIndex];
        const colorType = this.colorsType[colorIndex];
        const radius = 20;

        const x = -this.blockWidth / 2;
        let y;

        if (this.blocksArr.length > 0) {
            const lastBlock = this.blocksArr[this.blocksArr.length - 1];
            y = lastBlock.y - (this.blockHeight + this.blockSpacing);
        } else {
            y = -460;
        }

        for (let i = 0; i < this.blocksArr.length; i++) {
            this.blocksArr[i].y += this.blockSpacing + 100;
        }

        let block = this.scene.make.graphics()
            .fillStyle(color, 1)
            .fillRoundedRect(0, 0, this.blockWidth, this.blockHeight, radius);
        this.add(block);

        block.x = x;
        block.y = y;
        block.colorType = colorType;

        this.blocksArr.push(block);

        if (this.blocksArr[0].y >= 210) {
            if (this.blockLoop) {
                this.blockLoop.remove();
            }
            if (this.circleLoop) {
                this.circleLoop.remove();
            }
            this.gameOver = true;
            console.log("Game Over!");
        }
    }

    createSmallCircle() {
        const centerX = 0;
        const centerY = 400;
        const circleRadius = 20;

        let fill = this.scene.add.graphics();
        fill.fillStyle(this.currentColor, 1);
        fill.fillCircle(0, 0, circleRadius);
        this.add(fill);

        fill.x = centerX;
        fill.y = centerY;
        fill.colorType = this.currentColorType;
        this.currentBall = fill;
        fill.radius = circleRadius;

        this.circleArr.push(fill);

        fill.tween = this.scene.tweens.add({
            targets: fill,
            y: { from: fill.y, to: fill.y - 1000 },
            duration: 1000,
            ease: 'Linear',
            onUpdate: () => this.checkCollisions(fill),
        });
    }

    createLine() {
        const centerX = -this.blockWidth / 2;
        const centerY = 300;
        const lineRadius = 3;

        let fill = this.scene.add.graphics();
        fill.fillStyle(this.colors[0], 1);
        fill.fillRoundedRect(0, 0, this.blockWidth, 7, lineRadius);
        this.add(fill);
        fill.x = centerX;
        fill.y = centerY;

    }

    checkCollisions(circle1) {
        if (this.blocksArr.length === 0) return;
        this.blocksArr.forEach((block) => {
            let rect = new Phaser.Geom.Rectangle(block.x, block.y, this.blockWidth, this.blockHeight);
            let circle = new Phaser.Geom.Circle(circle1.x, circle1.y, circle1.radius);

            if (Phaser.Geom.Intersects.CircleToRectangle(circle, rect)) {
                this.circleArr = this.circleArr.filter((c) => c !== circle);
                circle1.tween.stop();
                circle1.destroy();
                this.handleCircleBlockCollision(circle1, block)
            }
        });
    }

    handleCircleBlockCollision(circle, block) {
        if (this.largeCircleSprite.type == block.colorType) {
            this.createCollisionEffect(block, block.x, block.y, block.colorType);
            this.circleArr = this.circleArr.filter((c) => c !== circle);
            this.blocksArr = this.blocksArr.filter((b) => b !== block);

            if (circle.tween) {
                circle.tween.stop();
            }

            circle.destroy();
            block.destroy();

            this.score++;
            this.scoreText.setText(this.score);
        } else {
            this.circleArr = this.circleArr.filter((c) => c !== circle);
            if (circle.tween) {
                circle.tween.stop();
            }
            circle.destroy();
        }
    }

    createCollisionEffect(block, x, y, colorType) {
        const emitZone1 = { type: 'random', source: new Phaser.Geom.Rectangle(block.x, block.y, this.blockWidth, this.blockHeight), quantity: 25 };
        const emitter = this.scene.add.particles(0, 0, colorType, {
            speed: 24,
            lifespan: 250,
            quantity: 25,
            scale: { start: 0.1, end: 0 },
            emitZone: emitZone1,
            duration: 100,
            emitting: false
        });
        this.add(emitter)

        emitter.start(100);
    }


    createBigCircle() {

        this.largeCircleSprite = this.scene.add.sprite(0, 395, "sheet", "orange");
        this.largeCircleSprite.setOrigin(0.5);
        this.add(this.largeCircleSprite);

        this.largeCircleSprite.type = this.currentColorType

        this.largeCircleSprite.setInteractive();
        this.largeCircleSprite.on("pointerdown", (event) => {
            this.onBigCircleClick();
        });
    }

    onBigCircleClick() {
        if (this.largeCircleSprite.type == "orange") {
            this.largeCircleSprite.setFrame("blue")
            if (this.circleArr) {
                this.circleArr.forEach(element => {
                    element.clear();
                    element.fillStyle(this.colors[0], 1);
                    element.fillCircle(0, 0, 20);
                });
            }

            this.currentColor = this.colors[0];
            this.currentColorType = this.colorsType[0];
            this.largeCircleSprite.type = this.currentColorType
        } else {
            this.largeCircleSprite.setFrame("orange")
            if (this.circleArr) {
                this.circleArr.forEach(element => {
                    element.clear();
                    element.fillStyle(this.colors[1], 1);
                    element.fillCircle(0, 0, 20);
                });
            }
            this.currentColor = this.colors[1];
            this.currentColorType = this.colorsType[1];
            this.largeCircleSprite.type = this.currentColorType
        }
    }

}