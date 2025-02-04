import { ILevelConfiguration } from "@/app/DataInterface/InitialDataInterface";
import { Game } from "@/app/game";

export class CommonConfig {
  protected static _the: CommonConfig;

  //----Event---
  public static UPDATE_GAME_SCORE: string = "updateGameScore";
  public static GAME_OVER: string = "gameOver";
  public static GAME_UPDATE_TICKER: string = "updateTicker";
  public static RESET_TIMER: string = "RESET_TIMER";
  public static RESET_BUTTON: string = "RESET_BUTTON";
  public static FETCH_GAME_INITIAL_RESPONSE: string ="FETCH_GAME_INITIAL_RESPONSE";
  public static UPDATE_GAME_LEVEL_DATA: string = "UPDATE_GAME_LEVEL_DATA";
  public static UPDATE_DATA_ON_GAME_OVER: string = "UPDATE_DATA_ON_GAME_OVER";
  public static ENABLE_PLAY_AGAIN_BUTTON: string = "ENABLE_PLAY_AGAIN_BUTTON";
  public static NAV_BUTTON_CLICKED : string = "NAV_BUTTON_CLICKED";
  public static PLAY_TUTORIAL : string = "PLAY_TUTORIAL";
  public static HIDE_TUTORIAL :string = "HIDE_TUTORIAL";
  public static START_GAME : string = "START_GAME";
  public static STOP_GAME : string = "STOP_GAME";
  public static HIDE_LOADING_SCREEN : string = "HIDE_LOADING_SCREEN";
  public static UPDATE_SCORE_POSITION : string = "UPDATE_SCORE_POSITION";
  public static RESTART_GAME : string = "RESTART_GAME";
  public static SHOW_GAME_OVER_POPUP : string = "SHOW_GAME_OVER_POPUP";

  public static TUTORIAL_LEFT_CLICK : string = "TUTORIAL_LEFT_CLICK";
  public static TUTORIAL_LEFT_CLICK_UP : string = "TUTORIAL_LEFT_CLICK_UP";
  public static TUTORIAL_RIGHT_CLICK : string = "TUTORIAL_RIGHT_CLICK";
  public static TUTORIAL_RIGHT_CLICK_UP : string = "TUTORIAL_RIGHT_CLICK_UP";


  //Text-string
  public static TUTORIAL_TEXT_LEFT : string = "Tap the left arrow button to move the platform counter-clockwise";
  public static TUTORIAL_TEXT_RIGHT : string = "Tap the right arrow button to move the platform clockwise";
  public static TUTORIAL_CENTER_RIGHT : string = "Move the board along the circle to catch the pong ball. The game will end when the ball leaves the circle";
  public static GAME_OVER_TEXT: string = "Oops! Game Over";
  public static PLAY_AGAIN_TEXT: string = "Play Again";
  public static COngratulation_TEXT: string = "Congratulation! Play Next Level";
  public static TUTORIAL_LEFT_STATE :string = "tutorialLeftState";
  public static TUTORIAL_RIGHT_STATE :string = "tutorialRightState";
  public static TUTORIAL_GAMEOVER_STATE :string = "tutorialGameOverState";

  //---------------Path---------
  public static BASE_URL: string = "https://datacanvas.parentof.com/";
  public static GENERATE_PAYLOAD_PATH: string = "generatePayload";
  public static INSERT_DATA_PATH: string = "submit";
  public static UPDATE_DATA_PATH: string = "updateData";
  public static TEMPLATE_ID: string = "67612f792b3b310dfb3bca66";

  private timer: number = 0;

  static get the(): CommonConfig {
    if (!CommonConfig._the) {
      CommonConfig._the = new CommonConfig();
    }

    return CommonConfig._the;
  }

  private currentScore: number = 0;
  private isGamePaused: boolean = false;
  private currentLevel: number = 1;
  private isNextLevel: boolean = false;
  private insertedId: string = "";
  private fastestSpeed: number = 1;
  private _gameConfiguration : ILevelConfiguration[] = [];
  private _currentSpeed : number = 1;
  private _isButtonLoop : boolean = false;
  private _currentBtn : string = "";
  private _isTutorialState : boolean = false;
  private _isGamePauseForTutorialState : boolean = false;
  private _currentTutorialState : string = "";


  constructor() {
    if (CommonConfig._the == null) CommonConfig._the = this;
  }

  public setCurrentTutorialState(value : string) :void{
    this._currentTutorialState = value;
  }

  public getCurrentTutorialState() : string{
    return this._currentTutorialState;
  }

  public setGamePauseForTutorialState(value : boolean) :void{
    this._isGamePauseForTutorialState = value;
  }

  public getGamePauseForTutorialState() : boolean{
    return this._isGamePauseForTutorialState;
  }

  public setTutorialState(value : boolean) :void{
    this._isTutorialState = value;
  }

  public getTutorialState() : boolean{
    return this._isTutorialState;
  }

  public setIsButtonLoop(value : boolean) :void{
    this._isButtonLoop = value;
  }

  public getIsButtonLoop() : boolean{
    return this._isButtonLoop;
  }

  public setCurrentBtn(value : string) :void{
    this._currentBtn = value;
  }

  public getCurrentBtn() :string{
    return this._currentBtn;
  }

  public getCurrentSpeed() : number{
    return this._currentSpeed;
  }

  public setCurrentSpeed(value : number) : void{
    this._currentSpeed = value;
  }

  public getGameConfiguration(): ILevelConfiguration[] {
    return this._gameConfiguration;
  }

  public setGameConfiguration(value: ILevelConfiguration[]): void {
    this._gameConfiguration = value;
  }

  public getInsertedId(): string {
    return this.insertedId;
  }

  public setInsertedId(value: string): void {
    this.insertedId = value;
  }

  public getFastestSpeed(): number {
    return this.fastestSpeed;
  }

  public setFastestSpeed(value: number): void {
    this.fastestSpeed = value;
  }

  public getIsNextLevel(): boolean {
    return this.isNextLevel;
  }

  public setIsNextLevel(value: boolean): void {
    this.isNextLevel = value;
  }

  public getGamePaused(): boolean {
    return this.isGamePaused;
  }

  public setGamePaused(value: boolean): void {
    this.isGamePaused = value;
  }

  public getGameScore(): number {
    return this.currentScore;
  }

  public setGameScore(value: number): void {
    this.currentScore = value;
    Game.the.app.stage.emit(CommonConfig.UPDATE_GAME_SCORE);
  }

  public getGameLevel(): number {
    return this.currentLevel;
  }

  public setGameLevel(value: number): void {
    this.currentLevel = value;
  }

  public setTimer(value: number): void {
    this.timer = value;
  }

  public getTimer(): number {
    return this.timer;
  }
}
