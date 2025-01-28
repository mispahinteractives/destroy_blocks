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
        this.blocks = [];
        this.movingCircles = [];

        this.createBlocks();

        this.createCircle();

        this.scene.time.addEvent({ delay: 500, callback: this.createMovingCircle, callbackScope: this, loop: true, });

        this.scene.matter.world.on("collisionstart", this.onCollisionStart, this);

        this.visible = false;
        this.show();
    }

    createCircle() {
        const centerX = 0;
        const centerY = 400;
        const largeCircleRadius = 50;

        this.largeCircle = this.scene.matter.add.circle(centerX, centerY, largeCircleRadius, { isStatic: true, render: { fillStyle: 0xff6666 }, });

        let fill = this.scene.add.graphics();
        fill.fillStyle(0xff6666, 1);
        fill.fillCircle(0, 0, largeCircleRadius);
        fill.x = centerX;
        fill.y = centerY;
        this.add(fill);
    }

    createMovingCircle() {
        const centerX = 0;
        const bottomY = 400;
        const smallCircleRadius = 15;

        const smallCircle = this.scene.matter.add.circle(centerX, bottomY, smallCircleRadius, {
            restitution: 0.5,
            friction: 0,
        });

        let fill = this.scene.add.graphics();
        fill.fillStyle(0xff6666, 1);
        fill.fillCircle(25, 25, smallCircleRadius);
        fill.generateTexture("smallCircle", 50, 50);
        fill.destroy();

        let dynamicSprite = this.scene.add.sprite(centerX, bottomY, "smallCircle");
        dynamicSprite.setOrigin(0.5);
        this.add(dynamicSprite);

        this.scene.matter.world.on("beforeupdate", () => {
            dynamicSprite.x = smallCircle.position.x;
            dynamicSprite.y = smallCircle.position.y;
        });

        this.scene.matter.body.setVelocity(smallCircle, { x: 0, y: -5 });

        this.movingCircles.push({ body: smallCircle, sprite: dynamicSprite });
    }


    createBlocks() {
        this.colors = [0x00ffff, 0xff6666];
        this.blockWidth = 450;
        this.blockHeight = 40;
        this.blockSpacing = 20;
        this.blockSpeed = 2;
        this.blocks = [];
        let count = 0;
        let initialY = -this.blockHeight - 460;

        this.scene.time.addEvent({
            delay: 1000,
            callback: () => {
                count++;
                const color = this.colors[Math.floor(Math.random() * this.colors.length)];
                const x = 0;
                const y = initialY + (this.blockHeight + this.blockSpacing) * count;

                const block = this.scene.matter.add.rectangle(x, y, this.blockWidth, this.blockHeight, { isStatic: false });

                let fill = this.scene.add.graphics();
                fill.fillStyle(color, 1);
                fill.fillRoundedRect(0, 0, this.blockWidth, this.blockHeight, 20);
                fill.generateTexture("blockTexture" + count, this.blockWidth, this.blockHeight);
                fill.destroy();

                let blockSprite = this.scene.add.sprite(x, y, "blockTexture" + count);
                blockSprite.setOrigin(0.5);
                this.add(blockSprite);

                blockSprite.setData("body", block);
                this.scene.matter.world.on("afterUpdate", () => {
                    blockSprite.x = block.position.x;
                    blockSprite.y = block.position.y;
                });
                this.scene.matter.body.setVelocity(block, { x: 0, y: this.blockSpeed });
                this.blocks.push({ body: block, sprite: blockSprite });

                this.blocks = this.blocks.filter(({ body, sprite }) => {
                    if (sprite.y > 220) {
                        sprite.destroy();
                        this.scene.matter.world.remove(body);
                        return false;
                    }
                    return true;
                });
            },
            loop: true,
        });
    }

    onCollisionStart(event) {
        const pairs = event.pairs;
        pairs.forEach((pair) => {
            const bodyA = pair.bodyA;
            const bodyB = pair.bodyB;

            if (this.isSmallCircle(bodyA) && this.isBlock(bodyB)) {
                console.log("11");
                this.destroyCircle(bodyA);
            } else if (this.isSmallCircle(bodyB) && this.isBlock(bodyA)) {
                console.log("22");
                this.destroyCircle(bodyB);
            }
        });
    }

    isSmallCircle(body) {
        return this.movingCircles.some((circle) => circle === body);
    }

    isBlock(body) {
        return this.blocks.some((block) => block === body);
    }

    destroyCircle(circle) {
        this.movingCircles = this.movingCircles.filter((c) => c !== circle);
        this.scene.matter.world.remove(circle);
        console.log("Small circle destroyed!");
    }

    show() {
        if (this.visible) return;
        this.visible = true;
    }
}