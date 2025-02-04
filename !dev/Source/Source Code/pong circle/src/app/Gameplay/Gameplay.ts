import {
  Assets,
  Container,
  Graphics,
  Sprite,
  Spritesheet,
  Ticker,
} from "pixi.js";
import { Game } from "../game";
import { CommonConfig } from "@/Common/CommonConfig";
import gsap from "gsap";
import { GameScore } from "../Meter/GameScore";
import SoundManager from "../Sound/SoundManager";

export class Gameplay extends Container {
  private ballSpeed: { x: number; y: number };
  private paddleSpeed: number;
  private paddle1Angle: number;
  private gameRadius: number;
  private isGameOver: boolean;
  private soundManager !: SoundManager;
  // gameOverText!: Sprite;
  // private playAgainButton!: Sprite;
  private isChecking: boolean = false;
  private totalTime: number = 60;
  private pongCircle!: Sprite;
  private paddle!: Sprite;
  private paddleContainer!: Container;
  private paddleParentContainer!: Container;
  private texture!: Spritesheet;
  private ball!: Sprite;
  private gameScore!: GameScore;
  private ticker!: Ticker;
  private firstClick : number = 0;
  private tutorialState : string = "";
  private lastTutorialState : string = "";
  private isLeftClick : boolean = false;
  private isRightClick : boolean = false;

  constructor() {
    super();
    this.texture = Assets.get("ui_assets");
    this.gameRadius = 180;
    this.isGameOver = false;
    this.ballSpeed = { x: 1, y: 1 };
    this.paddleSpeed = 0.05;
    this.paddle1Angle = Math.PI / 2;
    this.init();
    this.setToPosition();
    this.subscribeEvent();
  }

  private init() {
    CommonConfig.the.setIsButtonLoop(false);
    CommonConfig.the.setCurrentBtn("");
    this.pongCircle = new Sprite(Assets.get("circle_new"));
    this.addChild(this.pongCircle);
    this.pongCircle.scale.set(0.5);
    this.pongCircle.anchor.set(0.5);
    this.createPaddle(this.paddle1Angle);
    this.initGameScore();
    this.addChild(this.gameScore);
    this.ball = new Sprite(Assets.get("ball_assets"));
    this.ball.scale.set(0.25);
    this.ball.anchor.set(0.5);
    this.ball.x = 0;
    this.ball.y = 0;
    this.addChild(this.ball);
    CommonConfig.the.setGamePaused(true);
    this.soundManager = SoundManager.getInstance();
    Game.the.app.stage.on(CommonConfig.START_GAME,this.startGame,this);
    CommonConfig.the.setGamePauseForTutorialState(true);
  }

  private subscribeEvent() :void{
    Game.the.app.ticker.add(() => this.gameLoop(Game.the.app.ticker.deltaTime));
    window.addEventListener("keydown", this.handleKeyDown.bind(this));
    window.addEventListener("keyup", this.handleKeyUP.bind(this));
    Game.the.app.stage.on(CommonConfig.RESTART_GAME, this.restartGame, this);
  }

  private startGame() :void{
    // if(CommonConfig.the.getGamePauseForTutorialState()){
    //   this.resumeGameForTutorialState();
    //   return;
    // }
    this.tutorialState = CommonConfig.the.getCurrentTutorialState();
    this.lastTutorialState = CommonConfig.the.getCurrentTutorialState();
    CommonConfig.the.setGamePaused(false);
    CommonConfig.the.setGamePauseForTutorialState(false);
  }

  private initGameScore() {
    this.gameScore = new GameScore();
  }

  private setToPosition() :void{
    this.gameScore.position.set(this.x + ( - this.gameScore.width)/2, this.y + ( - this.gameScore.height)/2);
  }

  createPaddle(angle: number) {
    this.paddleParentContainer = new Container();
    this.addChild(this.paddleParentContainer);
    this.paddleContainer = new Container();
    this.paddle = new Sprite(Assets.get("arc_new"));
    this.paddle.scale.set(0.6,0.6);
    this.paddle.angle = 90.5;
    this.paddle.anchor.set(0.5);
    this.paddleContainer.addChild(this.paddle);
    this.paddleParentContainer.addChild(this.paddleContainer);
    this.paddleContainer.pivot.set(-this.paddleContainer.width, 0);
    this.updatePaddlePosition(angle);
  }

  updatePaddlePosition(angle: number) {
    this.paddleContainer.position.set(
      Math.cos(angle) * (this.gameRadius - this.paddle.height * 1.4),
      Math.sin(angle) * (this.gameRadius - this.paddle.height * 1.4)
    );
    this.paddleContainer.rotation = angle;
  }

  private tutorialLeft() :void{
    CommonConfig.the.setTutorialState(true);
    this.tutorialState = "tutorialRightState";
    this.lastTutorialState = "tutorialRightState";
  }

  private handleKeyDown(event: KeyboardEvent) {
    if(CommonConfig.the.getTutorialState()){
      return
  }
    if(CommonConfig.the.getGamePaused()){
      return;
    }  
    CommonConfig.the.setIsButtonLoop(true);
    CommonConfig.the.setCurrentBtn(event.code);
  }

  private handleKeyUP(event: KeyboardEvent) {
    if(CommonConfig.the.getTutorialState()){
      return
  }
   if(CommonConfig.the.getGamePaused()){
      return;
    }  
    CommonConfig.the.setIsButtonLoop(false);
    CommonConfig.the.setCurrentBtn("");
  }

  private handleKeyDownFromButton(): void {
    if (!CommonConfig.the.getIsButtonLoop()) {
      return;
    }
    if (CommonConfig.the.getIsButtonLoop()) {
      if (CommonConfig.the.getCurrentBtn() === "ArrowLeft") {
        this.paddle1Angle += this.paddleSpeed;
      } else if (CommonConfig.the.getCurrentBtn() === "ArrowRight") {
        this.paddle1Angle -= this.paddleSpeed;
      }
    }
  }

  private rightPaddleTutorialClick() :void{
    if((this.paddleContainer.x > 107 && this.paddleContainer.x < 109) && (this.paddleContainer.y > 93 && this.paddleContainer.y < 95)){
      this.tutorialState = "";
      // CommonConfig.the.setTutorialState(false)
      return;
    }
    this.paddle1Angle -= this.paddleSpeed;
  }

  private leftPaddleTutorialClick() :void{
    if((this.paddleContainer.x < -96 && this.paddleContainer.x > -98) && (this.paddleContainer.y < -105 && this.paddleContainer.y > -107)){
      this.tutorialState = "";
      // CommonConfig.the.setTutorialState(false);
      return;
    }
    this.paddle1Angle += this.paddleSpeed;
  }

  private resumeGameForTutorialState() :void{
    CommonConfig.the.setGamePauseForTutorialState(false);
  }

  private gameLoop(delta: number) {
    if(CommonConfig.the.getGamePauseForTutorialState()){
      return;
    }
    if (this.isGameOver) return;

    !CommonConfig.the.getTutorialState() && this.handleKeyDownFromButton();
    if(this.tutorialState === CommonConfig.TUTORIAL_RIGHT_STATE){
      Game.the.app.stage.emit(CommonConfig.TUTORIAL_RIGHT_CLICK);
      this.rightPaddleTutorialClick();
    }else if(this.tutorialState === CommonConfig.TUTORIAL_LEFT_STATE){
      Game.the.app.stage.emit(CommonConfig.TUTORIAL_LEFT_CLICK);
      this.leftPaddleTutorialClick();
    }
    // Update paddles
    this.updatePaddlePosition(this.paddle1Angle);

    // Move ball
    this.ball.x += this.ballSpeed.x;
    this.ball.y += this.ballSpeed.y;

    // Calculate distance of ball from the center of the circle
    const distanceFromCenter = Math.sqrt(
      Math.pow(this.ball.x, 2) + Math.pow(this.ball.y, 2)
    );
    if (distanceFromCenter > this.gameRadius + this.ball.width) {
      if(CommonConfig.the.getTutorialState()){
        CommonConfig.the.setGamePauseForTutorialState(false);
        // CommonConfig.the.setTutorialState(false)
        this.tutorialState = "";
        CommonConfig.the.setCurrentTutorialState(this.tutorialState);
        Game.the.app.stage.emit(CommonConfig.HIDE_TUTORIAL);
      }
      this.triggerGameOver();
    }
    // Ball is at or beyond the border
    if (distanceFromCenter >= this.gameRadius - this.ball.width * 0.52) {
      if (!this.isChecking) {
        this.isChecking = true;

        // Check collision with paddle
        if (this.checkPaddleCollision()) {
          if(CommonConfig.the.getTutorialState()){
            Game.the.app.stage.emit(CommonConfig.RESET_BUTTON);
            // Game.the.app.stage.emit(CommonConfig.PLAY_TUTORIAL);
            if(this.lastTutorialState === CommonConfig.TUTORIAL_RIGHT_STATE){
              this.tutorialState = CommonConfig.TUTORIAL_LEFT_STATE;
              this.lastTutorialState = CommonConfig.TUTORIAL_LEFT_STATE;
              CommonConfig.the.setCurrentTutorialState(this.tutorialState);
              Game.the.app.stage.emit(CommonConfig.PLAY_TUTORIAL);
              CommonConfig.the.setGamePauseForTutorialState(true);
            }else if(this.lastTutorialState === CommonConfig.TUTORIAL_LEFT_STATE){
              CommonConfig.the.setGamePauseForTutorialState(true);
              this.tutorialState = CommonConfig.TUTORIAL_GAMEOVER_STATE;
              this.lastTutorialState = CommonConfig.TUTORIAL_GAMEOVER_STATE;
              CommonConfig.the.setCurrentTutorialState(this.tutorialState);
              Game.the.app.stage.emit(CommonConfig.PLAY_TUTORIAL);
            }        
          }
          CommonConfig.the.setGameScore(CommonConfig.the.getGameScore() + 1);
          this.playBallHitSound();
          // Adjust bounce based on paddle collision
          const normalX = this.ball.x / distanceFromCenter;
          const normalY = this.ball.y / distanceFromCenter;

          const paddleCenterX = this.paddleContainer.x;
          const paddleCenterY = this.paddleContainer.y;

          // Calculate offset from paddle center
          const offsetX = this.ball.x - paddleCenterX;
          const deflection = offsetX / this.paddleContainer.width; // Normalized deflection (-1 to 1)

          this.ballSpeed.x += deflection * 1; // Adjust speed vector based on deflection

          // Reflect the ball speed using the normal
          const dotProduct =
            this.ballSpeed.x * normalX + this.ballSpeed.y * normalY;
          this.ballSpeed.x -= 2 * dotProduct * normalX;
          this.ballSpeed.y -= 2 * dotProduct * normalY;

          // Normalize speed to maintain consistent magnitude
          const speedMagnitude = Math.sqrt(
            Math.pow(this.ballSpeed.x, 2) + Math.pow(this.ballSpeed.y, 2)
          );
          const normalizedSpeed = CommonConfig.the.getCurrentSpeed() *  1.2; // Desired speed magnitude
          this.ballSpeed.x =
            (this.ballSpeed.x / speedMagnitude) * normalizedSpeed;
          this.ballSpeed.y =
            (this.ballSpeed.y / speedMagnitude) * normalizedSpeed;
        } else {
          // No collision - Game over
        }
      }
    } else {
      this.isChecking = false;
    }
    Game.the.app.stage.emit(CommonConfig.GAME_UPDATE_TICKER, delta);
  }
 
  checkPaddleCollision(): boolean {
    const bounds1 = this.ball.getBounds();
    const bounds2 = this.paddleContainer.getBounds();
    return (
      bounds1.x < bounds2.x + (bounds2.width * 0.8) &&
      bounds1.x + (bounds1.width * 1) > bounds2.x &&
      bounds1.y < bounds2.y + bounds2.height &&
      bounds1.y + bounds1.height > bounds2.y
    );
  }

  private playBallHitSound() :void{
    this.soundManager.play('ballHitSound');
  }

  private playGameOverSound() :void{
    this.soundManager.play('gameOverSound');
  }

  triggerGameOver() {
    // CommonConfig.the.setTutorialState(false);
    Game.the.app.stage.emit(CommonConfig.RESET_BUTTON);
    gsap.to(this.ball, {
      alpha : 0,
      duration: 0.2,
      ease: "power1.inOut", // Smooth animation easing
    });
    this.playGameOverSound();
    CommonConfig.the.setGamePaused(true);
    this.isGameOver = true;
    Game.the.app.stage.emit(CommonConfig.SHOW_GAME_OVER_POPUP);
    Game.the.app.stage.emit(CommonConfig.UPDATE_GAME_LEVEL_DATA);
  }

  private restartGame() {
    // Reset game state
    this.resetDataOnGameOver();
    this.paddle1Angle = Math.PI / 2;
    this.updatePaddlePosition(this.paddle1Angle);
    Game.the.app.stage.emit(CommonConfig.RESET_TIMER);
    this.ball.x = 0;
    this.ball.y = 0;
    this.ball.alpha = 1;
    this.ballSpeed = { x: 1, y: 1 };
    gsap.delayedCall(1.5,()=>{
      this.isGameOver = false;
    })
  }

  private resetDataOnGameOver(): void {
    CommonConfig.the.setGameScore(0);
    CommonConfig.the.setGamePaused(false);
    CommonConfig.the.setGameScore(0);
    CommonConfig.the.setGameLevel(1);
    CommonConfig.the.setCurrentSpeed(1);
    CommonConfig.the.setFastestSpeed(1);
    CommonConfig.the.setIsNextLevel(false);
    CommonConfig.the.setTimer(0);
    CommonConfig.the.setIsButtonLoop(false);
    CommonConfig.the.setCurrentBtn("");
  }
}
