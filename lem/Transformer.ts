import { createFFmpeg, fetchFile, FFmpeg } from '@ffmpeg/ffmpeg';
import { Canvas } from './Canvas';
import { Dispatcher, TransformerEntity } from './types';
import { getVideoRecource } from './utiles';

interface Entity extends TransformerEntity {
  ffmpeg: FFmpeg;
  canvas: Canvas;
  dispatch: Dispatcher<TransformerEntity>;
  duration: number;
}

export class Transformer implements Entity {
  ffmpeg: FFmpeg;
  canvas: Canvas;
  dispatch: Dispatcher<TransformerEntity>;
  progress: number;
  duration: number;

  constructor(canvas: Canvas) {
    this.ffmpeg = createFFmpeg({
      log: process.env.NODE_ENV === 'development',
      progress: ({ ratio }) => {
        this.progress = ratio;
        this.notifyChanges();
      }
    });
    this.canvas = canvas;
    this.duration = 0;
    this.progress = 0;
    this.dispatch = () => {
      console.warn('Not set Lem Transformer dispatcher');
    };
  }

  attachDispatch(dispatch: Dispatcher<TransformerEntity>) {
    this.dispatch = dispatch;
  }

  DLVideo = (ref: string) => {
    const element = document.createElement('a');
    element.setAttribute('href', ref);
    element.setAttribute('download', ref);

    element.style.display = ' none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  concat = async () => {
    try {
      if (!this.canvas.resources.length) {
        throw new Error('Not set some files');
      }

      await this.ffmpeg.load();

      const inputPath: string[] = [];

      for (const asset of this.canvas.resources) {
        const { name } = asset.file;
        this.ffmpeg.FS('writeFile', name, await fetchFile(asset.file));
        const video = getVideoRecource(asset.texture);
        this.duration += video.duration;
        const fileRef = `file '${name}'`;
        inputPath.push(fileRef);
      }

      console.log('Concat start');

      const cancat = inputPath.join('\n');

      const concatList = new TextEncoder().encode(cancat);

      this.ffmpeg.FS('writeFile', 'concat.txt', concatList);

      await this.ffmpeg.run('-f', 'concat', '-safe', '0', '-i', 'concat.txt', '-c', 'copy', 'output.MOV');
      const data = this.ffmpeg.FS('readFile', 'output.MOV');
      const src = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));

      return src;
    } catch (error) {
      throw error;
    }
  };

  notifyChanges() {
    this.dispatch({ progress: this.progress });
  }
}
