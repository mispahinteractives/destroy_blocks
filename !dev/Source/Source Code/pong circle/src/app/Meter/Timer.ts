import { Container, Text, TextStyle, Ticker } from "pixi.js";
import { CommonConfig } from "../../Common/CommonConfig";
import { Game } from "../game";

export class Timer extends Container{
    private level !: Text;
    private timerMeterValue !: Text;
    private betValue: number = 0;
    private gap: number = 5;
    private elapsedTime: number = 0;
    private lastTime: number = 0;
    private totalTiming : number = 30;

    constructor() {
        super();
        this.init();
        this.updateScore();
        this.addToStage();
        Game.the.app.stage.on(CommonConfig.GAME_UPDATE_TICKER, this.update, this);
        Game.the.app.stage.on(CommonConfig.RESET_TIMER, this.resetTimer, this);
    }

    private init(): void {
        const buttonStyle = new TextStyle({
            fill: "#ffffff",
            fontSize: 24,
            fontWeight: "bold"
        });
        const buttonStyle2 = new TextStyle({
            fill: "#ffffff",
            fontSize: 24,
            fontWeight: "bold"
        });
        this.level = new Text({
            text: `Timer : `,
            style: buttonStyle
        });
        this.timerMeterValue = new Text({
            text: `${this.lastTime}`,
            style: buttonStyle2
        })
    }

    private addToStage(): void {
        this.addChild(this.level);
        this.addChild(this.timerMeterValue);
    }

    private updateScore(): void {
        let balance : number = CommonConfig.the.getTimer();
        this.timerMeterValue.text = `${balance}`;
        this.timerMeterValue.x = this.level.x + this.level.width + this.gap;
    }

    resetTimer() :void{
        this.lastTime = 0;
        this.elapsedTime = 0;
        this.updateScore();
    }

    private update(delta: number) {
        if(CommonConfig.the.getGamePaused()) return;
        this.elapsedTime += delta / Ticker.shared.FPS;
        this.lastTime = Number(this.elapsedTime.toFixed(2));
        CommonConfig.the.setTimer(this.lastTime);
        this.updateScore();
        if(this.lastTime <= 0){
            CommonConfig.the.setTimer(0);
            // Game.the.app.stage.emit(CommonConfig.GAME_OVER);
            return
        }
    }
}