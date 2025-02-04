import { Assets, Container, Graphics, Sprite, TextStyle ,Text} from "pixi.js";
import { Game } from "../game";
import gsap from "gsap";
import { CommonConfig } from "@/Common/CommonConfig";


export class LoadingScreen extends Container {
    private bgGraphics !: Sprite;
    private loadingFillContainer !: Container;
    private maskContainer !: Graphics;
    private loaderBg !: Sprite;
    private loaderfilled !: Sprite;
    private logo !: Sprite; 
    private totalDistance : number = 540;   
    private lastData : number = 0;
    private aspectRatio : number = 1;
    private aspectRatioBG : number = 1;
    private highScore !: Text;
    private loadingBtn !: Sprite;
    // private loadingFillContainer


    constructor() {
        super();
        this.init();
        this.resize();
        Game.the.app.stage.on("RESIZE_THE_APP", this.resize, this);
        this.loadingBtn.on('pointerup', this.onButtonUp, this);
    }

    private init(): void {
        this.bgGraphics = new Sprite(Assets.get("loading_background"));
        this.addChild(this.bgGraphics) ;
        this.aspectRatioBG = this.bgGraphics.height / 1920;

        this.loadingFillContainer = new Container();
        this.addChild(this.loadingFillContainer);
        
        this.loaderBg = new Sprite(Assets.get("loading_bar_unfilled"));
        this.loadingFillContainer.addChild(this.loaderBg);
        this.loaderBg.scale.set(1,1.2);

        this.loaderfilled = new Sprite(Assets.get("loading_bar_filled"));
        this.loadingFillContainer.addChild(this.loaderfilled);
        this.loaderfilled.scale.set(1.42,1)
        this.loaderfilled.position.set(24,34.5)

        // this.loaderfilled.position.set((this.loaderBg.width - this.loaderfilled.width)/2,(this.loaderBg.height - this.loaderfilled.height)/2)

        this.maskContainer = new Graphics()
                             .rect(this.loaderfilled.x, this.loaderfilled.y, this.loaderfilled.width, this.loaderfilled.height)
                             .fill(0x00ff00);
        this.loadingFillContainer.addChild(this.maskContainer);

        this.loaderfilled.mask = this.maskContainer;
        this.maskContainer.x = -540;
        if(window.innerWidth < window.innerHeight){
            this.loadingFillContainer.scale.set(0.45,0.4);
            let width = this.loadingFillContainer.width;
            this.aspectRatio = width / 360;
        }else{
            this.loadingFillContainer.scale.set(1,0.98);
            let width = this.loadingFillContainer.width;
            this.aspectRatio = width / 1920;
        }

        this.loadingBtn = new Sprite(Assets.get("play_button"));
        this.addChild(this.loadingBtn);
        this.loadingBtn.alpha = 0;
        this.loadingBtn.interactive = false;
        // this.loadingAnimation();

    }

    playLogoSpine() :void{
       this.logo = new Sprite(Assets.get("game_logo"));
       this.addChild(this.logo);
       this.logo.position.set(0.3);

       const buttonStyle2 = new TextStyle({
                   fontFamily: 'Bauhaus',
                   fill: "#ffffff",
                   fontSize: 48,
        });
        this.highScore = new Text({
                   text: `Best Score: ${localStorage.getItem("HighScore")?localStorage.getItem("HighScore"):0}`,
                   style: buttonStyle2
            });
        
        // this.addChild(this.highScore);
        this.logo?.position.set((window.innerWidth - this.logo.width)/2, (window.innerHeight - this.logo.height) * 0.35);
        // this.loadingBtn?.position.set(this.logo.x + (this.logo.width - this.loadingBtn.width)/2, (this.logo.y + this.logo.height));
    }

    private hideLoadingAndShowBtn() :void{
        gsap.to(this.loadingFillContainer,{
            alpha : 0,
            duration : 0.5,
            ease : "power4.in",
            onComplete :()=>{
                this.loadingBtn.alpha = 1;
                this.loadingBtn.interactive = true;
            }
        })
    }

    private resize() :void{
        let width = this.loadingFillContainer.width * this.aspectRatio;
        let scale = width / 500;
        this.loadingFillContainer.scale.set(scale);
        this.loadingFillContainer.position.set((window.innerWidth - this.loadingFillContainer.width)/2,(window.innerHeight - this.loadingFillContainer.height)*0.7);
        this.logo?.position.set((window.innerWidth - this.logo.width)/2, (window.innerHeight - this.logo.height) * 0.5);
        this.loadingBtn?.scale.set(scale);
        this.loadingBtn?.position.set(this.loadingFillContainer?.x + (this.loadingFillContainer?.width - this.loadingBtn?.width)/2, (this.loadingFillContainer?.y));

        let currentScale: number = 1;
        let assumedHeight: number = window.innerHeight * this.aspectRatioBG;
        this.bgGraphics.scale.set(0.8);
        let height = this.bgGraphics.height;
        currentScale = assumedHeight / height;
        this.bgGraphics.scale.set(currentScale);
        this.bgGraphics.position.set((window.innerWidth - this.bgGraphics.width) / 2, (window.innerHeight - this.bgGraphics.height) / 2 - 30);
    }

    public loadingAnimation(data:number) :void{ 
        if(data === 1){
            this.hideLoadingAndShowBtn();
            // this.interactive = true;
        }else{
            data = Number((data).toFixed(1));
        }
        const difference = Number((data - this.lastData).toFixed(1));
        this.lastData = data;
        const factor : number = (difference/1) * this.totalDistance ;      
        this.maskContainer.x += factor;
        // console.log(this.maskContainer.x);
    }

    private onButtonUp() :void{
        gsap.to(this, {
            alpha : 0,
            duration: 1,
            ease: "power1.inOut", 
            onComplete : ()=>{
                Game.the.app.stage.emit(CommonConfig.HIDE_LOADING_SCREEN);
                this.interactive = false;
                this.loadingBtn.interactive = false;
                this.visible = false;
            }
        });
    }

    // public hideLoadingScreen() :void{

    // }
}