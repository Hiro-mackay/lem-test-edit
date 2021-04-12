import { Texture } from '@pixi/core';
import { Loader } from './Loader';
import { CanvasEntity, Dispatcher, Resource, Resources, Source } from './types';
import { getVideoRecource, getVideoDuration, getDeltaStart, getDeltaEnd } from './utiles';

export interface Canvas extends CanvasEntity {
  id: number;
  screen: {
    width: number;
    height: number;
  };
  dispatch: Dispatcher<CanvasEntity>;
}

export class Canvas {
  private generateID = () => this.id++;

  private getViewTime = () => this.resources.reduce((c, resource) => c + resource.outFrame, 0);

  private findResouceIndex = (time: number) =>
    this.resources.findIndex((resource) => getDeltaStart(resource) <= time && time < getDeltaEnd(resource));

  private _load = (currentTime: number) => {
    const index = this.findResouceIndex(currentTime);
    if (index === -1) return null;
    const resource = this.resources[index];
    const source = Loader.loadSource(resource, this);
    return source;
  };

  private _update(texture: Texture, deltaTime: number) {
    const video = getVideoRecource(texture);
    video.currentTime = deltaTime;
    video.onseeked = () => {
      texture.baseTexture.update();
    };
  }

  private resetResourceRender() {
    this.resources.forEach((resource) => {
      this._update(resource.texture, 0);
    });
  }

  private _showCurrenttimeSource(deltaTime: number) {
    this._update(this.source.sprite.texture, deltaTime);
  }

  private showFirstSource() {
    const source = this._load(0);
    this.setSource(source);
  }

  private _setResources(resources: Resource[]) {
    this.resources = [...resources];
    this.notifyChanges();
  }

  private pauseVideo(video: HTMLVideoElement) {
    video.pause();
  }

  private resetTime() {
    this.deltaTime = 0;
    this.currentTime = 0;
    this.notifyChanges();
  }

  private _resloadResources(resources: Resources) {
    const res = [];
    resources.reduce((delta, resource) => {
      res.push({
        ...resource,
        deltaTime: delta
      });
      return delta + resource.outFrame;
    }, 0);

    return res;
  }

  constructor() {
    this.id = 0;
    this.currentTime = 0;
    this.deltaTime = 0;
    this.viewingTime = 0;
    this.resources = [];
    this.source = Loader.loadSource(null, this);
    this.dispatch = (data: CanvasEntity) => {
      console.warn('Not set Lem Canvas dispatcher');
    };
    this.screen = {
      width: 980,
      height: 700
    };
  }

  attachDispatch(dispatch: Dispatcher<CanvasEntity>) {
    this.dispatch = dispatch;
  }

  addViewingTime(time: number) {
    this.viewingTime += time;
    this.notifyChanges();
  }

  addDeltaTime(time: number) {
    this.deltaTime += time;
  }

  addResources(resource: Resource) {
    const video = getVideoRecource(resource.texture);
    const duration = getVideoDuration(video);

    this.addViewingTime(duration);
    this._setResources([...this.resources, resource]);

    console.log('viewing time', this.viewingTime);
  }

  setResources(resources: Resource[]) {
    this._setResources(resources);
  }

  setScreen({ width, height }) {
    this.screen.width = width;
    this.screen.height = height;
  }

  setSource(source: Source) {
    this.pauseVideo(source.video);
    this.source = { ...source };
    this.notifyChanges();
  }

  reloadResources(resources: Resources) {
    const newResources = this._resloadResources(resources);
    this.setResources(newResources);
    this.load();
  }

  createResource(texture: Texture, file: File): Resource {
    const video = getVideoRecource(texture);

    const id = this.generateID();
    const inFrame = 0;
    const outFrame = getVideoDuration(video);
    const deltaTime = this.getViewTime();

    return {
      id,
      texture,
      file,
      inFrame,
      outFrame,
      deltaTime
    };
  }

  showCurrentTimeSource() {
    this.resetResourceRender();
    const deltaTime = this.currentTime - this.deltaTime;
    this._showCurrenttimeSource(deltaTime);
  }

  resetSource() {
    this._update(this.source.sprite.texture, 0);
  }

  resetResource(resource: Resource) {
    this._update(resource.texture, 0);
  }

  updateCurrentTime(time: number) {
    this.currentTime = time;
  }

  reset() {
    this.resetResourceRender();
    this.showFirstSource();
    this.resetTime();
  }

  next() {
    const source = this._load(this.currentTime);
    if (!source?.sprite) return null;

    this.setSource(source);

    return this.source;
  }

  load() {
    const source = this._load(this.currentTime);

    if (!source) return null;

    if (this.source.id === source.id) return null;

    this.setSource(source);

    return this.source;
  }

  json(): CanvasEntity {
    return {
      currentTime: this.currentTime,
      deltaTime: this.deltaTime,
      viewingTime: this.viewingTime,
      source: this.source,
      resources: this.resources
    };
  }

  notifyChanges() {
    const data = this.json();
    this.dispatch(data);
  }
}
