import React, { FC, memo, useEffect, useRef, useCallback, useState } from 'react';
import { useLemContext } from '../context/Lem';

export const Viewer: FC = memo(() => {
  const ref = useRef<HTMLCanvasElement>();
  const { Lem, canvas } = useLemContext();
  const [src, setSrc] = useState('');

  const play = useCallback(() => {
    Lem.play();
  }, []);

  const pause = useCallback(() => {
    Lem.pause();
  }, []);

  const stop = useCallback(() => {
    Lem.stop();
  }, []);

  const convert = useCallback(async () => {
    setSrc('');
    try {
      const _src = await Lem.Transformer.concat();
      console.log(_src);
      setSrc(_src);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const dlVideo = useCallback(() => {
    if (!src) return;

    Lem.Transformer.DLVideo(src);
  }, [src]);

  useEffect(() => {
    if (ref) {
      Lem.attachApp(ref.current);
    }
  }, [ref]);

  return (
    <>
      <div className="w-full relative" style={{ paddingTop: '56.25%' }}>
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <canvas ref={ref} className="w-full h-full bg-white">
            Canvas viewer
          </canvas>
        </div>
      </div>
      <p className="text-white pt-4">{canvas.currentTime}</p>
      <label className="mt-5 bg-white inline-block">
        動画追加
        <input
          type="file"
          hidden
          onChange={(e) => {
            Lem.loadAsset(e.currentTarget.files[0]);
          }}
        />
      </label>
      <div className="pt-5">
        <input type="button" value="再生" onClick={play} />
      </div>
      <div className="pt-5">
        <input type="button" value="停止" onClick={pause} />
      </div>
      <div className="pt-5">
        <input type="button" value="リセット" onClick={stop} />
      </div>
      <div className="pt-5">
        {src ? (
          <>
            <input type="button" value="ダウンロード" onClick={dlVideo} />
            {src}
          </>
        ) : (
          <input type="button" value="コンバート" onClick={convert} />
        )}
      </div>
      <div className="pt-5">
        <input
          type="button"
          value="Reset DL Link"
          onClick={() => {
            setSrc('');
          }}
        />
      </div>
    </>
  );
});

export default Viewer;
