import { Sprite, Texture } from 'pixi.js';
import { Resource } from './types';

const SECONDS_CONVERT_MILLISECONDS = 1000;

/**
 *
 * @param texture
 * @returns HTMLVideoElement from Texture
 */
export const getVideoRecource = (texture: Texture) => {
  // @ts-ignore
  return texture.baseTexture.resource.source as HTMLVideoElement;
};

/**
 *
 * @param seconds
 * @returns milliseconds by number
 */
export const convertSecondsToMilliseconds = (seconds: number) => Math.ceil(seconds * SECONDS_CONVERT_MILLISECONDS);

/**
 *
 * @param milliseconds
 * @returns seconds by number
 */
export const convertMillisecondsToSeconds = (milliseconds: number) =>
  Math.ceil(milliseconds / SECONDS_CONVERT_MILLISECONDS);

/**
 *
 * @param video
 * @returns value of video CurrentTime milliseconds
 */
export const getVideoCurrentTime = (video: HTMLVideoElement) => convertSecondsToMilliseconds(video.currentTime);

/**
 *
 * @param video
 * @returns value of video duration milliseconds
 */
export const getVideoDuration = (video: HTMLVideoElement) => convertSecondsToMilliseconds(video.duration);

/**
 *
 * @param video
 * @returns Texture from video
 */
export const createVideoTexture = (video: HTMLVideoElement) => {
  return Texture.from(video);
};

/**
 *
 * @param resource
 * @returns resource delta start milliseconds
 */
export const getDeltaStart = (resource: Resource) => resource.inFrame + resource.deltaTime;

/**
 *
 * @param resource
 * @returns resource delta end milliseconds
 */
export const getDeltaEnd = (resource: Resource) => resource.outFrame + resource.deltaTime;

/**
 *
 * @param texture
 * @returns Sprite from Texture
 */
export const createSprite = (texture: Texture, screen: { width: number; height: number }) => {
  const sprite = Sprite.from(texture);
  sprite.width = screen.width;
  sprite.height = screen.height;
  return sprite;
};
