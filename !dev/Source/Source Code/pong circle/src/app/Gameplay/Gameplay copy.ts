// import { Container, Graphics } from "pixi.js";
// import { Game } from "../game";

// export class Gameplay__ extends Container{
//     ball: Graphics;
//     paddle1: Graphics;
//     paddle2: Graphics;
//     ballSpeed: { x: number; y: number };
//     paddleSpeed: number;
//     paddle1Angle: number;
//     paddle2Angle: number;
//     paddleRadius: number;
//     gameRadius: number;

//     constructor() {
//         super();
//         this.gameRadius = 300;
//         this.paddleRadius = 50;

//         // Ball properties
//         this.ball = new Graphics();
//         this.ballSpeed = { x: 3, y: 3 };

//         // Paddles properties
//         this.paddle1 = new Graphics();
//         this.paddle2 = new Graphics();
//         this.paddleSpeed = 0.05;
//         this.paddle1Angle = Math.PI / 2;
//         this.paddle2Angle = -Math.PI / 2;

//         this.init();
//     }

//     init() {
//         // Draw center circle (game boundary)
//         const circle = new Graphics();
//         circle.beginFill(0x8b78ea);
//         circle.drawCircle(window.innerWidth / 2, window.innerHeight / 2, this.gameRadius);
//         circle.endFill();
//         this.addChild(circle);

//         // Draw paddles
//         this.createPaddle(this.paddle1, 0x00ff00, this.paddle1Angle);
//         // this.createPaddle(this.paddle2, 0xff0000, this.paddle2Angle);

//         // Draw ball
//         this.ball.beginFill(0xffffff);
//         this.ball.drawCircle(0, 0, 10);
//         this.ball.endFill();
//         this.ball.x = window.innerWidth / 2;
//         this.ball.y = window.innerHeight / 2;
//         this.addChild(this.ball);

//         // Game loop
//         Game.the.app.ticker.add(() => this.gameLoop());

//         // Keyboard input for paddles
//         window.addEventListener('keydown', this.handleKeyDown.bind(this));
//         window.addEventListener('keyup', this.handleKeyUp.bind(this));
//     }

//     createPaddle(paddle: Graphics, color: number, angle: number) {
//         paddle.beginFill(color);
//         paddle.drawRect(-20, -5, 80, 10); // Paddle shape
//         paddle.endFill();
//         paddle.pivot.set(20, 5);
//         this.updatePaddlePosition(paddle, angle);
//         this.addChild(paddle);
//     }

//     updatePaddlePosition(paddle: Graphics, angle: number) {
//         paddle.x = window.innerWidth / 2 + Math.cos(angle) * this.gameRadius;
//         paddle.y = window.innerHeight / 2 + Math.sin(angle) * this.gameRadius;
//         paddle.rotation = angle + Math.PI / 2;
//     }

//     handleKeyDown(event: KeyboardEvent) {
//         if (event.code === 'ArrowRight') this.paddle1Angle -= this.paddleSpeed;
//         if (event.code === 'ArrowLeft') this.paddle1Angle += this.paddleSpeed;
//         // if (event.code === 'KeyW') this.paddle2Angle -= this.paddleSpeed;
//         // if (event.code === 'KeyS') this.paddle2Angle += this.paddleSpeed;
//     }

//     handleKeyUp(event: KeyboardEvent) {
//         // Optionally handle stop behavior
//     }

//     gameLoop() {
//         // Update paddles
//         this.updatePaddlePosition(this.paddle1, this.paddle1Angle);
//         // this.updatePaddlePosition(this.paddle2, this.paddle2Angle);

//         // Move ball
//         this.ball.x += this.ballSpeed.x;
//         this.ball.y += this.ballSpeed.y;

//         const distanceFromCenter = Math.sqrt(
//             Math.pow(this.ball.x - window.innerWidth / 2, 2) +
//             Math.pow(this.ball.y - window.innerHeight / 2, 2)
//         );

//         if (distanceFromCenter + 10 > this.gameRadius) {
//             this.ballSpeed.x *= -1;
//             this.ballSpeed.y *= -1;
//         }

//         // Ball collision with paddles (simplified)
//         this.checkPaddleCollision(this.paddle1);
//         this.checkPaddleCollision(this.paddle2);
//     }

//     checkPaddleCollision(paddle: Graphics) {
//         const dx = this.ball.x - paddle.x;
//         const dy = this.ball.y - paddle.y;
//         const distance = Math.sqrt(dx * dx + dy * dy);

//         if (distance < 15) {
//             this.ballSpeed.x *= -1;
//             this.ballSpeed.y *= -1;
//         }
//     }
// }

