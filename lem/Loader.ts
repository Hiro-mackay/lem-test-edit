import { Texture } from 'pixi.js';
import { Canvas } from './Canvas';
import { Resource, Source } from './types';
import { createSprite, getVideoRecource } from './utiles';

export class Loader {
  // Video Elementを作成し、video pathを読み込ませる
  static loadVideoRef = (pathVideo: string) => {
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.preload = '';
    video.src = pathVideo;

    return video;
  };

  // ファイルからpathを生成する
  static loadVideoPath = (file: File) => URL.createObjectURL(file);

  static loadVideoElement = (file: File) => {
    const path = Loader.loadVideoPath(file);
    const video = Loader.loadVideoRef(path);
    return video;
  };

  static loadVideo = (file: File): Promise<HTMLVideoElement> => {
    const video = Loader.loadVideoElement(file);

    return new Promise((resolve, reject) => {
      video.play().then(() => {
        video.pause();

        console.log('loadVideo', video.currentTime, video.duration);
        resolve(video);
      });
    });
  };

  static loadVideoTexture = (video: HTMLVideoElement) => {
    return Texture.from(video);
  };

  static loadSource = (resource: Resource, canvas: Canvas): Source => {
    if (!resource) {
      return {
        id: -1,
        video: null,
        sprite: null
      };
    }

    const texture = resource.texture;

    const sprite = createSprite(texture, canvas.screen);
    const video = getVideoRecource(sprite.texture);

    return {
      id: resource.id,
      video,
      sprite
    };
  };
}
