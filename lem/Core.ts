import * as PIXI from 'pixi.js';
import { CanvasEntity, Dispatcher } from './types';
import { Loader } from './Loader';
import { Canvas } from './Canvas';
import { createVideoTexture } from './utiles';
import { Player } from './Player';
import { Transformer } from './Transformer';

export interface Lem {
  app: PIXI.Application;
  canvas: Canvas;
  Player: Player;
  Transformer: Transformer;
}

export class Lem {
  private notifyChanges = () => {
    this.canvas.notifyChanges();
  };

  constructor() {
    this.app = null;
    this.canvas = new Canvas();
    this.Player = new Player(this.canvas, this.update);
    this.Transformer = new Transformer(this.canvas);
  }

  attachApp = (ref: HTMLCanvasElement) => {
    this.app = new PIXI.Application({ view: ref });
    this.canvas.setScreen(this.app.screen);
  };

  attachDispatch = (dispatcher: Dispatcher<CanvasEntity>) => {
    this.canvas.attachDispatch(dispatcher);
  };

  loadAsset = async (file: File) => {
    if (!file) return;
    const video = await Loader.loadVideo(file);
    const texture = createVideoTexture(video);
    const resource = this.canvas.createResource(texture, file);

    this.canvas.addResources(resource);
    this.canvas.load();

    this.render();

    this.notifyChanges();
  };

  render() {
    if (!this.canvas.source.sprite) return;
    this.app.stage.addChild(this.canvas.source.sprite);
  }

  update = () => {
    this.render();
    this.notifyChanges();
  };

  play = () => {
    this.Player.play();
  };

  pause = () => {
    this.Player.pause();
  };

  stop = () => {
    this.Player.stop();
    this.render();
  };
}
