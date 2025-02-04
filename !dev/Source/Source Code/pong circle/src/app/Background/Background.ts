import { Assets, Container, Graphics, Sprite, Text } from "pixi.js";
import { Game } from "../game";

export class Background extends Container {
    bg !: Sprite;
    private normalRation: number = 1920 / 919;
    private aspectRatioMobile: number = 0;
    private aspectRatio: number = 0;
    constructor() {
        super();
        this.init();
        this.addContainerToStage();
        this.resize();
        Game.the.app.stage.on("RESIZE_THE_APP", this.resize, this);
    }

    private subscribeEvent(): void {

    }

    private init() {
        this.bg = new Sprite(Assets.get("background_desktop"));
        this.aspectRatio = this.bg.height / 1920;
    }

    private resize() :void{
        // let currentScale: number = 1;
        // let assumedHeight: number = window.innerHeight * this.aspectRatio;
        // let assumedWidthMobile: number = window.innerWidth * this.aspectRatioMobile;
        // this.bg.scale.set(0.8);
        // let height = this.bg.height;
        // currentScale = assumedHeight / height;
        // this.bg.scale.set(currentScale);
        // this.bg.position.set((window.innerWidth - this.bg.width) / 2, (window.innerHeight - this.bg.height) / 2 - 30);

        let scaleX: number = 0;
        let scaleY: number = 0;
        this.width = 1080;
        this.height = 1920;
        if (window.innerHeight > window.innerWidth && this) { 
            scaleX = window.innerWidth >= 1080 ? 1 : window.innerWidth / this.width;
            scaleY = window.innerHeight >= 1920 ? 1 : window.innerHeight / this.height;
            this.scale.set(scaleX, scaleY);
        } else {
            scaleX = window.innerWidth >= 1080 ? 1 : window.innerWidth / this.width;
            scaleY = window.innerHeight >= 1920 ? 1 : window.innerHeight / this.height;
            this.scale.set(scaleX);
        }
        this.position.set((window.innerWidth - this.width) / 2, (window.innerHeight - this.height) / 2);
    }

    private addContainerToStage() {
        // let graphics = new Graphics();
        // graphics.fillStyle = 0x141116;
        // graphics.drawRect(0, 0, 1920, 1080);
        // graphics.endFill();
        // this.addChild(graphics);

        this.addChild(this.bg);
    }
}