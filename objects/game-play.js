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
        this.blockSpacing = -40;
        this.blockSpeed = 1000;
        this.score = 0;

        this.currentColorType = this.colors[0];

        this.createBlocks();
        this.addShooter();

        this.scoreText = this.scene.add.text(-230, 340, this.score, {
            fontFamily: "Arial",
            fontSize: "40px",
            color: "#ffffff",
        })
        this.scoreText.setOrigin(0, 0.5);
        this.add(this.scoreText);

        this.visible = false;
        // this.show();
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
        const colorType = this.colors[colorIndex];

        const x = 0;
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

        let block = this.scene.add.sprite(x, y, "sheet", color);
        block.setOrigin(0.5);
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
            this.scene.cta.show();
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
            speed: 80,
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
            duration: 1000,
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

        this.hand = this.scene.add.sprite(50, 395, "sheet", "hand");
        this.hand.setOrigin(0.5);
        this.hand.angle = -30
        this.add(this.hand);

        this.shooter.type = this.currentColorType;

        this.shooter.setInteractive();
        this.shooter.on("pointerdown", (event) => {
            this.onShooterClick();
        });
    }

    onShooterClick() {
        console.log(this.shooter.type);
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