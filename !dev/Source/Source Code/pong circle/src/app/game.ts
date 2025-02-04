// Game.ts
import { Application, Assets, Container} from 'pixi.js';
import { CommonConfig } from '../Common/CommonConfig';
import { StateManagement } from './State/StateManagement';
import { APICalls } from './API/APICall';
import { LoadingScreen } from './Loading/LoadingScreen';
import { Background } from './Background/Background';
export class Game {
  protected static _the: Game;
  public app: Application;
  private gameContainer!: Container;
  private isLocaltesting: boolean = false;
  private loading !: LoadingScreen;

  static get the(): Game {
    if (!Game._the) {
      Game._the = new Game();
    }

    return Game._the;
  }

  constructor() {
    if (Game._the == null) Game._the = this;

    this.app = new Application();
    this.init();
  }

  async init(): Promise<void> {
    await this.app.init();
    const pixiContainer = document.getElementById('pixi-container');
    if (pixiContainer) {
      pixiContainer.appendChild(this.app.canvas);
    }
    this.app.resize = this.resize.bind(this);
    this.gameContainer = new Container();
    this.app.stage.addChild(this.gameContainer);
    (globalThis as any).__PIXI_APP__ = this.app;

    this.loadAssetsAndInitialize();
    this.resize();
    window.onresize = this.resize.bind(this);

    // const font1 = new FontFace('Showcard_gothic', 'url(./Font/Showcard_gothic.ttf)');
    // const font2 = new FontFace('Bauhaus', 'url(./Font/Bauhaus.ttf)');

    // Promise.all([font1.load(),font2.load()]).then((loadedFonts) => {
    //   // @ts-ignore: Suppress TypeScript error for add method
    //   loadedFonts.forEach(font => document.fonts.add(font));
    
    // })

    
  }

  private async initLoading(){
    Game.the.app.stage.on(CommonConfig.HIDE_LOADING_SCREEN, this.onLoadComplete, this);
    await Assets.init({ manifest: "./manifest.json" });
    await Assets.loadBundle([
      "loading-assets"
    ]);
    this.initLoadingObj();
    this.loading.playLogoSpine();
    this.loadImages();
  }

  private initLoadingObj() :void{
    this.loading = new LoadingScreen();
    this.app.stage.addChild(this.loading);
  }

  private async loadImages() {
    await Assets.loadBundle([
      "font-assets",
      "background-assets",
      "ui-assets",
      "tutorial-assets"
    ],(data)=>{
      console.log(data);
      this.loading.loadingAnimation(data);
    });
    // this.loading.visible = false;
    // this.onLoadComplete();
  }

  isIOS(): boolean {
    const audio = document.createElement('audio');
    return audio.canPlayType('audio/ogg; codecs="vorbis"') === '';
    return false
  }



  private loadAssetsAndInitialize() {
    new CommonConfig();
    this.initLoading();
  }



  private onLoadComplete() {
    this.app.stage.addChild(new StateManagement());
    this.app.stage.addChild(new APICalls());
  }




  resize() {
    this.app.stage.emit("RESIZE_THE_APP");
    this.app.renderer.resize(window.innerWidth, window.innerHeight);
  }


}
