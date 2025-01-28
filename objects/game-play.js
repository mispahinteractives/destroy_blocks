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
        this.blockHeight = 40;
        this.blockSpacing = 20;
        this.blockSpeed = 3000;
        this.blockCount = 1;
        this.score = 0;
        this.currentColor = this.colors[1];
        this.currentColorType = this.colorsType[1];

        this.createBlocks();
        this.createBigCircle();

        this.scoreText = this.scene.add.text(-170, 400, `Score: ${this.score}`, {
            fontFamily: "Arial",
            fontSize: "40px",
            color: "#ffffff",
        })
        this.scoreText.setOrigin(0.5, 0.5);
        this.add(this.scoreText);

        this.visible = false;
        this.show();
    }

    show() {
        if (this.visible) return;
        this.visible = true;

        this.blockLoop = this.scene.time.addEvent({
            delay: this.blockSpacing,
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
        this.blockCount++;

        const colorIndex = Math.floor(Math.random() * this.colors.length);
        const color = this.colors[colorIndex];
        const colorType = this.colorsType[colorIndex];
        const startY = -420;
        const toY = 250;
        const speed = 200;

        const x = -this.blockWidth / 2;
        const y = startY - (this.blockHeight + this.blockSpacing) * (this.blockCount - 1);

        const distance = Math.abs(toY - y);
        const duration = (distance / speed) * this.blockSpeed;

        let block = this.scene.make.graphics()
            .fillStyle(color, 1)
            .fillRoundedRect(0, 0, this.blockWidth, this.blockHeight, this.blockSpacing);
        block.x = x;
        block.y = y;
        block.colorType = colorType;
        this.add(block);
        this.blocksArr.push(block);

        block.tween = this.scene.tweens.add({
            targets: block,
            y: toY,
            duration: duration,
            ease: 'Linear',
            onUpdate: (tween) => {
                const target = tween.getValue();
                block.setData('y', target);
            },
            onComplete: () => {
                this.blocksArr = this.blocksArr.filter((b) => b !== block);

                for (let i = 0; i < this.blocksArr.length; i++) {
                    this.blocksArr[i].tween.stop();
                }
                if (this.blockLoop) {
                    this.blockLoop.remove();
                }
                if (this.circleLoop) {
                    this.circleLoop.remove();
                }
                this.gameOver = true;
                console.log("Game Over!");
            },
        });

        block.setData('x', x);
        block.setData('y', y);
        block.setData('width', this.blockWidth);
        block.setData('height', this.blockHeight);
        block.setData('colorType', colorType);
    }

    createSmallCircle() {
        const centerX = 0;
        const centerY = 400;
        const circleRadius = 20;

        let fill = this.scene.add.graphics();
        fill.fillStyle(this.currentColor, 1);
        fill.fillCircle(0, 0, circleRadius);
        fill.x = centerX;
        fill.y = centerY;
        this.add(fill);
        fill.colorType = this.currentColorType;
        this.currentBall = fill;

        fill.setData('radius', circleRadius);
        fill.setData('x', centerX);
        fill.setData('y', centerY);
        fill.setData('colorType', this.currentColorType);

        this.circleArr.push(fill);

        this.scene.tweens.add({
            targets: fill,
            y: { from: fill.y, to: fill.y - 1000 },
            duration: 2000,
            ease: 'Linear',
            onUpdate: () => this.checkCollisions(fill),
        });
    }

    checkCollisions(circle) {
        if (this.blocksArr.length === 0) return;

        this.blocksArr.forEach((block) => {
            const circleX = circle.x;
            const circleY = circle.y;
            const circleRadius = circle.getData('radius');

            const blockX = block.getData('x');
            const blockY = block.getData('y');
            const blockWidth = block.getData('width');
            const blockHeight = block.getData('height');

            if (
                circleX + circleRadius > blockX &&
                circleX - circleRadius < blockX + blockWidth &&
                circleY + circleRadius > blockY &&
                circleY - circleRadius < blockY + blockHeight
            ) {
                this.handleCircleBlockCollision(circle, block);
            }
        });
    }

    handleCircleBlockCollision(circle, block) {
        if (this.currentColorType == block.colorType) {
            block.tween.stop();
            circle.destroy();
            block.destroy();

            this.circleArr = this.circleArr.filter((c) => c !== circle);
            this.blocksArr = this.blocksArr.filter((b) => b !== block);

            this.score++;
            console.log(`Score: ${this.score}`);
            this.scoreText.setText(`Score: ${this.score}`);
        } else {
            circle.destroy();
        }
    }

    createBigCircle() {

        this.largeCircleSprite = this.scene.add.sprite(0, 400, "sheet", "orange");
        this.largeCircleSprite.setOrigin(0.5);
        this.add(this.largeCircleSprite);
        this.largeCircleSprite.type = this.currentColorType

        this.largeCircleSprite.setInteractive();
        this.largeCircleSprite.on("pointerdown", (event) => {
            this.onBigCircleClick();
        });
    }

    onBigCircleClick() {
        console.log(this.largeCircleSprite.type);
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