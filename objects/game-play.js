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
        this.colors = ["red", "yellow"];
        this.blockWidth = 470;
        this.blockHeight = 50;
        this.blockSpacing = 70;
        this.blockSpeed = 1000;
        this.ballSpeed = 1000;
        this.ballDelay = 1000;
        this.emitterBallSpeed = 80;
        this.score = 0;

        this.currentColorType = this.colors[0];
        for (let i = 0; i < 4; i++) {
            this.createBlocks();
        }
        this.addShooter();

        this.text = this.scene.add.text(-230, 350, this.scene.text.texts[0].score, {
            fontFamily: "Arial",
            fontSize: "40px",
            color: "#ffffff",
            stroke: "#c00b00",
            strokeThickness: 5,
        })
        this.text.setOrigin(0, 0.5);
        this.add(this.text);

        this.scoreText = this.scene.add.text(-230, 400, this.score, {
            fontFamily: "Arial",
            fontSize: "40px",
            color: "#ffffff",
            stroke: "#c00b00",
            strokeThickness: 5,
        })
        this.scoreText.setOrigin(0, 0.5);
        this.add(this.scoreText);

        this.line = this.scene.add.sprite(0, 290, "sheet", "line");
        this.line.setOrigin(0.5).setScale(1);
        this.add(this.line);

        this.visible = false;
        // this.show();
    }

    show() {
        if (this.visible) return;
        this.visible = true;
    }

    startGame() {
        this.gameStarted = true;
        this.hand.visible = false;

        this.createBlocks();
        this.createSmallCircle();

        this.blockLoop = this.scene.time.addEvent({
            delay: this.blockSpeed,
            callback: this.createBlocks,
            callbackScope: this,
            loop: true,
        });

        this.circleLoop = this.scene.time.addEvent({
            delay: this.ballDelay,
            callback: this.createSmallCircle,
            callbackScope: this,
            loop: true,
        });
    }

    createBlocks() {
        if (this.gameOver) return;

        const colorIndex = Math.floor(Math.random() * this.colors.length);
        const color = this.colors[colorIndex];

        const x = 0;
        let y;

        if (this.blocksArr.length > 0) {
            const lastBlock = this.blocksArr[this.blocksArr.length - 1];
            y = lastBlock.y;
        } else {
            y = -655;
        }

        for (let i = 0; i < this.blocksArr.length; i++) {
            this.blocksArr[i].y += this.blockSpacing;
        }

        let block = this.scene.add.sprite(x, y, "sheet", color);
        block.setOrigin(0.5);
        this.add(block);
        block.colorType = color;
        this.blocksArr.push(block);

        this.adjustSpeed();

        if (this.blocksArr[0].y >= 210) {
            if (this.blockLoop) this.blockLoop.remove();
            if (this.circleLoop) this.circleLoop.remove();
            this.gameOver = true;
            console.log("Game Over!");
            setTimeout(() => {
                this.scene.cta.show();
            }, 250);
        }
    }

    adjustSpeed() {
        if (this.blocksArr.length === 0) return;

        const lowestBlock = this.blocksArr[0].y;
        const dangerZone = -300;
        // console.log(lowestBlock, dangerZone);
        if (lowestBlock >= dangerZone) {
            this.blockSpeed = Math.max(400, this.blockSpeed - 20);
            this.ballSpeed = Math.max(400, this.ballSpeed - 20);
            this.emitterBallSpeed = Math.max(5, this.emitterBallSpeed - 10);

            // console.log(`Speed Increased! Block Speed: ${this.blockSpeed}, Ball Speed: ${this.ballSpeed}`);
        }
    }


    createSmallCircle() {
        const centerX = 0;
        const centerY = this.shooter.y - 80;

        let fill = this.scene.add.sprite(centerX, centerY, this.currentColorType);
        fill.setOrigin(0.5);
        this.add(fill);

        fill.x = centerX;
        fill.y = centerY;
        fill.colorType = this.currentColorType;
        this.currentBall = fill;
        this.circleArr.push(fill);
        const emitter = this.scene.add.particles(0, 0, "white", {
            speed: this.emitterBallSpeed,
            lifespan: 800,
            scale: { start: 1, end: 0 },
            alpha: { start: .9, end: 0 },
            quantity: 1,
            frequency: 50,
            maxParticles: 30
        });
        this.add(emitter);
        fill.emitter = emitter;
        emitter.startFollow(fill);

        this.bringToTop(fill)

        this.scene.tweens.add({
            targets: this.shooter,
            y: this.shooter.y - 15,
            duration: 100,
            yoyo: true,
            ease: 'Power1'
        });

        fill.tween = this.scene.tweens.add({
            targets: fill,
            y: fill.y - 1000,
            duration: this.ballSpeed,
            ease: 'Linear',
            onUpdate: () => this.checkCollisions(fill),
            onComplete: () => {
                emitter.stop();
                emitter.destroy();
            }
        });
    }

    checkCollisions(circle1) {
        if (this.blocksArr.length === 0) return;
        this.blocksArr.forEach((block) => {
            let rect = new Phaser.Geom.Rectangle(block.x, block.y, block.width, block.height);
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
        // console.log(this.blocksArr.length);
        if (this.shooter.type == block.colorType) {
            this.createCollisionEffect(block, block.x, block.y, block.colorType);
            this.circleArr = this.circleArr.filter((c) => c !== circle);
            this.blocksArr = this.blocksArr.filter((b) => b !== block);

            if (circle.tween) {
                circle.tween.stop();
            }

            if (circle.emitter) {
                circle.emitter.destroy();
            }

            circle.destroy();
            block.destroy();
            this.scene.sound.play('break', { volume: 3 })

            this.score++;
            this.scoreText.setText(this.score);
        } else {
            this.circleArr = this.circleArr.filter((c) => c !== circle);
            if (circle.tween) {
                circle.tween.stop();
            }
            circle.destroy();
            if (circle.emitter) {
                circle.emitter.destroy();
            }
        }
    }

    createCollisionEffect(block, x, y, colorType) {
        const emitZone1 = { type: 'random', source: new Phaser.Geom.Rectangle(x - (block.width / 2), y - (block.height / 2), block.width, block.height), quantity: 25 };
        const emitter = this.scene.add.particles(0, 0, colorType, {
            speed: 24,
            lifespan: 250,
            quantity: 25,
            scale: { start: 0.4, end: 0 },
            emitZone: emitZone1,
            duration: 100,
            emitting: false
        });
        this.add(emitter)

        emitter.start(100);
    }

    addShooter() {

        this.shooterBg = this.scene.add.sprite(0, 450, "sheet", "ball_thrower/thrower_bg");
        this.shooterBg.setOrigin(0.5);
        this.add(this.shooterBg);

        this.shooter = this.scene.add.sprite(0, 395, "sheet", "ball_thrower/" + this.currentColorType);
        this.shooter.setOrigin(0.5);
        this.add(this.shooter);

        this.hand = this.scene.add.sprite(70, 440, "sheet", "hand");
        this.hand.setOrigin(0.5);
        this.hand.angle = -40
        this.add(this.hand);

        this.scene.tweens.add({
            targets: this.hand,
            scale: { from: this.hand.scale, to: this.hand.scale - 0.1 },
            ease: "Linear",
            duration: 700,
            yoyo: true,
            repeat: -1,
            onComplete: () => {
                // this.hand.visible = false;
            }
        })

        this.shooter.type = this.currentColorType;

        this.shooter.setInteractive();
        this.shooter.on("pointerdown", (event) => {
            this.onShooterClick();
        });
    }

    onShooterClick() {
        if (!this.gameStarted) return
        if (this.shooter.type == "yellow") {
            this.shooter.setFrame("ball_thrower/red")
            this.circleArr.forEach(element => {
                element.setTexture("red")
            });
            this.currentColorType = this.colors[0];
            this.shooter.type = this.currentColorType
        } else {
            this.shooter.setFrame("ball_thrower/yellow")
            this.circleArr.forEach(element => {
                element.setTexture("yellow")
            });
            this.currentColorType = this.colors[1];
            this.shooter.type = this.currentColorType
        }
    }

}