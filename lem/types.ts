import * as PIXI from 'pixi.js';

export interface Resource {
  id: number;
  texture: PIXI.Texture;
  file: File;
  inFrame: number;
  outFrame: number;
  deltaTime: number;
}

export type Resources = Array<Resource>;

export interface Source {
  id: number;
  video: HTMLVideoElement;
  sprite: PIXI.Sprite;
}

export interface CanvasEntity {
  currentTime: number;
  viewingTime: number;
  deltaTime: number;
  resources: Resources;
  source: Source;
}

export interface TransformerEntity {
  progress: number;
}

export type Dispatcher<T> = (data: T) => void;
