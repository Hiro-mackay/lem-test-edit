import { Canvas } from './Canvas';
import { getVideoCurrentTime } from './utiles';

interface Entity {
  canvas: Canvas;
  isComplaed: boolean;
  paused: boolean;
  updater: () => void;
}

export class Player implements Entity {
  canvas: Canvas;
  isComplaed: boolean;
  paused: boolean;
  updater: () => void;

  private complaed() {
    this.isComplaed = false;

    if (!this.canvas.source.video.paused) {
      return;
    }

    this.updateSource();
  }

  private _play() {
    this.paused = false;
    this.isComplaed = false;
    this.canvas.source.video.play();
  }

  private _pause() {
    this.paused = true;
    this.canvas.source.video.pause();
  }

  private updateSource() {
    this.canvas.addDeltaTime(getVideoCurrentTime(this.canvas.source.video));

    const comp = this.canvas.next();

    if (!comp) {
      this.isComplaed = true;
      this.paused = true;
      return;
    }
    this.canvas.resetSource();
    this._play();
  }

  private updateCurrentTime() {
    this.canvas.updateCurrentTime(this.canvas.deltaTime + getVideoCurrentTime(this.canvas.source.video));
  }

  constructor(canvas: Canvas, updater: () => void) {
    this.paused = false;
    this.isComplaed = false;
    this.canvas = canvas;
    this.updater = updater;
  }

  loop() {
    if (this.paused) return;
    this.update();
    requestAnimationFrame(() => this.loop());
  }

  update = () => {
    this.updateCurrentTime();

    this.complaed();

    if (this.isComplaed) return;

    this.updater();
  };

  play = () => {
    if (this.isComplaed) {
      this.canvas.reset();
    }

    this._play();
    this.loop();
  };

  pause = () => {
    this._pause();
  };

  stop = () => {
    this.paused = true;
    this.canvas.reset();
    this;
  };
}
