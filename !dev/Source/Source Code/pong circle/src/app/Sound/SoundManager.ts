import { Howl } from 'howler';

class SoundManager {
  private static instance: SoundManager;
  private sounds: Record<string, Howl>;
  private isMuted: boolean= false;

  private constructor() {
    this.sounds = {
      gameOverSound: new Howl({
        src: ['./audio/game_over.wav', './audio/game_over.m4a'],
        volume: 1,
        loop: false,
      }),
      ballHitSound: new Howl({
        src: ['./audio/ball_hit.wav', './audio/ball_hit.m4a'],
        volume: 1,
        loop: false,
      }),
    };
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  public play(soundName: string): void {
    if (this.sounds[soundName]) {
      this.sounds[soundName].play();
    } else {
      console.error(`Sound "${soundName}" not found.`);
    }
  }

  public stop(soundName: string): void {
    if (this.sounds[soundName]) {
      this.sounds[soundName].stop();
    } else {
      console.error(`Sound "${soundName}" not found.`);
    }
  }

  public getSound(soundName: string): Howl | undefined {
    return this.sounds[soundName];
  }

  public muteAll(): void {
    this.isMuted = true;
    Howler.mute(true);
  }

  public unmuteAll(): void {
    this.isMuted = false;
    Howler.mute(false);
  }

  public toggleMute(): void {
    this.isMuted = !this.isMuted;
    Howler.mute(this.isMuted);
  }

  public isSoundMuted(): boolean {
    return this.isMuted;
  }
}

export default SoundManager;
