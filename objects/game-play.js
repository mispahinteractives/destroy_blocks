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
        this.colors = [0x00ffff, 0xff6666];
        this.blockWidth = 450;
        this.blockHeight = 40;
        this.blockSpacing = 20;
        this.blockSpeed = 2;
        this.blockCount = 1;

        this.createBlocks();
        this.createCircle();

        this.visible = false;
        this.show();
    }

    show() {
        if (this.visible) return;
        this.visible = true;

        this.blockLoop = this.scene.time.addEvent({ delay: 1000, callback: this.createBlocks, callbackScope: this, loop: true, });
        this.circleLoop = this.scene.time.addEvent({ delay: 1000, callback: this.createSmallCircle, callbackScope: this, loop: true, });
    }

    createBlocks() {
        if (this.gameOver) return;
        this.blockCount++;

        const color = this.colors[Math.floor(Math.random() * this.colors.length)];
        const startY = -300
        const toY = 750
        const x = -this.blockWidth / 2;
        const y = -this.blockHeight + startY - (this.blockHeight + this.blockSpacing) * this.blockCount;

        let block = this.scene.make.graphics()
            .fillStyle(color, 1)
            .fillRoundedRect(x, y, this.blockWidth, this.blockHeight, this.blockSpacing);
        this.add(block);
        this.blocksArr.push(block);

        this.scene.tweens.add({ targets: block, y: toY, duration: 1000, ease: 'Linear', });

        block.setData('x', x);
        block.setData('y', y);
        block.setData('width', this.blockWidth);
        block.setData('height', this.blockHeight);

        if (y >= 260) {
            if (this.blockLoop) {
                this.blockLoop.remove();
            }
            if (this.circleLoop) {
                this.circleLoop.remove();
            }
            this.gameOver = true;
            return;
        }
    }

    createSmallCircle() {
        const centerX = 0;
        const centerY = 400;
        const circleRadius = 20;
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];

        let fill = this.scene.add.graphics();
        fill.fillStyle(color, 1);
        fill.fillCircle(0, 0, circleRadius);
        fill.x = centerX;
        fill.y = centerY;
        this.add(fill);

        fill.setData('radius', circleRadius);
        fill.setData('x', centerX);
        fill.setData('y', centerY);

        this.circleArr.push(fill)

        this.scene.tweens.add({
            targets: fill,
            y: { from: fill.y, to: fill.y - 1000 },
            duration: 2000,
            ease: 'Linear',
            onUpdate: () => this.checkCollisions(fill)
        });
    }

    checkCollisions(circle) {
        // Iterate over all blocks to check for overlap
        this.blocksArr.forEach((block) => {
            const circleX = circle.x;
            const circleY = circle.y;
            const circleRadius = circle.getData('radius');

            const blockX = block.getData('x');
            const blockY = block.getData('y');
            const blockWidth = block.getData('width');
            const blockHeight = block.getData('height');

            if (
                circleX + circleRadius > blockX && // Right side of circle overlaps left side of block
                circleX - circleRadius < blockX + blockWidth && // Left side of circle overlaps right side of block
                circleY + circleRadius > blockY && // Bottom side of circle overlaps top side of block
                circleY - circleRadius < blockY + blockHeight // Top side of circle overlaps bottom side of block
            ) {
                this.handleCircleBlockCollision(circle, block);
            }
        });
    }

    handleCircleBlockCollision(circle, block) {
        circle.destroy();
        block.destroy();

        this.circleArr = this.circleArr.filter((c) => c !== circle);
        this.blocksArr = this.blocksArr.filter((b) => b !== block);

        console.log('Collision detected!');
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
}